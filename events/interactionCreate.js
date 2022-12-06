const { player } = require("../commands/py.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (interaction.isButton()) {
      if (interaction.customId === "pauseButton") {
        if (player._state.status === "playing") {
          player.pause();
        } else {
          player.unpause();
        }
      }
    }

    if (!interaction.isCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  },
};
