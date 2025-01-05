const Discord = require('discord.js');

module.exports = {
    name: 'avatar',
    description: 'Veja o avatar de um usuário',
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'usuário',
            type: Discord.ApplicationCommandOptionType.User,
            description: 'Usuário que deseja ver o avatar.',
            require: false,
        },
    ],
    run: async (client, interaction) => {

        const user = interaction.options.getUser('usuário') || interaction.user;

        const avatarUrl = user.displayAvatarURL({ size: 2048, extension: 'png' });
        const embed = new Discord.EmbedBuilder()
            .setTitle(`${user.username}`)
            .setImage(avatarUrl)
            .setFooter({ text: `Comando utilizado por ${interaction.user.username}`})
            .setColor("#2b2d31")

        interaction.reply({ embeds: [embed] })
        setTimeout(() => interaction.deleteReply(), 20 * 1000);

    },
}