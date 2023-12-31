const { Client, IntentsBitField, Events } = require('discord.js')
// const { joinVoiceChannel, getVoiceConnection, createAudioPlayer } = require('@discordjs/voice');
const eventHandler = require('./handlers/eventHandler')

require('dotenv').config()

const client = new Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'CONNECT', 'SPEAK'],
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.DirectMessageTyping,
    IntentsBitField.Flags.GuildVoiceStates,
  ],
})

eventHandler(client);

client.login(process.env.BOT_TOKEN)