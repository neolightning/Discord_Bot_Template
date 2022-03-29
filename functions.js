const mysql = require("mysql");
const { config } = require("dotenv");
var functions = {
    writeLog: function(logMessage) {
        const date = new Date();
        var dateStr = date.toLocaleDateString();//date.getDate().toString().padStart(2, '0') + "." (date.getMonth() + 1).toString().padStart(2, '0') + "." + date.getFullYear();
        var timeStr = date.toLocaleTimeString();//date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0') + ":" + date.getSeconds().toString().padStart(2, '0');
    
        console.log(dateStr + " - " + timeStr + " => " + logMessage);
    },
    getMember: function(message, searchMember) {
        searchMember = searchMember.toLowerCase();
        let target = message.channel.guild.members.get(toFind);
        
        if (!target && message.mentions.length > 0)
            target = message.channel.guild.members.get(message.mentions[0].id);

        if (!target && toFind) {
            target = message.channel.guild.members.find(member => {
                try {
                    return member.username.toLowerCase().includes(searchMember) || member.nick.toLowerCase().includes(searchMember);                        
                } 
                catch {
                    return false;
                }
            });
        }
            
        return target;
    },
    getMembers: function(message, toFind = []) {
        var members = [];
        toFind.forEach(searchMember => {
            searchMember = searchMember.toLowerCase();

            let target = message.channel.guild.members.get(searchMember);
            
            if (!target && message.mentions.length > 0)
                target = message.channel.guild.members.get(message.mentions[0].id);
    
            if (!target && searchMember) {
                target = message.channel.guild.members.find(member => {
                    try {
                        return member.username.toLowerCase().includes(searchMember) || member.nick.toLowerCase().includes(searchMember);                        
                    } 
                    catch {
                        return false;
                    }
                });
            }
            
            if (target)
                members.push(target);
        });
            
        return members;
    },
    getRole: function(message, toFind = '') {
        toFind = toFind.toLowerCase();

        let target = message.channel.guild.members.get(toFind);
        
        if (!target && message.roleMentions.length > 0)
            target = message.channel.guild.roles.get(message.roleMentions[0]);

        if (!target && toFind) {
            target = message.channel.guild.roles.find(role => {
                return role.name.toLowerCase().includes(toFind)
            });
        }
            
        return target;
    },
    formatDate: function(date) {
        return new Intl.DateTimeFormat('en-US').format(date)
    },
    getRandomColor: function() {
        max = 1 << 24;
        // Return the randomly generated hex color
        return '0x'+(Math.floor(max*Math.random()) + max).toString(16).slice(-6);
    },
    getEmoji: function(message, emojiStr) {
        const emoji = message.channel.guild.emojis.find(emj => {
            return emj.name === emojiStr;
        })

        return emoji;
    },
    getEmojiString: function(message, emojiStr) {
        const emoji = functions.getEmoji(message, emojiStr);

        if (emoji) {
            var emojiString = "<";
            if (emoji.animated)
                emojiString += "a";

            return emojiString + `:${emoji.name}:${emoji.id}>`;
        }

        return "";
    },
    getSQLConnection: function() {
        var connection = mysql.createConnection({
            host: "127.0.0.1", 
            port: "1234",
            user: "sa", 
            password: "", 
            database: "discord-lovearousesnearlyeveryone"
        }); 

        connection.on('error', function(err) {
            if (err) {
                functions.writeLog("Encountered an SQL Error: " + err.code);
                functions.writeLog("SQL Error: " + err.errno);
                functions.writeLog("SQL Query: " + err.sql);
                functions.writeLog("SQL Message: " + err.sqlMessage);
            }
            else {
                functions.writeLog("Encountered an unknown error while using SQL");
            }
        });

        return connection;
    },
    getFromDatabase: function(table, fields = [], args = [], callback) {
        var con = functions.getSQLConnection();

        con.connect(function(err) {
            if (err) throw err;

            if (args.length > 0) {
                if (fields.length > 0) {
                    con.query(`SELECT DISTINCT ${fields.join(", ")} FROM ${table} where ${args.join(" and ")}`, function (err, result, fields) {

                        if (err) throw err;
                        return callback(result);                
                    }); 
                }
                else
                {
                    con.query(`SELECT DISTINCT * FROM ${table} where ${args.join(" and ")}`, function (err, result, fields) {
                        if (err) throw err;
                        return callback(result);                
                    }); 
                }
            }
            else {
                if (fields.length > 0) {
                    con.query(`SELECT DISTINCT ${fields.join(", ")} FROM ${table}`, function (err, result, fields) {
                        if (err) throw err;
                        return callback(result);             
                    }); 
                }
                else
                    {
                    con.query(`SELECT DISTINCT * FROM ${table}`, function (err, result, fields) {
                        if (err) throw err;
                        return callback(result);             
                    }); 
                }
            }
        }); 
    },
    saveToDatabase: function(table, values) {        
        var con = functions.getSQLConnection();

        con.connect(function(err) {
            if (err) throw err;
            con.query(`INSERT INTO ${table} VALUES(${values.join(", ")})`, function (err, result, fields) {
                if (err) throw err;
                return result;                
            }); 
        }); 
    },
    deleteFromDatabase: function(table, args = [], callback) {
        var con = functions.getSQLConnection();

        con.connect(function(err) {
            if (err) throw err;
            con.query(`DELETE FROM ${table} where ${args.join(" and ")}`, function (err, result, fields) {
                if (err) throw err;
                return callback(result);          
            }); 
        }); 
    },
    loadData: function(client) {
        functions.getFromDatabase("rainbows", [], [], function(rainbows) {
            if (rainbows) {
                rainbows.forEach(rainbow => {      
                    const guild = client.guilds.get(rainbow.guildid);
                    if(!guild) return;
    
                    const rRole = guild.roles.get(rainbow.roleid);
                    if (!rRole) return;

                    var interval = setInterval(function() {
                        rRole.edit({color: Number(functions.getRandomColor())}, "");
                    }, rainbow.interval * 1000 * 60);

                    interval.unref();
                });
            }
        });
    }
}

module.exports = functions;