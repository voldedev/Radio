import { stations } from "./stations.js?v=53";
import { getLanguage, hasLanguagePreference, setLanguage, t } from "./i18n.js?v=2";
import { addHistory, clearHistory, readHistory, startPolling, stopPolling } from "./nowplaying.js?v=4";

const $ = (selector) => document.querySelector(selector);
const audio = $("#audioPlayer");
const ring = $("#stationRing");
const playerCard = $(".player-card");
let currentStation;
let isMuted = false;
let streamTimeout;
let streamRetryTimer;
let streamRetryCount = 0;
let currentAutoplay = true;
const maxStreamRetries = 3;

function clearStreamRetry() {
  clearTimeout(streamRetryTimer);
  streamRetryTimer = undefined;
}

const state = {
  volume: Number(localStorage.getItem("radio-volume") ?? 0.72),
  stationId: localStorage.getItem("radio-station")
};

function buildEqualizer() {
  $("#equalizer").innerHTML = Array.from({ length: 28 }, (_, index) => `<i style="--bar:${index}"></i>`).join("");
}

function isAvailableStation(station) {
  return station && !station.streamUrl.startsWith("https://example.com/");
}

function layoutStations() {
  const mobile = window.matchMedia("(max-width: 1100px)").matches;
  stations.forEach((station, index) => {
    const element = document.querySelector(`[data-station-id="${station.id}"]`);
    if (!element) return;
    element.style.setProperty("--delay", `${index * (mobile ? 20 : 30)}ms`);
    if (!mobile) {
      const desktopSlots = [
        [1, 2, 3, 4, 5, 6, 7, 8],
        [1, 2, 3, 6, 7, 8],
        [1, 2, 3, 6, 7, 8],
        [1, 2, 3, 6, 7, 8],
        [1, 2, 3, 4, 5, 6, 7, 8]
      ];
      let remaining = index;
      let row = 1;
      while (remaining >= desktopSlots[row - 1].length) {
        remaining -= desktopSlots[row - 1].length;
        row += 1;
      }
      const column = desktopSlots[row - 1][remaining];
      element.style.gridRow = row;
      element.style.gridColumn = column;
    } else {
      element.style.gridRow = "";
      element.style.gridColumn = "";
    }
  });
}

function createStationButtons() {
  ring.innerHTML = stations.map((station) => `
    <div class="station-tile" data-station-id="${station.id}">
      <button class="station-logo${isAvailableStation(station) ? "" : " is-unavailable"}" type="button" data-station-id="${station.id}" aria-label="${station.name}" aria-pressed="false"${isAvailableStation(station) ? "" : " disabled"}>
        ${isAvailableStation(station) ? `<img src="${station.logo}" alt="" loading="lazy" decoding="async">` : ""}
      </button>
      ${isAvailableStation(station) ? `<span class="station-genre">${station.genre}</span>` : ""}
      ${station.websiteUrl ? `<a class="station-link" href="${station.websiteUrl}" target="_blank" rel="noopener noreferrer" data-i18n="visitWebsite">${t("visitWebsite")}</a>` : ""}
    </div>`).join("");
  ring.querySelectorAll(".station-logo").forEach((button) => {
    if (button.disabled) return;
    button.addEventListener("click", () => selectStation(stations.find((station) => station.id === button.dataset.stationId)));
    button.querySelector("img").addEventListener("error", (event) => { event.currentTarget.src = "./images/logo.svg"; });
  });
  layoutStations();
}

function updateStatus(status) {
  const text = { idle: t("idle"), loading: t("loading"), playing: t("playing"), paused: t("paused"), error: t("streamError") }[status];
  $("#statusText").textContent = text;
  playerCard.classList.toggle("is-playing", status === "playing");
  playerCard.classList.toggle("is-error", status === "error");
  $("#playerError").hidden = status !== "error";
}

function updateTrack(track) {
  $("#trackTitle").textContent = track.title;
  $("#trackArtist").textContent = track.artist || currentStation?.name || t("liveRadio");
  addHistory({ title: track.title, artist: track.artist || currentStation?.name || t("liveRadio") });
}

function resetPlayer() {
  clearTimeout(streamTimeout);
  clearStreamRetry();
  streamRetryCount = 0;
  stopPolling();
  audio.pause();
  audio.removeAttribute("src");
  audio.load();
  currentStation = undefined;
  localStorage.removeItem("radio-station");
  $("#stationName").textContent = t("noRadio");
  $("#stationGenre").textContent = t("liveRadio");
  $("#stationCover").src = "./images/logo.svg";
  $("#stationCover").alt = t("noRadio");
  $("#trackTitle").textContent = t("noRadio");
  $("#trackArtist").textContent = "";
  document.querySelectorAll(".station-logo").forEach((button) => {
    button.classList.remove("is-active", "is-muted");
    button.setAttribute("aria-pressed", "false");
  });
  $("#playButton").disabled = true;
  $("#muteButton").disabled = true;
  updateStatus("idle");
}

function selectStation(station, { autoplay = true, retry = false } = {}) {
  if (!isAvailableStation(station)) return;
  clearTimeout(streamTimeout);
  clearStreamRetry();
  if (!retry) streamRetryCount = 0;
  stopPolling();
  audio.pause();
  currentStation = station;
  currentAutoplay = autoplay;
  localStorage.setItem("radio-station", station.id);
  $("#selectionHint").hidden = true;
  $("#stationName").textContent = station.name;
  $("#stationGenre").textContent = station.genre;
  $("#stationCover").src = station.logo;
  $("#stationCover").alt = station.name;
  $("#trackTitle").textContent = t("liveRadio");
  $("#trackArtist").textContent = station.name;
  document.querySelectorAll(".station-logo").forEach((button) => {
    const active = button.dataset.stationId === station.id;
    button.classList.toggle("is-active", active);
    button.classList.toggle("is-muted", !active);
    button.setAttribute("aria-pressed", String(active));
  });
  audio.src = station.streamUrl;
  audio.load();
  $("#playButton").disabled = false;
  $("#muteButton").disabled = false;
  updateStatus("loading");
  streamTimeout = setTimeout(() => { if (!audio.paused && audio.readyState < 2) showError(); }, 10000);
  if (autoplay) audio.play().catch(() => { updateStatus("paused"); });
  else updateStatus("paused");
  startPolling(station, updateTrack);
}

function retryStream() {
  if (!currentStation || streamRetryTimer) return;
  if (streamRetryCount >= maxStreamRetries) {
    updateStatus("error");
    return;
  }
  streamRetryCount += 1;
  updateStatus("loading");
  streamRetryTimer = setTimeout(() => {
    streamRetryTimer = undefined;
    if (currentStation) selectStation(currentStation, { autoplay: currentAutoplay, retry: true });
  }, streamRetryCount * 1000);
}

function showError() {
  retryStream();
}

function togglePlay() {
  if (!currentStation) return;
  if (audio.paused) audio.play().catch(showError);
  else audio.pause();
}
function renderHistory() {
  const list = $("#historyList");
  const history = readHistory();
  list.innerHTML = history.length ? history.map((track) => `<div class="history-row"><span class="history-time">${new Date(track.time).toLocaleTimeString(getLanguage(), { hour: "2-digit", minute: "2-digit" })}</span><div><div class="history-title">${escapeHtml(track.title)}</div><div class="history-artist">${escapeHtml(track.artist || "")}</div></div></div>`).join("") : `<div class="empty-history">${t("emptyHistory")}</div>`;
}
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]); }
function toggleHistory(open) {
  $("#historyPanel").classList.toggle("is-open", open);
  $("#historyPanel").setAttribute("aria-hidden", String(!open));
  $("#historyButton").setAttribute("aria-expanded", String(open));
  $("#historyBackdrop").hidden = !open;
  if (open) renderHistory();
}

function init() {
  const firstVisit = !hasLanguagePreference();
  buildEqualizer();
  createStationButtons();
  $("#volumeSlider").value = state.volume;
  audio.volume = state.volume;
  setLanguage(getLanguage());
  if (localStorage.getItem("radio-dim") === "true") toggleDim(true);
  if (state.stationId) selectStation(stations.find((station) => station.id === state.stationId), { autoplay: true });
  else resetPlayer();
  $("#playButton").addEventListener("click", togglePlay);
  $("#retryButton").addEventListener("click", () => {
    if (!currentStation) return;
    selectStation(currentStation, { autoplay: true });
  });
  $("#muteButton").addEventListener("click", () => { isMuted = !isMuted; audio.muted = isMuted; $("#muteButton").setAttribute("aria-pressed", String(isMuted)); $("#muteButton").textContent = isMuted ? "×" : "⌁"; $("#muteButton").setAttribute("aria-label", t(isMuted ? "unmute" : "mute")); });
  $("#volumeSlider").addEventListener("input", (event) => { state.volume = Number(event.target.value); audio.volume = state.volume; localStorage.setItem("radio-volume", state.volume); });
  document.querySelectorAll(".language-button").forEach((button) => button.addEventListener("click", () => setLanguage(button.dataset.language)));
  $("#dimButton")?.addEventListener("click", () => toggleDim());
  $(".dim-button").addEventListener("click", () => toggleDim());
  $("#historyButton").addEventListener("click", () => toggleHistory(true));
  $("#closeHistory").addEventListener("click", () => toggleHistory(false));
  $("#historyBackdrop").addEventListener("click", () => toggleHistory(false));
  $("#clearHistory").addEventListener("click", () => { clearHistory(); renderHistory(); });
  document.querySelectorAll(".prompt-language-button").forEach((button) => {
    button.addEventListener("click", () => {
      setLanguage(button.dataset.promptLanguage);
      $("#languagePrompt").hidden = true;
    });
  });
  audio.addEventListener("playing", () => {
    clearTimeout(streamTimeout);
    clearStreamRetry();
    streamRetryCount = 0;
    updateStatus("playing");
  });
  audio.addEventListener("pause", () => { if (currentStation) { updateStatus("paused"); stopPolling(); } });
  audio.addEventListener("error", showError);
  audio.addEventListener("stalled", () => { if (!audio.paused) showError(); });
  window.addEventListener("resize", layoutStations);
  document.addEventListener("keydown", (event) => {
    if (event.target.matches("input, button")) return;
    if (event.code === "Space") { event.preventDefault(); togglePlay(); }
    if (event.key.toLowerCase() === "m") $("#muteButton").click();
    if (event.key.toLowerCase() === "h") toggleHistory(!$("#historyPanel").classList.contains("is-open"));
    if (event.key === "Escape") toggleHistory(false);
    if (event.key === "ArrowUp") { $("#volumeSlider").value = Math.min(1, state.volume + .05); $("#volumeSlider").dispatchEvent(new Event("input")); }
    if (event.key === "ArrowDown") { $("#volumeSlider").value = Math.max(0, state.volume - .05); $("#volumeSlider").dispatchEvent(new Event("input")); }
  });
  if (firstVisit) $("#languagePrompt").hidden = false;
}
function toggleDim(force) { const enabled = force ?? !document.body.classList.contains("dim-mode"); document.body.classList.toggle("dim-mode", enabled); localStorage.setItem("radio-dim", enabled); $(".dim-button").setAttribute("aria-pressed", String(enabled)); }
init();
