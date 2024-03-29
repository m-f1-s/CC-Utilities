const { Permissions } = require("discord.js");
const CustomEmbed = require("../utils/CustomEmbed.js");
const Punishment = require("../punishments/Punishment.js");

module.exports = {
    name: "unmute",
    alias: [],
    execute(message, args) {
        // check for permission
        if (!message.member.permissions.has(Permissions.FLAGS.MUTE_MEMBERS)) return;

        // author variable
        const author = message.author;

        // create embed
        const embed = new CustomEmbed(CustomEmbed.getDefaults(author));

        // check argument length
        if (args.length != 1) {
            embed.field["description"] = "Incorrect Usage!\n(`>unmute <@user>`)"
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

        // get muted role
        let role = message.guild.roles.cache.find(role => role.name.toLowerCase() === "muted");

        if (!role) {
            embed.field["description"] = "Muted role does not exist. Create one before executing.";
            message.channel.send({ embeds: [embed.create()] });
            return;
        }

        // if target isn't muted
        if (!target.roles.cache.has(role.id)) {
            embed.field["description"] = "User is not muted!";
            message.channel.send({ embeds: [embed.create()] });
            return;
        }

        // remove embed variable
        delete embed;

        // create punishment
        const punishment = new Punishment(message, target, author, "UNMUTE", "N/A", "N/A");

        // execute and log
        punishment.execute();
        punishment.log();

        // delete message
        message.delete(message);
    }
}