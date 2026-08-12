"use client";

/* ---------------------------------------------------------------------
   One oversized graphic per principle, filling the right third of the
   row so that side reads as composed rather than empty.

   Built entirely from divs and borders — no illustrations, no icons, no
   boxes around them, no gradients. Everything is near-black at low
   opacity with one restrained orange accent each, so they sit behind the
   type as editorial furniture rather than competing with it.

   The row's typography and horizontal structure are untouched: these are
   absolutely positioned and aria-hidden, and they disappear entirely on
   small screens where there is no empty right side to fill.
   --------------------------------------------------------------------- */

export default function PrincipleMark({ kind }: { kind: "01" | "02" | "03" | "04" }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 select-none md:block"
    >
      <div className="relative h-full w-full">
        {kind === "01" && <ArrowIn />}
        {kind === "02" && <Overlap />}
        {kind === "03" && <BreakOut />}
        {kind === "04" && <Spark />}
      </div>
    </div>
  );
}

/* Rows are short, so every mark is sized to sit inside the row height —
   an earlier pass drew circles taller than the row and they clipped into
   arcs. Sizes below are deliberately just under the row's content box. */

/* 01 — an oversized arrow pointing back inward, toward the claim. */
function ArrowIn() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="relative h-[120px] w-[300px] lg:w-[380px]">
        <div className="absolute left-0 top-1/2 h-[3px] w-full -translate-y-1/2 bg-ink/35" />
        {/* head: two bars meeting at the shaft's left end */}
        <div className="absolute left-0 top-1/2 h-[3px] w-[86px] origin-left -translate-y-1/2 rotate-[36deg] bg-tiger/55 lg:w-[104px]" />
        <div className="absolute left-0 top-1/2 h-[3px] w-[86px] origin-left -translate-y-1/2 -rotate-[36deg] bg-tiger/55 lg:w-[104px]" />
      </div>
    </div>
  );
}

/* 02 — two large outlined circles, overlapping. */
function Overlap() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="relative h-[126px] w-[210px] lg:h-[150px] lg:w-[252px]">
        <div className="absolute left-0 top-0 h-[126px] w-[126px] rounded-full border-[3px] border-ink/30 lg:h-[150px] lg:w-[150px]" />
        <div className="absolute right-0 top-0 h-[126px] w-[126px] rounded-full border-[3px] border-tiger/55 lg:h-[150px] lg:w-[150px]" />
      </div>
    </div>
  );
}

/* 03 — the numeral itself, rotated and hung off the edge of the row. */
function BreakOut() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[13deg]">
      <span className="block font-wordmark text-[150px] font-extrabold leading-none text-ink/[0.16] lg:text-[190px]">
        0<span className="text-tiger/38">3</span>
      </span>
    </div>
  );
}

/* 04 — a four-point spark. */
function Spark() {
  const star =
    "polygon(50% 0%, 57% 43%, 100% 50%, 57% 57%, 50% 100%, 43% 57%, 0% 50%, 43% 43%)";
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="relative h-[178px] w-[178px] lg:h-[210px] lg:w-[210px]">
        <div className="absolute inset-0 bg-ink/24" style={{ clipPath: star }} />
        <div
          className="absolute left-1/2 top-1/2 h-[58px] w-[58px] -translate-x-1/2 -translate-y-1/2 bg-tiger/50 lg:h-[70px] lg:w-[70px]"
          style={{ clipPath: star }}
        />
      </div>
    </div>
  );
}
