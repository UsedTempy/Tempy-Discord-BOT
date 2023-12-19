const { Client, IntentsBitField } = require('discord.js')
const axios = require('axios')
// const OpenAI = require('openai');

require('dotenv').config()
const OPENAI_API_KEY = process.env.OPEN_AI_API_KEY

// let openai = new OpenAI()
// openai.apiKey = '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' //process.env.OPEN_AI_API_KEY

// const openai = new OpenAIAPI(new Configuration({
//   apiKey: process.env.OPEN_AI_API_KEY
// }))

async function generateReply(message) {
//   const response = await openai.ChatCompletion.create({
//     model: "gpt-3.5-turbo",
//     temperature: 0.888,
//     max_tokens: 2048,
//     frequency_penalty: 0,
//     presence_penalty: 0,
//     top_p: 1,
//     messages: [{role: "system", content: message}, {role: "user", content: ''}], // {role: "assistant", content: ''}
//   },
//     { timeout: 60000 }
//   );

//   return response.data.choices[0].message.content.trim();
try {
  const response = await axios.post(
    'https://api.openai.com/v1/engines/gpt-3.5-turbo/completions',
    {
      prompt: message,
      max_tokens: 2048,
      temperature: 0.888,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
    }
  );

  // return response.data.choices[0].text.trim();
  // console.log(response.data.choices[0])
} catch (error) {
  console.error('Error generating reply from OpenAI:', error.message);
  return 'Error generating reply';
}
}

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
  // generateReply(message.content);

  message.delete()
})

client.login(
  process.env.BOT_TOKEN
)