const playingVideo = ({ id, thumbnail, title, length }) => {
  const embedPlayingVideo = {
    color: "#0099ff",
    title: title,
    url: `https://youtu.be/${id}`,
    thumbnail: {
      url: thumbnail.thumbnails[0].url,
    },
    timestamp: new Date(),
  };

  return embedPlayingVideo;
};

module.exports = playingVideo;
