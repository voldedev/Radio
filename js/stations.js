const placeholderStations = Array.from({ length: 4 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  return {
    id: `station-${number}`,
    name: `Station ${number}`,
    logo: `./images/stations/station-${number}.svg`,
    streamUrl: `https://example.com/stream${index + 1}`,
    nowPlayingUrl: null,
    nowPlayingType: null,
    parseNowPlaying: null,
    genre: "Placeholder",
    accent: null
  };
});

function classicFmClock() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Copenhagen",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(new Date());
  return Object.fromEntries(parts.filter(({ type }) => type !== "literal").map(({ type, value }) => [type, value]));
}

function classicFmNowPlayingUrl() {
  const clock = classicFmClock();
  return `https://radio-playlists.jfmedier.dk/playlist/json?station=classic&day=${clock.year}-${clock.month}-${clock.day}&time=${clock.hour}`;
}

function parseClassicFmPlaylist(playlist) {
  if (!Array.isArray(playlist)) return null;
  const clock = classicFmClock();
  const currentMinutes = Number(clock.hour) * 60 + Number(clock.minute);
  const currentTrack = playlist.filter((track) => {
    const [hour, minute] = String(track.time || "").split(":").map(Number);
    return Number.isFinite(hour) && Number.isFinite(minute) && hour * 60 + minute <= currentMinutes;
  }).pop();
  return currentTrack?.title ? { title: currentTrack.title, artist: currentTrack.artist || "" } : null;
}

function parsePartyFmNowPlaying(markup) {
  const song = new DOMParser().parseFromString(markup, "text/html").querySelector("#songNow")?.textContent.trim();
  if (!song) return null;
  const parts = song.split(/\s+-\s+/);
  return parts.length > 1
    ? { artist: parts.shift(), title: parts.join(" - ") }
    : { title: song, artist: "" };
}

export const stations = [
  {
    id: "station-01",
    name: "DR P3",
    logo: "./images/p3.png",
    streamUrl: "https://live-icy.dr.dk/A/A05H.mp3",
    nowPlayingUrl: null,
    nowPlayingType: "icy",
    parseNowPlaying: null,
    genre: "Pop & radio",
    accent: "#48a9e8"
  },
  {
    id: "station-02",
    name: "The Voice",
    logo: "./images/the-voice.png",
    streamUrl: "https://live-bauerdk.sharp-stream.com/voice128.mp3",
    nowPlayingUrl: null,
    nowPlayingType: "icy",
    parseNowPlaying: null,
    genre: "Hits",
    accent: "#e7c2d4"
  },
  {
    id: "station-03",
    name: "Flash FM",
    logo: "./images/flash-fm.png",
    streamUrl: "https://audio.gtaradio.net/vc/flash",
    nowPlayingUrl: null,
    nowPlayingType: null,
    parseNowPlaying: null,
    genre: "Vice City",
    accent: "#f4a261"
  },
  {
    id: "station-04",
    name: "Nova FM Danmark",
    logo: "./images/novafm.png",
    streamUrl: "https://live-bauerdk.sharp-stream.com/nova_dk_mp3",
    nowPlayingUrl: null,
    nowPlayingType: "icy",
    parseNowPlaying: null,
    genre: "Pop & hits",
    accent: "#d8c2f0"
  },
  {
    id: "station-05",
    name: "Nightride FM",
    logo: "./images/nightride.png",
    streamUrl: "https://stream.nightride.fm/nightride.mp3",
    nowPlayingUrl: null,
    nowPlayingType: null,
    parseNowPlaying: null,
    genre: "Synthwave",
    accent: "#ef72c6"
  },
  {
    id: "station-06",
    name: "Rainwave Game",
    logo: "./images/rainwave-game.png",
    streamUrl: "https://relay.rainwave.cc/game.mp3",
    nowPlayingUrl: null,
    nowPlayingType: null,
    parseNowPlaying: null,
    genre: "Game music",
    accent: "#7ed6c4"
  },
  {
    id: "station-07",
    name: "Hardstyle FM",
    logo: "./images/hardstylefm.png",
    streamUrl: "https://stream.laut.fm/hardstylefm",
    nowPlayingUrl: null,
    nowPlayingType: null,
    parseNowPlaying: null,
    genre: "Hardstyle",
    accent: "#f06d9f"
  },
  {
    id: "station-08",
    name: "SLAM! HARDSTYLE",
    logo: "./images/slam-hardstyle.png",
    streamUrl: "https://streaming.slam.nl/web11_mp3",
    nowPlayingUrl: null,
    nowPlayingType: null,
    parseNowPlaying: null,
    genre: "Hardstyle",
    accent: "#ff7b5c"
  },
  {
    id: "station-09",
    name: "Technobase FM",
    logo: "./images/techno-base.png",
    streamUrl: "https://listen.technobase.fm/tunein-mp3-m3u",
    nowPlayingUrl: null,
    nowPlayingType: null,
    parseNowPlaying: null,
    genre: "Techno",
    accent: "#66d9ef"
  },
  {
    id: "station-10",
    name: "Party FM Danmark",
    logo: "./images/partyfm.png",
    streamUrl: "https://stream.partyfm.dk/Party320/",
    nowPlayingUrl: "https://www.partyfm.dk/ajax.php?mode=reload_now_playing&code_mode=normal",
    nowPlayingType: "html",
    parseNowPlaying: parsePartyFmNowPlaying,
    genre: "Party",
    accent: "#f2c14e"
  },
  {
    id: "station-11",
    name: "1Mix Radio Trance",
    logo: "./images/1mix-radio.png",
    streamUrl: "https://fr2.1mix.co.uk:8060/320",
    nowPlayingUrl: null,
    nowPlayingType: null,
    parseNowPlaying: null,
    genre: "Trance",
    accent: "#8d7aff"
  },
  {
    id: "station-12",
    name: "EDM Festival Radio",
    logo: "./images/festival-edm-radio.png",
    streamUrl: "https://0nlineradio.radioho.st/0r-edm-festival?ref=rb26",
    nowPlayingUrl: null,
    nowPlayingType: null,
    parseNowPlaying: null,
    genre: "EDM & festival",
    accent: "#f0a94b"
  },
  {
    id: "station-13",
    name: "1.FM BPM Psytrance",
    logo: "./images/bpm-psytrance.png",
    streamUrl: "https://strm112.1.fm/psytrance_mobile_mp3",
    nowPlayingUrl: null,
    nowPlayingType: "icy",
    icyMetadataHeader: true,
    parseNowPlaying: null,
    genre: "Psytrance",
    accent: "#9b6cff"
  },
  {
    id: "station-14",
    name: "myROCK Danmark",
    logo: "./images/myrock.png",
    streamUrl: "https://live-bauerdk.sharp-stream.com/myrock_dk_mp3",
    nowPlayingUrl: null,
    nowPlayingType: "icy",
    parseNowPlaying: null,
    genre: "Rock",
    accent: "#db6d67"
  },
  {
    id: "station-15",
    name: "Classic Rock Danmark",
    logo: "./images/classic-rock-danmark.png",
    streamUrl: "https://netradio.classicfm.dk/classicrock",
    nowPlayingUrl: null,
    nowPlayingType: null,
    parseNowPlaying: null,
    genre: "Classic rock",
    accent: "#e5aa66"
  },
  {
    id: "station-16",
    name: "Rockkanalen",
    logo: "./images/rockkanalen.png",
    streamUrl: "https://stream.kanalplus.fm/kp128",
    nowPlayingUrl: null,
    nowPlayingType: null,
    parseNowPlaying: null,
    genre: "Rock",
    accent: "#d46d76"
  },
  {
    id: "station-17",
    name: "Radio Globus Danmark",
    logo: "./images/radio-globus.png",
    streamUrl: "https://stream.probroadcast.dk/radioglobus",
    nowPlayingUrl: null,
    nowPlayingType: null,
    parseNowPlaying: null,
    genre: "Dansk radio",
    accent: "#6bb7c8"
  },
  {
    id: "station-18",
    name: "Globus Guld Radio",
    logo: "./images/globus-guld.png",
    streamUrl: "https://stream.probroadcast.dk/guldcountrymp3",
    nowPlayingUrl: null,
    nowPlayingType: null,
    parseNowPlaying: null,
    genre: "Oldies",
    accent: "#d9b866"
  },
  {
    id: "station-19",
    name: "Technolovers HOUSE",
    logo: "./images/technolovers-house.png",
    streamUrl: "https://stream.technolovers.fm/house?ref=radiobrowser",
    nowPlayingUrl: null,
    nowPlayingType: null,
    parseNowPlaying: null,
    genre: "House",
    accent: "#67d6b1"
  },
  {
    id: "station-20",
    name: "SLAM!",
    logo: "./images/slam.png",
    streamUrl: "https://stream.slam.nl/slam",
    nowPlayingUrl: null,
    nowPlayingType: null,
    parseNowPlaying: null,
    genre: "Dance",
    accent: "#f56b9b"
  },
  {
    id: "station-21",
    name: "SLAM! 00's",
    logo: "./images/slam-00.png",
    streamUrl: "https://22353.live.streamtheworld.com/WEB15_MP3_SC",
    nowPlayingUrl: null,
    nowPlayingType: null,
    parseNowPlaying: null,
    genre: "00's",
    accent: "#ed9e65"
  },
  {
    id: "station-22",
    name: "SLAM! 10's",
    logo: "./images/slam-10.png",
    streamUrl: "https://22673.live.streamtheworld.com/WEB14_MP3_SC",
    nowPlayingUrl: null,
    nowPlayingType: null,
    parseNowPlaying: null,
    genre: "10's dance",
    accent: "#efcf65"
  },
  {
    id: "station-25",
    name: "Slam! Mixmarathon",
    logo: "./images/slam-mix-marathon.png",
    streamUrl: "https://stream.radiocorp.nl/web13_mp3",
    nowPlayingUrl: null,
    nowPlayingType: null,
    parseNowPlaying: null,
    genre: "Mix",
    accent: "#75c9e8"
  },
  {
    id: "station-26",
    name: "SLAM! Non Stop",
    logo: "./images/slam-nonstop.png",
    streamUrl: "https://stream.radiocorp.nl/web10_mp3",
    nowPlayingUrl: null,
    nowPlayingType: null,
    parseNowPlaying: null,
    genre: "Dance",
    accent: "#f18b68"
  },
  {
    id: "station-27",
    name: "Slam! The Boom Room",
    logo: "./images/slam-boom-room.png",
    streamUrl: "https://stream.radiocorp.nl/web12_aac",
    nowPlayingUrl: null,
    nowPlayingType: null,
    parseNowPlaying: null,
    genre: "Techno",
    accent: "#c27bdb"
  },
  {
    id: "station-28",
    name: "SLAM! WKNDMX",
    logo: "./images/slam-wkndmx.png",
    streamUrl: "https://streaming.slam.nl/web11_aac",
    nowPlayingUrl: null,
    nowPlayingType: null,
    parseNowPlaying: null,
    genre: "Dance",
    accent: "#6fc9b5"
  },
  {
    id: "station-29",
    name: "SLAM! Juize",
    logo: "./images/slam-juice.png",
    streamUrl: "https://stream.slam.nl/WEB09_MP3",
    nowPlayingUrl: null,
    nowPlayingType: null,
    parseNowPlaying: null,
    genre: "Urban",
    accent: "#d47bbd"
  },
  {
    id: "station-30",
    name: "Globus Guld Jul",
    logo: "./images/globus-jul-guld.png",
    streamUrl: "https://stream.probroadcast.dk/guldjul",
    nowPlayingUrl: null,
    nowPlayingType: "icy",
    parseNowPlaying: null,
    genre: "Julemusik",
    accent: "#d9485f"
  },
  {
    id: "station-31",
    name: "Classic FM Danmark",
    logo: "./images/classic.fm.png",
    streamUrl: "https://netradio.classicfm.dk/cla12a",
    nowPlayingUrl: classicFmNowPlayingUrl,
    nowPlayingType: "json",
    parseNowPlaying: parseClassicFmPlaylist,
    genre: "Klassisk & easy listening",
    accent: "#c5a46d"
  },
  {
    id: "station-32",
    name: "Music for Programming",
    logo: "./images/music-for-programming.svg",
    streamUrl: "https://datashat.net/music_for_programming_77-phonaut.mp3",
    nowPlayingUrl: null,
    nowPlayingType: null,
    parseNowPlaying: null,
    genre: "Programming & focus",
    accent: "#8fd3c7"
  },
  {
    id: "station-33",
    name: "Handsuplovers",
    logo: "./images/handsup-lovers.png",
    streamUrl: "https://stream.laut.fm/handsuplovers",
    nowPlayingUrl: null,
    nowPlayingType: null,
    parseNowPlaying: null,
    genre: "Hands up & dance",
    accent: "#ef9fca"
  },
  ...placeholderStations.slice(1).map((station, index) => ({
    ...station,
    id: `station-${String(index + 34).padStart(2, "0")}`,
    name: "No radio here yet",
    logo: `./images/stations/station-${String(index + 34).padStart(2, "0")}.svg`,
    streamUrl: `https://example.com/stream${index + 34}`
  }))
];

const websiteUrls = {
  "station-01": "https://www.dr.dk/p3",
  "station-02": "https://thevoice.dk/",
  "station-03": "https://gtaradio.net/",
  "station-04": "https://nova.dk/",
  "station-05": "https://nightride.fm/",
  "station-06": "https://rainwave.cc/",
  "station-07": "https://laut.fm/hardstylefm",
  "station-08": "https://www.slam.nl/",
  "station-09": "https://www.technobase.fm/",
  "station-10": "https://partyfm.dk/",
  "station-11": "https://1mix.co.uk/",
  "station-12": "https://plus.rm.fm/",
  "station-13": "https://www.1.fm/",
  "station-14": "https://myrock.dk/",
  "station-15": "https://classicfm.dk/",
  "station-16": "https://rockkanalen.dk/",
  "station-17": "https://radioglobus.dk/",
  "station-18": "https://globusguld.dk/",
  "station-19": "https://technolovers.fm/",
  "station-20": "https://www.slam.nl/",
  "station-21": "https://www.slam.nl/",
  "station-22": "https://www.slam.nl/",
  "station-25": "https://www.slam.nl/",
  "station-26": "https://www.slam.nl/",
  "station-27": "https://www.slam.nl/",
  "station-28": "https://www.slam.nl/",
  "station-29": "https://www.slam.nl/",
  "station-30": "https://globusguld.dk/",
  "station-31": "https://classicfm.dk/",
  "station-32": "https://musicforprogramming.net/latest/",
  "station-33": "https://laut.fm/handsuplovers"
};

stations.forEach((station) => { station.websiteUrl = websiteUrls[station.id] || null; });
