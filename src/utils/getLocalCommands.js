const path = require('path')
const getAllFiles = require('./getAllFiles')

module.exports = (exceptions) => {
    let localCommands = [];

    const commandCatagories = getAllFiles(
        path.join(__dirname, '..', 'commands'),
        true
    );

    for (const commandCatagory of commandCatagories) {
        const commandFiles = getAllFiles(commandCatagory);
        
    }

    return localCommands;
};