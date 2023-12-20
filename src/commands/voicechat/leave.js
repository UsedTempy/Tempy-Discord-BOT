module.exports = {
    name: 'leave',
    description: 'Leave voice call',
    // devOnly: Boolean,
    // testOnly: Boolean,
    // options: Object[],

    callback: ( client, interaction) => {
        interaction.reply(`Pong! ${client.ws.ping}ms`)
    }
}