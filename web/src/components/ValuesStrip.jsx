import { valueIcons } from "./Icons.jsx";
import { values } from "../data/site.js";

const dividers = [
  "",
  "border-s border-sand/70",
  "max-lg:border-t max-lg:border-sand/70 lg:border-s lg:border-sand/70",
  "border-s border-sand/70 max-lg:border-t",
];

export default function ValuesStrip() {
  return (
    <section aria-label="ارزش‌های برند" className="bg-cream-deep">
      <ul className="container-page grid grid-cols-2 lg:grid-cols-4">
        {values.map((item, index) => {
          const Icon = valueIcons[item.icon];

          return (
            <li
              key={item.title}
              className={[
                "flex items-start gap-3 px-4 py-8 sm:gap-4 sm:px-6 lg:px-8 lg:py-12",
                dividers[index],
              ].join(" ")}
            >
              <Icon className="size-6 shrink-0 text-caramel sm:size-7" />
              <div>
                <h3 className="text-sm font-semibold text-espresso">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs leading-6 text-ink-soft/75">
                  {item.description}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
