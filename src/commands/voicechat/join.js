const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js')
const { VoiceSubscription, AudioPlayerStatus, joinVoiceChannel, getVoiceConnection, createAudioPlayer, NoSubscriberBehavior, createAudioResource, demuxProbe } = require('@discordjs/voice');
const { createClient } = require('@deepgram/sdk') //from "@deepgram/sdk";
const { OpusEncoder } = require( "@discordjs/opus" )

const fs = require('fs');
const path = require('path');
const wav = require('wav')

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

    callback: async ( client, interaction) => {
        interaction.reply({
            content: `Please wait i'm connecting.`,
            ephemeral: true,
        })

        const voiceChatId = interaction.options._hoistedOptions[0].value
        const channel = await client.channels.fetch(voiceChatId)

        const connection = joinVoiceChannel({
            channelId: interaction.options._hoistedOptions[0].value,
            guildId: interaction.commandGuildId,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: false,
        })

        let vcData = {};

        connection.receiver.speaking.on('start', (userId) => {
            console.log({
                [userId]: 'Started Speaking.',
            });

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
            console.log({
                [userId]: 'Stopped Speaking.',
            });

            const userVCData = vcData[userId]

            if (userVCData) {
                try  {
                    userVCData.buffer = Buffer.concat(userVCData.buffer);
                    const user = client.users.cache.find(u => u.id === userId)
                    if (!user) return;
                    
                    const filePath = `C:\\Users\\Gebruiker\\Desktop\\GIT\\Tempy-Discord-BOT\\buffer_audio_requests\\${userId}_output.wav`
                    const newCreatedFile = await saveBufferAsWavFile(userVCData.buffer, filePath); // Loads the audio
                    setTimeout(async callback => {
                        const out = await convertAudioToText(newCreatedFile)

                        if (out != null) {
                            console.log({
                                [user.globalName]: out.results.channels[0].alternatives[0].transcript
                            });
                        };
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

// deepgram.transcription.preRecorded(
//     { url: 'https://static.deepgram.com/examples/deep-learning-podcast-clip.wav' },
//     { punctuate: true }
// ).then(data => {
//     console.log(data, { depth: null })
// })

// const transcribeUrl = async () => {
    // const deepgram = createClient(process.env.SPEECH_TO_TEXT_SECRET);

    // const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
    //     fs.readFileSync('C:\\Users\\Gebruiker\\Desktop\\GIT\\Tempy-Discord-BOT\\src\\audio\\SamASMR.mp3'),
    //     {
    //       smart_format: true,
    //       model: "nova",
    //     }
    //   );
  
    // if (error) throw error;
    // if (!error) console.dir(result, { depth: null });
//   };

//   transcribeUrl()

async function convertAudioToText(audioFilePath) {
    const deepgram = createClient(process.env.SPEECH_TO_TEXT_SECRET);
    // console.log(fs.readFileSync('C:\\Users\\Gebruiker\\Desktop\\GIT\\Tempy-Discord-BOT\\src\\audio\\SamASMR.mp3'));
    // console.log(Buffer.from(decodedAudioData, 'utf-8'));

    const audioFile = await fs.readFileSync(audioFilePath)

    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
        audioFile,
        {
            smart_format: true,
            model: "nova",
        }
    )

    if (error) throw error;
    if (!error) {
        return result
    };
}

//     try {
//         const response = await axios.post('https://api.deepgram.com/v1/listen', {
//             audio: {
//                 data: decodedAudioData.toString('base64'),
//             },
//         }, {
//             headers: {
//                 Authorization: `Token ${process.env.SPEECH_TO_TEXT_KEY}`,
//                 "Content-Type": 'application/json',
//             },
//         });

//         // Extract and return the transcription from the Deepgram response
//         return response.data.results[0].alternatives[0].transcript;

//     } catch (error) {
//         throw new Error(`Deepgram API error: ${error.message}`);
//     }
// }

// async function transcribe(buffer) {
//     recs.en.acceptWaveform(buffer);
//     let ret = recs.en.result().text;
//     return ret;
// }

// const stream = require('stream');

// function process_commands_query(txt, user) {
//     if (txt && txt.length) {
//         console.log(`${user}: ${txt}`)
//     }
// }

// function createReadableStreamFromOpus(opusData) {
//     const readable = new stream.Readable();
//     readable._read = () => {};
//     readable.push(opusData);
//     readable.push(null);
//     return readable;
// }

// async function convert_audio(input) {
//     try {
//         const data = new Int16Array(input)
//         const ndata = data.filter((el, idx) => idx % 2);
  
//         return Buffer.from(input);
//     } catch (e) {
//         console.log(e)
//         console.log('convert_audio: ' + e)
//         throw e;
//     }
// }