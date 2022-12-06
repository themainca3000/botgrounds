const { SlashCommandBuilder } = require('@discordjs/builders');
const voiceDiscord = require("@discordjs/voice");
const { player, queue } = require("./play")

const ytdl = require("ytdl-core");
const playingVideo = require("../helpers/playingVideo");
const searchVideos = require("../helpers/searchVideos");

const data = new SlashCommandBuilder()
  .setName("skip")
  .setDescription("Skipea la cancion actual");

const playOnChannel = async (connection, interaction) => {
  if (queue.length == 0) return;
  let query = queue.dequeue();

  let videos = await searchVideos(query);
  interaction.reply({ embeds: [playingVideo(videos[0])]});

  let videoUrl = `https://youtu.be/${videos[0].id}`;
  const audio = ytdl(videoUrl, { filter: "audioonly" });

  let resource = voiceDiscord.createAudioResource(audio);
  
  player.play(resource);
}

const execute = async (interaction) => {
  playOnChannel(interaction.member.voice.channel, interaction);
}

module.exports = {
	data,
  execute,
};