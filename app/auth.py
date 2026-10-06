from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from flask_login import login_user, logout_user, login_required, current_user
from app import db
from app.models import User, Order

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('shop.index'))

    if request.method == 'POST':
        identifier = request.form.get('identifier', '').strip()
        password = request.form.get('password', '')

        user = User.query.filter(
            (User.phone == identifier) | (User.email == identifier)
        ).first()
        if user and user.check_password(password):
            login_user(user, remember=True)
            next_page = request.args.get('next')
            return redirect(next_page or url_for('shop.index'))
        else:
            flash('شماره موبایل/ایمیل یا رمز عبور اشتباه است', 'error')

    return render_template('login.html')


@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('shop.index'))

    if request.method == 'POST':
        first_name = request.form.get('first_name', '').strip()
        last_name = request.form.get('last_name', '').strip()
        phone = request.form.get('phone', '').strip()
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '')

        if not all([first_name, last_name, phone, email, password]):
            flash('تمام فیلدها الزامی هستند', 'error')
            return render_template('register.html')

        if User.query.filter_by(phone=phone).first():
            flash('این شماره موبایل قبلاً ثبت شده است', 'error')
            return render_template('register.html')

        if User.query.filter_by(email=email).first():
            flash('این ایمیل قبلاً ثبت شده است', 'error')
            return render_template('register.html')

        user = User(first_name=first_name, last_name=last_name, phone=phone, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        login_user(user, remember=True)
        flash('ثبت‌نام موفقیت‌آمیز بود', 'success')
        return redirect(url_for('shop.index'))

    return render_template('register.html')


@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('shop.index'))


@auth_bp.route('/account')
@login_required
def account():
    orders = Order.query.filter_by(user_id=current_user.id).order_by(Order.created_at.desc()).all()
    return render_template('account.html', orders=orders)


@auth_bp.route('/account/edit', methods=['POST'])
@login_required
def account_edit():
    current_user.first_name = request.form.get('first_name', current_user.first_name)
    current_user.last_name = request.form.get('last_name', current_user.last_name)
    current_user.address = request.form.get('address', current_user.address)
    current_user.province = request.form.get('province', current_user.province)
    current_user.city = request.form.get('city', current_user.city)
    current_user.postal_code = request.form.get('postal_code', current_user.postal_code)
    db.session.commit()
    flash('اطلاعات شما با موفقیت به‌روزرسانی شد', 'success')
    return redirect(url_for('auth.account'))
