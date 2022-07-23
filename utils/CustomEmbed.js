const { MessageEmbed } = require("discord.js");

class CustomEmbed {
    // constructor
    constructor(field) {
        this.field = field;
    }

    // get field
    getField() { return this.field; }

    // this is called when the message is sent
    create() {
        const embed = new MessageEmbed();
        
        for (const key in this.getField()) {
            // make sure key isn't null
            if (!this.getField().hasOwnProperty(key)) return;

            // get new key variable
            const n_key =  this.getField()[key];

            // set all properties
            if (key === "title") embed.setTitle(n_key);
            if (key === "description") embed.setDescription(n_key);
            if (key === "fields") embed.setFields(n_key);
            if (key === "color") embed.setColor(n_key);
            if (key === "author") embed.setAuthor(n_key);
            if (key === "footer") embed.setFooter(n_key);
            if (key === "image") embed.setImage(n_key);
            if (key === "thumbnail") embed.setThumbnail(n_key);
            if (key === "timestamp" && key) embed.setTimestamp();
            if (key === "url") embed.setURL(n_key);
        }

        // return the final embed
        return embed;
    }

    // default embed options
    static getDefaults(queried) {
        const embed = {
            timestamp: true,
            color: "AQUA",
            author: {
                name: queried.username,
                url: "",
                iconURL: queried.displayAvatarURL()
            },
            footer: {
                text: "CC Utilities",
                iconURL: "https://cdn.discordapp.com/attachments/988130736290820108/1000076564664430684/E3237438-7EBF-4988-B76D-96F16FA965FA.gif"
            }
        }
    
        return embed;
    }
}

module.exports = CustomEmbed;