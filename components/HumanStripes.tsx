"use client";

import { useEffect, useState } from "react";

/* ---------------------------------------------------------------------
   Hero crowd.

   The assembled state is the crowd photograph itself
   (`/images/crowd-stripes.webp`) — dense, overlapping, real bodies with
   real shadows. Nothing about it is procedurally drawn. Its cream was
   colour-matched to #F4E9D6 so it sits on the page rather than on top of
   it, and it is positioned so both bands stay out at the edges with the
   centre left clear.

   Only the ARRIVAL is animated, and only with real people: fourteen
   transparent cutouts lifted from the close-up reference, each with its
   own shadow. They start scattered off the outer edges, walk toward the
   bands over ~2–3s, and fade out as they reach them — so the crowd looks
   like it assembled, without redrawing a single figure.

   Every walker's whole travel line is kept outside a protected centre
   box, so nothing crosses the headline, subline, nav or CTA at any point
   in the animation.
   --------------------------------------------------------------------- */

const SPRITES = Array.from({ length: 14 }, (_, i) => `/images/walkers/w${String(i).padStart(2, "0")}.webp`);

type Walker = {
  src: string;
  x: number;   // destination, % of hero box
  y: number;
  sx: number;  // start, % of hero box
  sy: number;
  h: number;   // height in vh-ish units
  delay: number;
  dur: number;
  flip: boolean;
};

/* Destinations sit ON the printed bands, so a walker dissolves into a
   crowd that is already there. Left column x<26, right column x>74 —
   the centre is never entered. */
const DEST_DESKTOP: [number, number][] = [
  [8, 26], [15, 34], [21, 44], [6, 52], [13, 62], [19, 72], [10, 80],
  [92, 24], [85, 33], [79, 43], [94, 55], [87, 64], [81, 74], [90, 84],
];

const DEST_MOBILE: [number, number][] = [
  [14, 12], [30, 17], [52, 12], [70, 19], [86, 14], [22, 24], [64, 25],
  [16, 78], [34, 84], [55, 79], [74, 86], [88, 80], [26, 90], [66, 92],
];

function buildWalkers(mobile: boolean): Walker[] {
  const dest = mobile ? DEST_MOBILE : DEST_DESKTOP;
  let seed = 11;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648), seed / 2147483648);

  return dest.map(([x, y], i) => {
    const fromLeft = x < 50;
    // start well outside the frame on the nearer side, so the walk-in
    // line never crosses the middle of the hero
    const sx = fromLeft ? -14 - rnd() * 16 : 114 + rnd() * 16;
    const sy = y + (rnd() - 0.5) * 14;
    return {
      src: SPRITES[i % SPRITES.length],
      x, y, sx, sy,
      h: (mobile ? 5.4 : 7.2) * (0.82 + rnd() * 0.4),
      delay: 0.25 + rnd() * 1.5,
      dur: 2.3 + rnd() * 1.1,
      flip: !fromLeft,
    };
  });
}

export default function HumanStripes() {
  const [walkers, setWalkers] = useState<Walker[]>([]);
  const [go, setGo] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [joining, setJoining] = useState(false);
  const [mob, setMob] = useState(false);

  useEffect(() => {
    const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    setReduced(r);
    setMob(mobile);
    setWalkers(buildWalkers(mobile));
    if (!r) requestAnimationFrame(() => requestAnimationFrame(() => setGo(true)));

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const onJoin = (e: Event) => {
      if (coarse || mobile) return;
      setJoining((e as CustomEvent<boolean>).detail === true);
    };
    window.addEventListener("tigerclub:join-hover", onJoin as EventListener);
    return () => window.removeEventListener("tigerclub:join-hover", onJoin as EventListener);
  }, []);

  const joinDest = mob ? { x: 78, y: 20 } : { x: 88, y: 40 };

  return (
    <div aria-hidden="true" className="hero-crowd">
      {/* the assembled crowd — the artwork itself, never redrawn */}
      <div className={`hero-crowd-art ${mob ? "is-mobile" : ""}`} />
      {mob && <div className="hero-crowd-art-b" />}

      {/* real people walking in, then dissolving into it */}
      {!reduced &&
        walkers.map((w, i) => (
          <img
            key={i}
            src={w.src}
            alt=""
            className="hero-walker"
            style={{
              height: `${w.h}vh`,
              left: `${go ? w.x : w.sx}%`,
              top: `${go ? w.y : w.sy}%`,
              opacity: go ? 0 : 0.96,
              transform: `translate(-50%, -100%) scaleX(${w.flip ? -1 : 1})`,
              transition: `left ${w.dur}s cubic-bezier(0.4,0,0.3,1) ${w.delay}s,
                           top ${w.dur}s cubic-bezier(0.4,0,0.3,1) ${w.delay}s,
                           opacity 0.8s ease-in ${w.delay + w.dur - 0.5}s`,
            }}
          />
        ))}

      {/* the one who joins on hover */}
      <img
        src={SPRITES[5]}
        alt=""
        className="hero-walker hero-joiner"
        style={{
          height: `${mob ? 5.6 : 7.6}vh`,
          left: `${joining ? joinDest.x : 116}%`,
          top: `${joining ? joinDest.y : joinDest.y + 4}%`,
          opacity: joining ? 1 : 0,
          transform: "translate(-50%, -100%) scaleX(-1)",
        }}
      />
    </div>
  );
}
