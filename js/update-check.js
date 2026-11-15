const currentVersion = document.querySelector('meta[name="app-version"]')?.content;
const updatePrompt = document.querySelector("#updatePrompt");
const reloadButton = document.querySelector("#reloadPageButton");

async function checkForUpdate() {
  const response = await fetch(`./version.json?check=${Date.now()}`, { cache: "reload" });
  if (!response.ok) throw new Error(`Update check failed with HTTP ${response.status}`);
  const { version } = await response.json();
  if (typeof version !== "string") throw new Error("Update check returned an invalid version");
  if (currentVersion && version !== currentVersion) updatePrompt.hidden = false;
}

export function startUpdateChecks() {
  const runCheck = () => checkForUpdate().catch((error) => console.warn(error.message));
  runCheck();
  window.setInterval(runCheck, 15_000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) runCheck(); });
  window.addEventListener("focus", runCheck);
  reloadButton.addEventListener("click", () => {
    const url = new URL(window.location.href);
    url.searchParams.set("update", Date.now());
    window.location.assign(url.href);
  });
}
