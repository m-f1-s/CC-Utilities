const { Permissions } = require("discord.js");
const CustomEmbed = require("../utils/CustomEmbed.js");

module.exports = {
    name: "unlock",
    alias: [],
    async execute(message, args) {
        // check for permission
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) return;

        // author variable
        const author = message.author;

        // create embed
        const embed = new CustomEmbed(CustomEmbed.getDefaults(author));
        embed.field["description"] = "Successfully unlocked `" + message.channel.name + "`.";
        message.channel.send({ embeds: [embed.create()] });

        // get everyone role
        const role = message.guild.roles.cache.find(role => role.name === "@everyone");

        // lock channel
        await message.channel.permissionOverwrites.create(role, {
            SEND_MESSAGES: true
        });

        // delete message
        message.delete(message);
    }
}