module.exports = ( client ) => {
    console.log(`🔥${client.user.tag} is online.`)
    client.user.setUsername('Tempy 2.0');
}