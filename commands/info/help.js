module.exports = {
    name: "help",
    aliases: ["halp", "hlp", "how"],
    category: "info",
    description: "Returns all known commands",
    run: async (client, message, args) => {
        message.delete();
        var commands = "";
        var roleColor = message.channel.guild.roles.get(message.member.roles.sort((a, b) => message.channel.guild.roles.get(b).position - message.channel.guild.roles.get(a).position)[0]).color
        roleColor = roleColor === 0x000000 ? 0xffffff : roleColor;

        for (var [key, command] of client.commands) {
            commands += "\n" + client.prefix + command.name;

            if (command.aliases) {
                for (let indexAlias = 0; indexAlias < command.aliases.length; indexAlias++) {
                    let alias = command.aliases[indexAlias];
                    commands += ", " + client.prefix + alias;
                }
            }
            
            commands += " - " + command.description;

            if (command.parameters) {
                commands += "\n    -Parameters: ";
                commands += command.parameters.join(", ");
            }

            commands += "\n";
        }

        commands += "\n\nNow use me as you like my dear. 💋";
        
        return client.createMessage(message.channel.id, {
            embed: {
                author: { // Author property
                    name: message.channel.guild.members.get(client.user.id).nick,
                    icon_url: message.channel.guild.members.get(client.user.id).avatarURL
                },
                title: "Hey honey ❤. These are the usable commands:",
                description: commands,
                color: roleColor,
                footer: {
                    text: message.member.nick,
                    icon_url: message.member.avatarURL
                }
            }
        });
    }
}