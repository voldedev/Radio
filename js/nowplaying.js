const HISTORY_KEY = "radio-history";
let pollTimer;

async function readIcyMetadata(url, requestMetadata = false) {
  const options = { cache: "no-store" };
  if (requestMetadata) options.headers = { "Icy-MetaData": "1" };
  const response = await fetch(url, options);
  const metaInt = Number(response.headers.get("icy-metaint"));
  if (!response.ok || !response.body || !metaInt) return null;

  const reader = response.body.getReader();
  let pending = new Uint8Array(0);
  const readBytes = async (count) => {
    while (pending.length < count) {
      const { done, value } = await reader.read();
      if (done) return null;
      const next = new Uint8Array(pending.length + value.length);
      next.set(pending);
      next.set(value, pending.length);
      pending = next;
    }
    const result = pending.slice(0, count);
    pending = pending.slice(count);
    return result;
  };

  try {
    if (!await readBytes(metaInt)) return null;
    const lengthByte = await readBytes(1);
    if (!lengthByte) return null;
    const metadata = await readBytes(lengthByte[0] * 16);
    if (!metadata) return null;
    const text = new TextDecoder().decode(metadata).replace(/\0/g, "").trim();
    const titleMatch = text.match(/StreamTitle=['"]([^'"]+)['"]/i);
    if (!titleMatch?.[1]) return null;
    const parts = titleMatch[1].split(/\s+-\s+/);
    return parts.length > 1
      ? { artist: parts.shift(), title: parts.join(" - ") }
      : { title: titleMatch[1], artist: "" };
  } finally {
    await reader.cancel();
  }
}

export function readHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; }
}
export function clearHistory() { localStorage.removeItem(HISTORY_KEY); }
export function addHistory(track) {
  if (!track?.title || track.title === "Live radio") return readHistory();
  const history = readHistory();
  const previous = history[0];
  if (previous?.title === track.title && previous?.artist === track.artist) return history;
  const next = [{ ...track, time: Date.now() }, ...history].slice(0, 10);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  return next;
}
export function stopPolling() { clearInterval(pollTimer); pollTimer = undefined; }
export function startPolling(station, onTrack) {
  stopPolling();
  if (!station?.streamUrl) return;
  const fetchTrack = async () => {
    try {
      let data;
      if (station.nowPlayingUrl) {
        const metadataUrl = typeof station.nowPlayingUrl === "function"
          ? station.nowPlayingUrl()
          : station.nowPlayingUrl;
        const response = await fetch(metadataUrl, { cache: "no-store" });
        if (!response.ok) return;
        const payload = station.nowPlayingType === "html" ? await response.text() : await response.json();
        data = station.parseNowPlaying ? station.parseNowPlaying(payload) : dataFromJson(payload);
      } else if (station.nowPlayingType === "icy") {
        data = await readIcyMetadata(station.streamUrl, station.icyMetadataHeader);
      }
      if (data?.title) onTrack(data);
    } catch { /* Metadata endpoints are optional and commonly CORS-limited. */ }
  };
  fetchTrack();
  pollTimer = setInterval(fetchTrack, 30000);
}
function dataFromJson(data) {
  return { title: data.title || data.song || data.track || "", artist: data.artist || data.artistName || "" };
}
