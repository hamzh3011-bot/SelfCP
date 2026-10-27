import { useState } from "react";
import Brand from "./Brand.jsx";
import {
  ArrowLeft,
  InstagramIcon,
  MailIcon,
  PinterestIcon,
  TiktokIcon,
} from "./Icons.jsx";

const socials = [
  { label: "اینستاگرام", Icon: InstagramIcon },
  { label: "تیک‌تاک", Icon: TiktokIcon },
  { label: "پینترست", Icon: PinterestIcon },
  { label: "ایمیل", Icon: MailIcon },
];

const legalLinks = ["حریم خصوصی", "قوانین", "تماس با ما"];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

    if (!isValid) {
      setMessage({ type: "error", text: "یک ایمیل معتبر وارد کنید." });
      return;
    }

    setMessage({ type: "success", text: "ثبت شد؛ ممنون از همراهی‌تان." });
    setEmail("");
  };

  return (
    <footer id="footer" className="scroll-mt-4 bg-charcoal text-cream">
      <div className="container-page py-16 sm:py-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <Brand />

          <div className="max-w-md lg:max-w-sm">
            <p className="text-sm font-medium text-cream">عضو خبرنامه ما شوید</p>
            <p className="mt-2 text-xs leading-6 text-cream/55">
              اولین نفری باشید که از نوشیدنی‌ها، رویدادها و خبرهای تازه باخبر
              می‌شود.
            </p>

            <form onSubmit={handleSubmit} className="mt-5" noValidate>
              <label htmlFor="newsletter-email" className="sr-only">
                ایمیل شما
              </label>
              <div className="flex items-center gap-2 rounded-full border border-cream/25 p-1.5 ps-5 transition focus-within:border-cream/50">
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setMessage(null);
                  }}
                  placeholder="ایمیل شما"
                  autoComplete="email"
                  className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-cream placeholder:text-cream/40 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="عضویت در خبرنامه"
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-cream text-espresso transition hover:bg-warm-white"
                >
                  <ArrowLeft className="size-4" />
                </button>
              </div>
              <p
                aria-live="polite"
                className={[
                  "mt-3 min-h-5 text-xs",
                  message?.type === "error" ? "text-caramel-soft" : "text-cream/55",
                ].join(" ")}
              >
                {message?.text ?? ""}
              </p>
            </form>
          </div>

          <div className="flex flex-col gap-6 lg:items-center">
            <ul className="flex items-center gap-3">
              {socials.map(({ label, Icon }) => (
                <li key={label}>
                  <button
                    type="button"
                    aria-label={label}
                    className="grid size-10 place-items-center rounded-full border border-cream/25 text-cream/80 transition hover:border-cream hover:text-cream"
                  >
                    <Icon className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <p className="flex items-start gap-3 text-[0.65rem] leading-6 font-medium tracking-[0.34em] text-cream/50 lg:flex-col lg:items-center lg:gap-1">
            <span>یک</span>
            <span>فردای</span>
            <span>گرم‌تر</span>
            <span aria-hidden="true" className="mt-2 hidden h-px w-8 bg-cream/25 lg:block" />
          </p>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-cream/12 pt-6 text-xs text-cream/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© ۱۴۰۳ هارت کافه. تمامی حقوق محفوظ است.</p>
          <nav aria-label="پیوندهای حقوقی" className="flex items-center gap-6">
            {legalLinks.map((link) => (
              <a
                key={link}
                href="#footer"
                className="transition-colors duration-300 hover:text-cream"
              >
                {link}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
