# Radio Player Denmark

En statisk radioafspiller bygget med HTML, CSS og vanilla JavaScript. Projektet kan hostes direkte på GitHub Pages og kræver ingen build-step. Siden indeholder SEO-metadata, Open Graph-data, strukturerede data og en `robots.txt`, så Google kan crawle den publicerede side.

## Lokal test

Åbn projektet med VS Code Live Server, eller kør:

```bash
npx serve .
```

Åbn derefter den viste lokale adresse i browseren. Direkte åbning af `index.html` virker også, men en lokal server anbefales til modul-scriptet.

## GitHub Pages

1. Push projektet til et repository på GitHub.
2. Gå til **Settings → Pages**.
3. Vælg **Deploy from a branch**.
4. Vælg branch `main` og mappe `/ (root)`.
5. Gem og åbn den publicerede URL.

## Tilpas radiostationer

Alle stationer ligger i [js/stations.js](./js/stations.js). Projektet indeholder 31 aktive stationer og 3 reserverede pladser, inklusive Globus Guld Jul, Classic FM Danmark, DEF CON Radio til programmering/tech og HandsUp Radio. Alle aktive stationer har et link til deres egen hjemmeside under logoet, og du kan redigere eller udskifte dem direkte i arrayet:

- `name`: navnet, der vises i playeren.
- `logo`: relativ sti til et SVG/PNG-logo.
- `streamUrl`: en offentlig `https://` audio-stream.
- `genre`: chippen under stationsnavnet.
- `accent`: valgfri hex-farve til stationens accent.
- `nowPlayingUrl`, `nowPlayingType` og `parseNowPlaying`: valgfri JSON-metadata. Classic FM bruger stationens officielle playlist-API, mens andre streams prøves automatisk med ICY `StreamTitle`-metadata, når streamens CORS-politik tillader det.

DEF CON Radio leveres af SomaFM og er valgt som en programmerings-/tech-kanal. Dens stream kan være utilgængelig fra enkelte netværk, hvis SomaFM afviser forbindelsen; det er en begrænsning hos streamudbyderen og ikke hos GitHub Pages.

De aktive stationer omfatter blandt andet DR P3, The Voice, Flash FM, Nova FM Danmark, Nightride FM, Rainwave Game, danske rockstationer, trance/hardstyle-stationer og flere SLAM!-kanaler. Placeholder-logoerne ligger i `images/stations/`; de kan erstattes med egne 150x150-logoer uden ændringer i layoutet.

## Funktioner

Sprog (DA/EN), dim-tilstand, lydstyrke og senest valgte station gemmes lokalt i browseren. Historikken gemmer op til 10 numre. Tastatur: `Space` play/pause, `M` mute, `H` historik, `Escape` luk historik, og pil op/ned ændrer lydstyrken.

## Google SEO

Når du har aktiveret GitHub Pages, bør du indsende den fulde Pages-adresse i [Google Search Console](https://search.google.com/search-console/about) og bruge URL-inspektion til at anmode om indeksering. Google kan ikke garantere en bestemt placering, men de nye metadata hjælper søgemaskinen med at forstå siden. Tilføj gerne den fulde Pages-URL som canonical og sitemap-URL, når repository-navnet er kendt.
