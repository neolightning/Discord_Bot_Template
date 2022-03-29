const { stripIndents } = require("common-tags");
const { getMember } = require("../../functions.js");
module.exports = {
    name: "mute",
    category: "moderation",
    description: "Mutes a user",
    parameters: ["'@Role'", "'mute interval in seconds'"], 
    usage: "<input>",
    run: async (client, message, args) => {
        message.delete();
        if (args.length < 1) 
            return client.createMessage(message.channel.id, "No user specified").then(m => setTimeout(function() {m.delete();}, 5000));

        const rMember = getMember(message, args[0]);
        
        if (!rMember) {
            return client.createMessage(message.channel.id, "Couldn't find that person").then(m => setTimeout(function() {m.delete();}, 5000));
        }

        let timeout = 300;
        if (args.length >= 2 && !isNaN(args[1].trim()) && args[1].trim() > 0)
        {
            timeout = Number(args[1].trim());
        }

        rMember.addRole("633381323972542465");
        setTimeout(function() {
            rMember.removeRole("633381323972542465");
        }, timeout * 1000);

        return client.createMessage(message.channel.id, {
            embed: {
                author: { // Author property
                    name: rMember.nick,
                    icon_url: rMember.avatarURL
                },
                title: "User muted",
                description: stripIndents`${rMember.mention} wurde von ${message.member.mention} für ${timeout} sekunden gemutet! 😘`,
                color: 0xff0000,
                footer: {
                    text: message.member.nick,
                    icon_url: message.member.avatarURL
                }
            }
        });
    }
}