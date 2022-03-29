module.exports = {
    name: "say",
    aliases: ["bc", "broadcast"],
    category: "moderation",
    description: "Says your input via the bot",
    parameters: ["'text for the bot to say'"], 
    usage: "<input>",
    run: async (client, message, args) => {
        message.delete();

        if (args.length < 1) 
            return client.createMessage(message.channel.id, "Nothing to say?").then(m => m.delete(5000));
        
        var roleColor = message.channel.guild.roles.get(message.member.roles.sort((a, b) => message.channel.guild.roles.get(b).position - message.channel.guild.roles.get(a).position)[0]).color
        roleColor = roleColor === 0x000000 ? 0xffffff : roleColor;

        if (args[0].toLowerCase() === "embed") {    
            return client.createMessage(message.channel.id, {
                embed: {
                    author: { // Author property
                        name: rMember.nick,
                        icon_url: rMember.avatarURL
                    },
                    title: "User muted",
                    description: args.slice(1).join(" "),
                    color: roleColor,
                    footer: {
                        text: message.member.nick,
                        icon_url: message.member.avatarURL
                    }
                }
            });  
        }
        else {
            const msg = args.join(" ");
            return client.createMessage(message.channel.id, msg);
        }     
    }
}