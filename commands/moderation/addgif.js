const { stripIndents } = require("common-tags");
const { saveToDatabase, getFromDatabase, getEmojiString } = require("../../functions.js");
const probe = require('probe-image-size');
module.exports = {
    name: "addgif",
    aliases: ["agif", "aimg"],
    category: "moderation",
    description: "Adds a gif to the specified type",
    parameters: ["'type to add'", "'url to add'"], 
    usage: "<input>",
    run: async (client, message, args) => {
        message.delete();
        if (args.length < 2) 
            return client.createMessage(message.channel.id, "No gif type or url specified").then(m => setTimeout(function() {m.delete();}, 5000));

        const type = args[0].toLowerCase();
        if (type.length > 40)
            return client.createMessage(message.channel.id, "The specified type is too long. Max. 40 characters").then(m => setTimeout(function() {m.delete();}, 5000));

        const url = args[1];
            if (type.length > 255)
                return client.createMessage(message.channel.id, "The specified url is too long. Max. 255 characters").then(m => setTimeout(function() {m.delete();}, 5000));
        
        getFromDatabase("gifs", [], [`type="${type}"`, `guildid="${message.channel.guild.id}"`, `url="${encodeURIComponent(url)}"`], function(result) {
            if (result.length > 0)
                return client.createMessage(message.channel.id, `This gif is already added. 😉`).then(m => setTimeout(function() {m.delete();}, 5000));

            saveToDatabase("gifs", ["\"" + type + "\"", "\"" + encodeURIComponent(url) + "\"", "\"" + message.channel.guild.id.toString() + "\""]);

            return client.createMessage(message.channel.id, {
                embed: {
                    title: `Ohhhhh jeah ${getEmojiString(message, "ahegaoemoji")}, I added a new gif for you 💕`,
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