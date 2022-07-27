const { Permissions } = require("discord.js");
const CustomEmbed = require("../utils/CustomEmbed.js");

module.exports = {
    name: "closejail",
    alias: [],
    execute(message, args) {
        // check for permission
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return;

        // author variable
        const author = message.author;

        // create embed
        const embed = new CustomEmbed(CustomEmbed.getDefaults(author));

        // check if jail channel
        if (message.channel.parentId !== "1000398398437998602") {
            embed.field["description"] = "Channel is not a jail channel!";
            message.channel.send({ embeds: [embed.create()] });
            return;
        }

        embed.field["description"] = "Closing jail channel in 5 seconds...";

        // send message
        message.channel.send({ embeds: [embed.create()] });

        // close channel
        setTimeout(() => {
            // check if channel already deleted
            if (!message.channel || !message.guild.channels.cache.find(channel => channel.id === message.channel.id))
                return;
            
            // delete channel
            message.guild.channels.delete(message.channel.id);
        }, 5000);

        // delete message
        message.delete(message);
    }
}