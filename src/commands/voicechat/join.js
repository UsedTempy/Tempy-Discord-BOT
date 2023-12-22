const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js')
const { VoiceSubscription, AudioPlayerStatus, joinVoiceChannel, getVoiceConnection, createAudioPlayer, NoSubscriberBehavior, createAudioResource, demuxProbe } = require('@discordjs/voice');

const fs = require('fs');
const { Model, Recognizer } = require('vosk');

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

            audioStream.on('data', (data) => {
                userVCData.buffer.push(data);
            })
        })

        connection.receiver.speaking.on('end', async (userId) => {
            console.log({
                [userId]: 'Stopped Speaking.',
            });

            const userVCData = vcData[userId]

            if (userVCData) {
                userVCData.buffer = Buffer.concat(userVCData.buffer);

                try  {
                    // let new_buffer = await convert_audio(userVCData.buffer);
                    // transcribe(userVCData.buffer)
                    //     .then(transcription => console.log('Transcription:', transcription))
                    //     .catch(error => console.error('Error during transcription:', error.message));
                    // let out = await transcribe(new_buffer);

                    // if (out != null) {
                    //     process_commands_query(out, userId);
                    // };
                } catch (e) {
                    console.log('tmpraw rename: ' + e)
                }

                userVCData.buffer = [];
                userVCData.audioStream.destroy();
            }
        })
    }
}

// function decodeOpusToPCM(opusData) {
//     const decodedBuffer = opusDecoder.decode(opusData, 1920); // Adjust the frame size based on your requirements

//     return decodedBuffer;
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

// async function transcribe(buffer) {
//     recs.en.acceptWaveform(buffer);
//     let ret = recs.en.result().text;
//     return ret;
//   }

//   async function convert_audio(input) {
//     try {
//         const data = new Int16Array(input)
//         const ndata = data.filter((el, idx) => idx % 2);
  
//         return Buffer.from(ndata);
//     } catch (e) {
//         console.log(e)
//         console.log('convert_audio: ' + e)
//         throw e;
//     }
// }