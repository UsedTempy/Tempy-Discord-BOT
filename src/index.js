const { Client, IntentsBitField } = require('discord.js')

require('dotenv').config()

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
  ],
})

client.on('ready', (bot) => {
  console.log(`🔥${bot.user.tag} is online.`)
})

client.on('messageCreate', (message) => {
  
})

client.login(
  process.env.BOT_TOKEN
)