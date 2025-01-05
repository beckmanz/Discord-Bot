const Discord = require("discord.js");
const {userVip} = require("../../Data/Models");
module.exports = {
    name: 'addvip',
    description: "Use to add users to the server's VIP member list.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [{
        name: 'user',
        type: Discord.ApplicationCommandOptionType.User,
        description: 'User to be added to server VIPs',
        required: true,
        },
        {
            name: 'time',
            type: Discord.ApplicationCommandOptionType.Number,
            description: 'length of time the member will remain on the server VIP list',
            required: true,
            choices: [
                {
                    name: '7 dias',
                    value: '7'
                },
                {
                    name: '15 dias',
                    value: '15'
                },
                {
                    name: '30 dias',
                    value: '30'
                }
                ]
        }
    ],

    run: async (client, interaction) => {
        const user = interaction.options.getUser('user');
        const time = interaction.options.getNumber('time');
        const member = interaction.guild.members.cache.get(user.id)

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({ content: `**Você não possui permissão pra utilizar este comando!**`, ephemeral: true });

        const vip = await client.db.userVip.findOne({_id: interaction.guild.id, userId: user.id})
        if (vip){
            return interaction.reply({content: `O usuário ${user} já é um membro vip do servidor!`, ephemeral: true})
        }

        const role = await interaction.guild.roles.create({
            name: `vip-${user.username}`
        });
        const channel = await interaction.guild.channels.create({
            name: `vip-${user.username}`,
            type: 2,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [Discord.PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: user.id,
                    allow: [Discord.PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: role.id,
                    allow: [Discord.PermissionsBitField.Flags.ViewChannel]
                }
            ],
        });

        member.roles.add(role);

        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + time);

        const newVip = new userVip({
            _id: interaction.guild.id,
            userId: user.id,
            expirationDate,
            roleId: role.id,
            channelId: channel.id,
        })
        await newVip.save();

        const embed = new Discord.EmbedBuilder()
            .setTitle("VIP - Membro adicionado")
            .setDescription(`${interaction.user} adicionou um novo membro a lista de vips do servidor.`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: `Membro: `, value: `${user}`, inline: true },
                { name: `Cargo: `, value: `${role}`, inline: true},
                { name: `Canal: `, value: `${channel}`, inline: true},
                {name: `Tempo:`, value: `${time} dias`, inline: true},
            )
            .setFooter({ text: `Todos os direitos reservados, ${interaction.guild.name}. ©2024`})
            .setColor("#2b2d31")

        interaction.reply({ embeds: [embed], ephemeral: true });
    }
}