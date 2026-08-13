"use client";

import { useEffect, useState } from "react";
import { SpriteDefs, SPRITE_IDS } from "./PersonSprites";

/* ---------------------------------------------------------------------
   Human tiger stripes.

   The stripes are a crowd. From across the room the bands read as tiger
   markings; up close every mark is a person with shoulders, arms, legs,
   shoes and a shadow (see PersonSprites.tsx).

   Composition follows the reference: dense, clumpy bands sweeping in from
   the outer left and right, with a wide calm middle. People are scattered
   across the *width* of each band rather than threaded along a line — the
   earlier version placed them on thin curves, which is why it read as
   dotted paths instead of crowds.

   A protected rectangle is carved out of the centre. Any figure whose
   final OR starting position falls inside it is discarded, so nothing
   ever touches the headline, the subline or the nav, at rest or mid-walk.

   Animation: the bulk of the crowd is already in place and only settles
   a few pixels, while a minority walk the full distance in from off-frame
   over 2–3s. That keeps the "people gathering" read without asking the
   browser to animate hundreds of long transitions.
   --------------------------------------------------------------------- */

/* Two coordinate spaces, not one.
   A landscape viewBox rendered with `slice` into a portrait phone crops
   the left and right edges away — which is exactly where the bands live,
   so mobile came out empty. Mobile therefore gets its own portrait
   viewBox and its own paths, with the bands running across the top and
   bottom instead of the sides. */
const VB = { w: 1600, h: 900 };
const VB_M = { w: 620, h: 1100 };

const SAFE = { x0: 470, x1: 1130, y0: 300, y1: 640 };
const SAFE_M = { x0: -40, x1: 660, y0: 330, y1: 720 };

type Band = { d: string; n: number; band: number; w: number };

const BANDS_DESKTOP: Band[] = [
  { d: "M-80 120 C 170 95, 340 175, 470 265", n: 78, band: 44, w: 1 },
  { d: "M-90 265 C 150 250, 320 330, 440 420", n: 70, band: 40, w: 1 },
  { d: "M-90 430 C 140 435, 300 515, 420 600", n: 64, band: 38, w: 1 },
  { d: "M-80 620 C 120 650, 280 705, 400 780", n: 54, band: 34, w: 1 },
  { d: "M1680 150 C 1440 130, 1270 210, 1150 300", n: 74, band: 42, w: 1 },
  { d: "M1690 340 C 1450 340, 1290 420, 1170 510", n: 66, band: 38, w: 1 },
  { d: "M1680 560 C 1440 575, 1280 655, 1160 745", n: 58, band: 36, w: 1 },
];

/* Portrait: bands sweep across the top and the bottom, leaving the
   middle of the screen clear for the copy. */
const BANDS_MOBILE: Band[] = [
  { d: "M-70 90 C 130 60, 340 120, 690 80", n: 40, band: 34, w: 1 },
  { d: "M-70 200 C 150 175, 360 235, 690 195", n: 34, band: 30, w: 1 },
  { d: "M-70 295 C 140 280, 330 330, 690 300", n: 26, band: 26, w: 1 },
  { d: "M-70 830 C 150 800, 360 865, 690 830", n: 34, band: 30, w: 1 },
  { d: "M-70 940 C 140 915, 350 975, 690 945", n: 32, band: 30, w: 1 },
  { d: "M-70 1050 C 150 1030, 350 1080, 690 1055", n: 24, band: 26, w: 1 },
];

type Person = {
  x: number; y: number; sx: number; sy: number;
  s: number; rot: number; id: string; delay: number; walker: boolean;
};

function build(bands: Band[], scale: number, vb: { w: number; h: number }, safe: typeof SAFE): Person[] {
  if (typeof document === "undefined") return [];
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("width", "0");
  svg.style.cssText = "position:absolute;opacity:0;pointer-events:none";
  document.body.appendChild(svg);

  let seed = 21;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648), seed / 2147483648);
  const inSafe = (x: number, y: number) =>
    x > safe.x0 - 40 && x < safe.x1 + 40 && y > safe.y0 - 40 && y < safe.y1 + 40;

  const out: Person[] = [];

  bands.forEach((b) => {
    const path = document.createElementNS(NS, "path");
    path.setAttribute("d", b.d);
    svg.appendChild(path);
    const len = path.getTotalLength();

    for (let i = 0; i < b.n; i += 1) {
      const t = rnd() * len;
      const p = path.getPointAtLength(t);
      const a = path.getPointAtLength(Math.max(t - 8, 0));
      const c = path.getPointAtLength(Math.min(t + 8, len));
      const dx = c.x - a.x, dy = c.y - a.y;
      const m = Math.hypot(dx, dy) || 1;
      // spread across the band, biased toward the middle so it clumps
      const u = (rnd() + rnd() + rnd()) / 3 - 0.5;
      const off = u * 2 * b.band;
      const x = p.x + (-dy / m) * off + (rnd() - 0.5) * 26;
      const y = p.y + (dx / m) * off + (rnd() - 0.5) * 22;
      if (inSafe(x, y)) continue;

      // a quarter of the crowd walks the full distance in from off-frame
      const walker = rnd() < 0.26;
      const fromLeft = x < vb.w / 2;
      const push = walker ? 300 + rnd() * 460 : 26 + rnd() * 54;
      const sx = x + (fromLeft ? -push : push);
      const sy = y + (rnd() - 0.5) * (walker ? 140 : 40);
      if (walker && inSafe(sx, sy)) continue;

      out.push({
        x, y, sx, sy,
        s: (0.82 + rnd() * 0.42) * scale,
        rot: (rnd() - 0.5) * 16,
        id: SPRITE_IDS[Math.floor(rnd() * SPRITE_IDS.length)],
        delay: walker ? 0.15 + rnd() * 1.9 : rnd() * 0.6,
        walker,
      });
    }
    path.remove();
  });

  svg.remove();
  return out;
}

export default function HumanStripes() {
  const [people, setPeople] = useState<Person[]>([]);
  const [assembled, setAssembled] = useState(false);
  const [joining, setJoining] = useState(false);
  const [mob, setMob] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    setMob(mobile);
    setPeople(
      mobile
        ? build(BANDS_MOBILE, 0.92, VB_M, SAFE_M)
        : build(BANDS_DESKTOP, 1, VB, SAFE)
    );

    if (reduced) {
      setAssembled(true);
    } else {
      requestAnimationFrame(() => requestAnimationFrame(() => setAssembled(true)));
    }

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const onJoin = (e: Event) => {
      if (coarse || mobile) return;
      setJoining((e as CustomEvent<boolean>).detail === true);
    };
    window.addEventListener("tigerclub:join-hover", onJoin as EventListener);
    return () => window.removeEventListener("tigerclub:join-hover", onJoin as EventListener);
  }, []);

  const W = 30, H = 44;
  const vb = mob ? VB_M : VB;
  const JOIN = mob
    ? { x: 470, y: 250, sx: 780, sy: 250 }
    : { x: 1232, y: 372, sx: 1780, sy: 320 };

  return (
    <div aria-hidden="true" className="human-stripes">
      <svg viewBox={`0 0 ${vb.w} ${vb.h}`} preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <defs>
          <SpriteDefs />
        </defs>

        {/* the one who joins on hover */}
        <use
          href="#tc-p2-0"
          width={W * 1.15}
          height={H * 1.15}
          className="tc-figure tc-joiner"
          style={{
            transform: joining
              ? `translate(${JOIN.x}px, ${JOIN.y}px)`
              : `translate(${JOIN.sx}px, ${JOIN.sy}px)`,
            opacity: joining ? 1 : 0,
          }}
        />

        {people.map((p, i) => (
          <use
            key={i}
            href={`#${p.id}`}
            width={W * p.s}
            height={H * p.s}
            className={p.walker ? "tc-figure tc-walker" : "tc-figure"}
            style={{
              transform: assembled
                ? `translate(${p.x}px, ${p.y}px) rotate(${p.rot}deg)`
                : `translate(${p.sx}px, ${p.sy}px) rotate(${p.rot}deg)`,
              opacity: assembled ? 1 : 0,
              transitionDelay: `${p.delay}s, ${p.delay}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
