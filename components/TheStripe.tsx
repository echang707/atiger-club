"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";

type Pt = { x: number; y: number };

// A page can opt individual elements into the route by giving them
// `data-stripe-anchor` (see ScrollStory.tsx for the pattern: the hero
// photo, the word "connected" in the pull-quote, each scattered memory
// photo, and the closing CTA). On mount we measure where those elements
// actually landed and thread the stripe through them, in document
// order, so the line has a reason to be where it is — it's visiting
// things — instead of an arbitrary decorative squiggle.
//
// The Stripe only runs on the homepage. Events and Work With Us don't
// have a chain of photos/quotes for it to connect, so rather than fake
// a route there it's simply not rendered on those pages.
const START: Pt = { x: 35, y: 0 };

// Catmull-Rom → cubic-bezier sampling, so the route through a sparse set
// of anchor points still reads as one continuous, gently curving stripe
// rather than straight dot-to-dot segments.
function sampleSmooth(points: Pt[], perSegment = 22): Pt[] {
  const p = points;
  if (p.length < 2) return p;
  const out: Pt[] = [];
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] || p2;
    for (let s = 0; s < perSegment; s++) {
      const t = s / perSegment;
      const t2 = t * t;
      const t3 = t2 * t;
      const x =
        0.5 *
        (2 * p1.x +
          (-p0.x + p2.x) * t +
          (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
          (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
      const y =
        0.5 *
        (2 * p1.y +
          (-p0.y + p2.y) * t +
          (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
          (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
      out.push({ x, y });
    }
  }
  out.push(p[p.length - 1]);
  return out;
}

// Turns the sampled centerline into a closed, filled ribbon. `widthAt(t)`
// is passed in rather than baked in here so the orange edge can be
// defined as "black's width plus a thin rim" instead of wobbling on its
// own independent phase — that's what previously let it balloon into a
// separate blobby shape instead of a tight outline.
function ribbonPath(samples: Pt[], widthAt: (t: number) => number): string {
  const n = samples.length;
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const prev = samples[Math.max(0, i - 1)];
    const next = samples[Math.min(n - 1, i + 1)];
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const w = widthAt(i / n);
    left.push({ x: samples[i].x + nx * w, y: samples[i].y + ny * w });
    right.push({ x: samples[i].x - nx * w, y: samples[i].y - ny * w });
  }
  return (
    `M ${left[0].x.toFixed(2)},${left[0].y.toFixed(2)} ` +
    left.slice(1).map((p) => `L ${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ") +
    " " +
    right.slice().reverse().map((p) => `L ${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ") +
    " Z"
  );
}

// Both ends of the whole route taper to a point over their first/last
// 3% — like a brush lifting off the page — instead of stopping on a
// blunt flat-cut edge. This is what gives the stripe a deliberate,
// clean finish at the bottom rather than looking like it just ran out.
function endTaper(t: number): number {
  const rampIn = Math.min(1, t / 0.03);
  const rampOut = Math.min(1, (1 - t) / 0.03);
  return Math.max(0, Math.min(rampIn, rampOut));
}

// Core (black) stripe width — a slim marker-line, not a band. Two
// overlapping sine waves at different frequencies keep a little organic
// breathing without reading as jagged at this smaller scale.
function coreWidth(t: number): number {
  const base = 0.34 + 0.14 * (0.6 * Math.sin(t * Math.PI * 8) + 0.4 * Math.sin(t * Math.PI * 19));
  return Math.max(0.16, base) * endTaper(t);
}

// Orange edge — always the core's width plus a thin, near-constant rim,
// so it hugs the black line as an outline instead of its own shape.
function edgeWidth(t: number): number {
  return coreWidth(t) + 0.22 * endTaper(t);
}

// A section can opt itself into "invert" with `data-stripe-invert` (see
// Ending.tsx) — the one dark section on the site, and the only place
// the black core needs to swap to a pale color so it doesn't vanish.
type Range = { y0: number; y1: number };

export default function TheStripe() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [points, setPoints] = useState<Pt[] | null>(null);
  const [invertRanges, setInvertRanges] = useState<Range[]>([]);
  const prefersReduced = useReducedMotion();

  const onHomepage = pathname === "/";

  const measure = useCallback(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-stripe-anchor]"));
    const docHeight = Math.max(document.documentElement.scrollHeight, 1);
    const winWidth = Math.max(document.documentElement.clientWidth, 1);

    const invertNodes = Array.from(document.querySelectorAll<HTMLElement>("[data-stripe-invert]"));
    setInvertRanges(
      invertNodes.map((el) => {
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        return { y0: (top / docHeight) * 1000, y1: ((top + rect.height) / docHeight) * 1000 };
      })
    );

    if (nodes.length < 2) {
      setPoints(null);
      return;
    }

    const anchors: Pt[] = nodes.map((el) => {
      const rect = el.getBoundingClientRect();
      const pageY = rect.top + window.scrollY + rect.height / 2;
      const x = ((rect.left + rect.width / 2) / winWidth) * 100;
      const y = (pageY / docHeight) * 1000;
      return { x: Math.max(8, Math.min(92, x)), y };
    });

    // Sort top-to-bottom, but anchors that land in the same rough band
    // of height (like the row of scattered photos) are ordered left to
    // right within that band instead of by their exact y — otherwise a
    // photo a few pixels higher than its neighbor jumps the queue and
    // the line visits them out of reading order.
    const BAND = 40;
    anchors.sort((a, b) => {
      const ba = Math.round(a.y / BAND);
      const bb = Math.round(b.y / BAND);
      if (ba !== bb) return ba - bb;
      return a.x - b.x;
    });

    // A little meander between each pair of anchors — alternating left
    // and right of the straight line between them — so the route still
    // wanders like the rest of the stripe instead of connecting the
    // dots in perfectly straight hops. The bend is scaled down when two
    // anchors sit close together vertically, so a short gap gets a
    // gentle curve instead of a sharp diagonal kink that reads as a
    // separate chunk rather than part of one continuous line.
    const route: Pt[] = [START];
    anchors.forEach((a, i) => {
      const prev = i === 0 ? START : anchors[i - 1];
      const gapY = Math.max(1, a.y - prev.y);
      const bend = Math.min(16, gapY * 0.4) * (i % 2 === 0 ? 1 : -1);
      const midX = (prev.x + a.x) / 2 + bend;
      const midY = (prev.y + a.y) / 2;
      route.push({ x: Math.max(6, Math.min(94, midX)), y: midY });
      route.push(a);
    });

    // A short, deliberate tail past the last anchor (the closing CTA)
    // that tapers to a point — not a long arbitrary meander all the way
    // to the bottom of the document.
    const last = anchors[anchors.length - 1];
    const tailDir = last.x > 50 ? -14 : 14;
    route.push({
      x: Math.max(6, Math.min(94, last.x + tailDir)),
      y: Math.min(1000, last.y + 70),
    });

    setPoints(route);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !onHomepage) return;
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    window.addEventListener("load", measure);
    // Images and web fonts can still land after first paint and shift
    // layout, so re-measure a couple of times after mount rather than
    // trusting the very first pass.
    const t1 = setTimeout(measure, 400);
    const t2 = setTimeout(measure, 1400);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", measure);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [mounted, onHomepage, measure]);

  // Tied to real scroll position, but through a spring — the same idea
  // as a raw 1:1 tie, except a spring has a little momentum, so it
  // eases and gently settles rather than snapping to a dead stop the
  // instant you stop scrolling. That momentum is what actually reads
  // as "flowing." Tuned tight (high stiffness, high damping) so that
  // momentum stays a few frames of settle, not the multi-second trail
  // a looser spring gives you — it should never feel like it's catching
  // up from behind, only like it has a bit of its own life to it.
  const { scrollYProgress } = useScroll();
  const revealProgress = useSpring(scrollYProgress, { stiffness: 320, damping: 38, mass: 0.4 });
  const revealHeight = useTransform(revealProgress, (v) => v * 1000);

  const { blackD, orangeD } = useMemo(() => {
    if (!points) return { blackD: "", orangeD: "" };
    const samples = sampleSmooth(points, 22);
    return {
      blackD: ribbonPath(samples, coreWidth),
      orangeD: ribbonPath(samples, edgeWidth),
    };
  }, [points]);

  if (!mounted || !onHomepage || !points) return null;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ zIndex: -1 }}
      viewBox="0 0 100 1000"
      preserveAspectRatio="none"
    >
      {invertRanges.map((r, i) => (
        <clipPath key={i} id={`stripeInvert-${i}`} clipPathUnits="userSpaceOnUse">
          <rect x="0" y={r.y0} width="100" height={Math.max(0, r.y1 - r.y0)} />
        </clipPath>
      ))}

      <clipPath id="stripeReveal" clipPathUnits="userSpaceOnUse">
        {prefersReduced ? (
          <rect x="0" y="0" width="100" height={1000} />
        ) : (
          // `height` is passed as a direct prop (a MotionValue), not
          // through `style`. Elements inside a <clipPath> aren't part
          // of the normal rendered box tree, so browsers don't
          // reliably apply CSS-driven sizing to them — the spring
          // would compute correctly but the rect just wouldn't move.
          // Framer Motion lets any prop take a MotionValue directly,
          // which sets the raw SVG attribute every frame instead of
          // going through CSS, so it animates regardless.
          <motion.rect x="0" y="0" width="100" height={revealHeight} />
        )}
      </clipPath>

      <g clipPath="url(#stripeReveal)">
        {/* Thin orange edge, hugging the black core as a tight rim — a
            solid fill traced along the same centerline, not a blurred
            or independently-wobbling band. */}
        <path d={orangeD} fill="#E2531C" />

        {/* The stripe itself: solid ink black everywhere by default. */}
        <path d={blackD} fill="#15130E" />

        {/* Over the one dark closing section, the core swaps to a pale
            paper tone instead — painted as the same path again, clipped
            to just that section's bounds — so it stays a deliberate,
            reliable color swap rather than a blend-mode guess. */}
        {invertRanges.map((_, i) => (
          <g key={i} clipPath={`url(#stripeInvert-${i})`}>
            <path d={blackD} fill="#F5F0E3" />
          </g>
        ))}
      </g>
    </svg>
  );
}
