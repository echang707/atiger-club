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

const BASE_VW = 3.77;   // derived: 47px person / 1672px art * 134% bg
const FRAMES = 6;

type Spec = {
  sprite: string;
  fw: number;
  x: number; y: number;        // destination, % of hero
  cx: number; cy: number;      // bezier control point, % of hero
  from: "left" | "right";
  sy: number;
  scale: number;
  flip: boolean;
  ms: number;
};

/* Destinations were found by scanning the artwork itself: each is a spot
   with almost no ink in a tight radius (open ground you can stand in) but
   plenty of ink nearby (right beside a crowd). Scale rises toward the
   bottom of the frame because the artwork has perspective. */
const ARRIVALS: Spec[] = [
  { sprite: "w03", fw: 100, from: "left",  x: 19.5, y: 18.0, cx: 6,  cy: 13, sy: 12, scale: 0.80, flip: false, ms: 6200 },
  { sprite: "w09", fw: 76,  from: "right", x: 82.5, y: 20.0, cx: 96, cy: 15, sy: 14, scale: 0.82, flip: true,  ms: 6000 },
  { sprite: "w00", fw: 81,  from: "left",  x: 9.0,  y: 24.0, cx: 2,  cy: 20, sy: 19, scale: 0.84, flip: false, ms: 6400 },
  { sprite: "w02", fw: 81,  from: "right", x: 93.0, y: 18.0, cx: 99, cy: 13, sy: 12, scale: 0.80, flip: true,  ms: 6200 },
  { sprite: "w06", fw: 69,  from: "left",  x: 9.0,  y: 50.0, cx: 2,  cy: 44, sy: 43, scale: 0.98, flip: false, ms: 6600 },
  { sprite: "w08", fw: 76,  from: "right", x: 94.5, y: 68.0, cx: 99, cy: 62, sy: 61, scale: 1.10, flip: true,  ms: 6400 },
  { sprite: "w11", fw: 78,  from: "left",  x: 7.5,  y: 78.0, cx: 1,  cy: 84, sy: 86, scale: 1.18, flip: false, ms: 6800 },
];

const JOINER: Spec = {
  sprite: "w05", fw: 102, from: "right", x: 84.0, y: 80.0, cx: 99, cy: 86, sy: 88, scale: 1.20, flip: true, ms: 4200,
};


const OFF = (s: Spec) => (s.from === "left" ? -10 : 110);
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
      const h = BASE_VW * spec.scale;
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
      const x = bez(OFF(spec), spec.cx, spec.x, e);
      const y = bez(spec.sy, spec.cy, spec.y, e);

      // cadence follows distance covered, so the steps match the speed
      const phase = e * 34;
      const frame = Math.floor(phase) % FRAMES;
      const bob = t > 0 && t < 1 ? Math.sin(phase * Math.PI) * 0.22 : 0;
      const sway = t > 0 && t < 1 ? Math.sin(phase * Math.PI) * 1.1 : 0;

      // lean very slightly into the direction of travel
      const lean = t > 0 && t < 1 ? (spec.from === "left" ? 1.6 : -1.6) : 0;

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
