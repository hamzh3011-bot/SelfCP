import Header from "./Header.jsx";
import { ArrowLeft, PlayIcon } from "./Icons.jsx";
import { heroStats } from "../data/site.js";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-[42rem] flex-col overflow-hidden bg-espresso lg:min-h-[88vh]"
    >
      <img
        src="/images/hero-cafe.svg"
        alt="فضای داخلی گرم و روشن هارت کافه با میز چوبی و فنجان قهوه"
        className="absolute inset-0 size-full object-cover object-center"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_left,rgba(32,28,25,0.93)_0%,rgba(32,28,25,0.78)_30%,rgba(32,28,25,0.34)_62%,rgba(32,28,25,0.12)_100%)]"
      />

      <Header />

      <div className="container-page relative flex flex-1 flex-col justify-center pt-32 pb-10 sm:pt-36 lg:pt-40">
        <div className="max-w-[38rem] text-cream">
          <p className="eyebrow text-cream/75">قهوه تخصصی • فردایی گرم‌تر</p>

          <h1 className="mt-6 font-display text-[clamp(2.5rem,5.6vw,4.6rem)] leading-[1.15] font-extrabold tracking-tight">
            <span className="block">بیشتر از یک</span>
            <span className="block">فنجان قهوه</span>
          </h1>

          <p className="mt-6 max-w-[26rem] text-sm leading-8 text-cream/80 sm:text-base">
            دانه‌های منتخب، طعم‌های فصلی و فضایی دنج برای مکث و لذت بردن.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
            <a
              href="#menu"
              className="group inline-flex items-center gap-3 rounded-full bg-warm-white px-6 py-3.5 text-sm font-medium text-espresso shadow-[0_18px_40px_-18px_rgba(0,0,0,0.8)] transition duration-300 hover:-translate-y-0.5 hover:bg-cream"
            >
              مشاهده منو
              <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
            </a>

            <a
              href="#story"
              className="group inline-flex items-center gap-3 rounded-full px-2 py-2 text-sm text-cream/90 transition hover:text-cream"
            >
              <span className="grid size-10 place-items-center rounded-full bg-warm-white text-espresso transition duration-300 group-hover:bg-cream">
                <PlayIcon />
              </span>
              داستان کافه
            </a>
          </div>
        </div>

        <p
          aria-hidden="true"
          className="absolute bottom-40 left-6 hidden text-[0.65rem] tracking-[0.5em] text-cream/60 [writing-mode:vertical-rl] xl:block"
        >
          قهوه خوب، روز روشن‌تر
        </p>
      </div>

      <div className="relative border-t border-cream/25 bg-cream/90 backdrop-blur-md">
        <dl className="container-page grid grid-cols-3 [&>*+*]:border-s [&>*+*]:border-espresso/15">
          {heroStats.map((stat) => (
            <div key={stat.label} className="px-2 py-5 text-center sm:py-6">
              <dt className="text-[0.65rem] tracking-[0.18em] text-ink-soft sm:text-xs">
                {stat.label}
              </dt>
              <dd className="mt-1.5 font-display text-lg font-bold text-espresso sm:text-2xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
