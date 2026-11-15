const currentVersion = document.querySelector('meta[name="app-version"]')?.content;
const updatePrompt = document.querySelector("#updatePrompt");
const reloadButton = document.querySelector("#reloadPageButton");

async function checkForUpdate() {
  const response = await fetch(`./version.json?check=${Date.now()}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`Update check failed with HTTP ${response.status}`);
  const { version } = await response.json();
  if (currentVersion && version && version !== currentVersion) updatePrompt.hidden = false;
}

export function startUpdateChecks() {
  const runCheck = () => checkForUpdate().catch((error) => console.warn(error.message));
  runCheck();
  window.setInterval(runCheck, 60_000);
  reloadButton.addEventListener("click", () => {
    const url = new URL(window.location.href);
    url.searchParams.set("update", Date.now());
    window.location.assign(url.href);
  });
}
