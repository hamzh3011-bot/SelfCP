// Toast
function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

// Cart
async function addToCart(productId, quantity = 1) {
    try {
        const res = await fetch('/cart/add', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId, quantity })
        });
        const data = await res.json();
        if (data.success) { showToast('محصول به سبد خرید اضافه شد'); updateCartBadge(data.cart_count); }
    } catch (e) { showToast('خطا در افزودن به سبد'); }
}

async function updateCartQty(productId, quantity) {
    try {
        const res = await fetch('/cart/update', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId, quantity })
        });
        const data = await res.json();
        if (data.success) location.reload();
    } catch (e) { showToast('خطا در به‌روزرسانی'); }
}

async function removeCartItem(productId) {
    try {
        const res = await fetch('/cart/remove', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId })
        });
        const data = await res.json();
        if (data.success) location.reload();
    } catch (e) { showToast('خطا در حذف'); }
}

function updateCartBadge(count) {
    const badge = document.querySelector('.cart-badge');
    if (count > 0) {
        if (badge) { badge.textContent = count; }
        else {
            const link = document.querySelector('a.header-icon[href="/cart"]');
            if (link) { const b = document.createElement('span'); b.className = 'cart-badge'; b.textContent = count; link.appendChild(b); }
        }
    } else if (badge) { badge.remove(); }
}

// Mobile menu
document.getElementById('mobileToggle')?.addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.toggle('open');
    document.getElementById('mobileMenuOverlay').classList.toggle('show');
});
document.getElementById('mobileMenuOverlay')?.addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.remove('open');
    document.getElementById('mobileMenuOverlay').classList.remove('show');
});

// Admin login trigger (5 clicks on logo)
let logoClicks = 0, logoTimer;
document.getElementById('siteLogo')?.addEventListener('click', (e) => {
    logoClicks++;
    clearTimeout(logoTimer);
    logoTimer = setTimeout(() => { logoClicks = 0; }, 800);
    if (logoClicks >= 5) {
        e.preventDefault();
        document.getElementById('adminModal').classList.add('show');
        logoClicks = 0;
    }
});
document.getElementById('adminModalClose')?.addEventListener('click', () => {
    document.getElementById('adminModal').classList.remove('show');
});
document.getElementById('adminModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'adminModal') document.getElementById('adminModal').classList.remove('show');
});

// Add to cart buttons
document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const qtyInput = document.getElementById('qtyInput');
        const qty = qtyInput ? parseInt(qtyInput.value) : 1;
        await addToCart(btn.dataset.productId, qty);
    });
});

// Buy now buttons
document.querySelectorAll('.buy-now-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const qtyInput = document.getElementById('qtyInput');
        const qty = qtyInput ? parseInt(qtyInput.value) : 1;
        try {
            await fetch('/cart/add', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_id: btn.dataset.productId, quantity: qty })
            });
            window.location.href = '/checkout';
        } catch (e) { showToast('خطا'); }
    });
});

// Quantity selectors
document.getElementById('qtyMinus')?.addEventListener('click', () => {
    const input = document.getElementById('qtyInput');
    if (parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
});
document.getElementById('qtyPlus')?.addEventListener('click', () => {
    const input = document.getElementById('qtyInput');
    if (parseInt(input.value) < parseInt(input.max)) input.value = parseInt(input.value) + 1;
});

// Account tabs
document.querySelectorAll('.account-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.account-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.querySelectorAll('.account-section').forEach(s => s.classList.remove('active'));
        document.getElementById(tab.dataset.tab)?.classList.add('active');
    });
});

// Scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.section, .product-card, .category-card, .banner-card, .stat-card').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});
