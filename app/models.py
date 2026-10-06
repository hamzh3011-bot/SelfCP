from datetime import datetime
from app import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    address = db.Column(db.Text)
    province = db.Column(db.String(100))
    city = db.Column(db.String(100))
    postal_code = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    orders = db.relationship('Order', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    products = db.relationship('Product', backref='category', lazy=True)


class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    price = db.Column(db.Integer, nullable=False)
    discount_price = db.Column(db.Integer, nullable=True)
    stock = db.Column(db.Integer, default=0)
    short_desc = db.Column(db.String(500))
    description = db.Column(db.Text)
    specs = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    is_featured = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    images = db.relationship('ProductImage', backref='product', lazy=True, cascade='all, delete-orphan')
    order_items = db.relationship('OrderItem', backref='product', lazy=True)


class ProductImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    image_path = db.Column(db.String(500))
    is_primary = db.Column(db.Boolean, default=False)


class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(50), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120))
    province = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    address = db.Column(db.Text, nullable=False)
    postal_code = db.Column(db.String(20))
    notes = db.Column(db.Text)
    subtotal = db.Column(db.Integer, nullable=False)
    discount = db.Column(db.Integer, default=0)
    total = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    items = db.relationship('OrderItem', backref='order', lazy=True, cascade='all, delete-orphan')


class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=True)
    product_name = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    discount_price = db.Column(db.Integer, nullable=True)
    quantity = db.Column(db.Integer, nullable=False)
    subtotal = db.Column(db.Integer, nullable=False)


class Banner(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    text = db.Column(db.Text)
    image_path = db.Column(db.String(500))
    link = db.Column(db.String(500))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class SiteSettings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    logo_path = db.Column(db.String(500))
    site_name = db.Column(db.String(200), default='نیک سرش')
    phone = db.Column(db.String(50))
    address = db.Column(db.Text)
    email = db.Column(db.String(120))
    instagram = db.Column(db.String(200))
    telegram = db.Column(db.String(200))
    whatsapp = db.Column(db.String(200))
