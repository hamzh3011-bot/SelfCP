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
