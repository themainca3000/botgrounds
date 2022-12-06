const { SlashCommandBuilder } = require("@discordjs/builders");
const voiceDiscord = require("@discordjs/voice");

const ytdl = require("ytdl-core");
const playingVideo = require("../helpers/playingVideo");
const searchVideos = require("../helpers/searchVideos");

const data = new SlashCommandBuilder()
  .setName("py")
  .setDescription("Recibe un link de Youtube y reproduce su audio")
  .addStringOption((option) =>
    option
      .setName("search-terms")
      .setDescription("Terminos de busqueda...")
      .setRequired(true)
  );

const execute = async (interaction) => {
  const channel = interaction.member.voice.channel;
  if (!channel)
    return interaction.reply("Necesito que te conectes a un canal de voz.");

  const query = interaction.options.getString("search-terms");

  let videos = await searchVideos(query);

  let videoUrl = `https://youtu.be/${videos[0].id}`;
  const audio = ytdl(videoUrl, { filter: "audioonly" });

  const player = voiceDiscord.createAudioPlayer();
  let resource = voiceDiscord.createAudioResource(audio);

  const connection = voiceDiscord.joinVoiceChannel({
    channelId: interaction.member.voice.channel.id,
    guildId: interaction.guild.id,
    adapterCreator: interaction.guild.voiceAdapterCreator,
  });

  player.play(resource);
  connection.subscribe(player);

  interaction.reply({ embeds: [playingVideo(videos[0])] });

  player.on(voiceDiscord.AudioPlayerStatus.Idle, () => {
    connection.destroy();
  });
};

module.exports = {
  data,
  execute,
};
