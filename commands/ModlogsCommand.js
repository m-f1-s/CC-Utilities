const { Permissions } = require("discord.js");

const CustomEmbed = require("../utils/CustomEmbed.js");
const Logs = require("../punishments/Logs.js");

module.exports = {
    name: "modlogs",
    alias: [],
    execute(message, args) {
        // check for permission
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return;

        // author variable
        const author = message.author;

        // create embed
        const embed = new CustomEmbed(CustomEmbed.getDefaults(author));

        // check argument length
        if (args.length != 1) {
            embed.field["description"] = "Incorrect Usage!\n(`>modlogs <@user>`)"
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

        // get stats
        const stats = Logs.getStats(message.guild.id, target.user.id);

        if (stats) {
            // create fields
            const fields = [
                {name: "Warns", value: stats.WARN.toString(), inline: true},
                {name: "Mutes", value: stats.MUTE.toString(), inline: true},
                {name: "Kicks", value: stats.KICK.toString(), inline: true},
                {name: "Jails", value: stats.JAIL.toString(), inline: true},
                {name: "Bans", value: stats.BAN.toString(), inline: true},
            ]

            // update embed
            embed.field["fields"] = fields;

            // send message
            message.channel.send({ embeds: [embed.create()] });
        }
    }
}