"use client";

/* The homepage hero's little scene: two Tiger Club explorers and an ATL
   door. One gets there first, opens the door and waves the other through,
   then follows them in. Drawn and animated in the same way as the
   Experiful explorer: inline SVG, every movement a CSS state (see
   .tc-scene in globals.css) switched on a short timeline below.

   Pauses off screen and in background tabs. Visitors who prefer reduced
   motion get one still frame: the door held open, both looking at each
   other. */

import { useEffect, useRef } from "react";

const MARKUP = `<svg class="ground" viewBox="0 0 760 6" preserveAspectRatio="none" aria-hidden="true">
        <path d="M2 3.4C140 2.6 260 3.9 380 3.1s250 .7 376-.2" fill="none" stroke="rgba(21,19,14,0.22)" stroke-width="1.6" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
      </svg>
      <div class="door-wrap" data-door aria-hidden="true">
        <svg viewBox="0 0 46 66" class="door" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" focusable="false">
          <path class="door-light" d="M6.5 63 6.9 7.2c0-1.9 1.1-3 3-3l26-.3c2 0 3.2 1.1 3.2 3.1L39.4 63Z" fill="#FFC46B" stroke="none"/>
          <path d="M6.5 63.2 6.9 7.2c0-1.9 1.1-3 3-3l26-.3c2 0 3.2 1.1 3.2 3.1l.3 56.2"/>
          <g class="door-leaf">
            <path d="M6.7 63 7 7.3c0-1.9 1-2.9 2.9-2.9l25.9-.3c2 0 3.1 1.1 3.1 3L39.2 63Z" fill="#E0521C"/>
            <circle cx="33.2" cy="37.5" r="1.5" fill="#F4E9D6" stroke="none"/>
            <text class="door-label" x="23" y="22" text-anchor="middle" fill="#F4E9D6" stroke="none">ATL</text>
          </g>
          <path d="M1.5 63.3c14.4-.5 28.7-.4 43 .1"/>
        </svg>
      </div>
      <div class="who who-a" data-a aria-hidden="true">
        <span class="face">
          <svg viewBox="0 0 40 56" class="explorer" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" focusable="false">
            <g class="explorer-body">
              <path class="explorer-arm explorer-arm-back" d="M19.6 23.5 L14.6 29.4"/>
              <g class="explorer-pack">
                <rect x="6.6" y="19" width="10.8" height="14.6" rx="3.8" fill="#e0521c"/>
                <path d="M6.9 23.6C9.4 25.6 14.6 25.6 17.1 23.6" stroke-width="1.3"/>
                <rect x="8.8" y="27.2" width="6.4" height="4.6" rx="1.7" fill="#e0521c" stroke-width="1.3"/>
                <path d="M16.8 20.4C18.4 19.6 19.6 20 20.1 21.4" stroke-width="1.5"/>
              </g>
              <path d="M20 19.2c-.5 5.8.6 11.1 0 16.9"/>
              <path class="explorer-head" d="M13 11.3c0-4.4 3.3-7.7 7.6-7.7 4.2 0 7.6 3.2 7.6 7.4 0 4.4-3.4 7.8-7.8 7.8-4.2 0-7.4-3.3-7.4-7.5Z" fill="#F4E9D6"/>
              <g class="explorer-eyes" fill="currentColor" stroke="none"><circle cx="21.4" cy="10.6" r="1"/><circle cx="25" cy="10.4" r="1"/></g>
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
            <g class="explorer-body">
              <path class="explorer-arm explorer-arm-back" d="M19.6 23.5 L14.6 29.4"/>
              <path d="M20 19.2c-.5 5.8.6 11.1 0 16.9"/>
              <path class="scarf-tail" d="M17.6 19.6c-1.6 1.7-2.9 3.6-3.6 6.1" stroke="#e0521c" stroke-width="2.8"/>
              <path class="explorer-head" d="M13 11.3c0-4.4 3.3-7.7 7.6-7.7 4.2 0 7.6 3.2 7.6 7.4 0 4.4-3.4 7.8-7.8 7.8-4.2 0-7.4-3.3-7.4-7.5Z" fill="#F4E9D6"/>
              <path d="M15.4 18.4c2.9 1.9 7.6 2 10.6-.1" stroke="#e0521c" stroke-width="3.2"/>
              <g class="explorer-eyes" fill="currentColor" stroke="none"><circle cx="21.4" cy="10.6" r="1"/><circle cx="25" cy="10.4" r="1"/></g>
              <g class="explorer-arm explorer-arm-front"><path d="M20.2 23.5 L25.6 29.2"/></g>
            </g>
            <path class="explorer-leg explorer-leg-a" d="M20 36 L23.6 47.2 L26.8 47.3"/>
            <path class="explorer-leg explorer-leg-b" d="M20 36 L16.6 47.3 L19.7 47.4"/>
          </svg>
        </span>
      </div>`;

export default function DoorScene({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? run(ref.current) : undefined), []);
  return (
    <div
      ref={ref}
      className={`tc-scene ${className}`}
      role="img"
      aria-label="Two people walk up to an orange door marked ATL. One opens it and waves the other through, then follows them in."
      dangerouslySetInnerHTML={{ __html: MARKUP }}
    />
  );
}

function run(track: HTMLElement): () => void {
  const door = track.querySelector<HTMLElement>("[data-door]")!;
  const A = track.querySelector<HTMLElement>("[data-a]")!;
  const B = track.querySelector<HTMLElement>("[data-b]")!;
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
      holder: dw * 0.5 + w * 0.32,  // A, holding the door, beside its hinge
      front: w * 0.16,              // B, in front of the open doorway
      inA: -w * 0.08,               // A, stepping into the doorway
    };
  };
  const clear = () => {
    ["data-run", "data-look", "data-nod", "data-hop", "data-reach", "data-after"].forEach((n) => both(n, false));
    ["data-open", "data-glow"].forEach((n) => flag(door, n, false));
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

      // A trots in and stops beside the door
      A.style.opacity = "1";
      flag(A, "data-run", true);
      place(A, -G.holder, 1150, "cubic-bezier(.3,.5,.4,1)");
      await wait(500, g);

      // B sets off a beat later, at an easier pace
      B.style.opacity = "1";
      flag(B, "data-run", true);
      place(B, G.front, 1700, "cubic-bezier(.25,.55,.35,1)");
      await wait(650, g);
      flag(A, "data-run", false);

      // A reaches for the door; it swings open
      flag(A, "data-reach", true);
      await wait(220, g);
      flag(door, "data-open", true);
      await wait(380, g);

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

      // A follows them in
      flag(A, "data-after", false);
      flag(A, "data-look", false);
      flag(A, "data-run", true);
      place(A, G.inA, 380, "cubic-bezier(.45,0,.55,1)");
      await wait(380, g);
      flag(A, "data-run", false);
      flag(A, "data-hop", true);
      await wait(300, g);
      flag(door, "data-glow", true);
      await wait(160, g);
      A.style.transition = "none"; A.style.opacity = "0";

      // the door swings shut behind them
      await wait(380, g);
      flag(door, "data-open", false);
      await wait(950, g);
    }
  }

  const still = () => {
    const G = geom();
    clear();
    place(A, -G.holder); place(B, G.front);
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
