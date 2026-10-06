# Nik Saresh — Tile Adhesive E-commerce (نیک سرش)

Flask-based Persian RTL e-commerce site for tile adhesive and tiling supplies.

## Run
```bash
docker compose -f docker-compose.base44.yml up -d   # port 3000 → app port 5000
# or locally: pip install -r requirements.txt && python run.py
```

## Admin Access
Click the site logo **5 times rapidly** → admin login modal opens.
Default credentials: `admin` / `admin123`

## Tech
- Flask + Flask-SQLAlchemy + Flask-Login, SQLite (switch to MySQL via `DATABASE_URL` env var)
- Jinja2 templates, vanilla JS, Three.js for hero 3D
- Vazirmatn font from Google Fonts

## Config
`config.py` — DB URI, secret key, upload limits. All editable via env vars.

## File Uploads
Product images, banners, and logo are stored in `static/uploads/`.
These files are stored **publicly** — each file gets a permanent public URL that never expires, and anyone with the link can access it.

## DB Tables
users, admins, products, categories, orders, order_items, banners, site_settings

## Hero Scroll Sequence
Home page hero (`templates/index.html`, `static/css/style.css`, `static/js/hero-video.js`) is a pinned
300vh section. The video is never played: scroll progress (0→1) is mapped to `video.currentTime`.
- 0: only the intro teaser (`.hero-intro`) + "اسکرول کنید" are visible; existing hero content is hidden.
- 0 → 0.15: intro fades out.
- 0 → 1: video scrubs with the scrollbar (forward and backward).
- 0.55 → 0.9: existing hero content cascades back in (fade + rise, one element per window).

Scrubbing smoothness comes from the encoding, not the JS: the files in `static/uploads/` are H.264
with a keyframe every 4 frames, no B-frames, no audio, `+faststart`. If the hero video is swapped,
re-encode with the ffmpeg recipe in the header comment of `hero-video.js` or scrubbing will stutter.
The section gets a `hero-js` class when the script runs; without JS the CSS leaves the normal hero
content visible and hides the intro. `prefers-reduced-motion` keeps a static hero image.
