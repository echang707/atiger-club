"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Print = {
  id: number;
  x: number;
  y: number;
  rotate: number;
  size: number;
  opacity: number;
};

// Session-only memory: an in-flight array, never persisted. A refresh
// wipes the page's JS state entirely, which is all the "disappears on
// reload" requirement needs — no localStorage, no cleanup to write.
const MAX_PRINTS = 36;
const MOBILE_BREAKPOINT = 768;

// Anything that already responds to a click — links, buttons, form
// controls, nav, cards with their own handlers — is off limits. This is
// deliberately broad: it's better to occasionally miss a valid empty
// patch of page than to stamp a paw over something interactive.
const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  "input",
  "textarea",
  "select",
  "label",
  "summary",
  '[role="button"]',
  '[role="link"]',
  '[role="menuitem"]',
  '[contenteditable="true"]',
  "header",
  "footer",
  "nav",
  "form",
  "[data-no-paw]",
].join(", ");

// A single hand-cut pad + four irregular toes, closer to a linocut stamp
// than a rounded emoji paw. Asymmetric on purpose — nothing here is a
// perfect ellipse.
function HandDrawnPaw({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      <g fill="currentColor">
        <path d="M32.4 61.2c-8.9.3-16.4-4.9-16.9-13.6-.4-6.8 3.9-11.2 8.9-13.9 2.2-1.2 4.5-2 6.7-1.9 2.3 0 4.6.9 6.7 2.1 4.8 2.8 8.8 7 8.3 13.7-.6 8.6-4.9 13.3-13.7 13.6Z" />
        <path d="M15.2 27.5c-3.1-.8-5.6-3.3-6.2-6.6-.7-4 1.6-7.9 5.4-9 3.5-1 7.1.8 8.5 4.1 1.5 3.5.2 7.6-3 9.6-1.4.9-3.1 1.5-4.7 1.9Z" />
        <path d="M27.9 16.3c-3.2-.2-6-2.3-7-5.5-1.2-3.9.7-8 4.5-9.4 3.5-1.3 7.3.3 8.9 3.5 1.8 3.4.9 7.5-2 9.9-1.3 1-2.8 1.4-4.4 1.5Z" />
        <path d="M41 16.4c-1.6-.1-3.1-.6-4.4-1.6-2.9-2.3-3.9-6.4-2-9.8 1.7-3.2 5.5-4.7 8.9-3.3 3.8 1.5 5.6 5.6 4.3 9.5-1 3.1-3.8 5.1-6.8 5.2Z" />
        <path d="M53.3 28.1c-1.7-.4-3.3-1-4.7-1.9-3.1-2.1-4.3-6.2-2.7-9.6 1.5-3.3 5.1-5 8.6-3.9 3.8 1.2 6 5.1 5.2 9.1-.7 3.2-3.2 5.6-6.4 6.3Z" />
      </g>
    </svg>
  );
}

export default function PawPrints() {
  const [prints, setPrints] = useState<Print[]>([]);
  const nextId = useRef(0);

  const handleClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    if (target.closest(INTERACTIVE_SELECTOR)) return;

    setPrints((prev) => {
      if (prev.length >= MAX_PRINTS) return prev;

      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
      const size = isMobile ? 24 + Math.random() * 8 : 28 + Math.random() * 12;
      const rotate = -20 + Math.random() * 40;
      const opacity = 0.15 + Math.random() * 0.1;

      nextId.current += 1;
      return [
        ...prev,
        {
          id: nextId.current,
          x: e.clientX + window.scrollX,
          y: e.clientY + window.scrollY,
          rotate,
          size,
          opacity,
        },
      ];
    });
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [handleClick]);

  if (prints.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {prints.map((p) => (
        <span
          key={p.id}
          className="paw-print-mark absolute text-ink"
          style={
            {
              left: p.x,
              top: p.y,
              "--paw-rot": `${p.rotate}deg`,
              "--paw-opacity": p.opacity,
            } as React.CSSProperties
          }
        >
          <HandDrawnPaw size={p.size} />
        </span>
      ))}
    </div>
  );
}
