# Agent notes

## Repository layout
This repo is primarily a Python ML training project (`main.py`, `Trainer.py`, `DatasetModule*.py`).
The `web/` directory is a separate, self-contained React (Vite) + Tailwind v4 landing page for
"Harth Cafe" / «هارت کافه». It has no backend, no database and no API calls by design.

## Running the web app
Use the Base44 compose file; do not run the raw Dockerfile of any other project here:

```
docker compose -f docker-compose.base44.yml up -d --build
```

- Source is bind-mounted at `/app`; `npm ci` runs at container start because
  `web/node_modules` lives in a named volume (`web_node_modules`), not the host.
- Vite dev server listens on `0.0.0.0:3000` with polling enabled (bind mounts do not
  emit reliable fs events). Host allowlisting relies on the platform-provided
  `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS`; no host wildcard is hardcoded.
- The Vazirmatn variable font is vendored at `web/public/fonts/Vazirmatn.woff2`, so the
  page makes no external requests (no CDN, no image host). All artwork is local SVG in
  `web/public/images/`.

## Verifying
- `curl -s localhost:3000 | head` returns the RTL `index.html` shell.
- `docker compose -f docker-compose.base44.yml exec -T web npm run build` checks the
  production build (Tailwind + JSX compile).

## Conventions
- Persian, RTL, brand name «هارت کافه» with «قهوه تخصصی» underneath.
- Every visible string is Persian; prices are Persian digits followed by «تومان».
- Section ids used by nav anchors: `#home`, `#menu`, `#story`, `#footer`.
- Keep animations minimal (hover/transition only) and avoid extra dependencies.
