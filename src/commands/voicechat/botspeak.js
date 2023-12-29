const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js')
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const axios = require('axios')
const requests = require('requests')

const ElevenLabs = require("elevenlabs-node");
const fs = require('fs-extra')

const voice = new ElevenLabs({
    apiKey: process.env.ELEVEN_LABS_API, // Your API key from Elevenlabs
    voiceId: "pNInz6obpgDQGcFmaJgB", // A Voice ID from Elevenlabs
});

module.exports = {
    name: 'speak',
    description: 'Make the bot play a soundEffect',
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'text',
            description: 'text to speech',
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

    callback: async (client, interaction) => {
        const connection = getVoiceConnection(interaction.commandGuildId);
        const textToSpeech = interaction.options._hoistedOptions[0].value;

        interaction.reply({
            content: `Bot will say: ${textToSpeech}`,
            ephemeral: true,
        })

        if (connection) {
            const voiceResponse = voice.textToSpeechStream({
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
                const newFilePath = `C:\\Users\\Gebruiker\\Desktop\\GIT\\Tempy-Discord-BOT\\buffer_send_audio\\audio_SoundEffect.mp3`
                res.pipe(fs.createWriteStream(newFilePath));

                const player = createAudioPlayer();
                const SoundEffect = createAudioResource(newFilePath);
                
                if (SoundEffect) {
                    player.play(SoundEffect);
                    connection.subscribe(player);

                    player.addListener("stateChange", (oldOne, newOne) => {
                        if (newOne.status == "idle") {
                            setTimeout(data => {
                                fs.unlink(newFilePath, (err) => {
                                    if (err) {
                                        console.error('Error deleting file:', err);
                                    } else {
                                        console.log('File deleted successfully.');
                                    }
                                });
                            }, 1000)
                        }
                    });
                };
            });
        } else {
            console.log(`👎 Couldn't make a connection with the active bot`)
        }
    }
}