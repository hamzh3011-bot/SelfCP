import { useCallback, useRef, useState } from 'react'
import { useSiteContent } from '../data/siteStore'
import { Icon } from './Icons'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

export default function Destinations() {
  const { destinations } = useSiteContent()
  const railRef = useRef(null)
  const [index, setIndex] = useState(0)

  const move = useCallback(
    (step) => {
      const rail = railRef.current
      if (!rail) return
      const next = Math.min(Math.max(index + step, 0), destinations.length - 1)
      const card = rail.children[next]
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
      setIndex(next)
    },
    [index],
  )

  return (
    <section id="destinations" className="section">
      <div className="shell">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            align="start"
            eyebrow="مقاصد محبوب"
            title="مقصد بعدی شما کجاست؟"
            lead="از شهرهای پرهیجان دنیا تا آرام‌ترین سواحل، مقصد مورد علاقه‌تان را پیدا کنید."
          />
          <Reveal delay={120} className="flex shrink-0 items-center gap-3">
            <button type="button" className="rail-btn" onClick={() => move(-1)} aria-label="مقاصد قبلی">
              <Icon name="arrowRight" size={20} />
            </button>
            <button type="button" className="rail-btn" onClick={() => move(1)} aria-label="مقاصد بعدی">
              <Icon name="arrowLeft" size={20} />
            </button>
          </Reveal>
        </div>
      </div>

      <Reveal delay={180} className="mt-12">
        <div ref={railRef} className="rail pe-[var(--gutter)] ps-[var(--gutter)]">
          {destinations.map((destination, cardIndex) => (
            <a
              key={`${destination.name}-${cardIndex}`}
              href="#packages"
              className="dest-card"
              style={{ width: 'clamp(240px, 72vw, 336px)', aspectRatio: '2 / 3' }}
            >
              <img src={destination.image} alt={`${destination.name}، ${destination.country}`} loading="lazy" />
              <span className="dest-veil" aria-hidden="true" />
              <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-6">
                <span className="t-h3 text-white">{destination.name}</span>
                <span className="text-sm text-white/70">{destination.country}</span>
                <span className="mt-3 text-sm text-white/85">از {destination.price} تومان</span>
                <span className="dest-cta mt-4 text-sm font-semibold text-white">
                  مشاهده مقصد
                  <Icon name="arrowLeft" size={16} />
                </span>
              </span>
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
