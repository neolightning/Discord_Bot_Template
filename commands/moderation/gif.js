const { stripIndents } = require("common-tags");
const { getFromDatabase } = require("../../functions.js");
module.exports = {
    name: "gif",
    aliases: ["image", "img", "jif", "meme"],
    category: "moderation",
    description: "Sends a random gif",
    parameters: ["'type to look for'"], 
    usage: "<input>",
    run: async (client, message, args) => {
        message.delete();
        if (args.length < 1) 
            return client.createMessage(message.channel.id, "No gif type specified").then(m => setTimeout(function() {m.delete();}, 5000));

        getFromDatabase("gifs", [], [`type="${args[0].toLowerCase().trim()}"`], function(gifs) {
            if (!gifs) {
                return client.createMessage(message.channel.id, `Couldn't find any gifs for the type: ${args[0].toLowerCase()}`).then(m => setTimeout(function() {m.delete();}, 5000));
            }

            const index = Math.floor(Math.random() * gifs.length);
            const img = gifs[index];

            if (!img) {
                return client.createMessage(message.channel.id, `Couldn't find any gifs for the type: ${args[0].toLowerCase()}`).then(m => setTimeout(function() {m.delete();}, 5000));
            }

            return client.createMessage(message.channel.id, {
                embed: {
                    image: {
                        url: decodeURIComponent(img.url)
                    },
                    title: "Babe, enjoy my present for you! 💕",
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