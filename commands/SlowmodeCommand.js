const { Permissions } = require("discord.js");
const CustomEmbed = require("../utils/CustomEmbed.js");

module.exports = {
    name: "slowmode",
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
            embed.field["description"] = "Incorrect Usage!\n(`>slowmode <duration>`)"
            message.channel.send({ embeds: [embed.create()] });
            return;
        }

        // check if number
        var duration = args[0];
        
        if (duration !== "off" && !Number.isInteger(parseInt(duration))) {
            embed.field["description"] = "Must be a number!"
            message.channel.send({ embeds: [embed.create()] });
            return;
        }

        if (duration === "off")
            duration = 0;

        // set slowmode
        message.channel.setRateLimitPerUser(duration).then(() => {
            embed.field["description"] = "Successfully set slowmode to `" + parseInt(duration) + "s`.";
            message.channel.send({ embeds: [embed.create()] });
        });
    }
}