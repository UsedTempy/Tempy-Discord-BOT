const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js')
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer } = require('@discordjs/voice');

module.exports = {
    name: 'leave',
    description: 'Leave voice call.',
    // devOnly: Boolean,
    // testOnly: Boolean,
    // options: Object [],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

    callback: async ( client, interaction) => {
        interaction.reply({
            content: 'I left the voice call!',
            ephemeral: true,
        })

        const connection = getVoiceConnection(interaction.commandGuildId)
        if (connection) {
            connection.destroy()
        } else {
            console.log("No disconnect connection found.")
        }
    }
}