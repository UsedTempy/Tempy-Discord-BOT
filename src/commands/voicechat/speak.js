const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js')
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const axios = require('axios')
const requests = require('requests')

module.exports = {
    name: 'speak',
    description: 'Make the bot play a soundEffect',
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'speak',
            description: 'Text to speech',
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

    callback: async ( client, interaction) => {
        const connection = getVoiceConnection(interaction.commandGuildId);

        if (connection) {
            const textToSpeech = interaction.options._hoistedOptions[0].value;
            const url = `https://api.elevenlabs.io/v1/text-to-speech/${1}`

            const headers = {
                "Accept": "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": process.env.IIELEVEN_TOK
            }

            const options = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: {
                    "text": textToSpeech,
                    "model_id": "eleven_monolingual_v1",
                    "voice_settings": {
                        "stability": 0.5,
                        "similarity_boost": 0.5
                    }
                }
            };
              
            // fetch('https://api.elevenlabs.io/v1/text-to-speech/{voice_id}', options)
            //     .then(response => response.json())
            //     .then(response => console.log(response))
            //     .catch(err => console.error(err));

            response = requests.post(url, json=data, headers=headers)
            console.log(response);

            // const options = {
            //     method: 'POST',
            //     headers: {'Content-Type': 'application/json'},
            //     body: '{"model_id":"<string>","text":"<string>","voice_settings":{"similarity_boost":123,"stability":123,"style":123,"use_speaker_boost":true}}'
            //   };
              
            //   fetch('https://api.elevenlabs.io/v1/text-to-speech/{voice_id}', options)
            //     .then(response => response.json())
            //     .then(response => console.log(response))
            //     .catch(err => console.error(err));

            // const player = createAudioPlayer();
            // const SoundEffect = soundEffects[effectRequest];
            
            // if (SoundEffect) {
            //     player.play(SoundEffect);
            //     connection.subscribe(player);
            // };
        } else {
            console.log(`👎 Couldn't make a connection with the active bot`)
        }
    }
}