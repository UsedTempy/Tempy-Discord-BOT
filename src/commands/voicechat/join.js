const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js')
const { VoiceSubscription, AudioPlayerStatus, joinVoiceChannel, getVoiceConnection, createAudioPlayer, NoSubscriberBehavior, createAudioResource } = require('@discordjs/voice');

let SPEECH_METHOD = 'witai'; // witai, google, vosk

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

        const vcData = {};

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

                const duration = userVCData.buffer.length / 48000 / 4;
                console.log("duration: " + duration);

                if (SPEECH_METHOD === 'witai' || SPEECH_METHOD === 'google') {
                    if (duration < 1.0 || duration > 19) { // 20 seconds max dur
                        console.log("TOO SHORT / TOO LONG; SKPPING")
                        return;
                        }
                    }
        
                    try  {
                        let new_buffer = await convert_audio(buffer);
                        let out = await transcribe(new_buffer, mapKey);

                        if (out != null)
                            process_commands_query(out, mapKey, user);
                    } catch (e) {
                        console.log('tmpraw rename: ' + e)
                }

                userVCData.buffer = [];
                userVCData.audioStream.destroy();
            }
        })
    }
}

function process_commands_query(txt, mapKey, user) {
    if (txt && txt.length) {
        // let val = guildMap.get(mapKey);
        // val.text_Channel.send(user.username + ': ' + txt);
        console.log(`${user.name}: ${txt}`)
    }
}

async function transcribe(buffer, mapKey) {
    if (SPEECH_METHOD === 'witai') {
        return transcribe_witai(buffer)
    } else if (SPEECH_METHOD === 'google') {
        return transcribe_gspeech(buffer)
    } else if (SPEECH_METHOD === 'vosk') {
        let val = guildMap.get(mapKey);
        recs[val.selected_lang].acceptWaveform(buffer);
        let ret = recs[val.selected_lang].result().text;
        console.log('vosk:', ret)
        return ret;
    }
  }

  async function convert_audio(input) {
    try {
        // stereo to mono channel
        const data = new Int16Array(input)
        const ndata = data.filter((el, idx) => idx % 2);
        return Buffer.from(ndata);
    } catch (e) {
        console.log(e)
        console.log('convert_audio: ' + e)
        throw e;
    }
}