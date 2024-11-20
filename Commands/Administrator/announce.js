const Discord = require('discord.js')

module.exports = {
    name: 'announce',
    description: "Use to make announcements on server channels using the bot.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [{
        name: 'channel',
        type: Discord.ApplicationCommandOptionType.Channel,
        description: 'channel where the ad will be sent',
        required: true,
        }
    ],

    run: async(client, interaction) => {

        const channel = interaction.options.getUser('channel');


    }
}