const { Permissions } = require("discord.js");
const CustomEmbed = require("../utils/CustomEmbed.js");

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

        // get reason
        let reason = "";
        for (let i = 1; i < args.length; i++) {
            if (reason.length === 0) reason = args[i];
            else reason = reason + " " + args[i];
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

        // remove muted role
        target.roles.remove(role.id);

        // send embed
        embed.field["description"] = `Successfully unmuted <@${target.user.id}>.`;
        message.channel.send({ embeds: [embed.create() ]});

        // delete message
        message.delete(message);
    }
}