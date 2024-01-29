const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js')
const { VoiceSubscription, AudioPlayerStatus, joinVoiceChannel, getVoiceConnection, createAudioPlayer, NoSubscriberBehavior, createAudioResource, demuxProbe } = require('@discordjs/voice');
const { HarmBlockThreshold, HarmCategory, GoogleGenerativeAI } = require('@google/generative-ai')
const { createClient } = require('@deepgram/sdk')
const { OpusEncoder } = require( "@discordjs/opus" )

const fs = require('fs-extra');
const path = require('path');
const wav = require('wav');
const axios = require('axios');

const ElevenLabs = require("elevenlabs-node");
let audioIndex = 1;
const stringArray = [];

const CharacterAI = require("node_characterai");
const characterAI = new CharacterAI();

const LANGUAGE_MODEL_API_KEY = process.env.AI_TOKEN
const LANGUAGE_MODEL_URL = `https://generativelanguage.googleapis.com/v1beta1/models/chat-bison-001:generateMessage?key=${LANGUAGE_MODEL_API_KEY}`

const voice = new ElevenLabs({
    apiKey: process.env.ELEVEN_LABS_API, // Your API key from Elevenlabs
    voiceId: "pNInz6obpgDQGcFmaJgB", // A Voice ID from Elevenlabs
});

async function removeStars(inputString) {
    return inputString.replace(/\*/g, '');
}

async function handleStrings(connection, chat) {
    while (stringArray.length > 0) {
        const currentString = stringArray[0];

        if (typeof currentString == "string" || currentString.length > 1) {
            const ai_res = await chat.sendAndAwaitResponse(currentString, true);
            await textToVoice(connection, await removeStars(ai_res.text));
        }

        stringArray.shift();
    }
}

function pushString(connection, chat, string) {
    stringArray.push(string);

    if (!handleStrings.running) {
        handleStrings.running = true;
        handleStrings(connection, chat).finally(() => {
            handleStrings.running = false;
        });
    }
}

async function saveBufferAsWavFile(buffer, filePath) {
    try {
      const fileWriter = new wav.FileWriter(filePath, {
        channels: 2,          // Assuming mono audio, change to 2 for stereo
        sampleRate: 48000,    // Adjust based on your audio data
        bitDepth: 16,         // Adjust based on your audio data
      });
  
      fileWriter.write(buffer);
      fileWriter.end();

      console.log('WAV file saved successfully:', filePath);
    
      return filePath;
    } catch (error) {
      console.error('Error saving WAV file:', error.message);
    }
}

module.exports = {
    name: 'join',
    description: 'Join voice call.',
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'vc',
            description: 'Voice chat to connect to.',
            required: true,
            type: ApplicationCommandOptionType.Channel,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

    callback: async (client, interaction) => {
        interaction.reply({
            content: `Please wait i'm connecting.`,
            ephemeral: true,
        })

        const voiceChatId = interaction.options._hoistedOptions[0].value
        const channel = await client.channels.fetch(voiceChatId)

        await characterAI.authenticateAsGuest("Bearer" + process.env.NODE_CAI)

        const characterId = "NfDIpprUyKlmPxJS0DDwjgnrFGnETWOt0cOMUjRT4RY";
        const chat = await characterAI.createOrContinueChat(characterId)

        const connection = joinVoiceChannel({
            channelId: interaction.options._hoistedOptions[0].value,
            guildId: interaction.commandGuildId,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: false,
        })

        let vcData = {};
        connection.receiver.speaking.on('start', (userId) => {
            // if (userId != 731459407216508949) return;
            vcData[userId] = {
                buffer: [],
                audioStream: connection.receiver.subscribe(userId)
            }

            const userVCData = vcData[userId]
            const audioStream = userVCData.audioStream

            audioStream.on('error', (e) => [
                console.log('audioStream: ' + e)
            ])

            const encoder = new OpusEncoder( 48000, 2 );
            audioStream.on('data', chunk => { userVCData.buffer.push( encoder.decode( chunk ) ) })
        })

        connection.receiver.speaking.on('end', async (userId) => {
            // if (userId != 731459407216508949) return;
            const userVCData = vcData[userId]

            if (userVCData) {
                try  {
                    userVCData.buffer = Buffer.concat(userVCData.buffer);
                    const user = client.users.cache.find(u => u.id === userId)
                    if (!user) return;
                    
                    const filePath = `C:\\Users\\Gebruiker\\Desktop\\GIT\\Tempy-Discord-BOT\\buffer_audio_requests\\${userId}_output.wav`
                    const newCreatedFile = await saveBufferAsWavFile(userVCData.buffer, filePath); // Loads the audio
                    setTimeout(async () => {
                        try {
                            const out = await convertAudioToText(newCreatedFile)
                            
                            if (out != null) {
                                const speech_res = out.results.channels[0].alternatives[0].transcript;
                                if (speech_res.length > 1) {
                                    pushString(connection, chat, speech_res)
                                }
                            };
                        } catch(e) {
                            console.error(e);
                        }
                    }, 250)
                } catch (e) {
                    console.log('tmpraw rename: ' + e)
                }

                userVCData.buffer = [];
                userVCData.audioStream.destroy();
            }
        })
    }
}

async function convertAudioToText(audioFilePath) {
    const deepgram = createClient(process.env.SPEECH_TO_TEXT_SECRET);
    const audioFile = await fs.readFileSync(audioFilePath)

    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
        audioFile,
        {
            smart_format: true,
            model: "nova-2",
        }
    )

    if (error) throw error;
    if (!error) {
        return result
    };
}

async function textToVoice(connection, textToSpeech) {
    const voiceResponse = await voice.textToSpeechStream({
        // Required Parameters
        textInput:       textToSpeech,                // The text you wish to convert to speech
    
        // Optional Parameters
        voiceId:         "z9fAnlkpzviPz146aGWa",         // A different Voice ID from the default
        stability:       0.5,                            // The stability for the converted speech
        similarityBoost: 0.5,                            // The similarity boost for the converted speech
        modelId:         "eleven_multilingual_v1",       // The ElevenLabs Model ID
        style:           1,                              // The style exaggeration for the converted speech
        responseType:    "stream"
      }).then(async (res) => {
        const newFilePath = `C:\\Users\\Gebruiker\\Desktop\\GIT\\Tempy-Discord-BOT\\buffer_send_audio\\audio_response.mp3`
        await res.pipe(fs.createWriteStream(newFilePath)).on('finish', async () => {
            const player = createAudioPlayer();
            const SoundEffect = createAudioResource(newFilePath);
        
            if (SoundEffect) {
                player.play(SoundEffect);
                await connection.subscribe(player);
            }; 
        });
    });
}