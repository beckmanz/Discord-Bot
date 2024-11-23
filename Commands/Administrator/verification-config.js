const Discord = require('discord.js')

module.exports = {
    name: 'verification-config',
    description: "Configures the server's new member verification system.",
    type: Discord.ApplicationCommandType.ChatInput,

    embedPainel: async (client, interaction) => {
        let serverIcon = interaction.guild.iconURL({ dynamic: true })

        let config = await client.db.verification.findById(interaction.guild.id) || new client.db.verification({ _id: interaction.guild.id })
        await config.save()

        let msgNull = "`Não configurado`";
        let chanel = interaction.guild.channels.cache.get(config.configuration.channel) || msgNull;
        let roleAdd = interaction.guild.roles.cache.get(config.configuration.roleAdd) || msgNull;
        let roleRemove = interaction.guild.roles.cache.get(config.configuration.roleRemove) || msgNull;
        let category = interaction.guild.channels.cache.get(config.configuration.category) || msgNull;

        const embed = new Discord.EmbedBuilder()
            .setTitle(`${interaction.guild.name} - Configuração de verificação`)
            .setThumbnail(serverIcon)
            .setDescription('Bem-vindo à configuração do nosso sistema de verificação! Aqui você pode ajustar as opções para garantir que todos os novos membros estejam de acordo com as regras e políticas da nossa comunidade antes de participar.')
            .addFields(
                { name: '**<:icons_discordstaff:1011001160024461413> Status da configuração:**', value: ` - Canal de verificação: ${chanel}\n - Cargo a ser adicionado: ${roleAdd}\n - Cargo a ser removido: ${roleRemove}\n - Categoria dos tickets de verificação: ${category}`},
                { name: 'Regras de Verificação:', value: 'Todos os novos membros devem passar pela verificação antes de acessar o restante do servidor.\nO sistema de verificação garante que apenas usuários autenticados tenham acesso aos canais e conteúdos.' }
            )
            .setColor("#2b2d31")
            .setFooter({ text: `Todos os direitos reservados, ${interaction.guild.name}. ©2024`})

        const select = new Discord.StringSelectMenuBuilder()
            .setCustomId('systemVerification')
            .setPlaceholder('Selecione uma opção')
            .addOptions(
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel('Configurar canal')
                    .setDescription('Configura o canal para o sistema de verificação.')
                    .setValue('channel'),
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel('Configurar cargo para adicionar')
                    .setDescription('Configura o cargo que sera adicionado após a verificação.')
                    .setValue('cargoAdd'),
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel('Configurar cargo para remover')
                    .setDescription('Configura o cargo que sera removido após a verificação.')
                    .setValue('cargoRm'),
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel('Configurar categoria')
                    .setDescription('Configura a categoria onde será aberto os tickets de verificação de novos usuários.')
                    .setValue('category'),
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel('Configurar embed de verificação')
                    .setDescription('Configura conteúdo da embed de verificação.')
                    .setValue('msgEmbedConfig'),
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel('Enviar embed')
                    .setDescription('Enviar a embed de verificação no canal configurado.')
                    .setValue('sendEmbed'),
            );

        const row = new Discord.ActionRowBuilder().addComponents(select);

        return {embed, row};
    },

    run: async(client, interaction) => {

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({ content: `**Você não possui permissão pra utilizar este comando!**`, ephemeral: true });

        const { embed, row} = await module.exports.embedPainel(client, interaction)

        interaction.reply({ embeds: [embed], components: [row], ephemeral: true})
    }
}