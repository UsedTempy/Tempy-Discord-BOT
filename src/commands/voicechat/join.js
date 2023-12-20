const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js')
const { AudioPlayerStatus, joinVoiceChannel, getVoiceConnection, createAudioPlayer, NoSubscriberBehavior, createAudioResource } = require('@discordjs/voice');

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
        })

        const player = createAudioPlayer();
        player.on(AudioPlayerStatus.Playing, () => {
            console.log(`🎵 Audio player has started playing`)
        })

        player.on('error', error => {
            console.log(`❌ Error ${error} with resource`)
        })

        const resource = createAudioResource('C:\\Users\\Gebruiker\\Desktop\\GITHUB\\Tempy-Discord-BOT\\src\\audio\\Minecraft_Sheep_says_ambatukam_AI_COVER.wav')
        player.play(resource)

        const subscription = connection.subscribe(player);
        if (subscription) {
            setTimeout(() => {
                subscription.unsubscribe()
            }, 15_000);
        }

        // connection.subscribe(player)

        // const resource = createAudioResource('C:\Users\Gebruiker\Desktop\GITHUB\Tempy-Discord-BOT\src\audio\Minecraft_Sheep_says_ambatukam_AI_COVER.wav');
        // player.play(resource)
    }
}