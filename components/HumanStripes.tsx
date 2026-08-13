"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/* ---------------------------------------------------------------------
   Human tiger stripes.

   The hero's stripes are not artwork — they are a few hundred tiny people
   who walk in from the outer edges and assemble into sweeping bands. From
   across the room it reads as a tiger pattern; up close every mark is a
   figure with a head, shoulders and a shadow.

   How it is built, and why:

   • One `<symbol>` is defined once and stamped with `<use>`, so a few
     hundred figures cost one drawing definition rather than a few hundred
     independent shapes.
   • Positions are sampled off real bezier paths with `getPointAtLength`,
     then pushed sideways along the path normal by a random amount. That
     gives bands with organic thickness instead of beads on a wire.
   • The walk-in is a single CSS transform transition per figure with its
     own delay — no rAF loop, no per-frame JS, and the browser can hand
     the whole thing to the compositor.
   • A handful of figures are deliberately late: their slots sit empty for
     the first couple of seconds and they walk in afterwards to close the
     gap. That is the whole idea of the piece, so it is explicit in the
     data rather than emergent.

   The stripes enter from the left and right edges only. The centre column
   is left deliberately empty so the typography always sits on clean cream
   — the animation frames the copy and never runs behind it.
   --------------------------------------------------------------------- */

const VB_W = 1600;
const VB_H = 900;

/* Bands sweep in from the outer edges and stop short of the middle. */
const STRIPES_DESKTOP = [
  { d: "M-60 150 C 220 120, 430 210, 610 300", n: 46, band: 34 },
  { d: "M-60 300 C 200 285, 400 360, 560 430", n: 40, band: 30 },
  { d: "M-70 470 C 180 470, 360 540, 520 620", n: 38, band: 30 },
  { d: "M-60 660 C 160 690, 330 730, 470 790", n: 30, band: 26 },
  { d: "M1660 190 C 1420 170, 1230 250, 1080 330", n: 42, band: 32 },
  { d: "M1670 380 C 1440 380, 1250 450, 1110 540", n: 40, band: 30 },
  { d: "M1660 600 C 1430 610, 1240 690, 1090 780", n: 34, band: 28 },
];

/* Mobile: fewer people, fewer bands, and they hug the very top and bottom
   so the middle of a narrow screen stays clear for the copy. */
const STRIPES_MOBILE = [
  { d: "M-40 90 C 170 70, 330 140, 470 210", n: 30, band: 30 },
  { d: "M-40 230 C 150 230, 300 290, 430 350", n: 26, band: 26 },
  { d: "M-30 380 C 130 400, 250 450, 360 500", n: 18, band: 22 },
  { d: "M1640 560 C 1440 570, 1290 630, 1160 700", n: 28, band: 28 },
  { d: "M1640 730 C 1450 745, 1310 800, 1190 860", n: 24, band: 26 },
];

type Person = {
  x: number;
  y: number;
  sx: number;
  sy: number;
  s: number;
  c: string;
  delay: number;
  idle: number;
};

const ORANGE = "#E0521C";
const CHAR = "#2B2723";
const WARM = "#C9793F";
const SAND = "#E8DCC6";

/* Weighted so a band reads mostly orange-and-charcoal, with a few paler
   figures breaking up the mass the way a crowd actually looks. */
function pickColour(r: number) {
  if (r < 0.44) return ORANGE;
  if (r < 0.84) return CHAR;
  if (r < 0.93) return WARM;
  return SAND;
}

function buildPeople(stripes: typeof STRIPES_DESKTOP): Person[] {
  if (typeof document === "undefined") return [];
  const svgNS = "http://www.w3.org/2000/svg";
  const scratch = document.createElementNS(svgNS, "svg");
  scratch.setAttribute("width", "0");
  scratch.setAttribute("height", "0");
  scratch.style.position = "absolute";
  scratch.style.opacity = "0";
  scratch.style.pointerEvents = "none";
  document.body.appendChild(scratch);

  const out: Person[] = [];
  let seed = 7;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };

  stripes.forEach((st) => {
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", st.d);
    scratch.appendChild(path);
    const len = path.getTotalLength();

    for (let i = 0; i < st.n; i += 1) {
      const t = ((i + rnd() * 0.85) / st.n) * len;
      const p = path.getPointAtLength(Math.min(t, len));
      const a = path.getPointAtLength(Math.max(t - 6, 0));
      const b = path.getPointAtLength(Math.min(t + 6, len));
      // unit normal, so people spread across the band rather than along a line
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const m = Math.hypot(dx, dy) || 1;
      const nx = -dy / m;
      const ny = dx / m;
      const off = (rnd() - 0.5) * 2 * st.band;

      const x = p.x + nx * off + (rnd() - 0.5) * 10;
      const y = p.y + ny * off + (rnd() - 0.5) * 10;

      // walk in from further out, in the direction of the nearer edge
      const fromLeft = p.x < VB_W / 2;
      const push = 160 + rnd() * 320;
      const sx = x + (fromLeft ? -push : push);
      const sy = y + (rnd() - 0.5) * 120;

      // a few arrive late, closing a visible gap in the band
      const late = rnd() < 0.06;
      const delay = late ? 2.1 + rnd() * 1.1 : 0.1 + rnd() * 1.5;

      out.push({
        x,
        y,
        sx,
        sy,
        s: 0.86 + rnd() * 0.4,
        c: pickColour(rnd()),
        delay,
        idle: rnd() * 9,
      });
    }
    path.remove();
  });

  scratch.remove();
  return out;
}

export default function HumanStripes() {
  const [people, setPeople] = useState<Person[]>([]);
  const [assembled, setAssembled] = useState(false);
  // One extra figure, reserved for the Join hover. It has a slot kept
  // empty for it in a band; on hover it walks in and fills the gap, and
  // when the hover ends it turns around and walks back out. Nobody else
  // in the crowd reacts.
  const [joining, setJoining] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    setPeople(buildPeople(mobile ? STRIPES_MOBILE : STRIPES_DESKTOP));

    if (reduced.current) {
      setAssembled(true);
      return;
    }
    // one frame at the scattered positions, then release them
    const id = window.setTimeout(() => setAssembled(true), 60);

    // Skip the hover behaviour on touch. Testing for a COARSE pointer is
    // the right check: requiring `pointer: fine` also excludes browsers
    // that simply don't report one, which silently disabled this.
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const onJoin = (e: Event) => {
      if (coarse || mobile) return;
      setJoining((e as CustomEvent<boolean>).detail === true);
    };
    window.addEventListener("tigerclub:join-hover", onJoin as EventListener);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("tigerclub:join-hover", onJoin as EventListener);
    };
  }, []);

  // The gap this person completes: a real hole left in the upper-right band.
  const JOINER = { x: 1196, y: 388, sx: 1760, sy: 300 };

  const symbol = useMemo(
    () => (
      <symbol id="tc-person" viewBox="0 0 12 18">
        {/* shadow on the ground, sold from above */}
        <ellipse cx="6" cy="15.6" rx="4.1" ry="1.5" fill="#15130E" opacity="0.12" />
        {/* shoulders / torso */}
        <path
          d="M6 6.4c2.5 0 4 1.8 4.2 4.2.15 1.9-.4 3.3-1.1 3.9-.9.8-5.3.8-6.2 0-.7-.6-1.25-2-1.1-3.9C2 8.2 3.5 6.4 6 6.4Z"
          fill="currentColor"
        />
        {/* head */}
        <circle cx="6" cy="3.9" r="2.9" fill="currentColor" />
        {/* a lighter crown, so the head reads separately from the body */}
        <circle cx="6" cy="3.5" r="1.5" fill="#F4E9D6" opacity="0.16" />
      </symbol>
    ),
    []
  );

  return (
    <div aria-hidden="true" className="human-stripes">
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <defs>{symbol}</defs>
        {/* the one who joins on hover */}
        <use
          href="#tc-person"
          width={13.4}
          height={20}
          className="tc-figure tc-joiner"
          style={{
            color: ORANGE,
            transform: joining
              ? `translate(${JOINER.x}px, ${JOINER.y}px)`
              : `translate(${JOINER.sx}px, ${JOINER.sy}px)`,
            opacity: joining ? 1 : 0,
          }}
        />

        {people.map((p, i) => (
          <use
            key={i}
            href="#tc-person"
            width={13 * p.s}
            height={19.5 * p.s}
            className="tc-figure"
            style={{
              color: p.c,
              transform: assembled
                ? `translate(${p.x}px, ${p.y}px)`
                : `translate(${p.sx}px, ${p.sy}px)`,
              opacity: assembled ? 1 : 0,
              transitionDelay: `${p.delay}s, ${p.delay}s`,
              animationDelay: `${p.delay + 1.6 + p.idle}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
