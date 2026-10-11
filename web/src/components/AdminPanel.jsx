import { useEffect, useState } from 'react'
import { removeById, resetSite, setBrand, useSiteContent } from '../data/siteStore'
import CollectionEditor from './CollectionEditor'
import { Icon, Logo } from './Icons'

const TABS = [
  { id: 'brand', label: 'برند و تنظیمات', icon: 'sliders' },
  { id: 'destinations', label: 'مقاصد', icon: 'globe' },
  { id: 'packages', label: 'تورها', icon: 'compass' },
  { id: 'testimonials', label: 'نظرات مسافران', icon: 'users' },
  { id: 'bookings', label: 'رزروها', icon: 'plane' },
  { id: 'subscribers', label: 'خبرنامه', icon: 'mail' },
]

const toFa = (value) => String(value).replace(/[0-9]/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)])

function faDate(iso) {
  if (!iso) return '—'
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('fa-IR')
}

function faStamp(ts) {
  const date = new Date(ts)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('fa-IR', { dateStyle: 'short', timeStyle: 'short' })
}

function BrandTab({ brand }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="admin-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-ink-soft">پیش‌نمایش نام سایت</p>
          <p className="mt-1 text-lg font-bold">{brand.name}</p>
        </div>
        <div className="rounded-2xl bg-ink px-4 py-3">
          <Logo tone="light" name={brand.name} latin={brand.latin} />
        </div>
      </div>

      <div className="admin-grid admin-grid-2">
        <div className="admin-field">
          <label className="field-label" htmlFor="admin-brand-name">
            نام سایت (فارسی)
          </label>
          <input
            id="admin-brand-name"
            className="field-control"
            value={brand.name}
            onChange={(event) => setBrand({ name: event.target.value })}
          />
        </div>
        <div className="admin-field">
          <label className="field-label" htmlFor="admin-brand-latin">
            نام لاتین
          </label>
          <input
            id="admin-brand-latin"
            className="field-control"
            dir="ltr"
            value={brand.latin}
            onChange={(event) => setBrand({ latin: event.target.value })}
          />
        </div>
      </div>

      <div className="admin-field">
        <label className="field-label" htmlFor="admin-brand-tagline">
          شعار سایت
        </label>
        <input
          id="admin-brand-tagline"
          className="field-control"
          value={brand.tagline}
          onChange={(event) => setBrand({ tagline: event.target.value })}
        />
      </div>

      <div className="admin-field">
        <label className="field-label" htmlFor="admin-brand-about">
          معرفی سایت (متن فوتر)
        </label>
        <textarea
          id="admin-brand-about"
          className="field-control admin-textarea"
          value={brand.about}
          onChange={(event) => setBrand({ about: event.target.value })}
        />
      </div>

      <p className="text-xs text-ink-soft">
        نام سایت بلافاصله در لوگو، فوتر و عنوان مرورگر به‌روز می‌شود.
      </p>
    </div>
  )
}

function BookingsTab({ bookings }) {
  if (!bookings.length) {
    return <p className="admin-card text-sm text-ink-soft">هنوز درخواست رزروی ثبت نشده است.</p>
  }

  return (
    <ul className="flex flex-col gap-4">
      {bookings.map((booking) => (
        <li key={booking.id} className="admin-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-bold">
              {booking.from} ← {booking.to}
            </p>
            <button
              type="button"
              className="admin-danger"
              onClick={() => removeById('bookings', booking.id)}
              aria-label="حذف رزرو"
            >
              <Icon name="trash" size={16} />
              حذف
            </button>
          </div>

          <dl className="mt-3 grid gap-2 text-sm text-ink-soft sm:grid-cols-2">
            <div className="flex gap-2">
              <dt className="font-semibold">تاریخ رفت:</dt>
              <dd>{faDate(booking.depart)}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold">تاریخ برگشت:</dt>
              <dd>{faDate(booking.back)}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold">مسافران:</dt>
              <dd>{booking.passengers || '—'}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold">کلاس پروازی:</dt>
              <dd>{booking.cabin || '—'}</dd>
            </div>
          </dl>

          <p className="mt-3 text-xs text-ink-soft">ثبت شده در {faStamp(booking.createdAt)}</p>
        </li>
      ))}
    </ul>
  )
}

function SubscribersTab({ subscribers }) {
  if (!subscribers.length) {
    return <p className="admin-card text-sm text-ink-soft">هنوز عضوی در خبرنامه ثبت نشده است.</p>
  }

  return (
    <ul className="flex flex-col gap-3">
      {subscribers.map((item) => (
        <li key={item.id} className="admin-card flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold" dir="ltr">
              {item.email}
            </p>
            <p className="mt-1 text-xs text-ink-soft">{faStamp(item.createdAt)}</p>
          </div>
          <button
            type="button"
            className="admin-danger"
            onClick={() => removeById('subscribers', item.id)}
            aria-label="حذف عضو خبرنامه"
          >
            <Icon name="trash" size={16} />
            حذف
          </button>
        </li>
      ))}
    </ul>
  )
}

export default function AdminPanel({ open, onClose }) {
  const content = useSiteContent()
  const [tab, setTab] = useState('brand')
  const [confirmReset, setConfirmReset] = useState(false)

  // Escape closes the panel and the page behind it stays put while it is open.
  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [open, onClose])

  // A reset confirmation should not survive closing the panel.
  useEffect(() => {
    if (!open) setConfirmReset(false)
  }, [open])

  if (!open) return null

  return (
    <div className="admin-overlay" role="dialog" aria-modal="true" aria-label="پنل مدیریت">
      <div className="admin-panel">
        <header className="admin-head">
          <div className="flex items-center gap-3">
            <span className="admin-badge">
              <Icon name="sliders" size={19} />
            </span>
            <div>
              <h2 className="text-base font-bold">پنل مدیریت {content.brand.name}</h2>
              <p className="text-xs text-ink-soft">هر تغییر بلافاصله روی سایت ذخیره می‌شود.</p>
            </div>
          </div>
          <button type="button" className="admin-close" onClick={onClose} aria-label="بستن پنل مدیریت">
            <Icon name="close" size={20} />
          </button>
        </header>

        <nav className="admin-tabs" aria-label="بخش‌های پنل مدیریت">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`admin-tab${tab === item.id ? ' is-active' : ''}`}
              onClick={() => setTab(item.id)}
            >
              <Icon name={item.icon} size={17} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="admin-body">
          {tab === 'brand' && <BrandTab brand={content.brand} />}

          {tab === 'destinations' && (
            <CollectionEditor
              collection="destinations"
              addLabel="افزودن مقصد"
              blank={{ name: '', country: '', price: '', image: '/media/destination-dubai.jpg' }}
              fields={[
                { key: 'name', label: 'نام مقصد' },
                { key: 'country', label: 'کشور' },
                { key: 'price', label: 'شروع قیمت (تومان)' },
                { key: 'image', label: 'نشانی تصویر', dir: 'ltr' },
              ]}
            />
          )}

          {tab === 'packages' && (
            <CollectionEditor
              collection="packages"
              addLabel="افزودن تور"
              blank={{
                title: '',
                duration: '',
                hotel: '',
                rating: '۵',
                price: '',
                image: '/media/package-dubai.jpg',
                cta: 'مشاهده تور',
              }}
              fields={[
                { key: 'title', label: 'عنوان تور' },
                { key: 'duration', label: 'مدت سفر' },
                { key: 'hotel', label: 'هتل' },
                { key: 'rating', label: 'امتیاز' },
                { key: 'price', label: 'قیمت (تومان)' },
                { key: 'image', label: 'نشانی تصویر', dir: 'ltr' },
                { key: 'cta', label: 'متن دکمه' },
              ]}
            />
          )}

          {tab === 'testimonials' && (
            <CollectionEditor
              collection="testimonials"
              addLabel="افزودن نظر"
              blank={{ name: '', destination: '', rating: '۵', text: '', avatar: '/media/avatar-1.jpg' }}
              fields={[
                { key: 'name', label: 'نام مسافر' },
                { key: 'destination', label: 'مقصد سفر' },
                { key: 'rating', label: 'امتیاز' },
                { key: 'avatar', label: 'نشانی تصویر', dir: 'ltr' },
                { key: 'text', label: 'متن نظر', multiline: true },
              ]}
            />
          )}

          {tab === 'bookings' && <BookingsTab bookings={content.bookings} />}

          {tab === 'subscribers' && <SubscribersTab subscribers={content.subscribers} />}
        </div>

        <footer className="admin-foot">
          <p className="text-xs text-ink-soft">
            برای باز کردن پنل، پنج بار روی نام سایت در نوار بالا بزنید.
          </p>
          {confirmReset ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  resetSite()
                  setConfirmReset(false)
                }}
              >
                بله، بازنشانی کن
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirmReset(false)}>
                انصراف
              </button>
            </div>
          ) : (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirmReset(true)}>
              بازنشانی به حالت اولیه
            </button>
          )}
        </footer>
      </div>
    </div>
  )
}
