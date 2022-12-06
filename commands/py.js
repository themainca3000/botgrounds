const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  createAudioResource,
  joinVoiceChannel,
  createAudioPlayer,
  NoSubscriberBehavior,
  AudioPlayerStatus,
} = require("@discordjs/voice");

const ytdl = require("ytdl-core");
const playingVideo = require("../helpers/playingVideo");
const searchVideos = require("../helpers/searchVideos");

const getVideo = async (query) => {
  let videos = await searchVideos(query);
  let videoUrl = `https://youtu.be/${videos[0].id}`;
  const audio = ytdl(videoUrl, { filter: "audioonly", highWaterMark: 1 << 25 });
  const src = videos[0];

  return { audio, src };
};

const setVoiceConnection = ({ member, guild }) =>
  joinVoiceChannel({
    channelId: member.voice.channel.id,
    guildId: guild.id,
    adapterCreator: guild.voiceAdapterCreator,
  });

const data = new SlashCommandBuilder()
  .setName("py")
  .setDescription(
    "Recibe terminos de busqueda para Youtube y reproduce su audio"
  )
  .addStringOption((option) =>
    option
      .setName("search-terms")
      .setDescription("Terminos de busqueda...")
      .setRequired(true)
  );

const queue = [];

const player = createAudioPlayer({
  behaviors: {
    noSubscriber: NoSubscriberBehavior.Pause,
  },
});

const addToQueue = (resource) => {
  queue.push(resource);
  if (player.status !== "playing") player.play(queue[0]);
  console.log("Se añadio un recurso a la cola");
};

const getNextResource = () => {
  return queue[0];
};

// Eventos del reproductor de audio
player.on(AudioPlayerStatus.Idle, () => {
  console.log("Idle...");
  // Eliminamos el primer recurso de la cola
  queue.shift();

  // Si hay algun recurso en la cola lo reproducimos
  if (queue.length) player.play(getNextResource());
  // Sino destruimos la conexion del bot
  else {
    player.subscribers.forEach(({ connection }) => {
      connection.destroy();
    });

    console.log("El bot se ha desconectado, ya que no hay recursos en espera.");
  }
});

player.on(AudioPlayerStatus.Buffering, () => {
  console.log("Buffering...");
});

player.on(AudioPlayerStatus.Playing, () => {
  console.log("Reproductor: Se esta reproduciendo musica");
});

player.on(AudioPlayerStatus.Paused, () => {
  console.log("Reproductor: Se ha pausado la reproduccion de musica");
});

player.on(AudioPlayerStatus.AutoPaused, () => {
  console.log(
    "Reproductor: La reproduccion de musica esta detenida, ya que no hay ninguna conexion subscrita."
  );
});

// Manejando los prosibles errores del reproductor
player.on("error", (error) => {
  // console.error(`Error: ${error.message} con el recurso ${error.resource}`);
  // player.play(getNextResource());
  console.log(error);
});

const execute = async (interaction) => {
  const channel = interaction.member.voice.channel;
  if (!channel)
    return interaction.reply("Necesito que te conectes a un canal de voz.");

  const query = interaction.options.getString("search-terms");
  const { audio, src } = await getVideo(query);

  let resource = createAudioResource(audio);
  addToQueue(resource);

  // Conectamos al bot al canal donde se encuentra le miembro
  const connection = setVoiceConnection(interaction);
  connection.subscribe(player);

  interaction.reply({ embeds: [playingVideo(src)] });
  interaction.client.user.setActivity(src.title, { type: "LISTENING" });
};

module.exports = {
  data,
  execute,
  player,
};
