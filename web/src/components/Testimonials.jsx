import { testimonials } from '../data/content'
import Clouds from './Clouds'
import { Icon } from './Icons'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

/** "۴٫۵" → 4.5 */
function toLatinNumber(value) {
  return Number(value.replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))).replace('٫', '.'))
}

const layers = [
  { width: '34rem', height: '12rem', top: '8%', start: '-8rem', opacity: 0.55, blur: '10px', duration: 120 },
  { width: '26rem', height: '9rem', top: '42%', start: '60%', opacity: 0.45, blur: '14px', duration: 150, delay: 8 },
  { width: '30rem', height: '11rem', top: '72%', start: '12%', opacity: 0.6, blur: '8px', duration: 135, delay: 4 },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="sky-band section">
      <Clouds layers={layers} />

      <div className="shell relative z-10">
        <SectionHeading
          eyebrow="تجربهٔ مسافران"
          title="مسافرانی که به ما اعتماد کردند"
          lead="روایت‌های واقعی از سفرهایی که با آسمانه آغاز شدند."
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((person, index) => (
            <Reveal key={person.name} delay={index * 90}>
              <figure className="glass-card squircle flex h-full flex-col p-7">
                <div className="flex items-center gap-4">
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="h-14 w-14 rounded-full object-cover"
                    loading="lazy"
                  />
                  <figcaption className="flex flex-col">
                    <span className="font-semibold">{person.name}</span>
                    <span className="text-sm text-ink-soft">{person.destination}</span>
                  </figcaption>
                </div>

                <div className="mt-5 flex items-center gap-1" aria-label={`امتیاز ${person.rating} از ۵`}>
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Icon
                      key={star}
                      name="star"
                      size={16}
                      style={{ color: star < Math.round(toLatinNumber(person.rating)) ? '#FBBF24' : '#EAF2F6' }}
                    />
                  ))}
                  <span className="ms-2 text-sm font-semibold">{person.rating}</span>
                </div>

                <blockquote className="mt-5 text-ink-soft">«{person.text}»</blockquote>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
