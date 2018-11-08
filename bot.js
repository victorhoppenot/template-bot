const Discord = require("discord.js");
const mysql = require('mysql');
const fs = require("fs");
const Enmap = require("enmap");

const client = new Discord.Client();
const config = require("./config.json");

client.config = config;

client.SQLTok = process.env.SQL_TOKEN;
client.commands = new Enmap();

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  console.log("Command prefix is: " + client.config.prefix);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Attempting to load command ${commandName}`);
    client.commands.set(commandName, props);
    console.log("Loaded");
  });
  console.log("All commands loaded successfully!");
});

client.on("message", (message) => {
  
  if (message.author.bot) return;
  if (message.content.indexOf(client.config.prefix) != 0) return;
  
  if (message.channel.name != client.config.channel){
    message.delete();
    return;
  }
  
  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command);
 
  cmd.run(client, message, args);
});

client.login(process.env.BOT_TOKEN);
