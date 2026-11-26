/* Still drawings for the member journey, taken from the homepage door
   scene (components/DoorScene.tsx) so they match it line for line: the
   two stick characters and the door. Nothing else is drawn. */

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* The two characters: "orange" carries the pack, "gold" doesn't. */
export function Explorer({
  tone,
  flip = false,
  className = "",
}: {
  tone: "orange" | "gold";
  flip?: boolean;
  className?: string;
}) {
  const fill = tone === "orange" ? "#E0521C" : "#F2A541";
  return (
    <svg
      viewBox="0 0 40 56"
      {...STROKE}
      className={`text-ink ${className}`}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M19.8 35.4c-2.8 1.8-6.2 2.8-8.8 2-1.8-.6-2.6-2-2.2-3.6" />
      <circle cx="9.1" cy="33.1" r="1.6" fill={fill} strokeWidth="1.5" />
      <path d="M19.6 23.5 L14.6 29.4" />
      {tone === "orange" && (
        <g>
          <rect x="6.6" y="19" width="10.8" height="14.6" rx="3.8" fill="#e0521c" />
          <path d="M6.9 23.6C9.4 25.6 14.6 25.6 17.1 23.6" strokeWidth="1.3" />
          <rect x="8.8" y="27.2" width="6.4" height="4.6" rx="1.7" fill="#e0521c" strokeWidth="1.3" />
          <path d="M16.8 20.4C18.4 19.6 19.6 20 20.1 21.4" strokeWidth="1.5" />
        </g>
      )}
      <path d="M20 19.2c-.5 5.8.6 11.1 0 16.9" />
      <g transform="translate(20.6 18.6) scale(1.1) translate(-20.6 -18.6)">
        <path d="M13.6 7.6c-1.1-3.4.1-5.8 2.2-5.6 1.3.1 2.4 1 2.9 2.4" fill={fill} strokeWidth="1.9" />
        <path d="M22.6 3.8c.8-1.5 2.1-2.2 3.5-1.8 1.9.6 2.4 3 1.6 5.6" fill={fill} strokeWidth="1.9" />
        <path d="M12.4 11.4c0-5 3.6-8.4 8.2-8.4s8.2 3.4 8.2 8.2c0 4.8-3.6 8-8.3 8-4.6 0-8.1-3.2-8.1-7.8Z" fill={fill} />
        <path d="M19.6 3.4v1.9" strokeWidth="1.35" />
        <path d="M22.4 3.5l-.3 1.8" strokeWidth="1.35" />
        <path d="M22.6 14.3c.8.8 2 .8 2.8 0" strokeWidth="1.15" />
        <g fill="#15130E" stroke="none">
          <circle cx="21.4" cy="10.9" r="1.55" />
          <circle cx="25.4" cy="10.7" r="1.55" />
        </g>
        <g fill="#fff" stroke="none">
          <circle cx="21.95" cy="10.35" r=".55" />
          <circle cx="25.95" cy="10.15" r=".55" />
        </g>
      </g>
      <path d="M20.2 23.5 L25.6 29.2" />
      <path d="M20 36 L23.6 47.2 L26.8 47.3" />
      <path d="M20 36 L16.6 47.3 L19.7 47.4" />
    </svg>
  );
}

/* The door. "open": swung open with the warm light inside (a door you've
   been through). "closed": the orange door (one you're going through).
   "outline": not committed yet (saved, no RSVP). */
export function Door({
  state,
  label,
  className = "",
}: {
  state: "open" | "closed" | "outline";
  label?: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 46 66" {...STROKE} className={`text-ink ${className}`} aria-hidden="true" focusable="false">
      {state === "open" && (
        <path d="M6.5 63 6.9 7.2c0-1.9 1.1-3 3-3l26-.3c2 0 3.2 1.1 3.2 3.1L39.4 63Z" fill="#FFC46B" stroke="none" />
      )}
      <path d="M6.5 63.2 6.9 7.2c0-1.9 1.1-3 3-3l26-.3c2 0 3.2 1.1 3.2 3.1l.3 56.2" />
      {state === "open" ? (
        <g transform="translate(7 34) scale(0.2 1) skewY(-7) translate(-7 -34)">
          <path d="M6.7 63 7 7.3c0-1.9 1-2.9 2.9-2.9l25.9-.3c2 0 3.1 1.1 3.1 3L39.2 63Z" fill="#E0521C" />
        </g>
      ) : (
        <g strokeDasharray={state === "outline" ? "3 3.4" : undefined}>
          <path
            d="M6.7 63 7 7.3c0-1.9 1-2.9 2.9-2.9l25.9-.3c2 0 3.1 1.1 3.1 3L39.2 63Z"
            fill={state === "closed" ? "#E0521C" : "#F4E9D6"}
          />
          <circle cx="33.2" cy="46" r="1.5" fill={state === "closed" ? "#F4E9D6" : "#15130E"} stroke="none" />
          {label && (
            <text
              x="23"
              y="22"
              textAnchor="middle"
              fill={state === "closed" ? "#F4E9D6" : "#15130E"}
              stroke="none"
              style={{ font: "700 9px var(--font-main), sans-serif", letterSpacing: "0.04em" }}
            >
              {label}
            </text>
          )}
        </g>
      )}
      <path d="M1.5 63.3c14.4-.5 28.7-.4 43 .1" />
    </svg>
  );
}
