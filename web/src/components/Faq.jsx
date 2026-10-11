import { useState } from 'react'
import { faqs } from '../data/content'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'

export default function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="section">
      <div className="shell grid gap-14 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
        <SectionHeading
          align="start"
          eyebrow="سوالات متداول"
          title="پاسخ سؤال‌های پرتکرار شما"
          lead="اگر پاسخ خود را پیدا نکردید، پشتیبانی ۲۴ ساعتهٔ ما در کنار شماست."
        />

        <Reveal delay={120} className="lg:pt-2">
          <div>
            {faqs.map((item, index) => {
              const isOpen = open === index
              return (
                <div key={item.q} className="faq-item" data-open={isOpen}>
                  <h3>
                    <button
                      type="button"
                      className="faq-trigger"
                      onClick={() => setOpen(isOpen ? -1 : index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${index}`}
                      id={`faq-trigger-${index}`}
                    >
                      <span>{item.q}</span>
                      <span className="faq-sign" aria-hidden="true" />
                    </button>
                  </h3>
                  <div
                    className="faq-body"
                    id={`faq-panel-${index}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${index}`}
                  >
                    <div>
                      <p className="faq-answer">{item.a}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
