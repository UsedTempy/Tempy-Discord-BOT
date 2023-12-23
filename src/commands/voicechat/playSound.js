const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js')
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

const soundEffects = {
    SheepMoan: 'C:\\Users\\Gebruiker\\Desktop\\GIT\\Tempy-Discord-BOT\\src\\audio\\SheepMoan.wav',
    SamL: 'C:\\Users\\Gebruiker\\Desktop\\GIT\\Tempy-Discord-BOT\\src\\audio\\SamLikesHisUncle.mp3',
    FlyesSanta: 'C:\\Users\\Gebruiker\\Desktop\\GIT\\Tempy-Discord-BOT\\src\\audio\\SantaFlyes.mp3',
    SamAMR: 'C:\\Users\\Gebruiker\\Desktop\\GIT\\Tempy-Discord-BOT\\src\\audio\\SamASMR.mp3'
}

module.exports = {
    name: 'playsound',
    description: 'Make the bot play a soundEffect',
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'name',
            description: 'Plays a sound effect.',
            required: true,
            type: ApplicationCommandOptionType.String,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

    callback: async ( client, interaction) => {
        const connection = getVoiceConnection(interaction.commandGuildId);
        const effectRequest = interaction.options._hoistedOptions[0].value;

        interaction.reply({
            content: `Played sound: ${effectRequest}`,
            ephemeral: true,
        })

        if (connection) {
            const player = createAudioPlayer();
            const SoundEffect = createAudioResource(soundEffects[effectRequest]);
            
            if (SoundEffect) {
                player.play(SoundEffect);
                connection.subscribe(player);
            };
        } else {
            console.log(`👎 Couldn't make a connection with the active bot`)
        }
    }
}