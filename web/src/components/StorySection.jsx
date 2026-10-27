import { ArrowLeft } from "./Icons.jsx";

export default function StorySection() {
  return (
    <section id="story" className="scroll-mt-4 bg-charcoal">
      <div className="grid lg:min-h-[34rem] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.35fr)_minmax(0,0.6fr)]">
        <div className="flex flex-col justify-center bg-charcoal px-6 py-14 sm:px-10 lg:px-12 lg:py-16 xl:px-16">
          <p className="eyebrow text-cream/55">داستان ما</p>
          <h2 className="mt-5 font-display text-[clamp(1.9rem,3.2vw,2.8rem)] leading-[1.25] font-extrabold tracking-tight text-cream">
            جایی برای آدم‌ها و لحظه‌های خوب
          </h2>
          <p className="mt-6 max-w-[30rem] text-sm leading-8 text-cream/65">
            هارت کافه با یک ایده ساده شروع شد؛ قهوه خوب آدم‌ها را به هم نزدیک
            می‌کند. اینجا فضایی ساخته‌ایم برای گفت‌وگوهای واقعی، روزهای آرام‌تر و
            فردایی روشن‌تر.
          </p>

          <a
            href="#home"
            className="group mt-9 inline-flex w-fit items-center gap-3 rounded-full border border-cream/35 px-6 py-3 text-sm text-cream transition duration-300 hover:border-cream hover:bg-cream hover:text-espresso"
          >
            داستان ما
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
          </a>
        </div>

        <div className="relative min-h-[20rem] sm:min-h-[26rem] lg:min-h-full">
          <img
            src="/images/story-table.svg"
            alt="میز چوبی کافه با فنجان لاته، کتاب و گلدان سبز در نور گرم بعدازظهر"
            className="absolute inset-0 size-full object-cover"
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-6 bg-cream-deep px-6 py-12 text-center lg:py-16">
          <p className="flex flex-col gap-2 text-[0.65rem] leading-6 font-medium tracking-[0.38em] text-espresso/75">
            <span>آدم‌های خوب</span>
            <span>قهوه خوب</span>
          </p>
          <span aria-hidden="true" className="h-px w-8 bg-espresso/25" />
          <p className="text-[0.65rem] leading-6 tracking-[0.14em] text-espresso/55">
            همیشه فردایی گرم‌تر.
          </p>
        </div>
      </div>
    </section>
  );
}
