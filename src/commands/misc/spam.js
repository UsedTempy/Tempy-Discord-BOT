const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js')

module.exports = {
    name: 'spam',
    description: 'spam someone xD',
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'id',
            description: 'UserID',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

    callback: async ( client, interaction) => {
        interaction.reply({
            content: `Started`,
            ephemeral: true,
        })

        
    }
}