const fs = require("fs");

// Require the necessary discord.js classes
const { Client, Collection, Intents } = require("discord.js");
const { token } = require("./config.json");

// Create a new client instance
const client = new Client({ intents: 32767 });

client.commands = new Collection();
// Obtenemos unicamente los archivos que terminan con la extension .js
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}

// Obtenemos una arreglo con el nombre de todos los archivos .js de la carpeta /events
const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

// Definimos los manejadores para cada uno de los eventos obtenidos
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Login to Discord with your client's token
client.login(token);
