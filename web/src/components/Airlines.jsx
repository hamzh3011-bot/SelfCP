import { airlines } from '../data/content'
import Reveal from './Reveal'

/** Neutral geometric roundel — a minimalist stand-in for each carrier's mark. */
function Roundel() {
  return (
    <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M6.5 19.4c3.6-1 6.2-3 8.1-6 1-1.6 1.7-3.4 2.1-5.4l1.3-.3c-.3 2.6-1 5-2.4 7.2l6.5 2-1.3 1.3-7.3-1c-1.4 1.6-3 3-4.6 4l-2.4-1.8Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function Airlines() {
  return (
    <section className="section pt-0">
      <div className="shell">
        <Reveal as="p" className="t-eyebrow text-center">
          همکاران پروازی ما
        </Reveal>
      </div>

      <Reveal delay={100} className="marquee mt-10">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {airlines.map((airline) => (
                <span
                  key={`${copy}-${airline.latin}`}
                  className="airline mx-7 flex items-center gap-3 text-ink-soft"
                >
                  <Roundel />
                  <span className="flex flex-col leading-tight">
                    <span className="text-lg font-semibold tracking-wide">{airline.latin}</span>
                    <span className="text-xs opacity-70">{airline.name}</span>
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
