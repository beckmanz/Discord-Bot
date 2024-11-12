require('colors')
const Database = require("../../Data/database");

module.exports = {
    name: 'ready',
    execute: (client) => {
        client.on('ready', async () => {
            const db = new Database;
            client.db = await db.connect();
            console.log(`✅ Estou online em [${client.user.username}]`.green)
        })
    }
}