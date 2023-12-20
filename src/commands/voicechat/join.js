const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js')
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');

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
            selfDeaf: false
        })

        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });

        connection.subscribe(player)

        const resource = createAudioResource('../../../src/audio/Minecraft_Sheep_says_ambatukam_AI_COVER.mp3');
        player.play(resource)
    }
}