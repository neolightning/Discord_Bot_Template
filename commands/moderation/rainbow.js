const { stripIndents } = require("common-tags");
const { getRole, getRandomColor, getFromDatabase, saveToDatabase, deleteFromDatabase } = require("../../functions.js");

module.exports = {
    name: "rainbow",
    aliases: ["rb", "rbow"],
    category: "moderation",
    description: "changes the color of the role in an interval",
    parameters: ["'@Role' or 'stop'", "'Interval in minutes' or '@Role' if 1st parameter is 'stop'"], 
    usage: "<input>",    
    run: async (client, message, args) => {
        message.delete();
        
        if (args.length < 1) 
            return client.createMessage(message.channel.id, "No pervert specified").then(m => setTimeout(function() {m.delete();}, 5000));

        if (args[0].toLowerCase() === "stop") {
            const rRole = getRole(message, args[1]);
            
            if (!rRole) {
                return client.createMessage(message.channel.id, "Couldn't find that pervert").then(m => setTimeout(function() {m.delete();}, 5000));
            }

            deleteFromDatabase("rainbows", [`roleid=${rRole.id}`, `guildid=${message.channel.guild.id}`], function(result) {
                return client.createMessage(message.channel.id, {
                    embed: {
                        title: "😭 Someone got captured",
                        description: stripIndents`${rRole.mention} was captured by ${message.member.mention} and is no longer flashing. 😣`,
                        color: 0xff0000,
                        footer: {
                            text: message.member.nick,
                            icon_url: message.member.avatarURL
                        }
                    }
                });
            });
        }
        else {
            const rRole = getRole(message, args[0]);
            
            if (!rRole) {
                return client.createMessage(message.channel.id, "Couldn't find that role").then(m => setTimeout(function() {m.delete();}, 5000));
            }

            getFromDatabase("rainbows", [], [`roleid=${rRole.id}`, `guildid=${message.channel.guild.id}`], function(result) {
                if (result.length > 0)
                    return client.createMessage(message.channel.id, `${rRole.mention} is already showing the best parts. 🤩`).then(m => setTimeout(function() {m.delete();}, 5000));
        
                var timeout = 3;
                if (args.length >= 2 && !isNaN(args[1].trim()) && Number(args[1].trim()) >= 1)
                {
                    timeout = Number(args[1].trim());
        
                }

                setInterval(function() {
                    rRole.edit({color: Number(getRandomColor())}, "Rainboooooow!");
                }, timeout * 1000 * 60).unref();
        
                saveToDatabase("rainbows", [rRole.id.toString(), timeout, message.channel.guild.id.toString()]);    

                return client.createMessage(message.channel.id, {
                    embed: {
                        title: "🥰 We got an flasher 😍",
                        description: stripIndents`${rRole.mention} is now blinking like a vibrating toy thanks to: ${message.member.mention} 🌈`,
                        color: 0xff0000,
                        footer: {
                            text: message.member.nick,
                            icon_url: message.member.avatarURL
                        }
                    }
                });
            });
        }
    }
}