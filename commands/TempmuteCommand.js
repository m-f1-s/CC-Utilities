const { Permissions, Role, ThreadChannel } = require("discord.js");
const CustomEmbed = require("../utils/CustomEmbed.js");
const Punishment = require("../punishments/Punishment.js");
const Time = require("../utils/Time.js");

module.exports = {
    name: "tempmute",
    alias: [],
    async execute(message, args) {
        // check for permission
        if (!message.member.permissions.has(Permissions.FLAGS.MUTE_MEMBERS)) return;

        // author variable
        const author = message.author;

        // create embed
        const embed = new CustomEmbed(CustomEmbed.getDefaults(author));

        // check argument length
        if (args.length < 3) {
            embed.field["description"] = "Incorrect Usage!\n(`>tempmute <@user> <time> <reason>`)"
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

        // get time
        const timeArg = args[1];
        const ms = Time.parseTime(timeArg) * 1000;

        if (!ms) {
            embed.field["description"] = "Invalid time phrasing.\n(`Ex: 30s, 5m, 3h, 1d`)";
            message.channel.send({ embeds: [embed.create()] });
            return;
        }

        // get reason
        let reason = "";
        for (let i = 2; i < args.length; i++) {
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
        const punishment = new Punishment(message, target, author, "TEMPMUTE", reason, ms);

        // execute and log
        punishment.execute();
        punishment.log();

        // delete message
        message.delete(message);
    }
}