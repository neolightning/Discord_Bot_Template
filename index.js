const Eris = require("eris");
const { config } = require("dotenv");
const functions = require("./functions.js");

config({
    path: __dirname + "/.env"
});

var client = new Eris(process.env.TOKEN);

client.commands = new Eris.Collection();
client.aliases = new Eris.Collection();

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.on("ready", () => { // When the bot is ready
    functions.writeLog('Bot is connected');
    client.prefix = ">";
    functions.loadData(client);

    client.editStatus(
        "online", {
            name: "👀staring at Eric C.",
            type: 3
        }
    );
});

client.on("messageCreate", (message) => { 
    if (message.author.bot) return;
    if (!message.channel.guild) return;
    if (!message.content.startsWith(client.prefix)) return;
    if (!message.member) message.member = message.channel.guild.members.get(message.author);

    const args = message.content.slice(client.prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
    if (cmd.length === 0) return;

    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command) {
        functions.writeLog("Bot received command: " + message.content);
        command.run(client, message, args);
    }
});

client.connect(); // Get the bot to connect to Discord