
# 🤖 Discord AI Bot  
Bring the power of AI to your Discord server! This bot lets you communicate with an AI chatbot through both text and voice. 🎙️💬  

---

## 🌟 Features  
- 🎤 **Voice-to-Text Transcription**: Converts your spoken words into text.  
- 🤖 **AI Chatbot Integration**: Sends the transcribed text to an AI chatbot and retrieves responses.  
- 🔊 **AI Voice Response**: Converts the chatbot’s response back into speech and plays it in Discord.  
- 🛠️ **Seamless Interaction**: Enjoy smooth communication powered by multiple API integrations.

---

## 🛠️ How It Works  
1. **Voice Input**: The bot captures audio through Discord’s voice channel.  
2. **Speech Transcription**: Audio is transcribed into text using advanced AI tools.  
3. **Chatbot Query**: The text is sent to an AI chatbot that generates a response.  
4. **Text-to-Speech**: The response is converted into a natural-sounding voice.  
5. **Audio Playback**: The bot plays the response back in the Discord voice channel.  

---

## ⚡ Setup  

### 🔧 Dependencies  
Make sure to install the following dependencies before running the bot:  

```bash
npm install
npm install discord.js
npm install @discordjs/voice
npm install dotenv
npm install @discordjs/voice libsodium-wrappers
npm install ffmpeg-static
npm install node-witai-speech
npm install @deepgram/sdk @discordjs/opus
```

### 🖥️ Environment Variables  
Create a `.env` file in the root directory and configure the following:  

```env
DISCORD_TOKEN=your_discord_bot_token
WITAI_TOKEN=your_witai_token
DEEPGRAM_KEY=your_deepgram_api_key
```

Replace `your_discord_bot_token`, `your_witai_token`, and `your_deepgram_api_key` with the actual values from your API accounts.

---

## 🚀 Running the Bot  
1. Clone the repository:  
   ```bash
   git clone https://github.com/your-username/discord-ai-bot.git
   cd discord-ai-bot
   ```
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Start the bot:  
   ```bash
   node index.js
   ```

---

## 📦 Tech Stack  
- **Discord.js**: For interacting with Discord’s API.  
- **@discordjs/voice**: To handle audio in Discord voice channels.  
- **Wit.ai**: For speech-to-text transcription.  
- **Deepgram**: For advanced AI-driven transcription.  
- **FFmpeg**: For processing and converting audio files.  

---

## 🌐 API Integrations  
This bot integrates multiple APIs to deliver a seamless AI experience:  
- **Wit.ai**: Captures and processes user voice input.  
- **Deepgram**: High-quality speech transcription.  
- **Custom AI Chatbot**: Handles text-based interactions.  

---

## ❤️ Contributing  
Contributions are welcome! Feel free to fork the repository and submit a pull request.  

---

## 📧 Contact  
If you have any questions or need assistance, please feel free to reach out:  
- **GitHub**: [Tempy](https://github.com/usedtempy)  

---

### ✨ Enjoy the power of AI in your Discord community! 🎉  
