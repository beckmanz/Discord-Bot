const { ActivityType } = require('discord.js');
require('colors')
const Database = require("../../Data/database");
const {checkVipExpirations} = require("../../Utils/checkVipExpirations");

module.exports = {
    name: 'ready',
    execute: (client) => {
        client.on('ready', async () => {

            client.user.setActivity(`Teto`, { type: ActivityType.Listening })

            client.user.setStatus('dnd')
            const db = new Database;
            client.db = await db.connect();
            console.log(`✅ Estou online em [${client.user.username}]`.green)

            setInterval(() => {
                checkVipExpirations(client);
            }, 60 * 60 * 1000);
        })
    }
}