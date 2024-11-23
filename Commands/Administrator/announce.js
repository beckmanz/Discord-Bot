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
        const channel = interaction.options.getChannel('channel');
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({ content: `**Você não possui permissão pra utilizar este comando!**`, ephemeral: true });

        const modal = new Discord.ModalBuilder()
            .setTitle(`Fazendo um anuncio`)
            .setCustomId('modalAnnouncement')

        const titleEmbed = new Discord.TextInputBuilder()
            .setCustomId('titleEmbed')
            .setLabel("Qual sera o titula da embed?")
            .setStyle(Discord.TextInputStyle.Short)
            .setMaxLength(256)
            .setRequired(true);

        const descriptionEmbed = new Discord.TextInputBuilder()
            .setCustomId('descriptionEmbed')
            .setLabel("Qual sera o conteúdo do corpo da embed?")
            .setStyle(Discord.TextInputStyle.Paragraph)
            .setMaxLength(4000)
            .setRequired(true);

        const title = new Discord.ActionRowBuilder().addComponents(titleEmbed);
        const description = new Discord.ActionRowBuilder().addComponents(descriptionEmbed);

        modal.addComponents(title, description)

        await interaction.showModal(modal)

        client.on("interactionCreate", async (interaction) => {
            if (interaction.isModalSubmit() && interaction.customId === "modalAnnouncement") {

                const tituloEmbed = interaction.fields.getTextInputValue('titleEmbed');
                const descEmbed = interaction.fields.getTextInputValue('descriptionEmbed');

                const embed = new Discord.EmbedBuilder()
                    .setTitle(tituloEmbed)
                    .setDescription(descEmbed)
                    .setTimestamp()
                    .setColor("#2b2d31")
                    .setFooter({text: `Todos os direitos reservados, ${interaction.guild.name}. ©2024`})

                await channel.send({embeds: [embed]});

                await interaction.reply({content: `Anúncio enviado com sucesso no canal ${channel}!`, ephemeral: true});
            }
        })
    }
}