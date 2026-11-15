const translations = {
  da: {
    selectionHint: "Vælg en station for at starte", idle: "Klar til at spille", nowPlaying: "Nu spiller", liveDirectory: "Live radiooversigt",
    streamError: "Kunne ikke oprette forbindelse", retry: "Prøv igen", recent: "Sidste 10 sange",
    historyLabel: "Historik", recentTracks: "Sidste 10 afspillede sange", clearHistory: "Ryd historik",
    volume: "Lydstyrke", play: "Afspil", pause: "Pause", mute: "Slå lyd fra", unmute: "Slå lyd til",
    dimButton: "Aktivér dim-tilstand", loading: "Indlæser", playing: "Afspiller", paused: "Pause",
    liveRadio: "Live radio", noRadio: "Ingen radio her endnu", welcomeTitle: "Vælg en radio for at starte", welcomeArtist: "Din lyd, dit rum.",
    emptyHistory: "Ingen sange i historikken endnu.", visitWebsite: "Hjemmeside",
    seoDescription: "Dansk radio, programmering, tech og business"
  },
  en: {
    selectionHint: "Choose a station to start", idle: "Ready to play", nowPlaying: "Now playing", liveDirectory: "Live directory",
    streamError: "Could not connect", retry: "Try again", recent: "Last 10 songs",
    historyLabel: "History", recentTracks: "Last 10 songs played", clearHistory: "Clear history",
    volume: "Volume", play: "Play", pause: "Pause", mute: "Mute", unmute: "Unmute",
    dimButton: "Enable dim mode", loading: "Loading", playing: "Playing", paused: "Paused",
    liveRadio: "Live radio", noRadio: "No radio here yet", welcomeTitle: "Choose a station to start", welcomeArtist: "Your sound, your space.",
    emptyHistory: "No songs in history yet.", visitWebsite: "Website",
    seoDescription: "Danish radio, programming, tech and business"
  }
};

let language = localStorage.getItem("radio-language");
if (!language || !translations[language]) language = "en";

export function t(key) { return translations[language][key] || key; }
export function getLanguage() { return language; }
export function hasLanguagePreference() { return Boolean(localStorage.getItem("radio-language")); }
export function setLanguage(next) {
  if (!translations[next]) return;
  language = next;
  localStorage.setItem("radio-language", next);
  document.documentElement.lang = next;
  document.querySelectorAll("[data-i18n]").forEach((element) => { element.textContent = t(element.dataset.i18n); });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => { element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel)); });
  document.querySelectorAll(".station-logo.is-unavailable").forEach((element) => { element.setAttribute("aria-label", t("noRadio")); });
  document.querySelectorAll(".language-button").forEach((button) => button.classList.toggle("is-active", button.dataset.language === next));
  document.querySelector(".language-switch")?.classList.toggle("is-en", next === "en");
}
