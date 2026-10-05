import os
import time
import random
import string
from functools import wraps
from flask import session, jsonify, request, current_app, redirect, url_for
from werkzeug.utils import secure_filename
from app.models import Product

ORDER_STATUS = {
    'pending': 'در انتظار بررسی',
    'confirmed': 'تأیید شده',
    'preparing': 'در حال آماده‌سازی',
    'shipped': 'ارسال شده',
    'delivered': 'تحویل داده شده',
    'cancelled': 'لغو شده',
}


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']


def save_upload(file, subdir='products'):
    if file and file.filename and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        timestamp = int(time.time())
        random_part = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
        filename = f"{timestamp}_{random_part}_{filename}"
        upload_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], subdir)
        os.makedirs(upload_dir, exist_ok=True)
        filepath = os.path.join(upload_dir, filename)
        file.save(filepath)
        return f"/static/uploads/{subdir}/{filename}"
    return None


def get_cart():
    return session.get('cart', {})


def save_cart(cart):
    session['cart'] = cart
    session.modified = True


def get_cart_count():
    return sum(get_cart().values())


def get_cart_items_with_products():
    cart = get_cart()
    items = []
    total = 0
    for product_id, quantity in cart.items():
        product = Product.query.get(int(product_id))
        if product:
            price = product.discount_price if product.discount_price else product.price
            subtotal = price * quantity
            total += subtotal
            items.append({
                'product': product,
                'quantity': quantity,
                'price': price,
                'subtotal': subtotal
            })
    return items, total


def format_price(price):
    return f"{price:,} تومان"


def generate_order_number():
    from datetime import datetime
    timestamp = datetime.now().strftime('%Y%m%d')
    random_part = ''.join(random.choices(string.digits, k=6))
    return f"NS-{timestamp}-{random_part}"


def parse_specs(specs_text):
    if not specs_text:
        return []
    specs = []
    for line in specs_text.strip().split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            specs.append((key.strip(), value.strip()))
    return specs


def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not session.get('admin_id'):
            if request.is_json or request.headers.get('Content-Type') == 'application/json':
                return jsonify({'error': 'Unauthorized'}), 401
            return redirect(url_for('admin.login'))
        return f(*args, **kwargs)
    return decorated
