import { articles } from '../data/content'
import { Icon } from './Icons'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

export default function Inspiration() {
  return (
    <section id="inspiration" className="section">
      <div className="shell">
        <SectionHeading
          align="start"
          eyebrow="مجلهٔ سفر"
          title="الهام‌بخش سفر بعدی شما"
          lead="راهنماها و روایت‌هایی که پیش از بستن چمدان، بهتر است بخوانید."
        />

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {articles.map((article, index) => (
            <Reveal key={article.title} delay={index * 80}>
              <article className="group h-full">
                <a href="#newsletter" className="block text-inherit no-underline">
                  <span className="squircle block overflow-hidden" style={{ aspectRatio: '5 / 4' }}>
                    <img
                      src={article.image}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-[1300ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      loading="lazy"
                    />
                  </span>

                  <span className="mt-6 flex items-center gap-3 text-xs text-ink-soft">
                    <span className="font-semibold" style={{ color: 'var(--color-aero-600)' }}>
                      {article.category}
                    </span>
                    <span aria-hidden="true">•</span>
                    <span>{article.readTime}</span>
                  </span>

                  <h3 className="t-h3 mt-3 transition-colors duration-300 group-hover:text-aero-700">
                    {article.title}
                  </h3>

                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink-soft">
                    خواندن مقاله
                    <Icon name="arrowLeft" size={16} />
                  </span>
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
