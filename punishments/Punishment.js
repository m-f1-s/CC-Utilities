const { Permissions } = require("discord.js");

const CustomEmbed = require("../utils/CustomEmbed");
const Time = require("../utils/Time.js");

const config = require("../config.json");

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

    // execute
    async execute() {
        // get guild
        switch (this.getType()) {
            case "MUTE":
                // create embed
                const muteEmbed = new CustomEmbed(CustomEmbed.getDefaults(this.getExecutor()));

                // get role
                let muteRole = this.getMessage().guild.roles.cache.find(role => role.name.toLowerCase() === "muted");

                // add
                this.getTarget().roles.add(muteRole.id);

                // send message
                muteEmbed.field["description"] = `Successfully muted <@${this.getTarget().user.id}>.\n(\`${this.getReason()}\`)`;
                this.getMessage().channel.send({ embeds: [muteEmbed.create() ]});
                break;
            case "TEMPMUTE":
                // create embed
                const tempmuteEmbed = new CustomEmbed(CustomEmbed.getDefaults(this.getExecutor()));

                // get role
                const tempmuteRole = this.getMessage().guild.roles.cache.find(role => role.name.toLowerCase() === "muted");

                // add
                this.getTarget().roles.add(tempmuteRole.id);

                // get duration string
                const tempmuteDuration = Time.getTimeStr(this.getDuration());

                // send message
                tempmuteEmbed.field["description"] = `Successfully temp-muted <@${this.getTarget().user.id}>.\n(\`${this.getReason()}, ${tempmuteDuration}\`)`;
                this.getMessage().channel.send({ embeds: [tempmuteEmbed.create() ]});

                // set unmute timeout
                setTimeout(() => this.getTarget().roles.remove(tempmuteRole.id), this.getDuration());
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

                // delay
                setTimeout(() => {
                    // overwrite permissions
                    jailChannel.permissionOverwrites.create(this.getTarget(), {
                        VIEW_CHANNEL: true,
                        SEND_MESSAGES: true,
                        READ_MESSAGE_HISTORY: true,
                        ATTACH_FILES: false
                    });
                }, 500);

                // get role
                const jailRole = this.getMessage().guild.roles.cache.find(role => role.name.toLowerCase() === "jail");

                // add role
                this.getTarget().roles.add(jailRole.id);

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
                    this.getTarget().roles.remove(jailRole.id);
                    this.getMessage().guild.channels.delete(jailChannel.id);
                }, this.getDuration());
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

        let duration = this.getDuration();
        if (duration !== "Permanent")
            duration = Time.getTimeStr(this.getDuration());

        // create fields
        const fields = [
            {name: "Target", value: `<@${this.getTarget().id}>`, inline: true},
            {name: "Executor", value: `<@${this.getExecutor().id}>`, inline: true},
            {name: "Type", value: this.getType(), inline: true},
            {name: "Reason", value: this.getReason(), inline: true},
            {name: "Duration", value: duration, inline: true},
            {name: "Channel", value: this.getMessage().channel.id, inline: true}
        ];

        embed.field["fields"] = fields;

        // send message
        channel.send({ embeds: [embed.create()] });
    }
}

module.exports = Punishment;