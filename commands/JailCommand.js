const { Permissions } = require("discord.js");
const CustomEmbed = require("../utils/CustomEmbed.js");
const Punishment = require("../punishments/Punishment.js");
const Time = require("../utils/Time.js");

module.exports = {
    name: "jail",
    alias: [],
    execute(message, args) {
        // check for permission
        if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return;

        // author variable
        const author = message.author;

        // create embed
        const embed = new CustomEmbed(CustomEmbed.getDefaults(author));

        // check argument length
        if (args.length < 3) {
            embed.field["description"] = "Incorrect Usage!\n(`>jail <@user> <time> <reason>`)"
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

        let role = message.guild.roles.cache.find(role => role.name.toLowerCase() === "jail");

        if (!role) {
            embed.field["description"] = "Jail role does not exist. Create one before executing.";
            message.channel.send({ embeds: [embed.create()] });
            return;
        }

        // if target is muted
        if (target.roles.cache.has(role.id)) {
            embed.field["description"] = "User is already jailed!";
            message.channel.send({ embeds: [embed.create()] });
            return;
        }
        // remove embed variable
        delete embed;

        // create punishment
        const punishment = new Punishment(message, target, author, "JAIL", reason, ms);

        // execute and log
        punishment.execute();
        punishment.log();

        // delete message
        message.delete(message);
    }
}