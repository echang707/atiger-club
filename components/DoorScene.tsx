"use client";

/* The homepage hero's little scene: two little stick tigers (orange and
   gold) and an ATL door. Orange gets there first, takes the door knob and
   pulls the door open, stepping back with it, then holds it; gold
   nods thanks and hops through. Orange leans in to peek after it... and a
   gold paw reaches out of the doorway and pulls it inside. Slam. Drawn and animated in the same way as the
   Experiful explorer: inline SVG, every movement a CSS state (see
   .tc-scene in globals.css) switched on a short timeline below.

   Pauses off screen and in background tabs. Visitors who prefer reduced
   motion get one still frame: the door held open, both looking at each
   other. */

import { memo, useEffect, useRef } from "react";

const MARKUP = `<svg class="ground" viewBox="0 0 760 6" preserveAspectRatio="none" aria-hidden="true">
        <path d="M2 3.4C140 2.6 260 3.9 380 3.1s250 .7 376-.2" fill="none" stroke="rgba(21,19,14,0.22)" stroke-width="1.6" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
      </svg>
      <div class="door-wrap" data-door aria-hidden="true">
        <svg viewBox="0 0 46 66" class="door" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" focusable="false">
          <path class="door-light" d="M6.5 63 6.9 7.2c0-1.9 1.1-3 3-3l26-.3c2 0 3.2 1.1 3.2 3.1L39.4 63Z" fill="#FFC46B" stroke="none"/>
          <path d="M6.5 63.2 6.9 7.2c0-1.9 1.1-3 3-3l26-.3c2 0 3.2 1.1 3.2 3.1l.3 56.2"/>
          <g class="door-leaf">
            <path d="M6.7 63 7 7.3c0-1.9 1-2.9 2.9-2.9l25.9-.3c2 0 3.1 1.1 3.1 3L39.2 63Z" fill="#E0521C"/>
            <circle class="knob" cx="33.2" cy="46" r="1.5" fill="#F4E9D6" stroke="none"/>
            <text class="door-label" x="23" y="22" text-anchor="middle" fill="#F4E9D6" stroke="none">ATL</text>
          </g>
          <path d="M1.5 63.3c14.4-.5 28.7-.4 43 .1"/>
        </svg>
      </div>
      <div class="who who-a" data-a aria-hidden="true">
        <span class="face">
          <svg viewBox="0 0 40 56" class="explorer" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" focusable="false">
            <g class="explorer-body"><g class="tiger-tail"><path d="M19.8 35.4c-2.8 1.8-6.2 2.8-8.8 2-1.8-.6-2.6-2-2.2-3.6"/><circle cx="9.1" cy="33.1" r="1.6" fill="#E0521C" stroke-width="1.5"/></g>
              <path class="explorer-arm explorer-arm-back" d="M19.6 23.5 L14.6 29.4"/>
              <g class="explorer-pack">
                <rect x="6.6" y="19" width="10.8" height="14.6" rx="3.8" fill="#e0521c"/>
                <path d="M6.9 23.6C9.4 25.6 14.6 25.6 17.1 23.6" stroke-width="1.3"/>
                <rect x="8.8" y="27.2" width="6.4" height="4.6" rx="1.7" fill="#e0521c" stroke-width="1.3"/>
                <path d="M16.8 20.4C18.4 19.6 19.6 20 20.1 21.4" stroke-width="1.5"/>
              </g>
              <path d="M20 19.2c-.5 5.8.6 11.1 0 16.9"/>
              <g class="explorer-head"><g transform="translate(20.6 18.6) scale(1.1) translate(-20.6 -18.6)"><path d="M13.6 7.6c-1.1-3.4.1-5.8 2.2-5.6 1.3.1 2.4 1 2.9 2.4" fill="#E0521C" stroke-width="1.9"/><path d="M22.6 3.8c.8-1.5 2.1-2.2 3.5-1.8 1.9.6 2.4 3 1.6 5.6" fill="#E0521C" stroke-width="1.9"/><path d="M12.4 11.4c0-5 3.6-8.4 8.2-8.4s8.2 3.4 8.2 8.2c0 4.8-3.6 8-8.3 8-4.6 0-8.1-3.2-8.1-7.8Z" fill="#E0521C"/><path d="M19.6 3.4v1.9" stroke-width="1.35"/><path d="M22.4 3.5l-.3 1.8" stroke-width="1.35"/><path d="M22.6 14.3c.8.8 2 .8 2.8 0" stroke-width="1.15"/><g class="explorer-eyes"><g fill="#15130E" stroke="none"><circle cx="21.4" cy="10.9" r="1.55"/><circle cx="25.4" cy="10.7" r="1.55"/></g><g fill="#fff" stroke="none"><circle cx="21.95" cy="10.35" r=".55"/><circle cx="25.95" cy="10.15" r=".55"/></g></g></g></g>
              <g class="explorer-arm explorer-arm-front"><path d="M20.2 23.5 L25.6 29.2"/></g>
            </g>
            <path class="explorer-leg explorer-leg-a" d="M20 36 L23.6 47.2 L26.8 47.3"/>
            <path class="explorer-leg explorer-leg-b" d="M20 36 L16.6 47.3 L19.7 47.4"/>
          </svg>
        </span>
      </div>
      <div class="who who-b" data-b aria-hidden="true">
        <span class="face">
          <svg viewBox="0 0 40 56" class="explorer" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" focusable="false">
            <g class="explorer-body"><g class="tiger-tail"><path d="M19.8 35.4c-2.8 1.8-6.2 2.8-8.8 2-1.8-.6-2.6-2-2.2-3.6"/><circle cx="9.1" cy="33.1" r="1.6" fill="#F2A541" stroke-width="1.5"/></g>
              <path class="explorer-arm explorer-arm-back" d="M19.6 23.5 L14.6 29.4"/>
              <path d="M20 19.2c-.5 5.8.6 11.1 0 16.9"/>
              <g class="explorer-head"><g transform="translate(20.6 18.6) scale(1.1) translate(-20.6 -18.6)"><path d="M13.6 7.6c-1.1-3.4.1-5.8 2.2-5.6 1.3.1 2.4 1 2.9 2.4" fill="#F2A541" stroke-width="1.9"/><path d="M22.6 3.8c.8-1.5 2.1-2.2 3.5-1.8 1.9.6 2.4 3 1.6 5.6" fill="#F2A541" stroke-width="1.9"/><path d="M12.4 11.4c0-5 3.6-8.4 8.2-8.4s8.2 3.4 8.2 8.2c0 4.8-3.6 8-8.3 8-4.6 0-8.1-3.2-8.1-7.8Z" fill="#F2A541"/><path d="M19.6 3.4v1.9" stroke-width="1.35"/><path d="M22.4 3.5l-.3 1.8" stroke-width="1.35"/><path d="M22.6 14.3c.8.8 2 .8 2.8 0" stroke-width="1.15"/><g class="explorer-eyes"><g fill="#15130E" stroke="none"><circle cx="21.4" cy="10.9" r="1.55"/><circle cx="25.4" cy="10.7" r="1.55"/></g><g fill="#fff" stroke="none"><circle cx="21.95" cy="10.35" r=".55"/><circle cx="25.95" cy="10.15" r=".55"/></g></g></g></g>
              <g class="explorer-arm explorer-arm-front"><path d="M20.2 23.5 L25.6 29.2"/></g>
            </g>
            <path class="explorer-leg explorer-leg-a" d="M20 36 L23.6 47.2 L26.8 47.3"/>
            <path class="explorer-leg explorer-leg-b" d="M20 36 L16.6 47.3 L19.7 47.4"/>
          </svg>
        </span>
      </div>
      <div class="door-wrap grab-wrap" data-grabber aria-hidden="true">
        <svg viewBox="0 0 46 66" class="door" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" focusable="false">
          <g class="grab"><path d="M27 48.6 L17.4 48.6"/><circle cx="16" cy="48.6" r="2.5" fill="#F2A541" stroke-width="1.7"/><path d="M14.6 46.6 l-.9-1.2 M13.8 48.6 h-1.3 M14.6 50.6 l-.9 1.2" stroke-width="1.2"/></g>
        </svg>
      </div>`;

/* The drawing is inserted once, by hand, after mount, and the component
   never re-renders (memo, no state). This matters: the timeline below
   holds references to these exact SVG nodes. If React re-rendered and
   re-applied the markup (it did when the hero updated its "next up"
   label), the animation would keep running on detached copies and the
   visible scene would sit frozen. */
function DoorScene({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = MARKUP;
    return run(el);
  }, []);
  return (
    <div
      ref={ref}
      className={`tc-scene ${className}`}
      role="img"
      aria-label="Two tigers run up to a door marked ATL. Orange holds it open and gold hops through; then orange peeks inside and gets pulled in."
    />
  );
}

export default memo(DoorScene);

// the door's pull-open swing (must match .door-wrap[data-open] .door-leaf)
const PULL_MS = 760;
const PULL_EASE = "cubic-bezier(.45,0,.4,1)";

function run(track: HTMLElement): () => void {
  const door = track.querySelector<HTMLElement>("[data-door]")!;
  const A = track.querySelector<HTMLElement>("[data-a]")!;
  const B = track.querySelector<HTMLElement>("[data-b]")!;
  const paw = track.querySelector<HTMLElement>("[data-grabber]")!;
  const flag = (el: HTMLElement, name: string, on: boolean) =>
    on ? el.setAttribute(name, "") : el.removeAttribute(name);
  const both = (name: string, on: boolean) => { flag(A, name, on); flag(B, name, on); };

  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  let onScreen = true;
  let gen = 0;
  let alive = true;

  const place = (el: HTMLElement, x: number, ms = 0, ease = "linear") => {
    el.style.transition = `transform ${ms}ms ${ease}, opacity 260ms`;
    el.style.setProperty("--x", `${x}px`);
  };
  const geom = () => {
    const half = track.clientWidth / 2, w = A.offsetWidth, dw = door.offsetWidth;
    return {
      start: half + w * 0.7,        // just off either end of the track
      // The knob sits at x=33.2 of the 46-wide door; open, the leaf is
      // scaled to 0.2 about its hinge (x=7), which carries the knob to 12.24
      // (and the leaf's skew lifts it a little). A's paw is 7.89/40 of a
      // body width in front of its centre with the arm at reach, 4.69/40
      // with the arm raised to follow the lifted knob, so standing at these
      // two spots keeps the paw ON the knob from start to finish.
      approach: dw * (33.2 - 23) / 46 - w * 7.89 / 40,  // paw on the closed knob
      hold: dw * (12.24 - 23) / 46 - w * 4.69 / 40,     // paw on the open knob
      side: dw * 0.5 + w * 0.62,                        // B waits beside the door
      front: w * 0.16,              // B, in front of the open doorway
      peek: -dw * 0.217 - w * 0.15, // A, at the left edge of the doorway
      hole: dw * 0.06,              // the middle of the open doorway
      pulled: dw * 0.12,            // A, pulled well into the doorway
    };
  };
  const clear = () => {
    ["data-run", "data-look", "data-nod", "data-hop", "data-reach", "data-after",
     "data-peek", "data-drag", "data-back", "data-holdknob"].forEach((n) => both(n, false));
    ["data-open", "data-glow", "data-slam"].forEach((n) => flag(door, n, false));
    ["data-grab", "data-pull"].forEach((n) => flag(paw, n, false));
  };

  class Stop extends Error {}
  const wait = (ms: number, g: number) =>
    new Promise<void>((ok, no) => window.setTimeout(() => (alive && g === gen ? ok() : no(new Stop())), ms));

  async function loop(g: number) {
    for (;;) {
      const G = geom();
      clear();
      A.style.opacity = B.style.opacity = "0";
      place(A, -G.start); place(B, G.start);
      await wait(80, g);

      // A trots in and stops at the door, right by the knob
      A.style.opacity = "1";
      flag(A, "data-run", true);
      place(A, G.approach, 1150, "cubic-bezier(.3,.5,.4,1)");
      await wait(500, g);

      // B sets off a beat later, at an easier pace, and waits beside the door
      B.style.opacity = "1";
      flag(B, "data-run", true);
      place(B, G.side, 1700, "cubic-bezier(.25,.55,.35,1)");
      await wait(650, g);
      flag(A, "data-run", false);

      // A puts a paw on the knob...
      flag(A, "data-reach", true);
      await wait(280, g);
      // ...and pulls: the door swings toward its hinge and A steps back
      // with it, on the same timing curve, so the paw never leaves the knob
      flag(A, "data-back", true);
      flag(A, "data-holdknob", true);
      flag(door, "data-open", true);
      place(A, G.hold, PULL_MS, PULL_EASE);
      await wait(PULL_MS, g);
      flag(A, "data-back", false);
      flag(B, "data-run", false);
      await wait(160, g);

      // the way is open: B steps up in front of the doorway
      flag(B, "data-run", true);
      place(B, G.front, 380, "ease-in-out");
      await wait(380, g);
      flag(B, "data-run", false);
      flag(A, "data-holdknob", false);

      // "after you"
      flag(A, "data-reach", false);
      flag(A, "data-after", true);
      flag(A, "data-look", true);
      await wait(400, g);
      flag(B, "data-run", false);
      flag(B, "data-look", true);
      await wait(160, g);

      // B nods thanks and hops through
      flag(B, "data-nod", true);
      await wait(560, g);
      flag(B, "data-hop", true);
      await wait(420, g);
      B.style.transition = "none"; B.style.opacity = "0";
      flag(door, "data-glow", true);

      // A wanders up to the doorway and leans in for a peek
      await wait(380, g);
      flag(A, "data-after", false);
      flag(door, "data-glow", false);
      flag(A, "data-run", true);
      place(A, G.peek, 460, "ease-in-out");
      await wait(460, g);
      flag(A, "data-run", false);
      flag(A, "data-peek", true);
      await wait(900, g);

      // a gold paw reaches out, takes hold... and pulls A smoothly inside;
      // the paw draws back in step, so it stays on A the whole way
      flag(paw, "data-grab", true);
      await wait(300, g);
      flag(A, "data-look", false);
      flag(A, "data-drag", true);
      flag(paw, "data-pull", true);
      place(A, G.pulled, 520, "cubic-bezier(.5,0,.6,1)");
      await wait(520, g);
      A.style.transition = "none"; A.style.opacity = "0";
      flag(A, "data-peek", false);
      flag(A, "data-drag", false);
      flag(paw, "data-grab", false);
      flag(paw, "data-pull", false);
      flag(door, "data-glow", true);

      // SLAM
      await wait(160, g);
      flag(door, "data-open", false);
      flag(door, "data-slam", true);
      await wait(520, g);
      flag(door, "data-slam", false);
      flag(door, "data-glow", false);
      await wait(1000, g);
    }
  }

  const still = () => {
    const G = geom();
    clear();
    place(A, G.hold); place(B, G.front);
    A.style.opacity = B.style.opacity = "1";
    flag(A, "data-after", true);
    both("data-look", true);
    flag(door, "data-open", true);
  };

  const refresh = () => {
    const g = ++gen;
    if (mq.matches) still();
    else if (onScreen && !document.hidden) loop(g).catch((e) => { if (!(e instanceof Stop)) throw e; });
  };

  const io = "IntersectionObserver" in window
    ? new IntersectionObserver(([e]) => { if (onScreen !== e.isIntersecting) { onScreen = e.isIntersecting; refresh(); } })
    : null;
  io?.observe(track);
  let rw = track.clientWidth;
  const onResize = () => { if (track.clientWidth !== rw) { rw = track.clientWidth; refresh(); } };
  window.addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", refresh);
  mq.addEventListener?.("change", refresh);
  refresh();

  return () => {
    alive = false;
    gen++;
    io?.disconnect();
    window.removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", refresh);
    mq.removeEventListener?.("change", refresh);
  };
}
