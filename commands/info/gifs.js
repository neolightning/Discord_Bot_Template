const { getEmojiString, getFromDatabase } = require("../../functions.js");
module.exports = {
    name: "gifs",
    category: "info",
    description: "Returns all possible gif types to view",
    run: async (client, message, args) => {
        message.delete();
        getFromDatabase("gifs", ["type"], [], function(types) {
            var text = "All currently available types for gifs are: ";

            for (var index = 0; index < types.length; index++) {
                const type = types[index];

                if (index === 0) {
                    text += type.type;
                }
                else {
                    text += ", " + type.type;
                }
            }

            var roleColor = message.channel.guild.roles.get(message.member.roles.sort((a, b) => message.channel.guild.roles.get(b).position - message.channel.guild.roles.get(a).position)[0]).color
            roleColor = roleColor === 0x000000 ? 0xffffff : roleColor;

            return client.createMessage(message.channel.id, {
                embed: {
                    author: { // Author property
                        name: message.channel.guild.members.get(client.user.id).nick,
                        icon_url: message.channel.guild.members.get(client.user.id).avatarURL
                    },
                    title: `Hey my dear ❤. You want to know my DEEPEST secrets huh? ${getEmojiString(message, "wInK")}`,
                    description: text,
                    color: roleColor,
                    footer: {
                        text: message.member.nick,
                        icon_url: message.member.avatarURL
                    }
                }
            });
        });
    }
}