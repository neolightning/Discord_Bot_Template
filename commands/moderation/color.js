const { stripIndents } = require("common-tags");
const { getRole } = require("../../functions.js");
module.exports = {
    name: "color",
    aliases: ["clr"],
    category: "moderation",
    description: "changes the color of the role in an interval",
    parameters: ["'@Role'", "'Color in Hex. Example(0x000000)'"], 
    usage: "<input>",
    run: async (client, message, args) => {
        message.delete();
        if (args.length < 1) 
            return client.createMessage(message.channel.id, "No role specified").then(m => setTimeout(function() {m.delete();}, 5000));

        const rRole = getRole(message, args[0]);
        
        if (!rRole) {
            return client.createMessage(message.channel.id, "Couldn't find that role").then(m => setTimeout(function() {m.delete();}, 5000));
        }

        var clr = 0x000000;
        if (args.length >= 2 && args[1].length >= 6)
        {
            clr = Number(args[1].trim().replace("#", "0x"))
        }
        rRole.edit({color: clr}, "");

        return client.createMessage(message.channel.id, {
            embed: {
                title: "Role color change",
                description: stripIndents`${rRole.mention} wurde von ${message.member.mention} in die Farbe: ${args[1].trim().replace("#", "0x")} verwandelt!`,
                color: clr,
                footer: {
                    text: message.member.username,
                    icon_url: message.member.avatarURL
                }
            }
        });
    }
}