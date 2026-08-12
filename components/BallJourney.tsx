"use client";

import { useEffect, useRef } from "react";

/* ---------------------------------------------------------------------
   The traveling period.

   The full stop at the end of "seven ways to dive in." leaves the
   headline, becomes a ball, and works its way down the seven mediums:
   it ROLLS the length of each word, runs off the far edge, drops onto the
   leading edge of the next one, and rolls again. It finishes in the photo
   below, settling on the table.

   The path is built from two kinds of segment:

     ROLL — along the top edge of a word, ball spinning at the rate it
            actually travels, entering at whichever edge is closer to
            where the last drop left it.
     DROP — a short fall from one word's trailing edge to the next word's
            leading edge, accelerating as it goes.

   Everything is scroll-driven rather than timed, so scrolling back up
   runs it in reverse and puts the period back in the headline with no
   reset logic. Scroll is mapped so the ball keeps pace with the page —
   it stays in view as you scroll rather than lagging above.
   --------------------------------------------------------------------- */

type Seg = {
  kind: "roll" | "drop";
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  len: number;
  el?: HTMLElement;
};

const BALL = 11;

export default function BallJourney({ children }: { children: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const ball = useRef<HTMLSpanElement>(null);
  const fired = useRef<Set<number>>(new Set());

  useEffect(() => {
    const wrapEl = wrap.current;
    const ballEl = ball.current;
    if (!wrapEl || !ballEl) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let segs: Seg[] = [];
    let total = 0;
    let startEl: HTMLElement | null = null;
    let range = { from: 0, to: 1 };

    const build = () => {
      const wr = wrapEl.getBoundingClientRect();
      const ox = wr.left + window.scrollX;
      const oy = wr.top + window.scrollY;
      const box = (el: Element) => {
        const r = el.getBoundingClientRect();
        return {
          l: r.left + window.scrollX - ox,
          r: r.right + window.scrollX - ox,
          t: r.top + window.scrollY - oy,
          b: r.bottom + window.scrollY - oy,
          w: r.width,
          h: r.height,
        };
      };

      startEl = wrapEl.querySelector("[data-ball-start]");
      const words = Array.from(wrapEl.querySelectorAll<HTMLElement>("[data-medium]"));
      const endEl = wrapEl.querySelector("[data-ball-end]");
      if (!startEl || !endEl || words.length === 0) return false;

      const s = box(startEl);
      const out: Seg[] = [];
      let cx = s.l + s.w / 2;
      let cy = s.t + s.h / 2;

      const push = (kind: Seg["kind"], x1: number, y1: number, el?: HTMLElement) => {
        const len = Math.hypot(x1 - cx, y1 - cy);
        out.push({ kind, x0: cx, y0: cy, x1, y1, len: Math.max(len, 1), el });
        cx = x1;
        cy = y1;
      };

      words.forEach((w) => {
        const b = box(w);
        // sit ON the type: the cap-height line, not the layout box
        const top = b.t + b.h * 0.30 - BALL / 2;
        // enter at whichever end is nearer where we just fell from
        const enterLeft = Math.abs(cx - b.l) <= Math.abs(cx - b.r);
        const entry = enterLeft ? b.l + b.w * 0.04 : b.r - b.w * 0.04;
        const exit = enterLeft ? b.r - b.w * 0.02 : b.l + b.w * 0.02;
        push("drop", entry, top, w); // fall onto the leading edge
        push("roll", exit, top + (enterLeft ? 2 : -2)); // roll the length of it
      });

      const e = box(endEl);
      push("drop", e.l, e.t);

      segs = out;
      total = out.reduce((n, sg) => n + sg.len, 0);

      const sTop = startEl.getBoundingClientRect().top + window.scrollY;
      const eTop = endEl.getBoundingClientRect().top + window.scrollY;
      // Journey completes a little before the photo reaches centre, so the
      // ball moves briskly and is always ahead of the reading position
      // rather than trailing above the fold.
      range = {
        from: sTop - window.innerHeight * 0.72,
        to: eTop - window.innerHeight * 0.62,
      };
      return true;
    };

    let ok = build();
    let spin = 0;
    // The ball only ever travels forward. `reached` is the furthest point
    // of the journey we have got to, and it never decreases while the
    // section is on screen — scrolling up a little to re-read something
    // does not drag the ball backwards up the page.
    let reached = 0;

    const draw = () => {
      if (!ok) {
        ok = build();
        if (!ok) return;
      }
      const span = Math.max(range.to - range.from, 1);
      const raw = Math.min(Math.max((window.scrollY - range.from) / span, 0), 1);

      // Full reset only once you are completely back above the headline —
      // at which point the period returns and the whole run can happen
      // again. Anywhere below that, the ball holds its furthest position.
      const above = startEl
        ? startEl.getBoundingClientRect().top > window.innerHeight * 0.9
        : false;

      if (above || reduced) {
        reached = 0;
        fired.current.clear();
        spin = 0;
        ballEl.style.opacity = "0";
        if (startEl) startEl.style.opacity = "1";
        return;
      }

      reached = Math.max(reached, raw);
      const p = reached;

      if (startEl) startEl.style.opacity = p > 0.01 ? "0" : "1";
      if (p <= 0.01) {
        ballEl.style.opacity = "0";
        return;
      }
      ballEl.style.opacity = "1";

      // walk the path by arc length
      let d = p * total;
      let i = 0;
      while (i < segs.length - 1 && d > segs[i].len) {
        d -= segs[i].len;
        i += 1;
      }
      const sg = segs[i];
      const t = Math.min(d / sg.len, 1);

      // a drop accelerates; a roll is steady
      const e = sg.kind === "drop" ? t * t : t;
      const x = sg.x0 + (sg.x1 - sg.x0) * e;
      const y = sg.y0 + (sg.y1 - sg.y0) * (sg.kind === "drop" ? t * t : t);

      // spin at the rate it actually travels, and only while rolling
      spin = (p * total) / (BALL / 2) * (180 / Math.PI) * 0.5;

      ballEl.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${spin}deg)`;

      // Fire each landing exactly once, and never miss one.
      //
      // Checking "am I at the moment of contact" drops triggers whenever a
      // scroll step jumps past that instant — which is most of the time on
      // a trackpad flick. Instead: every drop at or behind the ball that
      // hasn't fired yet fires now, and anything ahead of the ball is
      // re-armed, so scrolling back up lets the run play again.
      segs.forEach((seg, j) => {
        if (seg.kind !== "drop" || !seg.el) return;
        // Every landing at or behind the ball fires exactly once. Checking
        // for the instant of contact loses hits whenever a scroll step
        // jumps past it, which is most trackpad flicks.
        //
        // Nothing is re-armed here: each word plays once, settles back to
        // normal on its own, and stays that way until the whole run is
        // reset by scrolling above the headline.
        const landed = j < i || (j === i && t > 0.8);
        if (landed && !fired.current.has(j)) {
          seg.el.dispatchEvent(new CustomEvent("medium:hit"));
          fired.current.add(j);
        }
      });
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
      ok = build();
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
        className="pointer-events-none absolute left-0 top-0 z-20 block rounded-full bg-tiger opacity-0 will-change-transform"
        style={{ width: BALL, height: BALL, marginLeft: -BALL / 2, marginTop: -BALL / 2 }}
      >
        {/* a single off-centre fleck, so the spin is actually visible */}
        <span className="absolute left-[18%] top-[42%] block h-[2px] w-[2px] rounded-full bg-paper/70" />
      </span>
    </div>
  );
}
