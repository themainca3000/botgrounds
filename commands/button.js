const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("button")
    .setDescription("Responde con un boton"),
  async execute(interaction) {
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("pauseButton")
        .setLabel("pause")
        .setStyle("PRIMARY")
      // .setEmoji("305818615712579584"),
    );

    await interaction.reply({
      content: "Reproductor",
      components: [row],
    });
  },
};
