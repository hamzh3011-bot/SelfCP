import { footer } from '../data/content'
import { Icon, Logo } from './Icons'
import Reveal from './Reveal'

export default function Footer() {
  return (
    <footer id="footer" className="horizon pt-20">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
          <Reveal>
            <Logo tone="dark" />
            <p className="mt-6 max-w-sm text-sm text-ink-soft">{footer.about}</p>
          </Reveal>

          {footer.columns.map((column, index) => (
            <Reveal key={column.title} delay={80 + index * 70}>
              <h3 className="text-sm font-semibold">{column.title}</h3>
              <ul className="mt-5 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a className="link-rule text-sm text-ink-soft hover:text-aero-700" href="#hero">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}

          <Reveal delay={220}>
            <h3 className="text-sm font-semibold">تماس با ما</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {footer.contact.map((item) => (
                <li key={item.label} className="flex items-center gap-2.5 text-sm text-ink-soft">
                  <Icon name={item.icon} size={17} />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>

            <h3 className="mt-8 text-sm font-semibold">شبکه‌های اجتماعی</h3>
            <ul className="mt-4 flex flex-wrap gap-3">
              {footer.social.map((item) => (
                <li key={item}>
                  <a
                    className="inline-flex min-h-11 items-center rounded-full border border-cloudgray bg-white/70 px-4 text-sm text-ink-soft transition-colors hover:border-aero-400 hover:text-aero-700"
                    href="#footer"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-cloudgray py-8 sm:flex-row">
          <p className="text-sm text-ink-soft">{footer.copyright}</p>
          <p className="text-sm text-ink-soft">© ۱۴۰۴ آسمانه</p>
        </div>
      </div>
      <div className="horizon-line" aria-hidden="true" />
    </footer>
  )
}
