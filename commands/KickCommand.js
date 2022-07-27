const { Permissions } = require("discord.js");
const CustomEmbed = require("../utils/CustomEmbed.js");
const Punishment = require("../punishments/Punishment.js");

module.exports = {
    name: "kick",
    alias: [],
    execute(message, args) {
        // check for permission
        if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) return;

        // author variable
        const author = message.author;

        // create embed
        const embed = new CustomEmbed(CustomEmbed.getDefaults(author));

        // check argument length
        if (args.length < 2) {
            embed.field["description"] = "Incorrect Usage!\n(`>kick <@user> <reason>`)"
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

        // check if target is higher than executor
        if (target.roles.highest.position >= message.member.roles.highest.position) {
            embed.field["description"] = "You cannot kick someone with a higher role than you."
            message.channel.send({ embeds: [embed.create()] });
            return;
        }

        // get reason
        let reason = "";
        for (let i = 1; i < args.length; i++) {
            if (reason.length === 0) reason = args[i];
            else reason = reason + " " + args[i];
        }

        // remove embed variable
        delete embed;

        // create punishment
        const punishment = new Punishment(message, target, author, "KICK", reason, "N/A");

        // execute and log
        punishment.execute();
        punishment.log();

        // delete message
        message.delete(message);
    }
}