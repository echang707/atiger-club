"use client";

import { useEffect, useRef, useState } from "react";

/* ---------------------------------------------------------------------
   Hero crowd.

   Background: the supplied artwork, static and untouched.

   On top of it, eight people walk in — seven after load, one on the
   "Join the Club" hover. Every part of the movement is driven from a
   single rAF loop rather than CSS transitions, because a transition can
   only interpolate between two states; it cannot walk.

   What the loop does per figure, per frame:

     • advances along a QUADRATIC BEZIER, so the path curves
     • eases in, holds a steady pace, eases out
     • steps a SIX-FRAME walk sheet at a cadence tied to actual speed, so
       the legs and arms swing in time with the distance covered
     • adds a small vertical bob and body sway from the same phase
     • orients the figure slightly toward its direction of travel
     • plays one or two shorter settling steps at the end before stopping

   SHADOWS are drawn separately and only after arrival. The sprites are
   cut body-only — no baked shadow — so a walking figure never drags a
   shadow across the artwork and two figures can never overlap shadows.
   The shadow fades up once its owner has stopped, which is the one
   opacity change in the hero; the people themselves never fade.
   --------------------------------------------------------------------- */

/* art width fraction -> vw, at the 134% background */
const ART_W = 1672;
const BG = 1.34;
const FRAMES = 4;

type Spec = {
  sprite: string;
  fw: number;
  srcH: number;
  sx: number; sy: number;      // entry point, % of hero (may be any edge)
  cx: number; cy: number;      // bezier control point
  x: number; y: number;        // destination
  flip: boolean;
  ms: number;
};

/* Destinations were found by scanning the artwork itself: each is a spot
   with almost no ink in a tight radius (open ground you can stand in) but
   plenty of ink nearby (right beside a crowd). Scale rises toward the
   bottom of the frame because the artwork has perspective. */
/* Every figure is cut FROM THIS ARTWORK — one of the isolated individuals
   already walking in its cream space — so renderer, lighting, palette and
   proportions match by construction.

   ROUTES ARE SOLVED, NOT PLACED. For each candidate spot the artwork is
   sampled along the whole bezier: a route is only accepted if every point
   on it is open ground (worst ink < 0.012) AND never enters the copy
   keep-out box. That is why some walkers now enter from the top or the
   bottom — the crowd bands run right to the left and right edges, so a
   side entry would have to walk through people to reach its place. These
   eight come in along the cream corridors instead.

   `srcH` is each figure's real pixel height in the 1672px source, so its
   rendered size is exact: srcH / 1672 * 1.34 * 100vw.
*/
const ARRIVALS: Spec[] = [
  { sprite: "n01", fw: 77, srcH: 47, sx: 84.0, sy: -8.0, cx: 56.0, cy: 4.7, x: 33.0, y: 15.0, flip: true, ms: 5600 },
  { sprite: "n03", fw: 84, srcH: 45, sx: 108.0, sy: 30.0, cx: 102.8, cy: 32.0, x: 95.0, y: 35.0, flip: true, ms: 6100 },
  { sprite: "n07", fw: 76, srcH: 45, sx: 6.0, sy: 108.0, cx: 10.4, cy: 87.8, x: 17.0, y: 57.5, flip: false, ms: 6600 },
  { sprite: "n09", fw: 78, srcH: 44, sx: 12.0, sy: 108.0, cx: 11.6, cy: 94.8, x: 11.0, y: 75.0, flip: false, ms: 5600 },
  { sprite: "n02", fw: 82, srcH: 46, sx: 72.0, sy: -8.0, cx: 72.4, cy: -0.8, x: 73.0, y: 10.0, flip: true, ms: 6100 },
  { sprite: "n00", fw: 84, srcH: 49, sx: 108.0, sy: 15.0, cx: 100.4, cy: 31.0, x: 89.0, y: 55.0, flip: true, ms: 6600 },
  { sprite: "n05", fw: 97, srcH: 46, sx: 12.0, sy: 108.0, cx: 9.2, cy: 100.8, x: 5.0, y: 90.0, flip: false, ms: 5600 },
];

const JOINER: Spec = { sprite: "n06", fw: 84, srcH: 45, sx: 75.0, sy: -8.0, cx: 72.8, cy: 10.2, x: 71.0, y: 25.0, flip: true, ms: 6100 };




const bez = (a: number, b: number, c: number, t: number) =>
  (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;

/* slow start, steady middle, slow finish, then two small settling steps */
function ease(t: number) {
  const base = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  if (t > 0.86) {
    const s = (t - 0.86) / 0.14;
    return base + Math.sin(s * Math.PI * 2) * 0.006 * (1 - s);
  }
  return base;
}

type Live = { el: HTMLElement; sh: HTMLElement; spec: Spec; t0: number; dir: 1 | -1; done: boolean };

export default function HumanStripes() {
  const [mob, setMob] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const live = useRef<Map<string, Live>>(new Map());

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMob(mobile);
    if (mobile) return;

    const root = wrap.current;
    if (!root) return;

    const make = (spec: Spec, key: string) => {
      const h = (spec.srcH / ART_W) * BG * 100;
      const sh = document.createElement("span");
      sh.className = "hero-shadow";
      sh.style.width = `${h * 1.15}vw`;
      sh.style.height = `${h * 0.26}vw`;
      root.appendChild(sh);

      const el = document.createElement("span");
      el.className = "hero-walker";
      el.style.height = `${h}vw`;
      el.style.width = `${(h * spec.fw) / 190}vw`;
      el.style.backgroundImage = `url(/images/walkers/${spec.sprite}.webp)`;
      el.style.backgroundSize = `${FRAMES * 100}% 100%`;
      root.appendChild(el);

      live.current.set(key, { el, sh, spec, t0: 0, dir: 1, done: false });
      place(key, 0);
    };

    const place = (key: string, t: number) => {
      const L = live.current.get(key);
      if (!L) return;
      const { spec, el, sh } = L;
      const e = ease(t);
      const x = bez(spec.sx, spec.cx, spec.x, e);
      const y = bez(spec.sy, spec.cy, spec.y, e);

      // cadence follows distance covered, so the steps match the speed
      const phase = e * 34;
      const frame = Math.floor(phase) % FRAMES;
      const bob = t > 0 && t < 1 ? Math.sin(phase * Math.PI) * 0.22 : 0;
      const sway = t > 0 && t < 1 ? Math.sin(phase * Math.PI) * 1.1 : 0;

      // lean very slightly into the direction of travel
      const lean = t > 0 && t < 1 ? (spec.sx < spec.x ? 1.6 : -1.6) : 0;

      el.style.left = `${x}%`;
      el.style.top = `calc(${y}% + ${bob}px)`;
      el.style.backgroundPosition = `${(frame / (FRAMES - 1)) * 100}% 0%`;
      el.style.transform = `translate(-50%, -100%) scaleX(${spec.flip ? -1 : 1}) rotate(${sway + lean}deg)`;

      sh.style.left = `${x}%`;
      sh.style.top = `${y}%`;
      sh.style.opacity = t >= 1 ? "1" : "0";
    };

    ARRIVALS.forEach((s, i) => make(s, `a${i}`));
    make(JOINER, "join");
    live.current.get("join")!.t0 = -1;

    const starts = new Map<string, number>();
    const timers: number[] = [];
    if (reduced) {
      ARRIVALS.forEach((_, i) => place(`a${i}`, 1));
    } else {
      ARRIVALS.forEach((_, i) => {
        timers.push(
          window.setTimeout(() => starts.set(`a${i}`, performance.now()), 900 + i * 1700)
        );
      });
    }

    // The joiner walks a normalised 0..1 along the same path. Hover drives
    // it toward 1, hover-out back toward 0, always from wherever it
    // currently is — so an interrupted walk turns around cleanly instead
    // of snapping.
    let joinT = 0;
    let joinTarget = 0;
    let joinLast = 0;

    const onJoin = (ev: Event) => {
      if (window.matchMedia("(pointer: coarse)").matches) return;
      joinTarget = (ev as CustomEvent<boolean>).detail === true ? 1 : 0;
    };
    window.addEventListener("tigerclub:join-hover", onJoin as EventListener);

    let raf = 0;
    const tick = (now: number) => {
      ARRIVALS.forEach((s, i) => {
        const key = `a${i}`;
        const st = starts.get(key);
        if (st === undefined) return;
        const t = Math.min((now - st) / s.ms, 1);
        place(key, t);
        if (t >= 1) starts.delete(key);
      });

      const dt = joinLast ? (now - joinLast) / JOINER.ms : 0;
      joinLast = now;
      if (joinT !== joinTarget) {
        const step = Math.min(dt, 0.05);
        joinT = joinTarget > joinT ? Math.min(joinT + step, 1) : Math.max(joinT - step, 0);
        place("join", joinT);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      window.removeEventListener("tigerclub:join-hover", onJoin as EventListener);
      live.current.forEach((L) => {
        L.el.remove();
        L.sh.remove();
      });
      live.current.clear();
    };
  }, []);

  return (
    <div aria-hidden="true" className="hero-crowd" ref={wrap}>
      <div className={`hero-crowd-art ${mob ? "is-mobile" : ""}`} />
      {mob && <div className="hero-crowd-art-b" />}
      <div className="hero-crowd-top" />
    </div>
  );
}
