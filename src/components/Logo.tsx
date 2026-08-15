/**
 * SafariStay logo mark — an iconic flat-top acacia tree beneath a rising sun.
 * The tree is drawn in `currentColor` so it adapts to light or dark contexts.
 */
export default function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      {/* Rising sun */}
      <circle cx="32" cy="12" r="6.5" fill="#e3a94f" />
      {/* Acacia canopy */}
      <g fill="currentColor">
        <ellipse cx="18.5" cy="17.5" rx="13.5" ry="3.4" />
        <ellipse cx="27.5" cy="18.2" rx="10" ry="3" />
        <ellipse cx="23" cy="19.4" rx="14.5" ry="2.8" />
      </g>
      {/* Trunk */}
      <path
        fill="currentColor"
        d="M21 20.6 C 20.5 28 21.4 34 22.5 44 L 25.5 44 C 26.6 34 27.5 28 27 20.6 Z"
      />
      {/* Ground shadow */}
      <ellipse cx="24" cy="45.5" rx="11" ry="1.6" fill="currentColor" opacity="0.25" />
    </svg>
  );
}
