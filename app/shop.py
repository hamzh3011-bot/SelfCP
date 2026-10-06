from flask import Blueprint, render_template, request, redirect, url_for, jsonify, session
from flask_login import current_user
from app import db
from app.models import Product, Category, Banner, Order, OrderItem, ProductImage
from app.utils import (
    get_cart, save_cart, get_cart_count, get_cart_items_with_products,
    generate_order_number, parse_specs, ORDER_STATUS
)

shop_bp = Blueprint('shop', __name__)


@shop_bp.route('/')
def index():
    featured_products = Product.query.filter_by(
        is_active=True, is_featured=True
    ).order_by(Product.created_at.desc()).limit(8).all()
    categories = Category.query.all()
    banners = Banner.query.filter_by(is_active=True).order_by(Banner.created_at.desc()).all()
    latest_products = Product.query.filter_by(is_active=True).order_by(
        Product.created_at.desc()
    ).limit(4).all()
    return render_template('index.html',
                           featured_products=featured_products,
                           categories=categories,
                           banners=banners,
                           latest_products=latest_products)


@shop_bp.route('/shop')
def shop():
    page = request.args.get('page', 1, type=int)
    category_id = request.args.get('category', 0, type=int)
    search = request.args.get('search', '')
    sort = request.args.get('sort', 'newest')
    featured_only = request.args.get('featured', 0, type=int)

    query = Product.query.filter_by(is_active=True)

    if category_id:
        query = query.filter_by(category_id=category_id)

    if search:
        query = query.filter(Product.name.contains(search))

    if featured_only:
        query = query.filter_by(is_featured=True)

    if sort == 'price_asc':
        query = query.order_by(Product.price.asc())
    elif sort == 'price_desc':
        query = query.order_by(Product.price.desc())
    else:
        query = query.order_by(Product.created_at.desc())

    per_page = 12
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    categories = Category.query.all()

    return render_template('shop.html',
                           products=pagination.items,
                           pagination=pagination,
                           categories=categories,
                           current_category=category_id,
                           search=search,
                           sort=sort,
                           featured_only=featured_only)


@shop_bp.route('/product/<int:id>')
def product_detail(id):
    product = Product.query.get_or_404(id)
    specs = parse_specs(product.specs)
    related = Product.query.filter_by(
        category_id=product.category_id, is_active=True
    ).filter(Product.id != id).limit(4).all()
    return render_template('product.html', product=product, specs=specs, related_products=related)


@shop_bp.route('/cart')
def cart():
    items, total = get_cart_items_with_products()
    return render_template('cart.html', items=items, total=total)


@shop_bp.route('/cart/add', methods=['POST'])
def cart_add():
    data = request.get_json() or {}
    product_id = str(data.get('product_id'))
    quantity = int(data.get('quantity', 1))

    product = Product.query.get(int(product_id))
    if not product or not product.is_active:
        return jsonify({'success': False, 'message': 'محصول یافت نشد'}), 404

    cart = get_cart()
    cart[product_id] = cart.get(product_id, 0) + quantity
    save_cart(cart)
    return jsonify({'success': True, 'cart_count': get_cart_count()})


@shop_bp.route('/cart/update', methods=['POST'])
def cart_update():
    data = request.get_json() or {}
    product_id = str(data.get('product_id'))
    quantity = int(data.get('quantity', 1))

    cart = get_cart()
    if product_id in cart:
        if quantity <= 0:
            cart.pop(product_id, None)
        else:
            cart[product_id] = quantity
        save_cart(cart)

    items, total = get_cart_items_with_products()
    item = next((i for i in items if str(i['product'].id) == product_id), None)
    subtotal = item['subtotal'] if item else 0
    return jsonify({
        'success': True,
        'subtotal': subtotal,
        'total': total,
        'cart_count': get_cart_count()
    })


@shop_bp.route('/cart/remove', methods=['POST'])
def cart_remove():
    data = request.get_json() or {}
    product_id = str(data.get('product_id'))

    cart = get_cart()
    cart.pop(product_id, None)
    save_cart(cart)

    items, total = get_cart_items_with_products()
    return jsonify({'success': True, 'total': total, 'cart_count': get_cart_count()})


@shop_bp.route('/checkout')
def checkout():
    items, total = get_cart_items_with_products()
    if not items:
        return redirect(url_for('shop.cart'))
    return render_template('checkout.html', items=items, total=total)


@shop_bp.route('/checkout/place', methods=['POST'])
def checkout_place():
    items, total = get_cart_items_with_products()
    if not items:
        return redirect(url_for('shop.cart'))

    form = request.form
    order = Order(
        order_number=generate_order_number(),
        user_id=current_user.id if current_user.is_authenticated else None,
        first_name=form.get('first_name', '').strip(),
        last_name=form.get('last_name', '').strip(),
        phone=form.get('phone', '').strip(),
        email=form.get('email', '').strip(),
        province=form.get('province', '').strip(),
        city=form.get('city', '').strip(),
        address=form.get('address', '').strip(),
        postal_code=form.get('postal_code', '').strip(),
        notes=form.get('notes', '').strip(),
        subtotal=total,
        total=total,
        status='pending'
    )
    db.session.add(order)
    db.session.flush()

    for item in items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item['product'].id,
            product_name=item['product'].name,
            price=item['product'].price,
            discount_price=item['product'].discount_price,
            quantity=item['quantity'],
            subtotal=item['subtotal']
        )
        db.session.add(order_item)

    db.session.commit()
    save_cart({})
    return redirect(url_for('shop.order_success', order_number=order.order_number))


@shop_bp.route('/order/<order_number>')
def order_success(order_number):
    order = Order.query.filter_by(order_number=order_number).first_or_404()
    return render_template('order_success.html', order=order)


@shop_bp.route('/about')
def about():
    return render_template('about.html')


@shop_bp.route('/contact')
def contact():
    return render_template('contact.html')
