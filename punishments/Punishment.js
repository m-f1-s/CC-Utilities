const CustomEmbed = require("../utils/CustomEmbed");
const Time = require("../utils/Time.js");
const Logs = require("./Logs.js");

const config = require("../config.json");

const { GuildMember } = require("discord.js");
const fs = require("fs");

class Punishment {
    constructor(message, target, executor, type, reason, duration) {
        this.message = message;
        this.target = target;
        this.executor = executor;
        this.type = type;
        this.reason = reason;
        this.duration = duration;
    }

    // get message
    getMessage() { return this.message; }

    // get target
    getTarget() { return this.target; }

    // get executor
    getExecutor() { return this.executor; }

    // get type
    getType() { return this.type; }

    // get the reason
    getReason() { return this.reason; }

    // get the duration
    getDuration() { return this.duration; }

    // get muted role
    getMuteRole() {
        const role = this.getMessage().guild.roles.cache.find(role => role.name.toLowerCase() === "muted");
        return role;
    }

    // get jailed role
    getJailRole() {
        const role = this.getMessage().guild.roles.cache.find(role => role.name.toLowerCase() === "jail");
        return role;
    }

    // execute
    async execute() {
        // get guild
        switch (this.getType()) {
            case "MUTE":
                // create embed
                const muteEmbed = new CustomEmbed(CustomEmbed.getDefaults(this.getExecutor()));

                // add
                this.getTarget().roles.add(this.getMuteRole().id);

                // send message
                muteEmbed.field["description"] = `Successfully muted <@${this.getTarget().user.id}>.\n(\`${this.getReason()}\`)`;
                this.getMessage().channel.send({ embeds: [muteEmbed.create() ]});
                break;
            case "TEMPMUTE":
                // create embed
                const tempmuteEmbed = new CustomEmbed(CustomEmbed.getDefaults(this.getExecutor()));

                // add
                this.getTarget().roles.add(this.getMuteRole().id);

                // get duration string
                const tempmuteDuration = Time.getTimeStr(this.getDuration());

                // send message
                tempmuteEmbed.field["description"] = `Successfully temp-muted <@${this.getTarget().user.id}>.\n(\`${this.getReason()}, ${tempmuteDuration}\`)`;
                this.getMessage().channel.send({ embeds: [tempmuteEmbed.create() ]});

                // set unmute timeout
                setTimeout(() => this.getTarget().roles.remove(this.getMuteRole().id), this.getDuration());
                break;
            case "JAIL":
                // create embed
                const jailEmbed = new CustomEmbed(CustomEmbed.getDefaults(this.getExecutor()));

                // get name for channel
                const channelName = `${this.getTarget().user.username}-${this.getTarget().user.discriminator}`;

                // create channel
                const jailChannel = await this.getMessage().guild.channels.create(channelName, {type: "GUILD_TEXT"});

                // set parent
                jailChannel.setParent("1000398398437998602");

                // add role
                this.getTarget().roles.add(this.getJailRole().id).then(async () => {
                    // overwrite permissions
                    await jailChannel.permissionOverwrites.create(this.getTarget(), {
                        VIEW_CHANNEL: true,
                        SEND_MESSAGES: true,
                        READ_MESSAGE_HISTORY: true,
                        ATTACH_FILES: false
                    }).then(() => {
                        // get duration string
                        const jailDuration = Time.getTimeStr(this.getDuration());

                        // send message
                        jailEmbed.field["description"] = `Successfully jailed <@${this.getTarget().user.id}>.\n(\`${this.getReason()}, ${jailDuration}\`)`;
                        this.getMessage().channel.send({ embeds: [jailEmbed.create()] });

                        // create jail embed
                        const n_jailEmbed = new CustomEmbed(CustomEmbed.getDefaults(this.getTarget().user));
                        n_jailEmbed.field["description"] = `You have been jailed for \`${this.getReason()}\` by <@${this.getExecutor().id}>\nThis jail expires in ${jailDuration}.`;

                        // send jail message
                        jailChannel.send({ embeds: [n_jailEmbed.create()] });

                        // set unjail timeout
                        setTimeout(() => {
                            // remove role
                            this.getTarget().roles.remove(this.getJailRole().id);

                            // check if already deleted
                            if (!this.getMessage().guild.channels.cache.find(channel => channel.id === jailChannel.id))
                                return;

                            // delete channel
                            this.getMessage().guild.channels.delete(jailChannel.id);
                        }, this.getDuration());
                    });
                });

                break;
            case "WARN":
                // create embed
                const warnEmbed = new CustomEmbed(CustomEmbed.getDefaults(this.getExecutor()));

                // send message
                warnEmbed.field["description"] = `Successfully warned <@${this.getTarget().user.id}>.\n(\`${this.getReason()}\`)`;
                this.getMessage().channel.send({ embeds: [warnEmbed.create() ]});
                break;
            case "KICK":
                // create embeds
                const kickEmbed = new CustomEmbed(CustomEmbed.getDefaults(this.getExecutor()));
                const kickTargetEmbed = new CustomEmbed({
                    timestamp: true,
                    color: "AQUA",
                    footer: {
                        text: "CC Utilities",
                        iconURL: "https://cdn.discordapp.com/attachments/988130736290820108/1000076564664430684/E3237438-7EBF-4988-B76D-96F16FA965FA.gif"
                    },
                    description: `You have been kicked for \`${this.getReason()}\` by ${this.getExecutor().username}.`
                });

                // try to send target the kick message
                this.getTarget().send({ embeds: [kickTargetEmbed.create()] }).catch((err) => {
                    // log if error
                    console.log("Couldn't send " + this.getTarget().user.tag + " kick message because DMs are disabled.\n(" + err + ")");
                // after message is sent, kick member
                }).then(async () => {
                    this.getMessage().guild.members.kick(this.getTarget()).then((kickInfo) => {
                        // send message
                        kickEmbed.field["description"] = `Successfully kicked <@${this.getTarget().user.id}>.\n(\`${this.getReason()}\`)`;
                        this.getMessage().channel.send({ embeds: [kickEmbed.create() ]});
                    });
                });
                break;
            case "BAN":
                // create embeds
                const banEmbed = new CustomEmbed(CustomEmbed.getDefaults(this.getExecutor()));
                const banEmbedTarget = new CustomEmbed({
                    timestamp: true,
                    color: "AQUA",
                    footer: {
                        text: "CC Utilities",
                        iconURL: "https://cdn.discordapp.com/attachments/988130736290820108/1000076564664430684/E3237438-7EBF-4988-B76D-96F16FA965FA.gif"
                    },
                    description: `You have been banned for \`${this.getReason()}\` by ${this.getExecutor().username}.\n**Appeal link:** https://discord.gg/bP24jaBBWh`
                });

                // try to send target the kick message
                this.getTarget().send({ embeds: [banEmbedTarget.create()] }).catch((err) => {
                    // log if error
                    console.log("Couldn't send " + this.getTarget().user.tag + " ban message because DMs are disabled.\n(" + err + ")");
                // after message is sent, kick member
                }).then(async () => {
                    this.getTarget().ban({
                        deleteMessageDays: 1,
                        reason: this.getReason()
                    }).then(() => {
                        // send message
                        banEmbed.field["description"] = `Successfully banned <@${this.getTarget().user.id}>.\n(\`${this.getReason()}\`)`;
                        this.getMessage().channel.send({ embeds: [banEmbed.create() ]});
                    });
                });
                break;
            case "UNMUTE":
                // create embed
                const unmuteEmbed = new CustomEmbed(CustomEmbed.getDefaults(this.getExecutor()));

                // unmute target
                this.getTarget().roles.remove(this.getMuteRole().id);

                // send embed
                unmuteEmbed.field["description"] = "Successfully unmuted <@" + this.getTarget().id + ">."
                this.getMessage().channel.send({ embeds: [unmuteEmbed.create()] });
                break;
            case "UNBAN":
                // create embed
                const unbanEmbed = new CustomEmbed(CustomEmbed.getDefaults(this.getExecutor()));

                // unmute target
                this.getMessage().guild.members.unban(this.getTarget());

                // send embed
                unbanEmbed.field["description"] = "Successfully unbanned <@" + this.getTarget() + ">."
                this.getMessage().channel.send({ embeds: [unbanEmbed.create()] });
                break;
            case "UNJAIL":
                // create embed
                const unjailEmbed = new CustomEmbed(CustomEmbed.getDefaults(this.getExecutor()));

                // unjail target
                this.getTarget().roles.remove(this.getJailRole().id);

                // get channel name
                const unjailChannelName = `${this.getTarget().user.username}-${this.getTarget().user.discriminator}`.toLowerCase().replaceAll("\ ", "-");

                // get jail channel
                const unjailChannel = this.getMessage().guild.channels.cache.find(channel => channel.name.toLowerCase() === unjailChannelName);

                // send embed
                unjailEmbed.field["description"] = "Successfully unjailed <@" + this.getTarget().id + ">.\nClosing jail channel in 5 seconds..."
                this.getMessage().channel.send({ embeds: [unjailEmbed.create()] });

                // delete jail channel
                setTimeout(() => {
                    // check if channel was deleted
                    if (!this.getMessage().guild.channels.cache.find(channel => channel.id === unjailChannel.id))
                        return;

                    // delete jail channel
                    this.getMessage().guild.channels.delete(unjailChannel.id);
                }, 5000);
                break;
        }
    }

    // log
    log() {
        // get channel
        const channelID = config.log_channel[this.getMessage().guild.id];
        const channel = this.getMessage().guild.channels.cache.find(ch => ch.id === channelID);

        // create embed
        const embed = new CustomEmbed(CustomEmbed.getDefaults(this.getExecutor()));

        if (!channel) {
            embed.field["description"] = "Couldn't log punishment.\n(`Channel not found`)";
            this.getMessage().channel.send({ embeds: [embed.create()] });
            return;
        }

        // correct duration
        let duration = this.getDuration();
        if (duration !== "Permanent" && duration !== "N/A")
            duration = Time.getTimeStr(this.getDuration());

        // correct target
        let target = this.getTarget();
        if (target instanceof GuildMember)
            target = `<@${this.getTarget().id}>`;

        // create fields
        const fields = [
            {name: "Target", value: target, inline: true},
            {name: "Executor", value: `<@${this.getExecutor().id}>`, inline: true},
            {name: "Type", value: this.getType(), inline: true},
            {name: "Reason", value: this.getReason(), inline: true},
            {name: "Duration", value: duration, inline: true},
            {name: "Channel", value: this.getMessage().channel.id, inline: true}
        ];

        embed.field["fields"] = fields;

        // send message
        channel.send({ embeds: [embed.create()] });

        // check if an undoing of punishment
        if (this.getType().startsWith("UN"))
            return;

        // get ids
        const guildId = this.getMessage().guild.id;
        const executorId = this.getExecutor().id;
        const type = this.getType().replaceAll("TEMP", "");

        // create logs instance
        const logs = new Logs(guildId, executorId, type);

        // check if server is null
        if (!logs.serverInitialized()) {
            // initialize server
            logs.initializeServer();

            // return (needed)
            return;
        }

        // if executor is null
        if (!logs.userInitialized())
            logs.initializeUser();

        // log user
        logs.updateStats();
    }
}

module.exports = Punishment;