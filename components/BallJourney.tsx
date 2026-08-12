"use client";

import { useEffect, useRef } from "react";

/* ---------------------------------------------------------------------
   The traveling period.

   The full stop at the end of "seven ways to dive in." leaves the
   headline as you scroll, becomes a ball, and rolls down through all
   seven mediums — setting each one off on contact — before dropping into
   the photograph below and settling on the table.

   It is entirely scroll-driven rather than timed: position is a pure
   function of how far you are through the section. That means scrolling
   back up runs it in reverse and returns the period to the headline for
   free, with no reset logic.

   Waypoints are measured from the live DOM (`[data-ball-start]`,
   `[data-medium]`, `[data-ball-end]`), so the path follows whatever
   layout the words actually land in at any breakpoint.
   --------------------------------------------------------------------- */

export default function BallJourney({ children }: { children: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const ball = useRef<HTMLSpanElement>(null);
  const lastLeg = useRef(-1);

  useEffect(() => {
    const wrapEl = wrap.current;
    const ballEl = ball.current;
    if (!wrapEl || !ballEl) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    type Pt = { x: number; y: number; el?: HTMLElement };
    let pts: Pt[] = [];
    let startEl: HTMLElement | null = null;
    let range = { from: 0, to: 1 };

    // Measure every waypoint in coordinates relative to the wrapper.
    const measure = () => {
      const wr = wrapEl.getBoundingClientRect();
      const top = wr.top + window.scrollY;
      const left = wr.left + window.scrollX;
      const rel = (el: Element) => {
        const r = el.getBoundingClientRect();
        return {
          x: r.left + window.scrollX - left + r.width / 2,
          y: r.top + window.scrollY - top + r.height / 2,
        };
      };

      startEl = wrapEl.querySelector("[data-ball-start]");
      const mediums = Array.from(
        wrapEl.querySelectorAll<HTMLElement>("[data-medium]")
      );
      const endEl = wrapEl.querySelector("[data-ball-end]");
      if (!startEl || !endEl || mediums.length === 0) return false;

      pts = [
        rel(startEl),
        ...mediums.map((m) => {
          const p = rel(m);
          // sit on top of the word rather than through the middle of it
          return { ...p, y: p.y - m.getBoundingClientRect().height * 0.34, el: m };
        }),
        rel(endEl),
      ];

      // The journey runs from the headline reaching mid-screen to the
      // photo reaching mid-screen.
      const sTop = startEl.getBoundingClientRect().top + window.scrollY;
      const eTop = endEl.getBoundingClientRect().top + window.scrollY;
      range = {
        from: sTop - window.innerHeight * 0.55,
        to: eTop - window.innerHeight * 0.45,
      };
      return true;
    };

    let ok = measure();

    const draw = () => {
      if (!ok) {
        ok = measure();
        if (!ok) return;
      }
      const span = Math.max(range.to - range.from, 1);
      const p = Math.min(Math.max((window.scrollY - range.from) / span, 0), 1);

      // Before the journey starts the period belongs to the headline.
      if (startEl) startEl.style.opacity = p > 0.012 ? "0" : "1";
      if (p <= 0.012 || reduced) {
        ballEl.style.opacity = "0";
        lastLeg.current = -1;
        return;
      }
      ballEl.style.opacity = "1";

      const legs = pts.length - 1;
      const t = p * legs;
      const leg = Math.min(Math.floor(t), legs - 1);
      const lt = t - leg;
      const a = pts[leg];
      const b = pts[leg + 1];

      // A hop between waypoints: linear across, parabola over the top.
      // The last leg drops into the photo instead of hopping out of it.
      const isLast = leg === legs - 1;
      const hop = isLast ? 0 : Math.min(90, Math.abs(b.x - a.x) * 0.22 + 34);
      const x = a.x + (b.x - a.x) * lt;
      const y =
        a.y + (b.y - a.y) * (isLast ? lt * lt : lt) - Math.sin(Math.PI * lt) * hop;

      ballEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      // squash a little at the bottom of each hop, like it's landing
      const squash = isLast ? 1 : 1 - Math.sin(Math.PI * lt) * 0.12;
      ballEl.style.scale = `${1 / squash} ${squash}`;

      // Fire the medium's animation as the ball arrives on it.
      if (leg !== lastLeg.current && lt > 0.72) {
        const target = pts[leg + 1]?.el;
        if (target) target.dispatchEvent(new CustomEvent("medium:hit"));
        lastLeg.current = leg;
      } else if (lt < 0.2 && lastLeg.current === leg) {
        lastLeg.current = -1;
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          draw();
        });
      }
    };
    const onResize = () => {
      ok = measure();
      draw();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const settle = window.setTimeout(onResize, 400);
    draw();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(settle);
    };
  }, []);

  return (
    <div ref={wrap} className="relative">
      {children}
      <span
        ref={ball}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-20 block h-[11px] w-[11px] -ml-[5.5px] -mt-[5.5px] rounded-full bg-tiger opacity-0 will-change-transform"
      />
    </div>
  );
}
