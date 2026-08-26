"use client";

/* ---------------------------------------------------------------------
   The line under the hero headline.

   Fixed copy, no bullet, no animation. It used to cycle through ten
   prompts, which also caused a measurement problem: the copy changed
   length between renders, so the block's height moved and the hero's
   vertical centring drifted depending on which line happened to be
   showing.

   The `hero-subline` class is kept because the responsive sizing and
   every centring value tuned against it still apply.
   --------------------------------------------------------------------- */

const LINE = "meet people. experience atlanta.";

export default function RotatingLine(_props: {
  intervalMs?: number;
  startDelayMs?: number;
}) {
  return (
    <div className="flex w-full items-center justify-center">
      <p className="hero-subline mx-auto text-center font-sans lowercase">
        {LINE}
      </p>
    </div>
  );
}
