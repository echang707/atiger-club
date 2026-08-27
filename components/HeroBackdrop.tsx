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
       --hero-copy-fix  whatever it takes to land the HEADLINE'S INK on
                        the exact centre of the window. Measured off the
                        headline itself, so it cannot inherit an error
                        from the other two.

     --hero-vis-h is the real window height; `100svh` can disagree with
     what is on screen, and the difference comes off the bottom edge.
     ------------------------------------------------------------------ */
  useEffect(() => {
    const el = ref.current;
    const shell = el?.parentElement;
    if (!el || !shell) return;

    // Where the headline's INK sits inside its own box, in px from the
    // box top. This is not the box centre: the line box carries leading
    // above the cap height and the box is taller than the letters, so
    // centring the box leaves the letters high. Everything here comes
    // from the browser's own font metrics via canvas, so there is no
    // hand-tuned constant and it stays right if the font or size changes.
    const inkCentreInBox = (h1: HTMLElement): number => {
      const cs = getComputedStyle(h1);
      const size = parseFloat(cs.fontSize);
      const lineBox = parseFloat(cs.lineHeight) || size * 1.06;
      const fallback = lineBox / 2 + size * 0.05;
      try {
        const ctx = document.createElement("canvas").getContext("2d");
        if (!ctx) return fallback;
        ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${size}px ${cs.fontFamily}`;
        // If the canvas rejected the font string it silently keeps its
        // default (10px sans-serif) and would hand back metrics for the
        // wrong face, so check the assignment actually took.
        if (!ctx.font || ctx.font === "10px sans-serif") return fallback;
        const m = ctx.measureText("life is better together.");
        if (
          typeof m.fontBoundingBoxAscent !== "number" ||
          typeof m.actualBoundingBoxAscent !== "number"
        ) {
          return fallback;
        }
        // Half-leading centres the font's em box inside the line box, so
        // the baseline sits this far down; the ink is then measured
        // relative to that baseline.
        const halfLeading =
          (lineBox - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2;
        const baseline = halfLeading + m.fontBoundingBoxAscent;
        return (
          baseline +
          (m.actualBoundingBoxDescent - m.actualBoundingBoxAscent) / 2
        );
      } catch {
        return fallback;
      }
    };

    let shift = 0;
    let copyFix = 30;

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

      // Copy: drive the HEADLINE'S INK onto the exact centre of the
      // window — equal space above the letters and below them. Measured
      // on the headline itself, NOT on the .hero-content block: the block
      // also holds the 46px gap and the subline beneath it, so centring
      // the block hung the headline about 64px high.
      const h1 = shell.querySelector<HTMLElement>(".hero-tagline");
      if (h1) {
        for (let i = 0; i < 3; i++) {
          const r = h1.getBoundingClientRect();
          const err =
            r.top + window.scrollY + inkCentreInBox(h1) - visH / 2;
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
