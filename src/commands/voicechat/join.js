const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js')

module.exports = {
    name: 'join',
    description: 'Join voice call.',
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'vc-id',
            description: 'The ID of the vc to join.',
            required: true,
            type: ApplicationCommandOptionType.Number,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

    callback: ( client, interaction) => {
        interaction.reply(`Connecting`)
    }
}