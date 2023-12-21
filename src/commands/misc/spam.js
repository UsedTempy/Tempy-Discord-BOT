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

        let i = 0;

        while (i<100) {
            loop(i);
            i++
        }

        function loop(i) {
            setTimeout(function() {
                client.users.fetch('431556889285885962', false).then((user) => {
                    user.send('💀');
                });
            }, 1000 * i)
        }
    }
}