class Time {
    static parseTime(time) {
        // send to lower
        time.toLowerCase();

        if (time.includes("w")) {
            if (!parseInt(time.split("w")[0])) 
                return undefined;
            
            const num = time.split("w")[0];
            return num * (86400 * 7);
        } else if (time.includes("d")) {
            if (!parseInt(time.split("d")[0])) 
                return undefined;

            const num = time.split("d")[0];
            return num * 86400;
        } else if (time.includes("h")) {
            if (!parseInt(time.split("h")[0])) 
                return undefined;
            
            const num = time.split("h")[0];
            return num * 3600;
        } else if (time.includes("m")) {
            if (!parseInt(time.split("m")[0])) 
                return undefined;
            
            const num = time.split("m")[0];
            return num * 60;
        } else if (time.includes("s")) {
            if (!parseInt(time.split("s")[0])) 
                return undefined;
            
            const num = time.split("s")[0];
            return num;
        } else 
            return undefined;
    }

    static getTimeStr(ms) {
        // get the amount of variable units of time from ms
        const days = Math.floor(ms / (24 * 60 * 60 * 1000));
        const daysms = ms % (24 * 60 * 60 * 1000);
        const hours = Math.floor((daysms) / (60 * 60 * 1000));
        const hoursms = ms % (60 * 60 * 1000);
        const minutes = Math.floor((hoursms) / (60 * 1000));
        const minutesms = ms % (60 * 1000);
        const seconds = Math.floor((minutesms) / (1000));

        // create the string variable
        let time = "";

        // convert the ms to readable text
        if (days > 0) {
            var str = " days";
            if (days == 1) str = " day";
            time = days + str;
        }

        if (hours > 0) {
            var str = " hours";
            if (hours == 1) str = " hour";
            if (time == "") time = hours + str;
            else time = `${time} ${hours}${str}`;
        }

        if (minutes > 0) {
            var str = " minutes";
            if (minutes == 1) str = " minute";
            if (time == "") time = minutes + str;
            else time = `${time} ${minutes}${str}`;
        }

        if (seconds > 0) {
            var str = " seconds";
            if (seconds == 1) str = " second";
            if (time == "") time = seconds + str;
            else time = `${time} ${seconds}${str}`;
        }

        return time;
    }
}

module.exports = Time;