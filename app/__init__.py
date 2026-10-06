import os
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
import config

db = SQLAlchemy()
login_manager = LoginManager()
login_manager.login_view = 'auth.login'
login_manager.login_message = 'برای ادامه باید وارد شوید'
login_manager.login_message_category = 'warning'


def create_app():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    app = Flask(__name__,
                template_folder=os.path.join(base_dir, 'templates'),
                static_folder=os.path.join(base_dir, 'static'))
    app.config.from_object(config)

    for subdir in ['products', 'banners', 'logo']:
        os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], subdir), exist_ok=True)

    db.init_app(app)
    login_manager.init_app(app)

    from app.models import User

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    from app.models import SiteSettings
    from app.utils import get_cart_count

    @app.context_processor
    def inject_globals():
        try:
            settings = SiteSettings.query.first()
        except Exception:
            settings = None
        return dict(site_settings=settings, cart_count=get_cart_count())

    from app.shop import shop_bp
    from app.auth import auth_bp
    from app.admin import admin_bp
    app.register_blueprint(shop_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp, url_prefix='/admin')

    @app.errorhandler(404)
    def not_found(e):
        return render_template('404.html'), 404

    return app
