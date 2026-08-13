"use client";

import { useEffect, useState } from "react";

/* ---------------------------------------------------------------------
   Hero crowd.

   The artwork is the hero. It loads complete — there is no assembly, no
   walk-in, no fade, nothing animated on load at all.

   The only motion on this screen is one person, and only on hover of
   "Join the Club": they walk in from the nearest outer edge, join a gap
   at the outer end of a stripe, and stop. On hover-out the same person
   turns around and walks back off the edge. No opacity is ever animated —
   the figure is simply parked off-frame when idle, so nothing fades in or
   out, and it is never unmounted mid-walk.

   Matching the crowd was the hard part and it is done by measurement, not
   by eye: isolated figures in the artwork have a median height of 39.5px
   in a 1672px-wide source. With the background rendered at 130% of the
   viewport width, a person is therefore

       39.5 / 1672 * 1.30 * 100vw  =  3.07vw

   which is what the joiner is sized to. The sprite is cut from the same
   family of aerial figures — same angle, same lighting, same soft
   shadow — so at rest it should be impossible to pick out.

   The same sprite, path, size and destination are used on every hover, so
   the interaction reads as deliberate rather than random. Disabled on
   touch.
   --------------------------------------------------------------------- */

/* One figure in the artwork, expressed in vw. See derivation above. */
const PERSON_VW = 3.07;

/* Destination: the outer end of the lower-right stripe, far from the copy. */
const DEST = { x: 87.5, y: 69 };
const EXIT = { x: 112, y: 66 };

export default function HumanStripes() {
  const [mob, setMob] = useState(false);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    setMob(mobile);

    const onJoin = (e: Event) => {
      if (coarse || mobile) return;
      setJoining((e as CustomEvent<boolean>).detail === true);
    };
    window.addEventListener("tigerclub:join-hover", onJoin as EventListener);
    return () => window.removeEventListener("tigerclub:join-hover", onJoin as EventListener);
  }, []);

  return (
    <div aria-hidden="true" className="hero-crowd">
      <div className={`hero-crowd-art ${mob ? "is-mobile" : ""}`} />
      {mob && <div className="hero-crowd-art-b" />}
      {/* keeps the nav legible where the artwork runs under it */}
      <div className="hero-crowd-top" />

      {!mob && (
        <img
          src="/images/walkers/w05.webp"
          alt=""
          className="hero-joiner"
          style={{
            height: `${PERSON_VW}vw`,
            left: `${joining ? DEST.x : EXIT.x}%`,
            top: `${joining ? DEST.y : EXIT.y}%`,
            // facing left on the way in, right on the way back out
            transform: `translate(-50%, -100%) scaleX(${joining ? -1 : 1})`,
          }}
        />
      )}
    </div>
  );
}
