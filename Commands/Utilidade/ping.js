const Discord = require('discord.js')

module.exports = {
    name: 'ping',
    description: 'Veja o meu ping!',
    type: Discord.ApplicationCommandType.ChatInput,

    run: async(client, interaction) => {
        const embed = new Discord.EmbedBuilder()
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setDescription(`👋 Olá **${interaction.user.username}**, meu ping está em \`${client.ws.ping}ms\`.`)

        interaction.reply({ embeds: [embed] })
    }
}