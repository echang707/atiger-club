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
     Three separate measurements. They were previously ONE number, which
     was the bug: --hero-shift means "how far the artwork paints low",
     and the copy was being lifted by that same amount as though it meant
     "how far the section sits low". Those are different quantities, so
     the copy ended up over-corrected and too high. Each is now measured
     against what it actually controls.

       --hero-shift     the backdrop's own painted offset. Read back off
                        the rendered box and cancelled, so the artwork's
                        top edge lands on the top of the window and it
                        runs up under the header.
       --hero-flow-top  where the section starts in the document. Drives
                        the section's height so it ends at the fold.
       --hero-copy-fix  whatever it takes to land the copy's centre on
                        the target. Measured off the copy itself, so it
                        cannot inherit an error from the other two.

     --hero-vis-h is the real window height; `100svh` can disagree with
     what is on screen, and the difference comes off the bottom edge.
     ------------------------------------------------------------------ */
  useEffect(() => {
    const el = ref.current;
    const shell = el?.parentElement;
    if (!el || !shell) return;

    // The copy sits this far ABOVE the dead centre of the window. The
    // headline's line-height leaves a band of empty leading above the cap
    // height that belongs to the box but shows as nothing, so centring
    // the box leaves the letters looking low. The artwork's void centres
    // at 49.6% of its own height, i.e. on the window's centre, so this is
    // the only correction the copy needs.
    const OPTICAL = 30;

    let shift = 0;
    let copyFix = OPTICAL;

    const sync = () => {
      const visH = window.innerHeight;
      shell.style.setProperty("--hero-vis-h", `${visH}px`);
      shell.style.setProperty(
        "--hero-flow-top",
        `${Math.max(0, Math.round(shell.getBoundingClientRect().top + window.scrollY))}px`,
      );

      // Artwork: drive its painted top edge to the top of the window.
      for (let i = 0; i < 3; i++) {
        const docTop = el.getBoundingClientRect().top + window.scrollY;
        if (Math.abs(docTop) < 0.5) break;
        shift += docTop;
        shell.style.setProperty("--hero-shift", `${Math.round(shift)}px`);
      }

      // Copy: drive its centre to the target. Measured independently of
      // the artwork so an error in one cannot leak into the other.
      const copy = shell.querySelector<HTMLElement>(".hero-content");
      if (copy) {
        for (let i = 0; i < 3; i++) {
          const r = copy.getBoundingClientRect();
          const err =
            r.top + window.scrollY + r.height / 2 - (visH / 2 - OPTICAL);
          if (Math.abs(err) < 0.5) break;
          copyFix += err;
          shell.style.setProperty("--hero-copy-fix", `${Math.round(copyFix)}px`);
        }
      }
    };

    sync();
    window.addEventListener("resize", sync);
    // A webfont swapping in changes the copy's height, and can change the
    // height of whatever sits above the hero, so re-measure once the
    // fonts have settled.
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
