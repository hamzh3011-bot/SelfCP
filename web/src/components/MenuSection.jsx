import ProductCard from "./ProductCard.jsx";
import { ArrowLeft } from "./Icons.jsx";
import { products } from "../data/site.js";

export default function MenuSection() {
  return (
    <section id="menu" className="scroll-mt-4 bg-cream py-20 sm:py-24 lg:py-28">
      <div className="container-page">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow text-caramel">منوی ما</p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.2rem)] leading-tight font-extrabold tracking-tight text-espresso">
              طعم‌های محبوب این فصل
            </h2>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-8">
            <p className="max-w-[22rem] text-sm leading-7 text-ink-soft/85">
              با وسواس آماده می‌شوند؛ از کلاسیک‌های پرطرفدار تا طعم‌های فصلی تازه
              برای هر سلیقه.
            </p>
            <a
              href="#menu"
              className="group inline-flex shrink-0 items-center gap-3 self-start rounded-full border border-espresso/25 px-5 py-2.5 text-sm text-espresso transition duration-300 hover:border-espresso hover:bg-espresso hover:text-cream sm:self-auto"
            >
              مشاهده منوی کامل
              <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
            </a>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
