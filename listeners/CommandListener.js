const config = require("../config.json");

class CommandListener {
    constructor(commands) {
        this.commands = commands;
    }

    // get the files
    getCommands() { return this.commands; }

    // trigger
    trigger(message) {
        // checks
        if (message.author.bot || !message.content.startsWith(config.prefix)) return;

        const args = message.content.slice(1).trim().split(" ");
        const commandName = args.shift().toLowerCase();

        // commands
        const commands = this.getCommands();

        // get command
        const command = commands.get(commandName);

        // check for alias
        if (!command) {
            if (commands.find((n_command) => {
                if (n_command.alias.includes(commandName))
                n_command = n_command;
            }));
        }

        // if found
        if (command) {
            // execute
            command.execute(message, args);

            let n_message = `[${message.guild.name}] ${message.author.username} has run command: ${command.name}`;

            if (args.length != 0)
            n_message = n_message + ` with arguments: \n[ ${args} ]`;

            // log
            console.log(n_message);    
        }
    }
}

module.exports = CommandListener;