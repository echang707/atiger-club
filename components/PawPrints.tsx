"use client";

import { useEffect, useState } from "react";

interface Paw {
  id: number;
  x: number;
  y: number;
  rotate: number;
  flip: boolean;
}

let counter = 0;

export default function PawPrints() {
  const [paws, setPaws] = useState<Paw[]>([]);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable='true']")) return;

      const id = counter++;
      const rotate = Math.random() * 56 - 28;
      const flip = Math.random() > 0.5;

      setPaws((prev) => [...prev.slice(-16), { id, x: e.clientX, y: e.clientY, rotate, flip }]);

      window.setTimeout(() => {
        setPaws((prev) => prev.filter((p) => p.id !== id));
      }, 950);
    };

    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden" aria-hidden="true">
      {paws.map((p) => (
        <span
          key={p.id}
          className="absolute"
          style={{
            left: p.x,
            top: p.y,
            transform: `translate(-50%, -50%) rotate(${p.rotate}deg) scaleX(${p.flip ? -1 : 1})`,
          }}
        >
          <span className="paw-mark block">
            <PawIcon />
          </span>
        </span>
      ))}
    </div>
  );
}

function PawIcon() {
  return (
    <svg width="26" height="26" viewBox="-2 -2 30 30" fill="none">
      {/* main pad */}
      <ellipse cx="13" cy="18" rx="6.8" ry="5.6" fill="#E2531C" />

      {/* four toes, each with a small claw tip poking out */}
      <ellipse cx="4.6" cy="9.6" rx="2.5" ry="3.3" fill="#E2531C" transform="rotate(-20 4.6 9.6)" />
      <path d="M2.7 7.3 C2.3 5.9 2.7 4.8 3.5 3.9 C3.9 5.2 3.9 6.4 3.5 7.6 Z" fill="#E2531C" />

      <ellipse cx="10.3" cy="5.4" rx="2.5" ry="3.3" fill="#E2531C" transform="rotate(-7 10.3 5.4)" />
      <path d="M9.5 2.6 C9.4 1.2 9.9 0.2 10.8 -0.6 C11 0.8 10.8 2 10.3 3.2 Z" fill="#E2531C" />

      <ellipse cx="15.7" cy="5.4" rx="2.5" ry="3.3" fill="#E2531C" transform="rotate(7 15.7 5.4)" />
      <path d="M16.5 2.6 C16.6 1.2 16.1 0.2 15.2 -0.6 C15 0.8 15.2 2 15.7 3.2 Z" fill="#E2531C" />

      <ellipse cx="21.4" cy="9.6" rx="2.5" ry="3.3" fill="#E2531C" transform="rotate(20 21.4 9.6)" />
      <path d="M23.3 7.3 C23.7 5.9 23.3 4.8 22.5 3.9 C22.1 5.2 22.1 6.4 22.5 7.6 Z" fill="#E2531C" />
    </svg>
  );
}
