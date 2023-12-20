const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js')
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

const soundEffects = {
    SheepMoan: {
        location: 'C:\\Users\\Gebruiker\\Desktop\\GITHUB\\Tempy-Discord-BOT\\src\\audio\\SheepMoan.wav',
        time: 15_000,
    },
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
                const newAudioSource = createAudioResource(SoundEffect.location)
                player.play(newAudioSource);
                connection.subscribe(player);
            };
        } else {
            console.log(`👎 Couldn't make a connection with the active bot`)
        }
    }
}