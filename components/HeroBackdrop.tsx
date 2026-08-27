"use client";

import { useEffect, useRef, useState } from "react";

/* ---------------------------------------------------------------------
   Hero backdrop.

   One static illustration, and nothing else. This replaces the whole
   crowd-animation system — the eight walking figures, their sprite
   sheets, the shadow layer, the rAF loop, the solved bezier routes and
   the Join-hover joiner are all gone. The hero is now a picture.

   Desktop and mobile get their own artwork rather than one image being
   re-cropped, since the two compositions leave their clear space in
   different places.
   --------------------------------------------------------------------- */

export default function HeroBackdrop() {
  const [mob, setMob] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setMob(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  /* ------------------------------------------------------------------
     Pin the artwork to the top of the window.

     Something above the hero pushes it down — the header is `fixed` and
     should take no flow space, but measuring the SECTION's offset came
     back 0 while the picture still painted ~80px low, so the cause is
     not the section's position in flow. Rather than keep guessing at the
     cause, this measures the effect: where this element actually lands.

     `docTop` is where the artwork's top edge really sits in the document.
     We want 0 — flush with the top of the window, running up under the
     header. Whatever it reads, we fold that straight into --hero-shift
     and re-measure; it converges on the first pass and the loop is only
     there in case a layer we can't see moves it again. Because it reads
     back its own painted position, it is correct regardless of WHY the
     artwork was displaced.

     --hero-vis-h is the real visible window height. The height was
     `100svh`, and if svh disagrees with what is actually on screen by
     even a few px, the bottom edge of the picture goes with it. This
     removes that whole class of problem by measuring instead.
     ------------------------------------------------------------------ */
  useEffect(() => {
    const el = ref.current;
    const shell = el?.parentElement;
    if (!el || !shell) return;

    let shift = 0;
    const sync = () => {
      shell.style.setProperty("--hero-vis-h", `${window.innerHeight}px`);
      // Converges on the first iteration; the extra passes are cheap
      // insurance against another layer shifting things underneath us.
      for (let i = 0; i < 3; i++) {
        const docTop = el.getBoundingClientRect().top + window.scrollY;
        if (Math.abs(docTop) < 0.5) break;
        shift += docTop;
        shell.style.setProperty("--hero-shift", `${Math.round(shift)}px`);
      }
    };

    sync();
    window.addEventListener("resize", sync);
    // A webfont swapping in can change the height of whatever sits above
    // the hero, so re-measure once the fonts have settled.
    document.fonts?.ready.then(sync).catch(() => {});

    return () => window.removeEventListener("resize", sync);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`hero-backdrop ${mob ? "is-mobile" : ""}`}
    />
  );
}
