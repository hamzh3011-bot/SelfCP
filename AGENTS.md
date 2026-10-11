# AGENTS.md

## What is in this repository

The repository was originally a Python prompt-compression research project
(`main.py`, `Trainer.py`, `DatasetModule*.py`, `config-blue.yaml`). **None of
that is run or touched by the Base44 sandbox environment** — those files need
CUDA and a GPU cluster.

The website — the Persian (RTL) airline / travel-agency site **آسمانه** — lives
in `web/` and is the only thing the sandbox runs.

```
web/
  index.html            <html lang="fa" dir="rtl">
  vite.config.js        sandbox host allowlist + HMR over the preview proxy
  src/
    index.css           design tokens, glassmorphism, reveal, marquee, nav, faq
    data/content.js     every piece of Persian copy and data on the site
    hooks.js            useInView / useCountUp / useScrollY
    App.jsx             section order
    components/         one file per section + Icons.jsx (line icons & logo)
  public/media/         all imagery, video and poster — served from /media
```

## Running it

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

One service (`web`), `node:22`, dev-oriented: the repo is bind-mounted at
`/app`, dependencies are installed on container start from the committed
`package.json`, then `vite` runs with live reload. Host port 3000 → container
5173. There is no backend, no database and no required secret, so there is
nothing to migrate or seed.

## Non-obvious things worth knowing

- **Sandbox-only networking is gated on `BASE44_PREVIEW_MODE === "1"`** in
  `web/vite.config.js`: the dev server widens `server.allowedHosts` to the
  sandbox host domain and points HMR at `wss:` port 443 (the preview proxy).
  With the flag unset the dev server keeps Vite's stock localhost-only
  behaviour. Edit that block, not the shared config, if preview networking
  breaks.
- **Fonts are self-hosted.** Vazirmatn ships through the
  `@fontsource-variable/vazirmatn` npm package — no CDN request. Yekan Bakh
  (the preferred face in the brief) is a commercial licence, so Vazirmatn is
  the implementation's primary face, exactly as the brief lists as fallback.
- **A controlled `<select>` can only display a value that exists among its
  options.** `FlightSearch.jsx` swaps origin and destination, and the two city
  lists differ, so each list injects the current city (`withCurrent`) — without
  it React mutates state but the field keeps showing the old city.
- **Media is local**, in `web/public/media/`. The hero is a 1080p H.264 clip
  (~3 MB, no audio, `+faststart`) with a matching `hero-poster.jpg`; the poster
  is also the still shown when `prefers-reduced-motion` is set.
- **Replacing the hero footage** (needs ffmpeg, which is not on the host —
  run it from a container): download the source clip, then
  `ffmpeg -i raw.mp4 -vf "scale=1920:-2" -an -c:v libx264 -preset medium -crf 26 -profile:v high -pix_fmt yuv420p -movflags +faststart hero.mp4`
  and extract a poster with `-ss 6 -frames:v 1 -vf "scale=1600:-2" -q:v 4`.
  Keep the clip bright and blue: an aerial above clouds reads best, and check
  the frame's average colour before shipping it (a grayscale clip slipped
  through the first time).
- **Persian digits**: the stats counters format with `toLocaleString('fa-IR')`.
  Anything comparing a Persian numeral must convert first (see
  `toLatinNumber` in `Testimonials.jsx`).
- Design tokens (sky blues, ink, radii, shadows) are declared once in
  `src/index.css` under `@theme`; Tailwind v4 turns them into utilities such as
  `text-ink`, `bg-mist`, `shadow-soft`.

## Verifying it works

There is no API to curl beyond the page itself, so verification is visual and
behavioural in the preview browser:

1. `curl -s http://localhost:3000/ | head` — should return the RTL HTML shell
   with `/src/main.jsx`, proving the dev server (not a prebuilt bundle) is
   serving the cloned source.
2. In the preview: the hero fills the viewport with the video playing
   (`muted`, `loop`, `autoplay`); the flight-search panel overlaps the hero
   bottom; the swap control exchanges مبدا/مقصد; submitting the search and the
   newsletter form each show their inline confirmation; the FAQ accordion opens
   one answer at a time; the destination rail scrolls with its arrows; at mobile
   width the menu opens and no horizontal scrolling appears.
