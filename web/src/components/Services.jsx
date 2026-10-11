import { services } from '../data/content'
import { branded, useSiteContent } from '../data/siteStore'
import { Icon } from './Icons'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

export default function Services() {
  const { brand } = useSiteContent()

  return (
    <section id="services" className="section">
      <div className="shell">
        <SectionHeading
          eyebrow={branded('خدمات آسمانه', brand)}
          title="همه چیز برای یک سفر بی‌دغدغه"
          lead="از لحظهٔ انتخاب مقصد تا بازگشت به خانه، هر بخش از سفر شما را به‌سادگی می‌سازیم."
        />

        <div className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 70} className="service">
              <span className="icon-well">
                <Icon name={service.icon} size={26} />
              </span>
              <h3 className="t-h3 mt-6">{service.title}</h3>
              <p className="mt-2 text-ink-soft">{service.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
