export default function Brand({ tone = "light", size = "md" }) {
  const isLight = tone === "light";

  return (
    <span className="flex flex-col leading-none">
      <span
        className={[
          "font-display font-extrabold tracking-tight",
          size === "md" ? "text-xl sm:text-2xl" : "text-lg",
          isLight ? "text-cream" : "text-cream",
        ].join(" ")}
      >
        هارت کافه
      </span>
      <span
        className={[
          "mt-2 font-medium text-[0.6rem] tracking-[0.42em] opacity-80",
          isLight ? "text-cream" : "text-cream",
        ].join(" ")}
      >
        قهوه تخصصی
      </span>
    </span>
  );
}
