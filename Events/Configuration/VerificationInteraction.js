const Discord = require('discord.js');
const {embedPainel} = require("../../Commands/Administrator/verification-config");


module.exports = {
    name: 'interactionCreate',
    execute: (client) => {
        client.on('interactionCreate', async (interaction) => {

            const requestsMap = new Map();

            if(interaction.isStringSelectMenu()){
                if (interaction.customId === 'systemVerification') {
                   let options = interaction.values[0]

                    if (options === "channel") {
                        let currentPage = 0;
                        const channelsPerPage = 25;

                        const channels = interaction.guild.channels.cache
                            .filter(channel => channel.type === 0)
                            .map(channel => ({ label: channel.name, value: channel.id }));

                        const totalPages = Math.ceil(channels.length / channelsPerPage);

                        const getPaginatedChannels = (page) =>
                            channels.slice(page * channelsPerPage, (page + 1) * channelsPerPage);

                        const updateMenu = async (page, interaction) => {
                            const paginatedChannels = getPaginatedChannels(page);

                            let channelConfig = new Discord.EmbedBuilder()
                                .setTitle(`${interaction.guild.name} - Configurando canal de verificação`)
                                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                                .setDescription(`para fazer a configuração do canal de verificação de novos usuários, basta selecionar o canal no seletor abaixo.`)
                                .setFooter({ text: `(Página ${page + 1} de ${totalPages}) Todos os direitos reservados, ${interaction.guild.name}. ©2024`})
                                .setColor("#2b2d31")

                            const selectMenu = new Discord.StringSelectMenuBuilder()
                                .setCustomId('textChannelSelect')
                                .setPlaceholder('Escolha um cargo')
                                .addOptions(paginatedChannels);

                            const row = new Discord.ActionRowBuilder().addComponents(selectMenu);

                            const buttons = new Discord.ActionRowBuilder().addComponents(
                                new Discord.ButtonBuilder()
                                    .setCustomId('prevPage')
                                    .setLabel('Pagina anterior')
                                    .setStyle(Discord.ButtonStyle.Primary)
                                    .setDisabled(page === 0),
                                new Discord.ButtonBuilder()
                                    .setCustomId('nextPage')
                                    .setLabel('Próxima pagina')
                                    .setStyle(Discord.ButtonStyle.Primary)
                                    .setDisabled(page === totalPages - 1)
                            );

                            await interaction.update({
                                embeds: [channelConfig],
                                components: [row, buttons],
                                ephemeral: true
                            });
                        };

                        await updateMenu(currentPage, interaction);

                        const filter = (i) => i.customId === 'prevPage' || i.customId === 'nextPage';
                        const collector = interaction.channel.createMessageComponentCollector({ filter });

                        collector.on('collect', async (i) => {
                            if (i.customId === 'prevPage') currentPage--;
                            if (i.customId === 'nextPage') currentPage++;
                            await updateMenu(currentPage, i);
                        });
                    }
                    if (options === "cargoAdd"){

                        let currentPage = 0;
                        const rolesPerPage = 25;
                        const roles = interaction.guild.roles.cache
                            .filter(role => role.id !== interaction.guild.id)
                            .map(role => ({ label: role.name, value: role.id }));

                        const totalPages = Math.ceil(roles.length / rolesPerPage);

                        const getPaginatedRoles = (page) =>
                            roles.slice(page * rolesPerPage, (page + 1) * rolesPerPage);

                        const updateMenu = async (page, interaction) => {
                            const paginatedRoles = getPaginatedRoles(page);

                            let roleConfig = new Discord.EmbedBuilder()
                                .setTitle(`${interaction.guild.name} - Configurando cargos de verificação`)
                                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                                .setDescription(`Para fazer a configuração do cargo que sera adicionado após a verificação dos novos usuários, basta selecionar o cargo no seletor abaixo.`)
                                .setFooter({ text: `(Página ${page + 1} de ${totalPages}) Todos os direitos reservados, ${interaction.guild.name}. ©2024`})
                                .setColor("#2b2d31")

                            const selectMenu = new Discord.StringSelectMenuBuilder()
                                .setCustomId('selectedRoleAdd')
                                .setPlaceholder('Escolha um cargo')
                                .addOptions(paginatedRoles);

                            const row = new Discord.ActionRowBuilder().addComponents(selectMenu);

                            const buttons = new Discord.ActionRowBuilder().addComponents(
                                new Discord.ButtonBuilder()
                                    .setCustomId('prevPage')
                                    .setLabel('Pagina anterior')
                                    .setStyle(Discord.ButtonStyle.Primary)
                                    .setDisabled(page === 0),
                                new Discord.ButtonBuilder()
                                    .setCustomId('nextPage')
                                    .setLabel('Próxima pagina')
                                    .setStyle(Discord.ButtonStyle.Primary)
                                    .setDisabled(page === totalPages - 1)
                            );

                            await interaction.update({
                                embeds: [roleConfig],
                                components: [row, buttons],
                                ephemeral: true
                            });
                        };

                        // Mostrar a primeira página
                        await updateMenu(currentPage, interaction);

                        const filter = (i) => i.customId === 'prevPage' || i.customId === 'nextPage';
                        const collector = interaction.channel.createMessageComponentCollector({ filter });

                        collector.on('collect', async (i) => {
                            if (i.customId === 'prevPage') currentPage--;
                            if (i.customId === 'nextPage') currentPage++;
                            await updateMenu(currentPage, i);
                        });
                    }
                    if (options === "cargoRm"){

                        let currentPage = 0;
                        const rolesPerPage = 25;
                        const roles = interaction.guild.roles.cache
                            .filter(role => role.id !== interaction.guild.id)
                            .map(role => ({ label: role.name, value: role.id }));

                        const totalPages = Math.ceil(roles.length / rolesPerPage);

                        const getPaginatedRoles = (page) =>
                            roles.slice(page * rolesPerPage, (page + 1) * rolesPerPage);

                        const updateMenu = async (page, interaction) => {
                            const paginatedRoles = getPaginatedRoles(page);

                            let roleConfig = new Discord.EmbedBuilder()
                                .setTitle(`${interaction.guild.name} - Configurando cargos de verificação`)
                                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                                .setDescription(`Para fazer a configuração do cargo que sera removido após a verificação dos novos usuários, basta selecionar o cargo no seletor abaixo.`)
                                .setFooter({ text: `(Página ${page + 1} de ${totalPages}) Todos os direitos reservados, ${interaction.guild.name}. ©2024`})
                                .setColor("#2b2d31")

                            const selectMenu = new Discord.StringSelectMenuBuilder()
                                .setCustomId('selectedRoleRm')
                                .setPlaceholder('Escolha um cargo')
                                .addOptions(paginatedRoles);

                            const row = new Discord.ActionRowBuilder().addComponents(selectMenu);

                            const buttons = new Discord.ActionRowBuilder().addComponents(
                                new Discord.ButtonBuilder()
                                    .setCustomId('prevPage')
                                    .setLabel('Pagina anterior')
                                    .setStyle(Discord.ButtonStyle.Primary)
                                    .setDisabled(page === 0),
                                new Discord.ButtonBuilder()
                                    .setCustomId('nextPage')
                                    .setLabel('Próxima pagina')
                                    .setStyle(Discord.ButtonStyle.Primary)
                                    .setDisabled(page === totalPages - 1)
                            );

                            await interaction.update({
                                embeds: [roleConfig],
                                components: [row, buttons],
                                ephemeral: true
                            });
                        };

                        await updateMenu(currentPage, interaction);

                        const filter = (i) => i.customId === 'prevPage' || i.customId === 'nextPage';
                        const collector = interaction.channel.createMessageComponentCollector({ filter });

                        collector.on('collect', async (i) => {
                            if (i.customId === 'prevPage') currentPage--;
                            if (i.customId === 'nextPage') currentPage++;
                            await updateMenu(currentPage, i);
                        });
                    }
                    if (options === "category"){
                        let currentPage = 0;
                        const categoryPerPage = 25;
                        const category = interaction.guild.channels.cache
                            .filter(category => category.type === 4)
                            .map(category => ({ label: category.name, value: category.id }));

                        const totalPages = Math.ceil(category.length / categoryPerPage);

                        const getPaginatedCategory = (page) =>
                            category.slice(page * categoryPerPage, (page + 1) * categoryPerPage);

                        const updateMenu = async (page, interaction) => {
                            const paginatedCategory = getPaginatedCategory(page);

                            let roleConfig = new Discord.EmbedBuilder()
                                .setTitle(`${interaction.guild.name} - Configurando categoria`)
                                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                                .setDescription(`Para fazer a configuração da categoria onde será aberto os tickets de verificação dos novos usuários, basta selecionar a categoria no seletor abaixo.`)
                                .setFooter({ text: `(Página ${page + 1} de ${totalPages}) Todos os direitos reservados, ${interaction.guild.name}. ©2024`})
                                .setColor("#2b2d31")

                            const selectMenu = new Discord.StringSelectMenuBuilder()
                                .setCustomId('selectedCategory')
                                .setPlaceholder('Escolha uma categoria')
                                .addOptions(paginatedCategory);

                            const row = new Discord.ActionRowBuilder().addComponents(selectMenu);

                            const buttons = new Discord.ActionRowBuilder().addComponents(
                                new Discord.ButtonBuilder()
                                    .setCustomId('prevPage')
                                    .setLabel('Pagina anterior')
                                    .setStyle(Discord.ButtonStyle.Primary)
                                    .setDisabled(page === 0),
                                new Discord.ButtonBuilder()
                                    .setCustomId('nextPage')
                                    .setLabel('Próxima pagina')
                                    .setStyle(Discord.ButtonStyle.Primary)
                                    .setDisabled(page === totalPages - 1)
                            );

                            await interaction.update({
                                embeds: [roleConfig],
                                components: [row, buttons],
                                ephemeral: true
                            });
                        };

                        await updateMenu(currentPage, interaction);

                        const filter = (i) => i.customId === 'prevPage' || i.customId === 'nextPage';
                        const collector = interaction.channel.createMessageComponentCollector({ filter });

                        collector.on('collect', async (i) => {
                            if (i.customId === 'prevPage') currentPage--;
                            if (i.customId === 'nextPage') currentPage++;
                            await updateMenu(currentPage, i);
                        });
                    }
                    if (options === "msgEmbedConfig"){

                        let serverConfig = await client.db.verification.findById(interaction.guild.id)

                        let titleSave = serverConfig.configuration.embed.title;
                        let descriptionSave = serverConfig.configuration.embed.description;

                        const modal = new Discord.ModalBuilder()
                            .setTitle(`Configurando embed de verificação`)
                            .setCustomId('modalMsgConfig')

                        const titleEmbed = new Discord.TextInputBuilder()
                            .setCustomId('titleEmbed')
                            .setLabel("Qual sera o titula da embed?")
                            .setValue(titleSave)
                            .setStyle(Discord.TextInputStyle.Short)
                            .setMaxLength(256)
                            .setRequired(true);

                        const descriptionEmbed = new Discord.TextInputBuilder()
                            .setCustomId('descriptionEmbed')
                            .setLabel("Qual sera o conteúdo do corpo da embed?")
                            .setValue(descriptionSave)
                            .setStyle(Discord.TextInputStyle.Paragraph)
                            .setMaxLength(4000)
                            .setRequired(true);

                        const title = new Discord.ActionRowBuilder().addComponents(titleEmbed);
                        const description = new Discord.ActionRowBuilder().addComponents(descriptionEmbed);

                        modal.addComponents(title, description)

                        await interaction.showModal(modal)

                    }
                    if (options === "sendEmbed"){
                        let serverConfig = await client.db.verification.findById(interaction.guild.id)

                        let channel = interaction.guild.channels.cache.get(serverConfig.configuration.channel);
                        let roleAdd = serverConfig.configuration.roleAdd;
                        let roleRemove = serverConfig.configuration.roleRemove;
                        let title = serverConfig.configuration.embed.title;
                        let description = serverConfig.configuration.embed.description;

                        if (!channel || !roleAdd || !roleRemove || !title || !description) {
                            return interaction.reply({ content: "Uma ou mais configurações obrigatórias estão faltando. Finalize a configuração do sistema antes de prosseguir.", ephemeral: true });
                        }

                        const embedV = new Discord.EmbedBuilder()
                            .setTitle(title)
                            .setDescription(description)
                            .setColor("#2b2d31");

                        const buttons = new Discord.ActionRowBuilder()
                            .addComponents(
                                new Discord.ButtonBuilder()
                                    .setCustomId("verification")
                                    .setLabel("Verificar")
                                    .setStyle(Discord.ButtonStyle.Success)
                        );

                        const { embed, row} = await embedPainel(client, interaction)

                        await channel.send({ embeds: [embedV], components: [buttons] });
                        await interaction.update({ embeds: [embed], components: [row] });
                        interaction.followUp({ content: `A embed foi enviada no canal ${channel}!`, ephemeral: true })

                    }
                }
                if(interaction.customId === "textChannelSelect"){

                    const selectedChannelId = interaction.values[0];
                    const selectedChannel = interaction.guild.channels.cache.get(selectedChannelId);

                    let serverConfig = await client.db.verification.findById(interaction.guild.id);
                    serverConfig.configuration.channel = selectedChannelId;
                    await serverConfig.save();

                    const { embed, row } = await embedPainel(client, interaction);

                    await interaction.deferUpdate();

                    await interaction.editReply({ embeds: [embed], components: [row], ephemeral: true });

                    await interaction.followUp({ content: `O canal ${selectedChannel} foi configurado como canal de verificação com sucesso.`, ephemeral: true });

                }
                if(interaction.customId === "selectedRoleAdd"){

                    const selectedRoleAddId = interaction.values[0];
                    const selectedRoleAdd = interaction.guild.roles.cache.get(selectedRoleAddId);

                    let serverConfig = await client.db.verification.findById(interaction.guild.id);
                    serverConfig.configuration.roleAdd = selectedRoleAddId;
                    await serverConfig.save();

                    const { embed, row} = await embedPainel(client, interaction)

                    await interaction.deferUpdate();

                    await interaction.editReply({ embeds: [embed], components: [row], ephemeral: true });

                    await interaction.followUp({ content: `O cargo ${selectedRoleAdd} foi configurado para ser adicionado após a verificação.`, ephemeral: true });

                }
                if(interaction.customId === "selectedRoleRm"){

                    const selectedRoleRmId = interaction.values[0];
                    const selectedRoleRm = interaction.guild.roles.cache.get(selectedRoleRmId);

                    let serverConfig = await client.db.verification.findById(interaction.guild.id);
                    serverConfig.configuration.roleRemove = selectedRoleRmId;
                    await serverConfig.save();

                    const { embed, row} = await embedPainel(client, interaction)

                    await interaction.deferUpdate();

                    await interaction.editReply({ embeds: [embed], components: [row], ephemeral: true });

                    await interaction.followUp({ content: `O cargo ${selectedRoleRm} foi configurado para ser removido após a verificação.`, ephemeral: true });

                }
                if(interaction.customId === "selectedCategory"){

                    const selectedCategoryId = interaction.values[0];
                    const selectedCategory = interaction.guild.channels.cache.get(selectedCategoryId);

                    let serverConfig = await client.db.verification.findById(interaction.guild.id);
                    serverConfig.configuration.category = selectedCategoryId;
                    await serverConfig.save();

                    const { embed, row} = await embedPainel(client, interaction)

                    await interaction.deferUpdate();

                    await interaction.editReply({ embeds: [embed], components: [row], ephemeral: true });

                    await interaction.followUp({ content: `A categoria ${selectedCategory} foi configurada para ser a categoria de tickets de verificação de novos usuários.`, ephemeral: true });

                }
            }
            if (interaction.isButton()){
                if (interaction.customId === "verification") {
                    let request = await client.db.request.findOne({_id: interaction.guild.id, requester: interaction.user.id});
                    if (request) return interaction.reply({ content: `Você já possui uma solicitação de acesso em aberto, aguarde uma resposta.`, ephemeral: true });

                    let embed = new Discord.EmbedBuilder()
                        .setDescription("Selecione o usuário que te convidou para o servidor e aguarde-o autorizar o seu acesso ao servidor.")
                        .setColor("#2b2d31");

                    const userSelect = new Discord.UserSelectMenuBuilder()
                        .setCustomId('users')
                        .setPlaceholder('Selecione um usuário.')

                    const row = new Discord.ActionRowBuilder().addComponents(userSelect);

                    interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
                }
                if (interaction.customId === "confirm"){
                    let config = await client.db.verification.findById(interaction.guild.id)
                    let request = await client.db.request.findOne({channel: interaction.channel.id});

                    const user = await interaction.guild.members.cache.get(request.requester);

                    let roleAdd = interaction.guild.roles.cache.get(config.configuration.roleAdd);
                    let roleRemove = interaction.guild.roles.cache.get(config.configuration.roleRemove);

                    user.roles.add(roleAdd);
                    user.roles.remove(roleRemove);

                    await interaction.update({ content: `A solicitação do membro ${user} foi aceita com sucesso, agora ele possui total acesso ao servidor.`, embeds: [], components: []});
                    setTimeout(() => interaction.channel.delete(), 30 * 1000);
                    await request.deleteOne();

                }
                if (interaction.customId === "cancel"){
                    let request = await client.db.request.findOne({channel: interaction.channel.id});
                    const user = await interaction.guild.members.cache.get(request.requester);


                    await interaction.update({ content: `A solicitação do membro ${user} foi recusada com sucesso.`, embeds: [], components: []});
                    setTimeout(() => interaction.channel.delete(), 30 * 1000);
                    await request.deleteOne();
                }
            }
            if(interaction.isUserSelectMenu()){
                if (interaction.customId === "users") {
                    const selected = interaction.values[0];
                    const selectedMember = interaction.guild.members.cache.get(selected);
                    let userIcon = interaction.user.displayAvatarURL({ dynamic: true });

                    if (selectedMember.id === interaction.user.id || selectedMember.user.bot) return interaction.reply({ content: `${interaction.user}, ouve um problema ao buscar o usuário, escolha outro membro.`, embeds: [], components: [], ephemeral: true  });

                    let serverConfig = await client.db.verification.findById(interaction.guild.id);
                    let category = interaction.guild.channels.cache.get(serverConfig.configuration.category);

                    const channelName = `verification-${interaction.user.username}`;
                    const newChannel = await interaction.guild.channels.create({
                        name: channelName,
                        type: 0,
                        parent: category ? category.id : null,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [Discord.PermissionsBitField.Flags.ViewChannel]
                            },
                            {
                                id: selectedMember.id,
                                allow: [Discord.PermissionsBitField.Flags.ViewChannel]
                            },
                        ],
                    });

                    let request = new client.db.request({_id: interaction.guild.id, channel: newChannel.id, requester: interaction.user.id, requested: selectedMember.id});
                    await request.save()

                    const embed = new Discord.EmbedBuilder()
                        .setTitle(`${interaction.guild.name} - Acesso`)
                        .setDescription(`Olá, o usuário ${interaction.user} lhe enviou uma solicitação de permissão de acesso ao servidor ${interaction.guild.name}, use os botões abaixo para aceitar ou recusar.`)
                        .setThumbnail(userIcon)
                        .setFooter({ text: `Todos os direitos reservados, ${interaction.guild.name}. ©2024`})
                        .setColor("#2b2d31")

                    const confirm = new Discord.ButtonBuilder()
                        .setCustomId('confirm')
                        .setLabel('Aceitar')
                        .setStyle(Discord.ButtonStyle.Success);

                    const cancel = new Discord.ButtonBuilder()
                        .setCustomId('cancel')
                        .setLabel('Recusar')
                        .setStyle(Discord.ButtonStyle.Danger);

                    const row = new Discord.ActionRowBuilder()
                        .addComponents(confirm, cancel);

                    await newChannel.send({ content: `${selectedMember}`, embeds: [embed], components: [row]})
                    interaction.update({ content: `${interaction.user}, a sua solicitação de verificação para ter acesso completo ao servidor foi enviada ao membro ${selectedMember}.`, embeds: [], components: [], ephemeral: true });


                }
            }
            if (interaction.isModalSubmit()){
                if (interaction.customId === "modalMsgConfig"){

                    const title = interaction.fields.getTextInputValue('titleEmbed');
                    const description = interaction.fields.getTextInputValue('descriptionEmbed');

                    let serverConfig = await client.db.verification.findById(interaction.guild.id);
                    serverConfig.configuration.embed.title = title;
                    serverConfig.configuration.embed.description = description;
                    await serverConfig.save();

                    const embedPrev = new Discord.EmbedBuilder()
                        .setTitle(serverConfig.configuration.embed.title)
                        .setDescription(serverConfig.configuration.embed.description)
                        .setColor("#2b2d31")

                    const { embed, row} = await embedPainel(client, interaction)

                    await interaction.deferUpdate();

                    await interaction.editReply({ embeds: [embed], components: [row], ephemeral: true });

                    await interaction.followUp({ content: `A embed de verificação de novos usuários foi configurada, veja uma previa logo abaixo`, embeds: [embedPrev], ephemeral: true });

                }
            }
        })
    }
}