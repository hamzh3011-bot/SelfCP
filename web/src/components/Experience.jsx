import { experience } from '../data/content'
import { Icon } from './Icons'
import Reveal from './Reveal'

export default function Experience() {
  return (
    <section id="experiences" className="section">
      <div className="shell grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative">
          <img
            src={experience.image}
            alt="نمای بال هواپیما از پنجرهٔ کابین بالای ابرها"
            className="squircle w-full object-cover shadow-soft"
            style={{ aspectRatio: '4 / 5' }}
            loading="lazy"
          />
          <span className="glass-panel float-slow absolute bottom-6 start-6 flex items-center gap-3 rounded-squircle px-5 py-4">
            <Icon name="plane" size={22} style={{ color: 'var(--color-aero-600)' }} />
            <span className="text-sm font-semibold">همراهی کارشناس سفر، در تمام مسیر</span>
          </span>
        </Reveal>

        <div>
          <Reveal as="p" className="t-eyebrow">
            {experience.eyebrow}
          </Reveal>
          <Reveal as="h2" delay={80} className="t-h2 mt-4">
            {experience.title}
          </Reveal>
          <Reveal as="p" delay={160} className="t-lead mt-5">
            {experience.text}
          </Reveal>

          <ul className="mt-8 flex flex-col gap-4">
            {experience.points.map((point, index) => (
              <Reveal as="li" key={point} delay={240 + index * 80} className="flex items-center gap-3">
                <span className="icon-well h-9 w-9 rounded-full">
                  <Icon name="shield" size={18} />
                </span>
                <span>{point}</span>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={420} className="mt-9">
            <a className="btn btn-primary" href="#services">
              {experience.cta}
              <Icon name="arrowLeft" size={18} />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
