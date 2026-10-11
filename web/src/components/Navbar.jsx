import { useEffect, useState } from 'react'
import { navLinks } from '../data/content'
import { Icon, Logo } from './Icons'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('#hero')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Keep the menu from scrolling behind the open mobile sheet.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const ids = navLinks.map((link) => link.href.slice(1))
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!sections.length || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(`#${visible.target.id}`)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.15, 0.5] },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
        <div className="nav-inner">
          <a href="#hero" className="shrink-0" aria-label="آسمانه — صفحه اصلی">
            <Logo tone={scrolled ? 'dark' : 'light'} />
          </a>

          <nav className="mx-auto hidden items-center gap-0.5 lg:flex" aria-label="ناوبری اصلی">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`nav-link${active === link.href ? ' is-active' : ''}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="ms-auto flex items-center gap-2 lg:ms-0">
            <a className="nav-link hidden sm:inline-flex" href="#footer">
              ورود / ثبت‌نام
            </a>
            <a className="btn btn-primary btn-sm" href="#search">
              رزرو بلیط
            </a>
            <button
              type="button"
              className="nav-icon-btn lg:hidden"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-label={open ? 'بستن منو' : 'باز کردن منو'}
            >
              <Icon name={open ? 'close' : 'menu'} size={22} />
            </button>
          </div>
        </div>
      </header>

      <div className={`nav-mobile lg:hidden${open ? ' is-open' : ''}`}>
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
        <a href="#footer" onClick={() => setOpen(false)}>
          ورود / ثبت‌نام
        </a>
        <a
          className="btn btn-primary mt-6"
          href="#search"
          onClick={() => setOpen(false)}
          style={{ color: '#fff' }}
        >
          رزرو بلیط
        </a>
      </div>
    </>
  )
}
