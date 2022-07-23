const { Client, Intents, Collection, MessageEmbed } = require("discord.js");  
const { readdirSync } = require("fs");

const CommandListener = require("./listeners/CommandListener.js");

// bot configuration
const client = new Client({
    // set intents
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ],
    // set presence
    presence: {
        status: "online",
        activities: [
            {
                name: "the gospel",
                type: "LISTENING"
            }
        ]
    }
});

// commands
const commandFiles = readdirSync("./commands/").filter(file => file.endsWith(".js"));
const commands = new Collection();
for (const file of commandFiles) {
    const command = require("./commands/" + file);
    commands.set(command.name, command);
}

// startup
client.once("ready", () => console.log("CC Utilities has loaded."));

// on message
client.on("messageCreate", (message) => {
    const listener = new CommandListener(commands);
    listener.trigger(message);
});

// login
const config = require("./config.json");
client.login(config.token);