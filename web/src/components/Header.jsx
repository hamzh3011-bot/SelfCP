import { useState } from "react";
import Brand from "./Brand.jsx";
import { CloseIcon, MenuIcon, SearchIcon } from "./Icons.jsx";
import { navLinks } from "../data/site.js";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-espresso/45 to-transparent"
      />

      <div className="container-page relative flex items-center justify-between gap-4 py-5 sm:py-7">
        <a href="#home" className="shrink-0" aria-label="هارت کافه، بازگشت به بالای صفحه">
          <Brand />
        </a>

        <nav aria-label="منوی اصلی" className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-cream/80 transition-colors duration-300 hover:text-cream"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="جست‌وجو"
            className="hidden size-10 place-items-center rounded-full text-cream/85 transition hover:bg-cream/10 hover:text-cream sm:grid"
          >
            <SearchIcon />
          </button>

          <a
            href="#footer"
            className="hidden rounded-full bg-warm-white px-5 py-2.5 text-sm font-medium text-espresso shadow-[0_10px_30px_-12px_rgba(0,0,0,0.65)] transition duration-300 hover:-translate-y-0.5 hover:bg-cream sm:inline-block"
          >
            رزرو میز
          </a>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "بستن منو" : "باز کردن منو"}
            className="grid size-10 place-items-center rounded-full border border-cream/30 text-cream transition hover:bg-cream/10 lg:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="container-page relative lg:hidden"
        >
          <nav
            aria-label="منوی موبایل"
            className="mt-1 rounded-3xl border border-cream/15 bg-charcoal/95 p-3 shadow-2xl backdrop-blur-md"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3 text-sm text-cream/85 transition hover:bg-cream/10 hover:text-cream"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#footer"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-2xl bg-warm-white px-4 py-3 text-center text-sm font-medium text-espresso sm:hidden"
            >
              رزرو میز
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
