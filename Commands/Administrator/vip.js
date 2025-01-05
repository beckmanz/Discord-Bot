const Discord = require("discord.js");
const moment = require('moment');
require('moment-duration-format');
const { userVip } = require("../../Data/Models");

module.exports = {
    name: 'vip',
    description: "use to manage your vip or add/remove members from your vip",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [{
        name: 'user',
        type: Discord.ApplicationCommandOptionType.User,
        description: 'member you want to add or remove from your vip',
        required: false,
    }],

    run: async (client, interaction) => {
        const memberOption = interaction.options.getUser('user');
        const vip = await client.db.userVip.findOne({_id: interaction.guild.id, userId: interaction.user.id });

        if (!vip) {
            return interaction.reply({ content: "Você não é um membro VIP deste servidor.", ephemeral: true });
        }

        let role = interaction.guild.roles.cache.get(vip.roleId);
        let channel = interaction.guild.channels.cache.get(vip.channelId);

        if (!role){
            const newRole = await interaction.guild.roles.create({ name: `vip-${interaction.user.username}` });
            vip.roleId = newRole.id;
            await vip.save()
            await interaction.roles.add(newRole);
            role = interaction.guild.roles.cache.get(newRole.id);
        }

        if (!channel){
            const newChannel = await interaction.guild.channels.create({
                name: `vip-${interaction.user.username}`,
                type: 2,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [Discord.PermissionsBitField.Flags.ViewChannel]
                    },
                    {
                        id: interaction.user.id,
                        allow: [Discord.PermissionsBitField.Flags.ViewChannel]
                    },
                    {
                        id: role.id,
                        allow: [Discord.PermissionsBitField.Flags.ViewChannel]
                    }
                ],
            });
            vip.channelId = newChannel.id;
            await vip.save()
            channel = interaction.guild.channels.cache.get(newChannel.id);
        }

        if (memberOption) {
            const member = interaction.guild.members.cache.get(memberOption.id);

            if (!member) {
                return interaction.reply({ content: "Não foi possível encontrar o membro no servidor.", ephemeral: true });
            }

            if (member.roles.cache.has(role.id)) {
                await member.roles.remove(role);
                return interaction.reply({ content: `Você removeu o membro ${member} do seu VIP.`, ephemeral: true });
            } else {
                await member.roles.add(role);
                return interaction.reply({ content: `Você adicionou o membro ${member} ao seu VIP.`, ephemeral: true });
            }
        }

        let remainingTime;
        const now = new Date();
        const expirationDate = new Date(vip.expirationDate);
        const duration = moment.duration(expirationDate - now);
        remainingTime = duration.format("D [dias], H [horas], m [minutos]");

        const painelVip = new Discord.EmbedBuilder()
            .setTitle(`Painel Vip - ${interaction.user.username}`)
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`O seu vip se encerra em ${remainingTime}\n\n**Canal:** ${channel}\n**Cargo:** ${role}`)
            .addFields({ name: `Gerenciamento`, value: `Para editar o seu vip, use as opções no seletor abaixo.\nE para adicionar ou remover um membro do seu vip, use \`/vip user:@membro\`.` })
            .setFooter({ text: `Todos os direitos reservados, ${interaction.guild.name}. ©2024`})
            .setColor("#2b2d31");

        const select = new Discord.StringSelectMenuBuilder()
            .setCustomId('optVip')
            .setPlaceholder('Selecione uma opção')
            .addOptions(
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel('Editar canal')
                    .setDescription('Usar para editar nome e limite do seu canal.')
                    .setValue('channel'),
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel('Editar cargo')
                    .setDescription('Usar para editar nome e cor do seu cargo.')
                    .setValue('cargo'),
                new Discord.StringSelectMenuOptionBuilder()
                    .setLabel('Ver amigos')
                    .setDescription('Usar para ver a lista de todos os membros do seu vip.')
                    .setValue('amigos'),
            );

        const row = new Discord.ActionRowBuilder().addComponents(select);

        await interaction.reply({ embeds: [painelVip], components: [row], ephemeral: true });

        client.on("interactionCreate", async (interaction) => {
            if (interaction.isStringSelectMenu() && interaction.customId === "optVip" && interaction.user.id === vip.userId) {
                let options = interaction.values[0];

                switch (options) {
                    case 'channel':
                        const modalChannel = new Discord.ModalBuilder()
                            .setTitle('Configurando canal')
                            .setCustomId('modalChannel');

                        const channelName = new Discord.TextInputBuilder()
                            .setCustomId('channelName')
                            .setLabel("Qual será o novo nome do seu canal?")
                            .setStyle(Discord.TextInputStyle.Short)
                            .setMaxLength(100)
                            .setRequired(true)
                            .setValue(channel.name);

                        const channelLimit = new Discord.TextInputBuilder()
                            .setCustomId('channelLimit')
                            .setLabel("Qual será o limite do seu canal?")
                            .setPlaceholder('Exemplo: 69')
                            .setStyle(Discord.TextInputStyle.Short)
                            .setMaxLength(2)
                            .setRequired(true)
                            .setValue(String(channel.userLimit));

                        const chn = new Discord.ActionRowBuilder().addComponents(channelName);
                        const lmt = new Discord.ActionRowBuilder().addComponents(channelLimit);
                        modalChannel.addComponents(chn, lmt);

                        await interaction.showModal(modalChannel);
                        break;
                    case 'cargo':

                        const colorHex = `#${role.color.toString(16).padStart(6, '0')}`;

                        const modalRole = new Discord.ModalBuilder()
                            .setTitle('Configurando canal')
                            .setCustomId('modalRole');

                        const roleName = new Discord.TextInputBuilder()
                            .setCustomId('roleName')
                            .setLabel("Qual será o novo nome do seu cargo?")
                            .setStyle(Discord.TextInputStyle.Short)
                            .setMaxLength(100)
                            .setRequired(true)
                            .setValue(role.name);

                        const roleColor = new Discord.TextInputBuilder()
                            .setCustomId('roleColor')
                            .setLabel("Qual será a cor do seu cargo?")
                            .setPlaceholder('Tem que ser uma cor em código Hexadecimal, Exemplo: #FF5733')
                            .setStyle(Discord.TextInputStyle.Short)
                            .setMinLength(7)
                            .setMaxLength(7)
                            .setRequired(true)
                            .setValue(colorHex);

                        const rl = new Discord.ActionRowBuilder().addComponents(roleName);
                        const cl = new Discord.ActionRowBuilder().addComponents(roleColor);
                        modalRole.addComponents(rl, cl);

                        await interaction.showModal(modalRole);
                        break;
                    case 'amigos':
                        await interaction.deferUpdate();
                        const membersWithRole = [];
                        await interaction.guild.members.fetch();

                        interaction.guild.members.cache.forEach(membro => {
                            if (membro.roles.cache.has(role.id) && membro.id !== interaction.user.id) {
                                membersWithRole.push(membro.user);
                            }
                        });

                        const painelVip = new Discord.EmbedBuilder()
                            .setTitle(`Painel Vip - ${interaction.user.username}`)
                            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                            .setDescription(`O seu vip se encerra em ${remainingTime}\n\n**Canal:** ${channel}\n**Cargo:** ${role}`)
                            .addFields({ name: `Gerenciamento`, value: `Para editar o seu vip, use as opções no seletor abaixo.\nE para adicionar ou remover um membro do seu vip, use \`/vip user:@membro\`.` })
                            .setFooter({ text: `Todos os direitos reservados, ${interaction.guild.name}. ©2024`})
                            .setColor("#2b2d31")

                        const embedAmigos = new Discord.EmbedBuilder()
                            .setTitle(`Membros do seu vip`)
                            .setDescription(`Os membros que possuem sua tag vip ${role} são:\n` + membersWithRole.join("\n"))
                            .setFooter({ text: `Todos os direitos reservados, ${interaction.guild.name}. ©2024`})
                            .setColor("#2b2d31")
                            .setTimestamp();

                        if (membersWithRole.length === 0) {
                            await interaction.editReply({ embeds: [painelVip], components: [row], ephemeral: true });
                            return interaction.followUp({ content: `Você ainda não tem membros no seu vip!`, ephemeral: true });
                        }

                        await interaction.editReply({ embeds: [painelVip], components: [row], ephemeral: true });
                        interaction.followUp({ embeds: [embedAmigos], ephemeral: true });
                        break;
                }
            }

            if (interaction.isModalSubmit() && interaction.user.id === vip.userId) {
                if (interaction.customId === "modalChannel") {
                    await interaction.deferUpdate();

                    const name = interaction.fields.getTextInputValue('channelName');
                    const limit = interaction.fields.getTextInputValue('channelLimit');

                    const painelVip = new Discord.EmbedBuilder()
                        .setTitle(`Painel Vip - ${interaction.user.username}`)
                        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                        .setDescription(`O seu vip se encerra em ${remainingTime}\n\n**Canal:** ${channel}\n**Cargo:** ${role}`)
                        .addFields({ name: `Gerenciamento`, value: `Para editar o seu vip, use as opções no seletor abaixo.\nE para adicionar ou remover um membro do seu vip, use \`/vip user:@membro\`.` })
                        .setFooter({ text: `Todos os direitos reservados, ${interaction.guild.name}. ©2024`})
                        .setColor("#2b2d31")

                    if (isNaN(limit)) {
                        await interaction.editReply({ embeds: [painelVip], components: [row], ephemeral: true });
                        return interaction.followUp({ content: 'Por favor, insira um número válido entre 0 e 99 para o limite de usuários do seu canal!', ephemeral: true });
                    }

                    await channel.edit({ name: name, userLimit: limit });

                    await interaction.editReply({ embeds: [painelVip], components: [row], ephemeral: true });
                    await interaction.followUp({ content: `Nome e limite do seu canal vip foram atualizados com sucesso.`, ephemeral: true });
                }

                if (interaction.customId === "modalRole") {
                    await interaction.deferUpdate();

                    const name = interaction.fields.getTextInputValue('roleName');
                    const color = interaction.fields.getTextInputValue('roleColor');

                    function isValidHexColor(color) {
                        const hexRegex = /^#[0-9A-Fa-f]{6}$/;
                        return hexRegex.test(color);
                    }
                    const painelVip = new Discord.EmbedBuilder()
                        .setTitle(`Painel Vip - ${interaction.user.username}`)
                        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                        .setDescription(`O seu vip se encerra em ${remainingTime}\n\n**Canal:** ${channel}\n**Cargo:** ${role}`)
                        .addFields({ name: `Gerenciamento`, value: `Para editar o seu vip, use as opções no seletor abaixo.\nE para adicionar ou remover um membro do seu vip, use \`/vip user:@membro\`.` })
                        .setFooter({ text: `Todos os direitos reservados, ${interaction.guild.name}. ©2024`})
                        .setColor("#2b2d31")

                    if (!isValidHexColor(color)) {
                        await interaction.editReply({ embeds: [painelVip], components: [row], ephemeral: true });
                        return interaction.followUp({ content: 'Por favor, insira uma cor hexadecimal válida!', ephemeral: true });
                    }

                    await role.edit({ name: name, color: color });

                    await interaction.editReply({ embeds: [painelVip], components: [row], ephemeral: true });
                    await interaction.followUp({ content: `Nome e cor do seu cargo vip foram atualizados com sucesso.`, ephemeral: true });
                }
            }
        });

    }
};