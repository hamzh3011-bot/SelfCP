const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
  focusable: "false",
};

export function ArrowLeft({ className = "size-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M19 12H5" />
      <path d="m11 6-6 6 6 6" />
    </svg>
  );
}

export function SearchIcon({ className = "size-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

export function PlayIcon({ className = "size-3.5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M9 6.5a1 1 0 0 1 1.53-.85l7 4.65a1 1 0 0 1 0 1.67l-7 4.65A1 1 0 0 1 9 15.77Z" />
    </svg>
  );
}

export function PlusIcon({ className = "size-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={1.7}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function CheckIcon({ className = "size-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={1.7}>
      <path d="m5 13 4.5 4.5L19 7" />
    </svg>
  );
}

export function MenuIcon({ className = "size-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon({ className = "size-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function LeafIcon({ className = "size-7" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} {...base}>
      <path d="M26 6c0 9.5-5.6 15-14 15H7c0-9 5.7-15 14-15Z" />
      <path d="M6 27c3.2-6.4 7.6-10.6 13.5-13" />
    </svg>
  );
}

export function BlossomIcon({ className = "size-7" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} {...base}>
      <circle cx="16" cy="16" r="2.4" />
      <path d="M16 13.6c0-3.7-2.2-6.6-5-6.6s-3.9 3.2-1.8 5.6" />
      <path d="M18.4 16c3.7 0 6.6-2.2 6.6-5s-3.2-3.9-5.6-1.8" />
      <path d="M16 18.4c0 3.7 2.2 6.6 5 6.6s3.9-3.2 1.8-5.6" />
      <path d="M13.6 16c-3.7 0-6.6 2.2-6.6 5s3.2 3.9 5.6 1.8" />
    </svg>
  );
}

export function HouseIcon({ className = "size-7" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} {...base}>
      <path d="m5 14 11-8.5L27 14" />
      <path d="M8 12.6V26h16V12.6" />
      <path d="M13.5 26v-6.4h5V26" />
    </svg>
  );
}

export function CupIcon({ className = "size-7" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} {...base}>
      <path d="M7 10h14v8.5A5.5 5.5 0 0 1 15.5 24h-3A5.5 5.5 0 0 1 7 18.5Z" />
      <path d="M21 12.5h2.2a3.3 3.3 0 0 1 0 6.6H21" />
      <path d="M10.5 6.5c0-1.4 1.4-1.7 1.4-3M15 6.5c0-1.4 1.4-1.7 1.4-3" />
    </svg>
  );
}

export function InstagramIcon({ className = "size-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="3.6" />
      <path d="M16.6 7.5h.01" />
    </svg>
  );
}

export function TiktokIcon({ className = "size-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M14.6 3h2.1c.2 1.7 1.3 3 2.9 3.4v2.1c-1.1.1-2.2-.2-3.1-.8v6.4a5.3 5.3 0 1 1-5.3-5.3c.3 0 .5 0 .8.1v2.2a3.2 3.2 0 1 0 2.2 3V3Z" />
    </svg>
  );
}

export function PinterestIcon({ className = "size-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M10.2 15.8 8.4 21" />
      <path d="M12 3.2a6.6 6.6 0 0 0-2.4 12.7c.4-.9.7-1.9.9-2.9" />
      <path d="M12 3.2a6.3 6.3 0 1 1-3.6 11.5" />
      <path d="M12.4 8.2c1.3-.4 2.8.3 3.1 1.7.4 1.7-.8 3.6-2.6 3.6-1 0-1.8-.6-1.7-1.7" />
    </svg>
  );
}

export function MailIcon({ className = "size-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
      <path d="m4.5 7 7.5 5.5L19.5 7" />
    </svg>
  );
}

export const valueIcons = {
  leaf: LeafIcon,
  blossom: BlossomIcon,
  house: HouseIcon,
  cup: CupIcon,
};
