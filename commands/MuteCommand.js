const { Permissions, Role, ThreadChannel } = require("discord.js");
const CustomEmbed = require("../utils/CustomEmbed.js");
const Punishment = require("../punishments/Punishment.js");

module.exports = {
    name: "mute",
    alias: [],
    async execute(message, args) {
        // check for permission
        if (!message.member.permissions.has(Permissions.FLAGS.MUTE_MEMBERS)) return;

        // author variable
        const author = message.author;

        // create embed
        const embed = new CustomEmbed(CustomEmbed.getDefaults(author));

        // check argument length
        if (args.length < 2) {
            embed.field["description"] = "Incorrect Usage!\n(`>mute <@user> <reason>`)"
            message.channel.send({ embeds: [embed.create()] });
            return;
        }

        // check if argument 1 is a valid user
        const target = message.mentions.members.first();

        if (!target) {
            embed.field["description"] = "Invalid Member!\n(`Must be a ping`)"
            message.channel.send({ embeds: [embed.create()] });
            return;
        }

        // get reason
        let reason = "";
        for (let i = 1; i < args.length; i++) {
            if (reason.length === 0) reason = args[i];
            else reason = reason + " " + args[i];
        }

        // get muted role
        let role = message.guild.roles.cache.find(role => role.name.toLowerCase() === "muted");

        if (!role) {
            try {
                // create channel
                const newRole = await message.guild.roles.create({name: "muted"});

                if (newRole instanceof Role)
                    role = newRole;

                // overwrite permissions
                await message.guild.channels.cache.forEach(async (channel) => {
                    if (channel instanceof ThreadChannel) return;

                    await channel.permissionOverwrites.create(role, {
                        ADD_REACTIONS: false,
                        SEND_MESSAGES: false,
                    })
                });
            } catch (err) {
                embed.field["description"] = "Couldn't create muted role. Check if I have administrator permissions."
                message.channel.send({ embeds: [embed.create()] });
                return;
            }
        }

        // if target is muted
        if (target.roles.cache.has(role.id)) {
            embed.field["description"] = "User is already muted!";
            message.channel.send({ embeds: [embed.create()] });
            return;
        }

        // remove embed variable
        delete embed;

        // create punishment
        const punishment = new Punishment(message, target, author, "MUTE", reason, "Permanent");

        // execute and log
        punishment.execute();
        punishment.log();

        // delete message
        message.delete(message);
    }
}