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
     --hero-top: how far down the document the hero actually starts.

     The header is meant to be `fixed`, in which case this is 0 and every
     rule that reads the variable falls back to exactly its old value.
     But if anything above the hero DOES take up flow — a header that
     isn't overlaying, a preview/dev bar, an announcement strip — the
     hero gets pushed down by that much and, because it is 100svh tall,
     an equal band falls off the bottom of the screen. That is what was
     clipping the picnic group off the bottom edge of the artwork.

     Measuring it rather than subtracting a hard-coded --nav-h means the
     hero is correct in both cases, and stays correct if the header's
     height or positioning changes later. `top` is read off the shell,
     not off this element, because this element is the one that gets
     moved by the result — reading it back would chase its own tail.
     ------------------------------------------------------------------ */
  useEffect(() => {
    const shell = ref.current?.parentElement;
    if (!shell) return;

    let last = -1;
    const measure = () => {
      const top = Math.max(
        0,
        Math.round(shell.getBoundingClientRect().top + window.scrollY),
      );
      if (top === last) return;
      last = top;
      shell.style.setProperty("--hero-top", `${top}px`);
    };

    measure();
    window.addEventListener("resize", measure);
    // A webfont swapping in can change the height of whatever sits above
    // the hero, so re-measure once the fonts have settled.
    document.fonts?.ready.then(measure).catch(() => {});

    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`hero-backdrop ${mob ? "is-mobile" : ""}`}
    />
  );
}
