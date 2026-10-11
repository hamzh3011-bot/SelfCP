# AGENTS.md

## What is in this repository

The repository was originally a Python prompt-compression research project
(`main.py`, `Trainer.py`, `DatasetModule*.py`, `config-blue.yaml`). **None of
that is run or touched by the Base44 sandbox environment** — those files need
CUDA and a GPU cluster.

The Persian (RTL) airline / travel-agency site **آسمانه** is what the sandbox
runs, and it is a two-part app: a Vite + React front end in `web/` and a small
Node API in `api/` backed by Postgres.

```
web/
  index.html            <html lang="fa" dir="rtl">
  vite.config.js        sandbox host allowlist, HMR, and the /api proxy
  src/
    index.css           design tokens, glassmorphism, reveal, marquee, nav, faq,
                        admin panel
    data/content.js     the shipped default copy and data — the fallback for
                        every editable collection
    data/api.js         fetch wrapper + the admin token
    data/siteStore.js   the content store: server reads, optimistic writes
    hooks.js            useInView / useCountUp / useScrollY
    App.jsx             section order
    components/         one file per section + Icons.jsx (line icons & logo),
                        AdminPanel.jsx, CollectionEditor.jsx
  public/media/         all imagery, video and poster — served from /media
api/
  server.js             plain node:http routes: content, inboxes, admin auth
  auth.js               scrypt password hashing, session tokens, login throttle
  db.js                 pg pool + the schema, created on boot
```

## Running it

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

Three services: `db` (postgres:16-alpine, named volume `asemaneh-db`), `api`
(node:22, created tables on boot, **not published** — only reachable through the
web proxy) and `web` (node:22, Vite dev server on host port 3000 → container
5173, with `/api` proxied to `http://api:8000`). Both app services bind-mount
their source and install dependencies on start, then run the dev process, so
edits keep reloading live. The API has no watcher: **restart it after an `api/`
change** (`docker compose restart api`). There is nothing to migrate or seed —
an empty `site_content` table means "render the defaults from
`web/src/data/content.js`".

## Non-obvious things worth knowing

- **Sandbox-only networking is gated on `BASE44_PREVIEW_MODE === "1"`** in
  `web/vite.config.js`: the dev server widens `server.allowedHosts` to the
  sandbox host domain and points HMR at `wss:` port 443 (the preview proxy).
  With the flag unset the dev server keeps Vite's stock localhost-only
  behaviour. Edit that block, not the shared config, if preview networking
  breaks.
- **An empty content document is the reset state.** `GET /api/content` returns
  `{"content":null}` until someone edits, and the front end then renders
  `content.js`. That is what the panel's «بازنشانی به حالت اولیه» uses
  (`DELETE /api/admin/content`) — there is no second copy of the defaults to
  keep in sync.
- **Writes are optimistic.** `siteStore.js` applies an edit locally, then PUTs
  the whole document after a 500 ms debounce, so the site updates while the
  owner types. The document is a single row; concurrent editors are
  last-write-wins by design.
- **The admin password is set from the panel, never from the repo.** First run
  inserts one scrypt hash into `admin_config` (`ON CONFLICT DO NOTHING`, so it
  cannot be overwritten); sessions live in `admin_sessions` with a 7-day TTL and
  the token is kept in `sessionStorage`, so it dies with the tab. To hand the
  panel back to its first-run state:
  `docker compose exec -T db psql -U asemaneh -d asemaneh -c "DELETE FROM admin_config; DELETE FROM admin_sessions;"`
- **Bookings and subscribers are visitor rows, not content.** They are never
  part of the public document — `PUT /api/admin/content` whitelists the stored
  fields, so a payload cannot smuggle them in — and only `GET /api/admin/inbox`
  (token required) can read them. The panel re-pulls both inboxes every time it
  opens, because they keep filling while it is shut.
- **The dev server's /api proxy is what keeps the browser on one origin**; no
  CORS setup exists anywhere. `API_PROXY_TARGET` is set by compose; a plain
  `npm run dev` defaults to `http://localhost:8000`.
- **The database credentials in the compose file are local development ones.**
  `DATABASE_URL` is inline in compose, so moving to a hosted Postgres means
  changing that value (and then it should come from a secret instead, not from
  `environment:`).
- **Fonts are self-hosted.** Vazirmatn ships through the
  `@fontsource-variable/vazirmatn` npm package — no CDN request. Yekan Bakh
  (the preferred face in the brief) is a commercial licence, so Vazirmatn is
  the implementation's primary face, exactly as the brief lists as fallback.
- **A rename is not a find-and-replace.** Short brand labels in component copy
  go through `branded(text, brand)`, which swaps the shipped name for the
  current one, and every editable collection is read with `useSiteContent()`.
  Anything still importing a value straight from `content.js` will not follow a
  rename.
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
  `text-ink`, `bg-mist`, `shadow-soft`. The admin panel's own classes
  (`.admin-overlay`, `.admin-tab`, `.admin-card`, `.admin-auth`, …) live in the
  same file.

## Verifying it works

1. `curl -s http://localhost:3000/ | head` — should return the RTL HTML shell
   with `/src/main.jsx`, proving the dev server (not a prebuilt bundle) is
   serving the cloned source.
2. `curl -s http://localhost:3000/api/content` — `{"content":null}` on a fresh
   database, or the stored document once someone has edited.
3. The API end to end (use a throwaway password and wipe `admin_config` after,
   so the owner still gets the first-run setup):

   ```bash
   B=http://localhost:3000/api
   curl -s $B/admin/session                                  # {"configured":false}
   T=$(curl -s -X POST $B/admin/setup -H 'content-type: application/json' \
        -d '{"password":"throwaway-1234"}' | sed 's/.*"token":"\([^"]*\)".*/\1/')
   curl -s -X PUT $B/admin/content -H "authorization: Bearer $T" \
        -H 'content-type: application/json' -d '{"brand":{"name":"X"}}'
   curl -s $B/content                                        # shows the saved name
   curl -s $B/admin/inbox -H "authorization: Bearer $T"
   curl -s -o /dev/null -w '%{http_code}\n' $B/admin/inbox    # 401 without the token
   ```

   Then in the preview: the hero fills the viewport with the video playing
   (`muted`, `loop`, `autoplay`); the flight-search panel overlaps the hero
   bottom; the swap control exchanges مبدا/مقصد; submitting the search and the
   newsletter form each show their inline confirmation; the FAQ accordion opens
   one answer at a time; the destination rail scrolls with its arrows; at mobile
   width the menu opens and no horizontal scrolling appears.
4. The admin panel: tap the brand mark in the navbar five times (four taps must
   leave it closed). On a fresh database it first asks to set the password, and
   nothing is editable until it is set. Its six tabs are برند و تنظیمات، مقاصد،
   تورها، نظرات مسافران، رزروها، خبرنامه. Renaming the site updates the navbar
   logo, the footer, the browser title and the copy that names the brand
   (`چرا <نام>`، `خدمات <نام>`) — and `curl -s http://localhost:3000/api/content`
   must show the new name, which is the proof it reached the server rather than
   one browser. Submitting the flight search and the newsletter form should make
   a record appear in the رزروها and خبرنامه tabs, and deleting it there should
   empty them again.
