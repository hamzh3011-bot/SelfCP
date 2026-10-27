import { useEffect, useRef, useState } from "react";
import { CheckIcon, PlusIcon } from "./Icons.jsx";

export default function ProductCard({ product }) {
  const [added, setAdded] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleAdd = () => {
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1800);
  };

  return (
    <article className="group flex h-full flex-col rounded-[1.7rem] border border-espresso/8 bg-warm-white p-3 transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_60px_-40px_rgba(44,38,33,0.55)]">
      <div className="overflow-hidden rounded-[1.35rem] bg-cream-deep">
        <img
          src={product.image}
          alt={product.alt}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-1 flex-col px-2 pt-5 pb-2">
        <p className="text-[0.6rem] font-medium tracking-[0.28em] text-caramel">
          {product.category}
        </p>
        <h3 className="mt-2 font-display text-lg font-bold text-espresso">
          {product.name}
        </h3>
        <p className="mt-1.5 text-xs leading-6 text-ink-soft/80">
          {product.description}
        </p>

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-espresso/8 pt-4">
          <p className="text-sm font-semibold text-espresso">
            {product.price}
            <span className="mr-1.5 text-[0.65rem] font-normal text-ink-soft/70">
              تومان
            </span>
          </p>

          <button
            type="button"
            onClick={handleAdd}
            aria-label={`افزودن ${product.name} به سفارش`}
            className={[
              "grid size-9 place-items-center rounded-full border transition duration-300",
              added
                ? "border-caramel bg-caramel text-warm-white"
                : "border-espresso/15 bg-warm-white text-espresso hover:border-espresso hover:bg-espresso hover:text-cream",
            ].join(" ")}
          >
            {added ? <CheckIcon /> : <PlusIcon />}
          </button>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {added ? `${product.name} به سبد نمایشی اضافه شد` : ""}
      </p>
    </article>
  );
}
