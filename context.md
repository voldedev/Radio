# ROLLE
Du er en senior front-end-udvikler og UI/UX-designer med fokus på rolige, professionelle og æstetiske grænseflader. Du bygger med omhu for detaljen, og designet skal føles som et færdigt, poleret produkt, ikke som en skabelon.

# OPGAVE
Byg en komplet, statisk hjemmeside kaldet **"Radio Player Denmark"** til hosting på **GitHub Pages**.
Kun HTML, CSS og vanilla JavaScript. Ingen build-step, ingen frameworks, ingen backend.
Alt skal fungere ved blot at åbne `index.html` via en lokal server eller på GitHub Pages.

# KONCEPT
En enkelt landingside, der fylder hele skærmen uden scroll på desktop (brug `100dvh`).
I midten sidder en centreret radioafspiller. Rundt om afspilleren er **30 radiostationers logoer** arrangeret i en cirkulær/elliptisk ring. Brugeren klikker på et logo, og stationen afspilles øjeblikkeligt uden sideskift. Klikker brugeren på et andet logo, skifter lyden straks.

# FILSTRUKTUR
```
/
├── index.html
├── css/
│   ├── tokens.css        (farver, spacing, radius, skygger, typografi som CSS variables)
│   └── style.css         (layout og komponenter)
├── js/
│   ├── app.js            (init, events, UI, layout-beregning)
│   ├── stations.js       (stationsdata)
│   ├── i18n.js           (sprog DA/EN)
│   └── nowplaying.js     (now playing + historik)
├── images/
│   ├── logo.svg          (sidens logo)
│   ├── favicon.svg
│   └── stations/         (station-01.svg ... station-30.svg som placeholders)
└── README.md
```

# STATIONSDATA (js/stations.js)
Eksportér et array med præcis 30 placeholder-stationer:
```js
{
  id: "station-01",
  name: "Station 01",
  logo: "images/stations/station-01.png", // 150x150 px
  streamUrl: "https://example.com/stream1", // placeholder, udskiftes senere
  nowPlayingUrl: null,                      // valgfri metadata-URL
  nowPlayingType: null,                     // "icy" | "json" | null
  parseNowPlaying: null,                    // valgfri parser-funktion pr. station
  genre: "Placeholder",
  accent: null                              // valgfri hex-farve til station-glød
}
```
Kun denne fil skal ændres for at tilføje, fjerne eller redigere radioer.
Generér 30 pæne placeholder-logoer (150x150, SVG) i `images/stations/` med stationsnummer og en dæmpet, unik farvetone pr. station, så layoutet ser levende ud fra start.

---

# DESIGN-VEJLEDNING (VIGTIGST: LAV ET FEDT, ROLIGT OG PROFESSIONELT DESIGN)

## Design-filosofi
Tænk "high-end audio-udstyr møder moderne Scandinavian design". Stemningen er rolig, elegant, fokuseret og tidløs. Siden skal kunne stå på en sekundær skærm hos en gamer i timevis eller i en reception hos en virksomhed uden at trætte øjnene eller virke useriøs.
Principper: **ro, dybde, hierarki, luft, konsistens**. Intet må skrige. Alt skal føles dæmpet, blødt og gennemtænkt.

## Farvepalette (definér som CSS custom properties i tokens.css)
Dæmpede, mellemmørke toner. Hverken sort eller skarpt hvidt.
```css
:root {
  /* Baggrund (dybde-lag fra bagest til forrest) */
  --bg-0: #12161d;      /* dybeste baggrund */
  --bg-1: #171c25;      /* sidebaggrund */
  --bg-2: #1d2430;      /* paneler */
  --bg-3: #252e3c;      /* hævede flader, hover */

  /* Tekst (aldrig ren hvid) */
  --text-1: #d8dee9;    /* primær */
  --text-2: #a3adbd;    /* sekundær */
  --text-3: #7a8598;    /* dæmpet/hint */

  /* Accent (rolig teal) + sekundær */
  --accent: #5fa8a0;
  --accent-soft: rgba(95, 168, 160, 0.18);
  --accent-glow: rgba(95, 168, 160, 0.35);
  --accent-2: #6c8ebf;  /* dæmpet blå til sekundære detaljer */
  --danger: #c27a7a;    /* dæmpet rød til fejl */
  --success: #7fb08a;

  /* Linjer og glas */
  --border: rgba(216, 222, 233, 0.08);
  --glass: rgba(31, 39, 51, 0.55);

  /* Radius, spacing, skygger */
  --r-sm: 10px; --r-md: 16px; --r-lg: 24px; --r-full: 999px;
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-5: 24px; --space-6: 32px; --space-7: 48px;
  --shadow-sm: 0 2px 8px rgba(0,0,0,.25);
  --shadow-md: 0 8px 24px rgba(0,0,0,.30);
  --shadow-lg: 0 20px 50px rgba(0,0,0,.35);

  --ease: cubic-bezier(.22,.61,.36,1);
  --t-fast: 200ms; --t-med: 300ms; --t-slow: 400ms;
}
```
Brug 60/30/10-reglen: 60 % mørke baggrundsflader, 30 % paneler og kort, 10 % accent. Accentfarven bruges sparsomt (aktiv station, play-knap, slider-fyld, fokusringe).

## Baggrund og atmosfære
- Lagdelt baggrund: en blød radial gradient i midten (`--bg-2` → `--bg-0`) og en meget svag vignette i kanterne.
- Tilføj 1-2 store, ekstremt bløde "ambient glow"-blobs (blur 120-160px, opacity 0.08-0.14) i accentfarverne bag afspilleren, som langsomt (60-90 s loop) og næsten umærkeligt driver. Slå bevægelsen helt fra ved `prefers-reduced-motion`.
- Valgfri støjtekstur (inline SVG feTurbulence, opacity ~0.03) for et mere organisk, premium look.
- **Dynamisk glød:** Når en station er aktiv, skifter den ambiente glød blidt (transition 800 ms) til stationens `accent`-farve. Hvis `accent` ikke er sat, forsøg at udtrække dominant farve fra logoet via `<canvas>` (fallback til standardaccenten ved CORS-fejl). Farven skal altid dæmpes (mix med baggrund), så den aldrig bliver skarp.

## Typografi
- Font: **Inter** (Google Fonts, weights 400/500/600) med fallback `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`. Brug `font-display: swap`.
- Tydeligt hierarki: stationsnavn 28-32px/600, now playing-titel 18-20px/500, kunstner 15-16px/400 i `--text-2`, labels 12-13px med let `letter-spacing: .06em` i versaler og `--text-3`.
- Linjehøjde 1.4-1.6. Tabular-nums på tidsstempler. God kontrast (WCAG AA).

## Layout og geometri
- Afspilleren er **perfekt centreret** (CSS grid/flex + `place-items: center`).
- Logoerne placeres i **to koncentriske ringer** (fx 12 i den indre og 18 i den ydre) eller én ellipse, beregnet i JS med `cos/sin`, med lige vinkelafstand. Ringene roteres en smule i forhold til hinanden, så logoerne ikke står i rækker (forskudt layout ser mere organisk ud).
- Udregn radius ud fra viewport (`min(width, height)`), og skaler logostørrelsen dynamisk fra **150px ned til minimum 64px**, så alt altid er synligt uden scroll. Genberegn ved `resize` (debounced) og `orientationchange`.
- Tegn **subtile, tynde cirkellinjer** (1px, `--border`, opacity .5) bag ringene som visuel "orbit"-struktur, så layoutet virker bevidst og harmonisk.
- Mikro-staggering: ved første indlæsning fader logoerne ind en ad gangen (30-40 ms forsinkelse, 400 ms fade + lille scale fra .9), og afspilleren fader ind først. Ingen hurtige eller hoppende animationer.
- **Mobil/tablet (< 900px):** rent responsivt grid (3-5 kolonner, afrundede kort), kompakt afspiller fastgjort i bunden (mini-player, der kan udvides), header i toppen. Ingen horisontal scroll.

## Header
Gennemsigtig/glas-header (`backdrop-filter: blur(12px)`), 64px høj: SVG-logo + "Radio Player Denmark" til venstre i 600 weight; til højre en elegant sprogvælger (segmenteret kontrol **DA | EN** med glidende aktiv-indikator) og en lille "Dim"-knap (måne-ikon). Ingen tung navigation.

## Afspilleren (hjertet i designet)
Et centreret **glaskort** (`--glass`, `backdrop-filter: blur(18px)`, 1px `--border`, radius `--r-lg`, `--shadow-lg`), ca. 380-440px bredt:
1. **Cover/logo** øverst: stationslogoet stort (ca. 160-200px) med afrundet kant, blød skygge og en tynd roterende/pulserende accent-ring rundt om, når der afspilles (meget langsom, 12 s per omdrejning, eller blid puls). Ved skift af station: crossfade (300 ms).
2. **Stationsnavn + genre-chip** (lille pille-label).
3. **Statuslinje:** lille farvet prik + tekst (Afspiller / Indlæser / Fejl). Prikken pulserer blidt kun ved "Afspiller".
4. **Now playing:** kunstner og titel, ellipsis ved overløb, evt. langsom marquee kun hvis teksten ikke kan være der.
5. **Equalizer:** 24-32 tynde, afrundede søjler i dæmpet accent med lav amplitude og langsom bevægelse (CSS-animation eller Web Audio, hvis CORS tillader). Står stille og dæmpet ved pause.
6. **Kontroller:** stor rund Play/Pause-knap (64px, accentfyldt med dæmpet glød, ikon i `--bg-0`) med små mute-knap og lydstyrkeslider ved siden af. Slideren er tilpasset (tynd 4px track, accentfyldt, rund 14px thumb, der vokser let ved hover/fokus).
7. **Historik-knap** (ikon + "Seneste 10") åbner historikpanelet.

## Station-logoer: interaktion og tilstande
- Rund maske, 150px (skalerer ned), `--shadow-sm`, 2px `--border`.
- **Hover:** `scale(1.08)`, løft i skygge, svag accent-glød (200 ms).
- **Fokus (tastatur):** tydelig 2px accent-ring med 3px offset.
- **Aktiv:** accent-ring + blød glød + meget langsom puls (3-4 s). Alle andre logoer dæmpes en anelse (opacity .82), så den aktive skiller sig ud uden at skrige.
- **Active-press:** `scale(.97)` ved klik for taktil feedback.
- Tooltip med stationsnavn ved hover (lille glas-pille, 150 ms fade).
- Fallback-grafik (neutral radio-ikon) hvis billedet fejler.

## Historikpanel
Glas-skuffe, der glider ind fra højre (320-360px, 300 ms ease), uden at skabe sidescroll. Viser de seneste 10 sange som kompakte rækker: lille tidsstempel (`--text-3`), titel (`--text-1`) og kunstner (`--text-2`), tynde skillelinjer, subtil hover. Tom-tilstand med venligt ikon og tekst. "Ryd historik"-knap i bunden (dæmpet, sekundær stil). Lukker med Escape og klik udenfor.

## Sidens logo (images/logo.svg + favicon.svg)
Minimalistisk og professionelt: en afrundet firkant/cirkel med et stiliseret lydbølge-/radiobølge-symbol (3 buer eller 5 søjler) i teal-gradient. Integrér diskret et **dansk kors-motiv** (en lodret og vandret stribe i dæmpet, sandfarvet/råhvid tone, evt. en meget svag dæmpet rød kant) uden at det bliver for plat. Ordmærke "Radio Player Denmark" i Inter 600. Skal fungere i lille størrelse (favicon 32px) og på mørk baggrund. Lav en ren SVG uden eksterne afhængigheder.

## Mikrointeraktioner og bevægelse
- Alle overgange 200-400 ms med `--ease`. Ingen hurtige, blinkende eller aggressive effekter.
- Knapper: blid hover-lysning, active-trykeffekt, ripple er ikke nødvendig.
- Skeleton/loader ved "Indlæser": rolig, tyndt spinner-ring i accent.
- Fejl: dæmpet rød banner/toast, der glider ind fra toppen i afspilleren med "Prøv igen"-knap, forsvinder ikke selv.
- **`prefers-reduced-motion`:** slå ambient-drift, puls, rotation og stagger fra; behold kun simple fades.

## Tilstande og tilstande-sikring
Design alle tilstande pænt: idle (ingen station valgt, afspilleren viser en venlig velkomsttekst "Vælg en radio for at starte"), loading, playing, paused, error, muted, offline. Første besøg skal føles indbydende og tydeligt: pil/pulserende hint på logoerne.

## "Professionelt" og "Gamer"-tilstande
- **Standard:** som beskrevet.
- **Dim-tilstand:** knap i headeren, der sænker lysstyrke/kontrast yderligere (fx baggrund `#0f1319`, tekst `#aab3c2`, accent mere dæmpet) til natbrug og mørke rum. Gemmes i `localStorage`.
- **Ren visning (valgfri):** tast `F` eller knap skjuler header og historik for en minimalistisk "skærm i receptionen"-visning (fuldskærm via Fullscreen API).

## Design-kvalitetstjekliste (skal overholdes før du afleverer)
- [ ] Ingen ren hvid eller ren sort, ingen neonfarver.
- [ ] Kun 1 accentfarve dominerer; resten er neutral.
- [ ] Ens spacing-skala og radius overalt, brug kun tokens.
- [ ] Tydeligt visuelt hierarki: afspiller > aktiv station > øvrige logoer > header.
- [ ] Alt er pixel-centreret og symmetrisk i ringene.
- [ ] Ingen scroll på 1366x768, 1920x1080 og 2560x1440.
- [ ] Kontrast mindst WCAG AA, synlig fokusmarkering overalt.
- [ ] Ser professionelt ud i en butik/reception og beroligende ud på en gamer-skærm.

---

# AFSPILLER: FUNKTION
- Brug HTML5 `<audio>`. Ved skift: pause, nulstil `src`, `load()`, `play()` straks. Annullér ventende fejl fra den gamle stream.
- **Lydstyrke gemmes i `localStorage`**, sammen med sidst valgte station, sprog og dim-tilstand. Genindlæs ved start (men start ikke automatisk lyd før brugerinteraktion; vis stationen valgt og klar).
- Håndter autoplay-politik og fejl (timeout 10 s, `error`/`stalled`-events) med venlig besked og "Prøv igen".
- Media Session API (titel, kunstner, artwork, play/pause).
- Tastaturgenveje: mellemrum = play/pause, pil op/ned = lydstyrke, M = mute, pil venstre/højre = forrige/næste station, H = historik, F = ren visning, Escape = luk panel.

# NOW PLAYING + HISTORIK (js/nowplaying.js)
- Vis "Nu spiller / Now playing" (kunstner – titel).
- Modulær løsning: (1) ICY-metadata hvis muligt, (2) JSON-API pr. station via `nowPlayingUrl` + `parseNowPlaying`, (3) fallback "Live radio" / stationsnavn.
- Poll hvert 15.-20. sekund kun under afspilning; ryd interval ved stationsskift og pause. Håndter CORS-fejl lydløst (ingen konsolspam).
- **Historik: seneste 10 sange**, ingen dubletter i træk, gemmes i `localStorage`, kan ryddes.

# SPROG (js/i18n.js)
- Dansk og engelsk. Standard: dansk, eller engelsk hvis browserens sprog ikke er dansk.
- Skift øjeblikkeligt uden reload via `data-i18n`-attributter. Opdatér `<html lang>` dynamisk. Gem valg i `localStorage`.

# TILGÆNGELIGHED OG KVALITET
- Semantisk HTML (`header`, `main`, `aside`, `button`), ARIA-labels på alle interaktive elementer, `aria-live="polite"` på now playing/status, `aria-pressed` på aktiv station, fuld tastaturnavigation og logisk tab-rækkefølge.
- `<meta>`: viewport, description, theme-color (`#171c25`), Open Graph.
- Ren, kommenteret kode. Ingen eksterne afhængigheder udover Google Fonts (Inter).
- Kun `https://`-streams (mixed content blokeres på GitHub Pages).
- Performance: `loading="lazy"`, `decoding="async"`, `will-change` kun hvor nødvendigt, ingen unødvendige biblioteker, Lighthouse-mål 95+.

# GITHUB PAGES
- Relative stier (`./images/...`) så det virker under `username.github.io/repo-navn/`.
- README (dansk) med trin-for-trin: Settings → Pages → Deploy from branch → main / root.

# LEVERANCE
1. Opret alle filer med komplet, fungerende kode.
2. Generér 30 placeholder-logoer, `logo.svg` og `favicon.svg`.
3. Skriv README på dansk: hvordan man udskifter logoer, stream-URL'er, now playing-kilder, accentfarver, og hvordan man tester lokalt (`npx serve` eller VS Code Live Server).
4. Gennemgå designets kvalitetstjekliste og ret eventuelle afvigelser, før du melder færdig.

Arbejd trin for trin: 1) struktur og stationsdata, 2) tokens og layout (ringene), 3) afspiller og funktion, 4) sprog, now playing og historik, 5) design-finpudsning, mikrointeraktioner og tilgængelighed.