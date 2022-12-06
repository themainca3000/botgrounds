const { SlashCommandBuilder } = require("@discordjs/builders");
const voiceDiscord = require("@discordjs/voice");
const PriorityQueue = require("js-priority-queue");

var queue = new PriorityQueue();

const ytdl = require("ytdl-core");
const playingVideo = require("../helpers/playingVideo");
const searchVideos = require("../helpers/searchVideos");

const player = voiceDiscord.createAudioPlayer();
let isPlaying = false;

player.on(voiceDiscord.AudioPlayerStatus.Playing, () => {
  console.log("Reproductor: Se esta reproduciendo musica");
  isPlaying = true;
});

const playOnChannel = async (connection, interaction) => {
  if (queue.length == 0) return;
  let query = queue.dequeue();

  let videos = await searchVideos(query);

  let videoUrl = `https://youtu.be/${videos[0].id}`;
  const audio = ytdl(videoUrl, { filter: "audioonly" });

  let resource = voiceDiscord.createAudioResource(audio);
  
  player.play(resource);
  connection.subscribe(player);
  // interaction.channel.send({ embeds: [playingVideo(videos[0])]})
}

const data = new SlashCommandBuilder()
  .setName("play")
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

  const connection = voiceDiscord.joinVoiceChannel({
    channelId: interaction.member.voice.channel.id,
    guildId: interaction.guild.id,
    adapterCreator: interaction.guild.voiceAdapterCreator,
  });

  player.on(voiceDiscord.AudioPlayerStatus.Idle, () => {
    isPlaying = false;
    playOnChannel(connection, interaction);
  });


  let query = interaction.options.getString("search-terms");

  let videos = await searchVideos(query);

  interaction.reply({ embeds: [playingVideo(videos[0])]})

  if (!isPlaying) {
    queue.queue(query);
    playOnChannel(connection, interaction);
}
  else {queue.queue(query);}
};

module.exports = {
  data,
  execute,
  player,
  queue
};