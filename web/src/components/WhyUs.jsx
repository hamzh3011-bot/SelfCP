import { whyUs } from '../data/content'
import { branded, useSiteContent } from '../data/siteStore'
import { Icon } from './Icons'
import Reveal from './Reveal'

export default function WhyUs() {
  const { brand } = useSiteContent()

  return (
    <section id="about" className="section">
      <div className="shell grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal as="p" className="t-eyebrow">
            {branded('چرا آسمانه', brand)}
          </Reveal>
          <Reveal as="h2" delay={80} className="t-h2 mt-4">
            سفر، وقتی بهتر است که خیالتان راحت باشد
          </Reveal>
          <Reveal as="p" delay={160} className="t-lead mt-5">
            پشت هر رزرو، تیمی از کارشناسان سفر ایستاده‌اند که مسیر شما را می‌شناسند و جزئیات را پیش از شما
            می‌سنجند.
          </Reveal>
          <Reveal delay={240} className="mt-8">
            <span className="float-slow inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-soft">
              <Icon name="sparkle" size={20} style={{ color: 'var(--color-aero-600)' }} />
              <span className="text-sm font-semibold">رضایت ۹۸٪ مسافران در سال گذشته</span>
            </span>
          </Reveal>
        </div>

        <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {whyUs.map((feature, index) => (
            <Reveal as="li" key={feature.title} delay={index * 70}>
              <span className="icon-well">
                <Icon name={feature.icon} size={24} />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-ink-soft">{feature.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
