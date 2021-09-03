const { SlashCommandBuilder } = require("@discordjs/builders");
const voiceDiscord = require("@discordjs/voice");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("np")
    .setDescription("Busca la cancion en Newgrounds y la reproduce"),
  execute: async (interaction) => {
    const channel = interaction.member.voice.channel;
    if (!channel)
      return interaction.reply("Bro join a voice channel smh :wink:");

    const player = voiceDiscord.createAudioPlayer();
    const resource = voiceDiscord.createAudioResource(
      "https://www.youtube.com/watch?v=bcmx20OjIc4&ab_channel=FaceDev"
    );

    const connection = voiceDiscord.joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    player.play(resource);
    connection.subscribe(player);

    player.on(voiceDiscord.AudioPlayerStatus.Idle, () => {
      connection.destroy();
    });
  },
};
