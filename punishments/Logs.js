const logs = require("../logs.json");

const fs = require("fs");

class Logs {
    constructor (guild, executor, type) {
        this.guild = guild;
        this.executor = executor;
        this.type = type;
    }

    // get guild
    getGuild() { return this.guild; }

    // get executor
    getExecutor() { return this.executor; }

    // get type
    getType() { return this.type; }

    // check if server is initialized
    serverInitialized() {
        return logs && logs[this.getGuild()]
    }

    // initialize server
    initializeServer() {
        // create new server
        const newServer = {
            "NEW_USER": {
                "WARN": 0,
                "MUTE": 0,
                "KICK": 0,
                "JAIL": 0,
                "BAN": 0
            }
        };

        newServer[this.getExecutor()] = newServer["NEW_USER"];
        delete newServer["NEW_USER"];

        // increase type to 1
        newServer[this.getExecutor()][this.getType()] = 1;

        // set to logs
        logs[this.getGuild()] = newServer;

        // write
        fs.writeFileSync("logs.json", JSON.stringify(logs, null, 2), function writeJSON(err) {
            if (err)
                console.log("(Error) Could not update logs.json.");
        });
    }

    // check if user is initialized
    userInitialized() { return logs[this.getGuild()][this.getExecutor()]; }

    // initialize user
    initializeUser() {
        // create new user
        const newUser = {
            "WARN": 0,
            "MUTE": 0,
            "KICK": 0,
            "JAIL": 0,
            "BAN": 0
        }

        // set to logs
        logs[this.getGuild()][this.getExecutor()] = newUser;
    }

    // update stats
    updateStats() { 
        logs[this.getGuild()][this.getExecutor()][this.getType()] = logs[this.getGuild()][this.getExecutor()][this.getType()] + 1;

        // write
        fs.writeFileSync("logs.json", JSON.stringify(logs, null, 2), function writeJSON(err) {
            if (err)
                console.log("(Error) Could not update logs.json.");
        });
    }

    // get a user's stats
    static getStats(guildId, userId) {
        return logs[guildId][userId];
    }
}

module.exports = Logs;