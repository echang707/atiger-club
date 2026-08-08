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
    <svg width="24" height="24" viewBox="0 0 26 26" fill="none">
      <ellipse cx="13" cy="17.5" rx="6.8" ry="5.6" fill="#E2531C" />
      <ellipse cx="4.6" cy="9" rx="2.5" ry="3.3" fill="#E2531C" transform="rotate(-20 4.6 9)" />
      <ellipse cx="10.3" cy="4.8" rx="2.5" ry="3.3" fill="#E2531C" transform="rotate(-7 10.3 4.8)" />
      <ellipse cx="15.7" cy="4.8" rx="2.5" ry="3.3" fill="#E2531C" transform="rotate(7 15.7 4.8)" />
      <ellipse cx="21.4" cy="9" rx="2.5" ry="3.3" fill="#E2531C" transform="rotate(20 21.4 9)" />
    </svg>
  );
}
