import { hero } from '../data/content'
import { Icon } from './Icons'
import Reveal from './Reveal'
import FlightSearch from './FlightSearch'

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-media" aria-hidden="true">
        <video autoPlay muted loop playsInline preload="metadata" poster="/media/hero-poster.jpg">
          <source src="/media/hero.mp4" type="video/mp4" />
        </video>
        <img src="/media/hero-poster.jpg" alt="" />
      </div>
      <div className="hero-scrim" aria-hidden="true" />

      <div className="hero-copy">
        <div className="shell max-w-4xl">
          <Reveal>
            <p className="hero-kicker">{hero.kicker}</p>
          </Reveal>

          <Reveal delay={120} as="h1" className="t-display ink-shadow mt-5 text-white text-balance">
            {hero.title}
          </Reveal>

          <Reveal delay={240} as="p" className="ink-shadow mx-auto mt-6 max-w-2xl text-lg text-white/85">
            {hero.lead}
          </Reveal>

          <Reveal
            delay={360}
            className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
          >
            <a className="btn btn-primary" href="#search">
              {hero.primaryCta}
            </a>
            <a className="btn btn-glass" href="#destinations">
              <Icon name="compass" size={19} />
              {hero.secondaryCta}
            </a>
          </Reveal>
        </div>
      </div>

      <div className="search-dock" id="search">
        <div className="shell">
          <Reveal delay={460}>
            <FlightSearch />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
