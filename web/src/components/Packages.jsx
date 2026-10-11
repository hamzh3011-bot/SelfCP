import { packages } from '../data/content'
import { Icon } from './Icons'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

export default function Packages() {
  return (
    <section id="packages" className="section">
      <div className="shell">
        <SectionHeading
          eyebrow="تورهای منتخب"
          title="تورهایی که همه‌چیزشان از پیش چیده شده"
          lead="هتل، ترانسفر و برنامهٔ سفر آماده است؛ شما فقط انتخاب کنید کجا می‌خواهید بیدار شوید."
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((item, index) => (
            <Reveal key={item.title} delay={index * 90}>
              <article className="pkg-card h-full">
                <figure>
                  <img src={item.image} alt={item.title} loading="lazy" />
                </figure>

                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="t-h3">{item.title}</h3>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                      <Icon name="star" size={16} style={{ color: '#FBBF24' }} />
                      {item.rating}
                    </span>
                  </div>

                  <dl className="mt-5 flex flex-col gap-2 text-sm text-ink-soft">
                    <div className="flex items-center gap-2">
                      <Icon name="compass" size={17} />
                      <dt className="sr-only">مدت سفر</dt>
                      <dd>{item.duration}</dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="bed" size={17} />
                      <dt className="sr-only">هتل</dt>
                      <dd>{item.hotel}</dd>
                    </div>
                  </dl>

                  <div className="mt-7 flex items-end justify-between gap-4 border-t border-cloudgray pt-6">
                    <p className="flex flex-col">
                      <span className="text-xs text-ink-soft">شروع قیمت از</span>
                      <span className="text-lg font-bold">{item.price} تومان</span>
                    </p>
                    <a className="btn btn-ghost btn-sm" href="#newsletter">
                      {item.cta}
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
