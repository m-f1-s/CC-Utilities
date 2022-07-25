const { Permissions } = require("discord.js");
const CustomEmbed = require("../utils/CustomEmbed.js");
const Punishment = require("../punishments/Punishment.js");

module.exports = {
    name: "unban",
    alias: [],
    async execute(message, args) {
        // check for permission
        if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return;

        // author variable
        const author = message.author;

        // create embed
        const embed = new CustomEmbed(CustomEmbed.getDefaults(author));

        // check argument length
        if (args.length != 1) {
            embed.field["description"] = "Incorrect Usage!\n(`>unban <user-id>`)"
            message.channel.send({ embeds: [embed.create()] });
            return;
        }

        // get target
        const target = args[0];

        // check if target is banned
        const bans = await message.guild.bans.fetch();
        const isBanned = bans.find(ban => ban.user.id === target);
        
        if (!isBanned) {
            embed.field["description"] = "User with id `" + target + "` is not banned." 
            message.channel.send({ embeds: [embed.create()] });
            return;
        }

        // remove embed variable
        delete embed;

        // create punishment
        const punishment = new Punishment(message, target, author, "UNBAN", "N/A", "N/A");

        // execute and log
        punishment.execute();
        punishment.log();

        // delete message
        message.delete(message);
    }
}