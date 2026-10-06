from datetime import datetime, timedelta
from flask import Blueprint, render_template, request, redirect, url_for, flash, session, jsonify
from app import db
from app.models import (
    User, Admin, Category, Product, ProductImage,
    Order, OrderItem, Banner, SiteSettings
)
from app.utils import admin_required, save_upload, ORDER_STATUS, format_price

admin_bp = Blueprint('admin', __name__)


@admin_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')
        admin = Admin.query.filter_by(username=username).first()
        if admin and admin.check_password(password):
            session['admin_id'] = admin.id
            return redirect(url_for('admin.dashboard'))
        flash('نام کاربری یا رمز عبور اشتباه است', 'error')
    return render_template('admin/login.html')


@admin_bp.route('/logout')
def logout():
    session.pop('admin_id', None)
    return redirect(url_for('admin.login'))


@admin_bp.route('/')
@admin_required
def dashboard():
    total_orders = Order.query.count()
    total_users = User.query.count()
    total_products = Product.query.count()
    total_sales = db.session.query(db.func.sum(Order.total)).filter(
        Order.status != 'cancelled'
    ).scalar() or 0

    today = datetime.utcnow().date()
    today_sales = db.session.query(db.func.sum(Order.total)).filter(
        db.func.date(Order.created_at) == today,
        Order.status != 'cancelled'
    ).scalar() or 0

    week_ago = today - timedelta(days=7)
    week_sales = db.session.query(db.func.sum(Order.total)).filter(
        db.func.date(Order.created_at) >= week_ago,
        Order.status != 'cancelled'
    ).scalar() or 0

    month_ago = today - timedelta(days=30)
    month_sales = db.session.query(db.func.sum(Order.total)).filter(
        db.func.date(Order.created_at) >= month_ago,
        Order.status != 'cancelled'
    ).scalar() or 0

    best_sellers = db.session.query(
        Product.name,
        db.func.sum(OrderItem.quantity).label('total_sold')
    ).join(OrderItem).join(Order).filter(
        Order.status != 'cancelled'
    ).group_by(Product.id).order_by(db.desc('total_sold')).limit(5).all()

    recent_orders = Order.query.order_by(Order.created_at.desc()).limit(5).all()

    sales_data = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        day_sales = db.session.query(db.func.sum(Order.total)).filter(
            db.func.date(Order.created_at) == day,
            Order.status != 'cancelled'
        ).scalar() or 0
        sales_data.append(day_sales)

    return render_template('admin/dashboard.html',
                           total_orders=total_orders,
                           total_users=total_users,
                           total_products=total_products,
                           total_sales=total_sales,
                           today_sales=today_sales,
                           week_sales=week_sales,
                           month_sales=month_sales,
                           best_sellers=best_sellers,
                           recent_orders=recent_orders,
                           sales_data=sales_data,
                           order_status=ORDER_STATUS)


@admin_bp.route('/products')
@admin_required
def products():
    products = Product.query.order_by(Product.created_at.desc()).all()
    return render_template('admin/products.html', products=products)


@admin_bp.route('/products/add', methods=['GET', 'POST'])
@admin_required
def product_add():
    categories = Category.query.all()
    if request.method == 'POST':
        product = Product(
            name=request.form.get('name', '').strip(),
            category_id=request.form.get('category_id', type=int),
            price=request.form.get('price', type=int) or 0,
            discount_price=request.form.get('discount_price', type=int) or None,
            stock=request.form.get('stock', type=int) or 0,
            short_desc=request.form.get('short_desc', ''),
            description=request.form.get('description', ''),
            specs=request.form.get('specs', ''),
            is_active='is_active' in request.form,
            is_featured='is_featured' in request.form
        )
        db.session.add(product)
        db.session.flush()

        files = request.files.getlist('images')
        for i, file in enumerate(files):
            if file and file.filename:
                path = save_upload(file, 'products')
                if path:
                    img = ProductImage(
                        product_id=product.id,
                        image_path=path,
                        is_primary=(i == 0 and not ProductImage.query.filter_by(product_id=product.id).first())
                    )
                    db.session.add(img)

        db.session.commit()
        flash('محصول با موفقیت افزوده شد', 'success')
        return redirect(url_for('admin.products'))

    return render_template('admin/product_form.html', categories=categories, product=None)


@admin_bp.route('/products/<int:id>/edit', methods=['GET', 'POST'])
@admin_required
def product_edit(id):
    product = Product.query.get_or_404(id)
    categories = Category.query.all()

    if request.method == 'POST':
        product.name = request.form.get('name', '').strip()
        product.category_id = request.form.get('category_id', type=int)
        product.price = request.form.get('price', type=int) or 0
        product.discount_price = request.form.get('discount_price', type=int) or None
        product.stock = request.form.get('stock', type=int) or 0
        product.short_desc = request.form.get('short_desc', '')
        product.description = request.form.get('description', '')
        product.specs = request.form.get('specs', '')
        product.is_active = 'is_active' in request.form
        product.is_featured = 'is_featured' in request.form

        files = request.files.getlist('images')
        for file in files:
            if file and file.filename:
                path = save_upload(file, 'products')
                if path:
                    img = ProductImage(product_id=product.id, image_path=path, is_primary=False)
                    db.session.add(img)

        db.session.commit()
        flash('محصول با موفقیت ویرایش شد', 'success')
        return redirect(url_for('admin.products'))

    return render_template('admin/product_form.html', categories=categories, product=product)


@admin_bp.route('/products/<int:id>/delete', methods=['POST'])
@admin_required
def product_delete(id):
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    flash('محصول حذف شد', 'success')
    return redirect(url_for('admin.products'))


@admin_bp.route('/products/<int:product_id>/images/<int:image_id>/delete', methods=['POST'])
@admin_required
def product_image_delete(product_id, image_id):
    image = ProductImage.query.get_or_404(image_id)
    db.session.delete(image)
    db.session.commit()
    return jsonify({'success': True})


@admin_bp.route('/categories')
@admin_required
def categories():
    categories = Category.query.all()
    return render_template('admin/categories.html', categories=categories)


@admin_bp.route('/categories/add', methods=['POST'])
@admin_required
def category_add():
    name = request.form.get('name', '').strip()
    description = request.form.get('description', '')
    if name:
        category = Category(name=name, description=description)
        db.session.add(category)
        db.session.commit()
        flash('دسته‌بندی افزوده شد', 'success')
    return redirect(url_for('admin.categories'))


@admin_bp.route('/categories/<int:id>/delete', methods=['POST'])
@admin_required
def category_delete(id):
    category = Category.query.get_or_404(id)
    if category.products:
        flash('این دسته‌بندی دارای محصول است و قابل حذف نیست', 'error')
        return redirect(url_for('admin.categories'))
    db.session.delete(category)
    db.session.commit()
    flash('دسته‌بندی حذف شد', 'success')
    return redirect(url_for('admin.categories'))


@admin_bp.route('/orders')
@admin_required
def orders():
    status = request.args.get('status', 'all')
    query = Order.query
    if status != 'all':
        query = query.filter_by(status=status)
    all_orders = query.order_by(Order.created_at.desc()).all()
    return render_template('admin/orders.html', orders=all_orders, current_status=status, order_status=ORDER_STATUS)


@admin_bp.route('/orders/<int:id>')
@admin_required
def order_detail(id):
    order = Order.query.get_or_404(id)
    return render_template('admin/order_detail.html', order=order, order_status=ORDER_STATUS)


@admin_bp.route('/orders/<int:id>/status', methods=['POST'])
@admin_required
def order_status_change(id):
    order = Order.query.get_or_404(id)
    order.status = request.form.get('status', order.status)
    db.session.commit()
    flash('وضعیت سفارش تغییر کرد', 'success')
    return redirect(url_for('admin.order_detail', id=id))


@admin_bp.route('/users')
@admin_required
def users():
    all_users = User.query.order_by(User.created_at.desc()).all()
    return render_template('admin/users.html', users=all_users)


@admin_bp.route('/banners')
@admin_required
def banners():
    all_banners = Banner.query.all()
    return render_template('admin/banners.html', banners=all_banners)


@admin_bp.route('/banners/add', methods=['POST'])
@admin_required
def banner_add():
    banner = Banner(
        title=request.form.get('title', ''),
        text=request.form.get('text', ''),
        link=request.form.get('link', ''),
        is_active='is_active' in request.form
    )
    file = request.files.get('image')
    if file and file.filename:
        banner.image_path = save_upload(file, 'banners')
    db.session.add(banner)
    db.session.commit()
    flash('بنر افزوده شد', 'success')
    return redirect(url_for('admin.banners'))


@admin_bp.route('/banners/<int:id>/edit', methods=['POST'])
@admin_required
def banner_edit(id):
    banner = Banner.query.get_or_404(id)
    banner.title = request.form.get('title', '')
    banner.text = request.form.get('text', '')
    banner.link = request.form.get('link', '')
    banner.is_active = 'is_active' in request.form
    file = request.files.get('image')
    if file and file.filename:
        banner.image_path = save_upload(file, 'banners')
    db.session.commit()
    flash('بنر ویرایش شد', 'success')
    return redirect(url_for('admin.banners'))


@admin_bp.route('/banners/<int:id>/delete', methods=['POST'])
@admin_required
def banner_delete(id):
    banner = Banner.query.get_or_404(id)
    db.session.delete(banner)
    db.session.commit()
    flash('بنر حذف شد', 'success')
    return redirect(url_for('admin.banners'))


@admin_bp.route('/settings', methods=['GET', 'POST'])
@admin_required
def settings():
    settings = SiteSettings.query.first()
    if not settings:
        settings = SiteSettings(site_name='نیک سرش')
        db.session.add(settings)
        db.session.commit()

    if request.method == 'POST':
        settings.site_name = request.form.get('site_name', 'نیک سرش')
        settings.phone = request.form.get('phone', '')
        settings.address = request.form.get('address', '')
        settings.email = request.form.get('email', '')
        settings.instagram = request.form.get('instagram', '')
        settings.telegram = request.form.get('telegram', '')
        settings.whatsapp = request.form.get('whatsapp', '')
        file = request.files.get('logo')
        if file and file.filename:
            settings.logo_path = save_upload(file, 'logo')
        db.session.commit()
        flash('تنظیمات ذخیره شد', 'success')
        return redirect(url_for('admin.settings'))

    return render_template('admin/settings.html', settings=settings)
