import { stats } from '../data/content'
import { useCountUp, useInView } from '../hooks'
import Reveal from './Reveal'

function Stat({ item, active }) {
  const value = useCountUp(item.value, active)
  return (
    <div className="text-center">
      <p className="text-[clamp(2.25rem,5.2vw,3.6rem)] font-light leading-none tracking-tight">
        {`${item.suffix}${value.toLocaleString('fa-IR')}`}
      </p>
      <p className="mt-4 text-sm font-semibold tracking-[0.12em] text-ink-soft">{item.label}</p>
    </div>
  )
}

export default function Stats() {
  const [ref, inView] = useInView()

  return (
    <section id="stats" className="section pt-0">
      <div className="shell">
        <Reveal>
          <div
            ref={ref}
            className="glass-card squircle grid gap-12 px-8 py-14 sm:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map((item) => (
              <Stat key={item.label} item={item} active={inView} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
