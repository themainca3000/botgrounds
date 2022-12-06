// at the top of your file
const { MessageEmbed } = require("discord.js");

const playingVideo = ({ id, thumbnail, title, length }) => {
  const embedPlayingVideo = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle(title)
    .setURL(`https://youtu.be/${id}`)
    // .setAuthor( "Some name","https://i.imgur.com/AfFp7pu.png","https://discord.js.org")
    // .setDescription("Some description here")
    .setThumbnail(thumbnail.thumbnails[0].url)
    // .setImage("https://i.imgur.com/AfFp7pu.png")
    .setTimestamp();
  // .setFooter("Some footer text here", "https://i.imgur.com/AfFp7pu.png");

  return embedPlayingVideo;
};

module.exports = playingVideo;
