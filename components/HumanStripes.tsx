"use client";

import { useEffect, useState } from "react";

/* ---------------------------------------------------------------------
   Hero crowd.

   The background is the supplied artwork, untouched and static. Nothing
   about the crowd itself is animated, recreated or redrawn.

   On top of it, eight real people walk in:

     • seven arrive one at a time after load, roughly every 1.7s, each
       from an off-screen edge to a predetermined open spot, where they
       stop and stay for the rest of the session;
     • an eighth is reserved for the "Join the Club" hover — walks in on
       hover, walks all the way back out on hover-out.

   Nothing fades. Ever. Each figure is mounted off-frame, translates in,
   and stays; the hover figure parks off-frame between hovers. There is no
   opacity transition anywhere in this component.

   THE WALK is a real cycle, not a slide. Each sprite is a four-frame
   sheet cut from the same aerial photography as the crowd, with the leg
   band sheared progressively per frame so the legs actually swing. The
   sheet is stepped with `steps(4)` while the element translates, so you
   get walking motion plus travel.

   SCALE is derived rather than guessed. Isolated figures in the artwork
   have a median height of 46px in a 1672px-wide source, so with the
   background at 132% of viewport width a person is

       46 / 1672 * 1.32 * 100vw  =  3.63vw

   Each arrival is then nudged by a per-person factor to match the exact
   apparent size of the people immediately around its destination — the
   crowd has perspective, so figures low in the frame are slightly larger.

   Every path is routed through the artwork's cream negative space and
   stays on its own side of the hero, so no figure ever crosses the
   headline, subline, logo, nav or CTA.
   --------------------------------------------------------------------- */

const BASE_VW = 3.63;
const FRAMES = 4;

type Arrival = {
  sprite: string;
  fw: number;          // frame width : height ratio source
  from: "left" | "right";
  x: number;           // destination, % of hero
  y: number;
  sy: number;          // entry height, % of hero
  scale: number;       // matched to neighbours at the destination
  flip: boolean;
  dur: number;
};

/* Destinations sit in gaps at the outer edges of the stripes, well clear
   of the copy. `scale` is tuned per spot against the neighbours there. */
const ARRIVALS: Arrival[] = [
  { sprite: "w00", fw: 153, from: "left",  x: 21.5, y: 30.0, sy: 26, scale: 0.86, flip: false, dur: 5.2 },
  { sprite: "w03", fw: 157, from: "right", x: 79.0, y: 26.5, sy: 24, scale: 0.84, flip: true,  dur: 5.0 },
  { sprite: "w06", fw: 142, from: "left",  x: 16.0, y: 47.0, sy: 44, scale: 0.95, flip: false, dur: 5.4 },
  { sprite: "w09", fw: 146, from: "right", x: 83.5, y: 44.0, sy: 42, scale: 0.93, flip: true,  dur: 5.2 },
  { sprite: "w11", fw: 148, from: "left",  x: 24.0, y: 63.0, sy: 62, scale: 1.04, flip: false, dur: 5.6 },
  { sprite: "w02", fw: 150, from: "right", x: 76.5, y: 66.0, sy: 66, scale: 1.07, flip: true,  dur: 5.4 },
  { sprite: "w08", fw: 148, from: "left",  x: 12.5, y: 79.0, sy: 80, scale: 1.14, flip: false, dur: 5.8 },
];

const JOINER: Arrival = {
  sprite: "w05", fw: 162, from: "right", x: 86.0, y: 71.5, sy: 70, scale: 1.10, flip: true, dur: 3.0,
};

function Walker({
  a,
  active,
  walking,
}: {
  a: Arrival;
  active: boolean;
  walking: boolean;
}) {
  const off = a.from === "left" ? -12 : 112;
  const h = BASE_VW * a.scale;
  return (
    <span
      className={`hero-walker${walking ? " is-walking" : ""}`}
      style={{
        height: `${h}vw`,
        width: `${(h * a.fw) / 190}vw`,
        left: `${active ? a.x : off}%`,
        top: `${active ? a.y : a.sy}%`,
        transform: `translate(-50%, -100%) scaleX(${a.flip ? -1 : 1})`,
        backgroundImage: `url(/images/walkers/${a.sprite}.webp)`,
        backgroundSize: `${FRAMES * 100}% 100%`,
        transition: `left ${a.dur}s linear, top ${a.dur}s linear`,
      }}
    />
  );
}

export default function HumanStripes() {
  const [mob, setMob] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [arrived, setArrived] = useState(0);     // how many of the 7 have set off
  const [walking, setWalking] = useState(0);     // how many are still mid-walk
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMob(mobile);
    setReduced(r);

    const timers: number[] = [];
    if (!r) {
      ARRIVALS.forEach((a, i) => {
        const start = 900 + i * 1700;
        timers.push(window.setTimeout(() => setArrived((n) => Math.max(n, i + 1)), start));
        timers.push(window.setTimeout(() => setWalking((n) => n | (1 << i)), start));
        timers.push(
          window.setTimeout(() => setWalking((n) => n & ~(1 << i)), start + a.dur * 1000)
        );
      });
    } else {
      setArrived(ARRIVALS.length);
    }

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const onJoin = (e: Event) => {
      if (coarse || mobile) return;
      setJoining((e as CustomEvent<boolean>).detail === true);
    };
    window.addEventListener("tigerclub:join-hover", onJoin as EventListener);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("tigerclub:join-hover", onJoin as EventListener);
    };
  }, []);

  return (
    <div aria-hidden="true" className="hero-crowd">
      <div className={`hero-crowd-art ${mob ? "is-mobile" : ""}`} />
      {mob && <div className="hero-crowd-art-b" />}
      <div className="hero-crowd-top" />

      {!mob &&
        ARRIVALS.map((a, i) => (
          <Walker key={a.sprite} a={a} active={i < arrived} walking={!reduced && !!(walking & (1 << i))} />
        ))}

      {!mob && <Walker a={JOINER} active={joining} walking={true} />}
    </div>
  );
}
