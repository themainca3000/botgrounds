let youtubesearchapi = require("youtube-search-api");

const searchVideos = async (query) => {
  try {
    let data = await youtubesearchapi.GetListByKeyword(query);
    return data.items;
  } catch (error) {
    return error;
  }
};

module.exports = searchVideos;
