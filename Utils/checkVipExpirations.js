const checkVipExpirations = async (client) => {
    const now = new Date();
    const vips = await client.db.userVip.find();

    for (const vip of vips) {
        const expirationDate = new Date(vip.expirationDate);

        if (expirationDate <= now) {
            const guild = client.guilds.cache.get(vip._id);

            if (!guild) continue;

            try {
                const member = guild.members.cache.get(vip.userId);

                const role = guild.roles.cache.get(vip.roleId);
                if (role) await role.delete(`VIP expirado para o usuário ${member.user}`);

                const channel = guild.channels.cache.get(vip.channelId);
                if (channel) await channel.delete(`VIP expirado para o usuário ${member.user}`);

                await client.db.userVip.deleteOne({_id: vip._id, userId: vip.userId });

                if (member) {
                    await member.send(`Seu VIP no servidor **${guild.name}** expirou. Para renovar, entre em contato com a administração.`);
                }
            } catch (error) {
                console.error(`Erro ao processar o VIP expirado para o usuário ${vip.userId}:`, error);
            }
        }
    }
};

module.exports = { checkVipExpirations };
