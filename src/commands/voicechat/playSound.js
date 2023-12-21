const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js')
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

const soundEffects = {
    SheepMoan: createAudioResource('C:\\Users\\Gebruiker\\Desktop\\GIT\\Tempy-Discord-BOT\\src\\audio\\SheepMoan.wav')
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

        if (connection) {
            const effectRequest = interaction.options._hoistedOptions[0].value;

            const player = createAudioPlayer();
            const SoundEffect = soundEffects[effectRequest];
            
            if (SoundEffect) {
                player.play(SoundEffect);
                connection.subscribe(player);
            };
        } else {
            console.log(`👎 Couldn't make a connection with the active bot`)
        }
    }
}