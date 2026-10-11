// Minimal line iconography — 1.25pt strokes, no fills (except rating stars).

const ICONS = {
  plane: ['M21.5 3.2 2.9 10.6l6.2 2.3 2.3 6.2 4.3-9.1 5.8-6.8Z', 'M21.5 3.2 9.1 12.9'],
  compass: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z', 'm15.6 8.4-2.1 5.4-5.4 2.1 2.1-5.4 5.4-2.1Z'],
  bed: ['M3.2 18.2V9.4', 'M3.2 13.4h17.6v4.8', 'M7.6 10.6a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z', 'M12.4 13.4V9.8h4.8a3.6 3.6 0 0 1 3.6 3.6'],
  passport: ['M6 3.5h11.9a1.6 1.6 0 0 1 1.6 1.6v13.8a1.6 1.6 0 0 1-1.6 1.6H6a1.6 1.6 0 0 1-1.6-1.6V5.1A1.6 1.6 0 0 1 6 3.5Z', 'M12 14.4a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z', 'M9.4 9.2h5.2', 'M7.6 17.6h8.8'],
  shield: ['M12 3.2 5 6v5.4c0 4 2.9 7.6 7 8.8 4.1-1.2 7-4.8 7-8.8V6l-7-2.8Z', 'm9.3 12.2 2 2 3.5-3.7'],
  transfer: ['M4 16.6v-3.3l1.7-4.2a1.6 1.6 0 0 1 1.5-1h9.6a1.6 1.6 0 0 1 1.5 1L20 13.3v3.3', 'M4 13.3h16', 'M7 16.6a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z', 'M14 16.6a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z'],
  tag: ['M11.4 3.6H6.2A2.6 2.6 0 0 0 3.6 6.2v5.2c0 .7.3 1.4.8 1.9l7.3 7.3a2.6 2.6 0 0 0 3.7 0l5.2-5.2a2.6 2.6 0 0 0 0-3.7L13.3 4.4a2.6 2.6 0 0 0-1.9-.8Z', 'M8.1 8.1h.01'],
  bolt: ['m13.2 2.6-8 11.1h6l-.9 7.7 8-11.1h-6l.9-7.7Z'],
  headset: ['M4.6 15.1v-3.3a7.4 7.4 0 0 1 14.8 0v3.3', 'M4.6 13.4h1.9a1.2 1.2 0 0 1 1.2 1.2v3.1a1.2 1.2 0 0 1-1.2 1.2H4.6Z', 'M19.4 13.4h-1.9a1.2 1.2 0 0 0-1.2 1.2v3.1a1.2 1.2 0 0 0 1.2 1.2h1.9Z', 'M19.4 18.9v.3a2.8 2.8 0 0 1-2.8 2.8H13'],
  lock: ['M7.4 10.4V8.2a4.6 4.6 0 0 1 9.2 0v2.2', 'M5.9 10.4h12.2a1.6 1.6 0 0 1 1.6 1.6v6.4a1.6 1.6 0 0 1-1.6 1.6H5.9a1.6 1.6 0 0 1-1.6-1.6V12a1.6 1.6 0 0 1 1.6-1.6Z', 'M12 14.4v2.4'],
  handshake: ['M10 17.6H8.1a5.6 5.6 0 0 1 0-11.2H10', 'M14 6.4h1.9a5.6 5.6 0 0 1 0 11.2H14', 'M8.6 12h6.8'],
  aftercare: ['M12 20.4s-7-4.1-7-9.3a4.2 4.2 0 0 1 7-3.1 4.2 4.2 0 0 1 7 3.1c0 5.2-7 9.3-7 9.3Z', 'm9.4 10.9 1.6 1.6 3.2-3.4'],
  search: ['M10.9 17.7a6.9 6.9 0 1 0 0-13.8 6.9 6.9 0 0 0 0 13.8Z', 'm15.9 15.9 4.1 4.1'],
  swap: ['M8.4 9.2h9.2l-2.6-2.8', 'M15.6 14.8H6.4l2.6 2.8'],
  arrowLeft: ['M19 12H5', 'm11 18-6-6 6-6'],
  arrowRight: ['M5 12h14', 'm13 6 6 6-6 6'],
  chevronDown: ['m6 9.6 6 6 6-6'],
  menu: ['M4 7.5h16', 'M4 12h16', 'M4 16.5h16'],
  close: ['M6.4 6.4 17.6 17.6', 'M17.6 6.4 6.4 17.6'],
  phone: ['M8.2 3.6 5.1 4.9a1.8 1.8 0 0 0-1 2.1c1.3 5.6 5.3 9.6 10.9 10.9a1.8 1.8 0 0 0 2.1-1l1.3-3.1-4.1-1.7-1.3 1.6a10.6 10.6 0 0 1-3.7-3.7l1.6-1.3-1.7-4.1Z'],
  mail: ['M4.6 5.6h14.8a1.6 1.6 0 0 1 1.6 1.6v9.6a1.6 1.6 0 0 1-1.6 1.6H4.6A1.6 1.6 0 0 1 3 16.8V7.2a1.6 1.6 0 0 1 1.6-1.6Z', 'm3.4 7 8.6 6 8.6-6'],
  pin: ['M12 20.8s6.4-5.4 6.4-10.2A6.4 6.4 0 0 0 5.6 10.6C5.6 15.4 12 20.8 12 20.8Z', 'M12 12.6a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z'],
  globe: ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z', 'M3.4 12h17.2', 'M12 3c2.3 2.4 3.6 5.5 3.6 9s-1.3 6.6-3.6 9c-2.3-2.4-3.6-5.5-3.6-9S9.7 5.4 12 3Z'],
  sparkle: ['M12 3.4l1.7 4.6 4.6 1.7-4.6 1.7L12 16l-1.7-4.6-4.6-1.7 4.6-1.7L12 3.4Z', 'M18.6 15.4l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z'],
  users: ['M15.6 19.6v-1.7a3.4 3.4 0 0 0-3.4-3.4H7.4A3.4 3.4 0 0 0 4 17.9v1.7', 'M9.8 11.1a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8Z', 'M20 19.6v-1.7a3.4 3.4 0 0 0-2.6-3.3', 'M15.2 4.5a3.4 3.4 0 0 1 0 6.6'],
  plus: ['M12 5.6v12.8', 'M5.6 12h12.8'],
  trash: ['M4.8 7h14.4', 'M9.6 7V5.5a1.4 1.4 0 0 1 1.4-1.4h2a1.4 1.4 0 0 1 1.4 1.4V7', 'M6.4 7l.9 12.2a1.6 1.6 0 0 0 1.6 1.5h6.2a1.6 1.6 0 0 0 1.6-1.5L17.6 7'],
  sliders: ['M4.6 7.6h14.8', 'M4.6 16.4h14.8', 'M9.4 7.6a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8Z', 'M15.2 20.2a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8Z'],
}

const FILLED = {
  star: 'M12 3.6l2.5 5.1 5.6.8-4.1 4 1 5.6-5-2.7-5 2.7 1-5.6-4.1-4 5.6-.8L12 3.6Z',
}

export function Icon({ name, size = 24, className = '', style }) {
  if (FILLED[name]) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className={className}
        style={style}
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <path d={FILLED[name]} />
      </svg>
    )
  }

  const paths = ICONS[name] || []
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  )
}

/** Brand mark: a wing lifting out of a cloud deck. */
export function Logo({ tone = 'light', name = 'آسمانه', latin = 'ASEMANEH' }) {
  const ink = tone === 'dark' ? '#172B3A' : '#FFFFFF'
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 40 40" width="38" height="38" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="asemaneh-mark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#62C4FF" />
            <stop offset="100%" stopColor="#269FE8" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="13" fill="url(#asemaneh-mark)" />
        <path
          d="M7.5 25.4c5-1.5 8.7-4.4 11.4-8.8 1.4-2.4 2.4-5 2.9-7.8l1.9-.5c-.4 3.8-1.5 7.3-3.4 10.5l9.2 2.8-1.9 1.9-10.3-1.5c-2 2.4-4.2 4.4-6.5 6l-3.3-2.6Z"
          fill="#FFFFFF"
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="text-[1.075rem] font-bold tracking-tight" style={{ color: ink }}>
          {name}
        </span>
        <span
          className="mt-0.5 text-[0.5rem] font-semibold"
          style={{ color: ink, opacity: 0.55, letterSpacing: '0.28em' }}
        >
          {latin}
        </span>
      </span>
    </span>
  )
}
