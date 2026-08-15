/**
 * Faded savanna backdrop: a fixed, very low-opacity scene of African
 * silhouettes (elephant, giraffe, acacia trees, birds) sitting on the
 * horizon, with a warm sunset sun — rendered behind all page content.
 */
export default function SafariBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Warm sand wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-sand-50 via-sand-100 to-sand-200/80" />

      {/* Savanna scene — anchored to the bottom of the viewport */}
      <svg
        className="absolute inset-x-0 bottom-0 h-[72vh] min-h-[420px] w-full"
        viewBox="0 0 1440 500"
        preserveAspectRatio="xMidYMax slice"
        fill="#4b3823"
        role="presentation"
      >
        {/* Faded sunset sun */}
        <circle cx="1180" cy="150" r="62" fill="#d9912b" opacity="0.32" />
        <circle cx="1180" cy="150" r="96" fill="none" stroke="#d9912b" strokeWidth="2" opacity="0.18" />

        {/* Rolling hills */}
        <path
          d="M0 468 Q 180 442 380 466 T 760 468 T 1140 464 T 1440 468 L 1440 500 L 0 500 Z"
          fill="#c9b184"
          opacity="0.5"
        />
        <path
          d="M0 484 Q 260 462 520 482 T 1000 480 T 1440 484 L 1440 500 L 0 500 Z"
          fill="#b99e6e"
          opacity="0.45"
        />

        {/* Silhouettes — faded so content stays readable */}
        <g opacity="0.13">
          {/* Acacia tree (left) */}
          <g>
            <path d="M150 446 C 146 416 143 392 146 362 C 150 356 156 356 158 362 C 161 392 158 416 155 446 Z" />
            <path d="M156 385 C 165 372 178 362 194 360 C 190 365 182 372 172 378 C 165 382 160 384 156 385 Z" />
            <ellipse cx="150" cy="358" rx="48" ry="9" />
            <ellipse cx="192" cy="358" rx="40" ry="8" />
            <ellipse cx="168" cy="366" rx="52" ry="7" />
          </g>

          {/* Elephant walking (left-centre) */}
          <g>
            <rect x="340" y="412" width="15" height="34" rx="6" />
            <rect x="362" y="414" width="14" height="32" rx="6" />
            <rect x="420" y="414" width="14" height="32" rx="6" />
            <rect x="442" y="412" width="15" height="34" rx="6" />
            <ellipse cx="398" cy="400" rx="62" ry="36" />
            <circle cx="330" cy="392" r="30" />
            <ellipse cx="358" cy="392" rx="15" ry="26" />
            <path d="M314 410 C 306 424 300 438 300 452 C 300 459 306 460 308 456 C 312 442 316 428 322 416 Z" />
            <path d="M458 398 C 468 402 473 410 473 420" stroke="#4b3823" strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>

          {/* Small acacia (right-centre) */}
          <g>
            <path d="M890 446 C 887 422 885 405 887 380 C 890 375 895 375 897 380 C 899 405 897 422 894 446 Z" />
            <ellipse cx="888" cy="377" rx="36" ry="7" />
            <ellipse cx="916" cy="377" rx="30" ry="6" />
          </g>

          {/* Giraffe (right) */}
          <g>
            <rect x="1120" y="395" width="9" height="51" rx="4" />
            <rect x="1136" y="398" width="9" height="48" rx="4" />
            <rect x="1172" y="398" width="9" height="48" rx="4" />
            <rect x="1188" y="395" width="9" height="51" rx="4" />
            <ellipse cx="1158" cy="404" rx="36" ry="20" />
            <path d="M1192 400 C 1198 360 1202 330 1206 306 L 1218 310 C 1216 336 1212 366 1208 406 Z" />
            <ellipse cx="1216" cy="304" rx="13" ry="8" />
            <ellipse cx="1226" cy="306" rx="7" ry="6" />
            <rect x="1210" y="288" width="3" height="12" rx="1.5" />
            <rect x="1220" y="288" width="3" height="12" rx="1.5" />
            <path d="M1204 300 l-8 2 4 6 z" />
            <path d="M1122 400 c-8 2 -12 8 -13 16" stroke="#4b3823" strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>
        </g>

        {/* Birds in the sky */}
        <g stroke="#4b3823" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.35">
          <path d="M400 118 q10 -8 20 0 q10 -8 20 0" />
          <path d="M500 92 q8 -7 16 0 q8 -7 16 0" />
          <path d="M565 138 q7 -6 14 0 q7 -6 14 0" />
          <path d="M660 108 q9 -7 18 0 q9 -7 18 0" />
        </g>
      </svg>

      {/* Soft vignette for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_0%,transparent_55%,rgba(90,70,40,0.07))]" />
    </div>
  );
}
