"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setMob(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`hero-backdrop ${mob ? "is-mobile" : ""}`}
    />
  );
}
