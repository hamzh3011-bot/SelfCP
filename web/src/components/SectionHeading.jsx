import Reveal from './Reveal'

export default function SectionHeading({ eyebrow, title, lead, align = 'center', className = '' }) {
  const centered = align === 'center'
  return (
    <div className={`${centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'} ${className}`}>
      {eyebrow ? (
        <Reveal as="p" className="t-eyebrow">
          {eyebrow}
        </Reveal>
      ) : null}
      <Reveal as="h2" delay={80} className="t-h2 mt-4">
        {title}
      </Reveal>
      {lead ? (
        <Reveal as="p" delay={160} className="t-lead mt-5">
          {lead}
        </Reveal>
      ) : null}
    </div>
  )
}
