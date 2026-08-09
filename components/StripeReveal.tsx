"use client";

import { useMemo } from "react";

// A handful of irregular vertical bars sit over the photo at rest, each
// covering the paper color behind it. On hover they collapse toward
// their own edge, so the strips of image between them widen out until
// the whole photo is visible. Geometry is randomized (but stable per
// mount) so repeated use across a page doesn't look mechanical.
export default function StripeReveal({
  children,
  seed = 0,
  barCount = 4,
  className = "",
}: {
  children: React.ReactNode;
  seed?: number;
  barCount?: number;
  className?: string;
}) {
  const bars = useMemo(() => {
    // deterministic pseudo-random so server/client match
    let s = seed * 9301 + 49297;
    const rand = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };

    const edges = [0];
    for (let i = 1; i < barCount; i++) {
      edges.push((i + rand() * 0.5) / barCount);
    }
    edges.push(1);

    return Array.from({ length: barCount }).map((_, i) => {
      const left = edges[i] * 100;
      const right = edges[i + 1] * 100;
      const width = right - left;
      const inset = width * (0.14 + rand() * 0.1);
      const fromLeft = i % 2 === 0;
      return {
        left: left + inset / 2,
        width: Math.max(width - inset, 4),
        origin: fromLeft ? "left center" : "right center",
      };
    });
  }, [seed, barCount]);

  return (
    <div className={`stripe-reveal relative overflow-hidden ${className}`}>
      {children}
      {bars.map((b, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="stripe-reveal-bar pointer-events-none absolute top-0 bottom-0 bg-paper"
          style={
            {
              left: `${b.left}%`,
              width: `${b.width}%`,
              "--bar-origin": b.origin,
              transitionDelay: `${i * 45}ms`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
