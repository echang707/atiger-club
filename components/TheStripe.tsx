"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring } from "framer-motion";

type Pt = { x: number; y: number };
type Box = { x0: number; y0: number; x1: number; y1: number };
type Band = { y0: number; y1: number };
type Metrics = { docHeight: number; winHeight: number; winWidth: number };

// The stripe is drawn in a fixed 100 x 1000 viewBox stretched over the
// whole document (preserveAspectRatio="none"), so x is "percent of
// viewport width" and y is "per-mille of document height".
const VB_W = 100;
const VB_H = 1000;

const FALLBACK_START: Pt = { x: 50, y: 0 };

// How far past the bottom of the viewport the stripe is already drawn,
// as a fraction of viewport height. The old version tied the drawn
// length to scroll *progress*, which meant the leading edge sat at the
// TOP of the viewport until you were most of the way down the page —
// so a slow scroll looked like nothing was happening. Anchoring to
// scroll position instead keeps the head just below what you're
// reading, so the stripe is always visibly present and the drawing
// happens at the bottom edge of the screen where it reads as motion.
const LOOKAHEAD = 0.88;

// Vertical distance over which the leading edge fades in, so the head
// of the stripe dissolves into the page instead of being chopped flat.
const HEAD_FADE = 22;

// Stripe weight in real pixels (converted into the distorted viewBox
// space per-sample, so thickness stays constant no matter which
// direction the line is travelling). CORE_PX is the half-width at a
// mark's fattest point, so the black reads about 13px across the belly
// with roughly 2.4px of orange either side of it.
const CORE_PX = 5.0;
const RIM_PX = 2.4;

// A tiger's markings are a run of separate short strokes, not one
// unbroken band — so a long clear stretch of the route gets chopped
// into marks of about this length, separated by small gaps, each
// tapering to its own needle points.
const TARGET_MARK_PX = 520;
const MIN_MARK_PX = 150;
const GAP_PX = 46;

// Padding around measured text boxes, in px, so the stripe finishes its
// taper cleanly before it reaches a letter rather than pinching out
// right against the glyph.
const TEXT_PAD_X = 10;
const TEXT_PAD_Y = 5;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// ---------------------------------------------------------------------
// Path construction
// ---------------------------------------------------------------------

// Catmull-Rom → sampled polyline, so a sparse set of anchors still reads
// as one continuous curve rather than straight dot-to-dot hops.
function sampleSmooth(points: Pt[], perSegment = 30): Pt[] {
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
      out.push({
        x:
          0.5 *
          (2 * p1.x +
            (-p0.x + p2.x) * t +
            (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
            (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y:
          0.5 *
          (2 * p1.y +
            (-p0.y + p2.y) * t +
            (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
            (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
      });
    }
  }
  out.push(p[p.length - 1]);
  return out;
}

function boxBlur(values: number[], radius: number): number[] {
  const n = values.length;
  const out = new Array<number>(n);
  for (let i = 0; i < n; i++) {
    let sum = 0;
    let count = 0;
    for (let k = -radius; k <= radius; k++) {
      const j = clamp(i + k, 0, n - 1);
      sum += values[j];
      count++;
    }
    out[i] = sum / count;
  }
  return out;
}

// Widens a sparse set of spikes into plateaus, keeping the sign and
// magnitude of the strongest value in each window. Blurring a spike
// destroys its amplitude; blurring a plateau of the same height keeps
// it. That difference is the whole reason the detour is visible.
function extremeFilter(values: number[], radius: number): number[] {
  const n = values.length;
  const out = new Array<number>(n);
  for (let i = 0; i < n; i++) {
    let best = 0;
    for (let k = -radius; k <= radius; k++) {
      const v = values[clamp(i + k, 0, n - 1)];
      if (Math.abs(v) > Math.abs(best)) best = v;
    }
    out[i] = best;
  }
  return out;
}

// Steer the line out of text boxes where a modest sideways bend is
// enough to clear them — "just make it take a different path." Each
// pass measures how far it needs to move, spreads that requirement out
// along the line, then smooths it, so what you see is one long lazy
// bend around a paragraph rather than a jag that snaps out and back at
// the paragraph's edges. Runs a few times because clearing one block
// can nudge the line toward another. Where no reachable detour exists
// (a full-bleed headline), the push stays at zero and the line breaks
// behind it instead.
function steerAroundText(samples: Pt[], boxes: Box[], maxPush: number): Pt[] {
  let current = samples;

  for (let pass = 0; pass < 3; pass++) {
    let needed = false;
    const push = current.map((p) => {
      let best = 0;
      for (const b of boxes) {
        if (p.y < b.y0 || p.y > b.y1 || p.x < b.x0 || p.x > b.x1) continue;
        const outLeft = p.x - b.x0 + 1.5;
        const outRight = b.x1 - p.x + 1.5;
        const d = outLeft < outRight ? -outLeft : outRight;
        if (Math.abs(d) > Math.abs(best)) best = d;
      }
      if (Math.abs(best) > maxPush) return 0;
      if (best !== 0) needed = true;
      return best;
    });

    if (!needed) break;

    const spread = boxBlur(boxBlur(extremeFilter(push, 26), 20), 20);
    current = current.map((p, i) => ({ x: clamp(p.x + spread[i], 5, 95), y: p.y }));
  }

  return current;
}

// True wherever a sample sits inside a line of text. These become the
// gaps in the stripe — and because each side of a gap tapers to a
// needle point, the break reads as two separate tiger marks rather than
// as a rectangle stamped out of a continuous line.
function occlusionMask(samples: Pt[], boxes: Box[]): boolean[] {
  const hidden = samples.map((p) =>
    boxes.some((b) => p.x >= b.x0 && p.x <= b.x1 && p.y >= b.y0 && p.y <= b.y1)
  );
  // Grow the mask slightly so the taper is fully finished by the time
  // the line reaches a glyph, never pinching out on top of one.
  const grown = hidden.slice();
  const GROW = 3;
  for (let i = 0; i < hidden.length; i++) {
    if (!hidden[i]) continue;
    for (let k = -GROW; k <= GROW; k++) {
      const j = clamp(i + k, 0, hidden.length - 1);
      grown[j] = true;
    }
  }
  return grown;
}

// The visible stretches between gaps. Very short slivers are dropped
// outright — a 6px orphan between two words is the thing that made it
// obvious a rectangle had been cut out of the line.
function visibleRuns(hidden: boolean[], minLen: number): Array<[number, number]> {
  const runs: Array<[number, number]> = [];
  let start = -1;
  for (let i = 0; i < hidden.length; i++) {
    if (!hidden[i] && start === -1) start = i;
    if ((hidden[i] || i === hidden.length - 1) && start !== -1) {
      const end = hidden[i] ? i - 1 : i;
      if (end - start >= minLen) runs.push([start, end]);
      start = -1;
    }
  }
  return runs;
}

// ---------------------------------------------------------------------
// Tiger-stripe geometry
// ---------------------------------------------------------------------

// A real tiger marking isn't a constant-width line: it's a brush stroke
// that comes to a needle point at each end, carries most of its weight
// in a belly nearer one end than the other, and has two edges that
// wander independently rather than staying parallel. `flip` swaps which
// end is the blunt shoulder and which is the fine tip, so consecutive
// marks down the page don't all point the same way.
function tigerBody(t: number, seed: number, flip: boolean): number {
  const u = flip ? 1 - t : t;
  // sin^0.38 holds a full body for most of the mark, then collapses
  // hard in the last few percent — that's what makes the ends read as
  // sharp points instead of rounded caps.
  const spine = Math.pow(Math.sin(Math.PI * clamp(u, 0, 1)), 0.38);
  const belly = 0.72 + 0.36 * Math.exp(-Math.pow((u - 0.32) / 0.36, 2));
  const wobble =
    1 +
    0.13 * Math.sin(u * Math.PI * 4.7 + seed) +
    0.06 * Math.sin(u * Math.PI * 10.3 + seed * 2.1);
  return Math.max(0, spine * belly * wobble);
}

// Deterministic 0..1 jitter — marks need to be irregular, but they also
// need to be identical between renders and between server and client.
function jitter(n: number): number {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

// Chops one clear stretch of the route into individual tiger marks.
// Lengths are measured in real pixels along the curve, so marks stay
// visually even whether the line is running steeply down the page or
// cutting across it. A stretch too short to divide is left as one mark.
function splitIntoMarks(
  samples: Pt[],
  from: number,
  to: number,
  sx: number,
  sy: number
): Array<[number, number]> {
  const lens: number[] = [0];
  for (let i = from + 1; i <= to; i++) {
    const dx = (samples[i].x - samples[i - 1].x) * sx;
    const dy = (samples[i].y - samples[i - 1].y) * sy;
    lens.push(lens[lens.length - 1] + Math.hypot(dx, dy));
  }
  const total = lens[lens.length - 1];
  if (total < MIN_MARK_PX * 2 + GAP_PX) return [[from, to]];

  const count = clamp(Math.round(total / TARGET_MARK_PX), 1, 14);
  if (count < 2) return [[from, to]];

  const stride = total / count;
  const atLength = (target: number) => {
    let i = 0;
    while (i < lens.length - 1 && lens[i + 1] < target) i++;
    return from + i;
  };

  const marks: Array<[number, number]> = [];
  for (let k = 0; k < count; k++) {
    const gap = GAP_PX * (0.6 + 0.9 * jitter(from + k * 3.1));
    const shrink = 0.86 + 0.2 * jitter(from + k * 7.7);
    const startLen = k * stride + (k === 0 ? 0 : gap * 0.5);
    const endLen = Math.min(total, startLen + (stride - gap) * shrink);
    if (endLen - startLen < MIN_MARK_PX * 0.5) continue;
    const a = atLength(startLen);
    const b = atLength(endLen);
    if (b - a >= 6) marks.push([a, b]);
  }

  return marks.length ? marks : [[from, to]];
}

// The two edges get their own phase offsets, so the mark's own centre
// drifts a little inside its outline the way a real stripe does.
function edgeScale(t: number, seed: number, side: number): number {
  return 1 + 0.17 * Math.sin(t * Math.PI * (side > 0 ? 6.1 : 5.3) + seed * (side > 0 ? 1.3 : 2.7));
}

// Builds one filled tiger mark from a stretch of the centreline.
// Widths arrive in pixels and are converted per-sample into viewBox
// units using the local scale factors — without this, the 100x1000
// viewBox stretched over a tall page makes a horizontal segment of the
// stripe render many times thicker than a vertical one.
function markPath(
  samples: Pt[],
  from: number,
  to: number,
  widthPx: (t: number, side: number) => number,
  sx: number,
  sy: number
): string {
  const n = to - from;
  if (n < 2) return "";
  const left: Pt[] = [];
  const right: Pt[] = [];

  for (let i = from; i <= to; i++) {
    const prev = samples[Math.max(from, i - 1)];
    const next = samples[Math.min(to, i + 1)];
    const dxPx = (next.x - prev.x) * sx;
    const dyPx = (next.y - prev.y) * sy;
    const lenPx = Math.hypot(dxPx, dyPx) || 1;
    const nxPx = -dyPx / lenPx;
    const nyPx = dxPx / lenPx;
    const t = (i - from) / n;

    const wl = widthPx(t, 1);
    const wr = widthPx(t, -1);
    left.push({ x: samples[i].x + (nxPx * wl) / sx, y: samples[i].y + (nyPx * wl) / sy });
    right.push({ x: samples[i].x - (nxPx * wr) / sx, y: samples[i].y - (nyPx * wr) / sy });
  }

  return (
    `M ${left[0].x.toFixed(2)},${left[0].y.toFixed(2)} ` +
    left.slice(1).map((p) => `L ${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ") +
    " " +
    right.reverse().map((p) => `L ${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ") +
    " Z"
  );
}

// Finds the emptiest vertical channel through a band of the page —
// the column where the stripe can run from y0 to y1 crossing the least
// text. The finish line sits under a dense stack of event rows that
// are far too wide to bend around one at a time, so instead of
// shredding the line into fragments there, the last leg picks a lane
// and runs down it. Ties break toward the middle of the page.
function bestChannel(boxes: Box[], y0: number, y1: number): number {
  const span = Math.max(1, y1 - y0);
  const relevant = boxes.filter((b) => b.y1 > y0 && b.y0 < y1);
  let bestX = 50;
  let bestScore = Infinity;

  for (let x = 6; x <= 94; x += 0.5) {
    let covered = 0;
    for (const b of relevant) {
      if (x >= b.x0 && x <= b.x1) covered += Math.min(y1, b.y1) - Math.max(y0, b.y0);
    }
    const score = covered + Math.abs(x - 50) * 0.002 * span;
    if (score < bestScore) {
      bestScore = score;
      bestX = x;
    }
  }
  return bestX;
}

// ---------------------------------------------------------------------
// Measurement
// ---------------------------------------------------------------------

// Per-line text boxes, measured with a Range rather than element rects,
// so a wrapped paragraph yields one tight box per rendered line instead
// of one big rectangle around the block. Boxes are also intersected
// with any overflow-hidden ancestor, so text inside a collapsed
// accordion doesn't leave a phantom obstacle behind.
function measureTextBoxes(m: Metrics): Box[] {
  const root = document.querySelector("main");
  if (!root) return [];

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const el = node.parentElement;
      if (!el) return NodeFilter.FILTER_REJECT;
      if (el.closest("svg, .sr-only, [data-stripe-ignore]")) return NodeFilter.FILTER_REJECT;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") return NodeFilter.FILTER_REJECT;
      if (parseFloat(cs.opacity || "1") < 0.05) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const boxes: Box[] = [];
  // Sibling text nodes share the same ancestor chain, so the clip
  // bounds are resolved once per element rather than once per node.
  const clipCache = new Map<HTMLElement, [number, number]>();

  const clipBounds = (el: HTMLElement): [number, number] => {
    const cached = clipCache.get(el);
    if (cached) return cached;

    // Nearest clipping ancestors, so collapsed or scrolled regions
    // can't contribute text boxes that aren't actually on screen.
    let top = -Infinity;
    let bottom = Infinity;
    for (let p: HTMLElement | null = el; p && p !== root; p = p.parentElement) {
      const inherited = clipCache.get(p);
      if (inherited && p !== el) {
        top = Math.max(top, inherited[0]);
        bottom = Math.min(bottom, inherited[1]);
        break;
      }
      const cs = getComputedStyle(p);
      if (cs.overflow !== "visible" || cs.overflowY !== "visible") {
        const pr = p.getBoundingClientRect();
        top = Math.max(top, pr.top);
        bottom = Math.min(bottom, pr.bottom);
      }
    }

    const result: [number, number] = [top, bottom];
    clipCache.set(el, result);
    return result;
  };

  let node: Node | null;

  while ((node = walker.nextNode())) {
    const el = (node as Text).parentElement!;
    const [clipTop, clipBottom] = clipBounds(el);

    const range = document.createRange();
    range.selectNodeContents(node);

    for (const r of Array.from(range.getClientRects())) {
      if (r.width < 2 || r.height < 2) continue;
      const top = Math.max(r.top, clipTop);
      const bottom = Math.min(r.bottom, clipBottom);
      if (bottom - top < 2) continue;

      boxes.push({
        x0: ((r.left - TEXT_PAD_X) / m.winWidth) * VB_W,
        x1: ((r.right + TEXT_PAD_X) / m.winWidth) * VB_W,
        y0: ((top + window.scrollY - TEXT_PAD_Y) / m.docHeight) * VB_H,
        y1: ((bottom + window.scrollY + TEXT_PAD_Y) / m.docHeight) * VB_H,
      });
    }
  }

  return boxes;
}

export default function TheStripe() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [points, setPoints] = useState<Pt[] | null>(null);
  const [textBoxes, setTextBoxes] = useState<Box[]>([]);
  const [invertBands, setInvertBands] = useState<Band[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({ docHeight: 1, winHeight: 1, winWidth: 1 });
  const prefersReduced = useReducedMotion();

  const onHomepage = pathname === "/";

  const measure = useCallback(() => {
    const docHeight = Math.max(document.documentElement.scrollHeight, 1);
    const winWidth = Math.max(document.documentElement.clientWidth, 1);
    const winHeight = Math.max(window.innerHeight, 1);
    const m: Metrics = { docHeight, winWidth, winHeight };
    setMetrics(m);

    const invertNodes = Array.from(document.querySelectorAll<HTMLElement>("[data-stripe-invert]"));
    setInvertBands(
      invertNodes.map((el) => {
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        return { y0: (top / docHeight) * VB_H, y1: ((top + rect.height) / docHeight) * VB_H };
      })
    );

    const boxes = measureTextBoxes(m);
    setTextBoxes(boxes);

    // Begin at the period in the hero tagline. This makes the punctuation feel
    // like the tip of the tail instead of letting the tail cut through the words.
    const startEl = document.querySelector<HTMLElement>("[data-stripe-start]");
    const startRect = startEl?.getBoundingClientRect();
    const START: Pt = startRect
      ? {
          x: clamp(((startRect.left + startRect.width / 2) / winWidth) * VB_W, 6, 94),
          y: ((startRect.top + window.scrollY + startRect.height / 2) / docHeight) * VB_H,
        }
      : FALLBACK_START;

    // The route stops dead on the element marked `data-stripe-end`
    // (its bottom edge — see UpcomingRows, where it's the rule under
    // the last event row). Anything below that line is not part of the
    // journey, so anchors down there are dropped rather than dragging
    // the line past its finish.
    const endEl = document.querySelector<HTMLElement>("[data-stripe-end]");
    const endRect = endEl?.getBoundingClientRect();
    const endY = endRect
      ? ((endRect.bottom + window.scrollY) / docHeight) * VB_H
      : VB_H;
    const endTop = endRect
      ? ((endRect.top + window.scrollY) / docHeight) * VB_H
      : VB_H;
    const endX = endRect
      ? clamp(((endRect.left + endRect.width / 2) / winWidth) * VB_W, 8, 92)
      : 50;

    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-stripe-anchor]"));
    const anchors: Pt[] = nodes
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const pageY = rect.top + window.scrollY + rect.height / 2;
        return {
          x: clamp(((rect.left + rect.width / 2) / winWidth) * VB_W, 8, 92),
          y: (pageY / docHeight) * VB_H,
        };
      })
      .filter((a) => a.y < endY - 10);

    if (anchors.length < 2) {
      setPoints(null);
      return;
    }

    // Top-to-bottom, but anchors sharing a rough band of height (a row
    // of scattered photos) are ordered left to right within it, so the
    // line visits them in reading order.
    const BAND = 40;
    anchors.sort((a, b) => {
      const ba = Math.round(a.y / BAND);
      const bb = Math.round(b.y / BAND);
      return ba !== bb ? ba - bb : a.x - b.x;
    });

    const route: Pt[] = [START];
    anchors.forEach((a, i) => {
      const prev = i === 0 ? START : anchors[i - 1];
      const gapY = Math.max(1, a.y - prev.y);
      const bend = Math.min(16, gapY * 0.4) * (i % 2 === 0 ? 1 : -1);
      route.push({ x: clamp((prev.x + a.x) / 2 + bend, 6, 94), y: (prev.y + a.y) / 2 });
      route.push(a);
    });

    // Run out to the finish line and stop exactly on it, dropping into
    // the clearest lane through the rows above it so the last stretch
    // arrives as one continuous mark rather than crumbs between lines.
    const last = anchors[anchors.length - 1];
    const laneX = bestChannel(boxes, endTop - (endY - endTop) * 0.4, endY);
    const approachY = endTop - (endY - endTop) * 0.35;
    route.push({
      x: clamp((last.x + laneX) / 2 + (last.x > laneX ? 6 : -6), 8, 92),
      y: last.y + (approachY - last.y) * 0.5,
    });
    route.push({ x: laneX, y: approachY });
    // The last bend leaves the clearest lane and deliberately aims at
    // the tiger's tail socket, so the wandering line resolves into a
    // physical tail instead of simply stopping at a rule.
    route.push({ x: clamp((laneX + endX) / 2, 6, 94), y: approachY + (endY - approachY) * 0.58 });
    route.push({ x: endX, y: endY });

    setPoints(route);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !onHomepage) return;
    measure();
    // Resize fires in bursts and a full remeasure walks every text node
    // on the page, so it's coalesced to one pass per settled resize.
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(measure, 150);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("load", measure);
    // Images and web fonts can land after first paint and reflow the
    // text we route around, so re-measure a few times after mount.
    const timers = [400, 1400, 2600].map((ms) => setTimeout(measure, ms));
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", measure);
      clearTimeout(resizeTimer);
      timers.forEach(clearTimeout);
    };
  }, [mounted, onHomepage, measure]);

  // Tied to scroll *position* (not progress) so the head of the stripe
  // always sits just past the bottom of the viewport, then run through
  // a spring so it trails your scroll for a beat and coasts to a stop
  // instead of snapping. That trailing is the momentum.
  //
  // The projection is driven from an effect rather than a plain
  // `useTransform` because it depends on measured page metrics: a
  // transform only re-runs when the scroll value changes, so after a
  // remeasure (fonts landing, a resize, an accordion opening) the head
  // would sit at a position computed from the old document height
  // until you happened to scroll again. Re-projecting on every
  // remeasure keeps it honest.
  const { scrollY } = useScroll();
  const target = useMotionValue(0);
  const revealY = useSpring(target, { stiffness: 82, damping: 16, mass: 0.72 });

  // Momentum lives only in the reveal spring above: the tail continues to
  // advance for a beat after scrolling stops, but its route never sways or
  // oscillates left/right.

  useEffect(() => {
    const project = (v: number) =>
      target.set(
        Math.min(VB_H, ((v + metrics.winHeight * LOOKAHEAD) / metrics.docHeight) * VB_H)
      );
    project(scrollY.get());
    return scrollY.on("change", project);
  }, [scrollY, target, metrics]);

  const tailPath = useMemo(() => {
    if (!points) return "";
    const raw = sampleSmooth(points, 30);
    // Keep the existing intelligent text avoidance, but the visual is now
    // one continuous tail rather than a collection of detached markings.
    const steered = steerAroundText(raw, textBoxes, 12);
    if (steered.length < 2) return "";
    return `M ${steered.map((p, i) => `${i ? "L" : ""} ${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ")}`;
  }, [points, textBoxes]);

  if (!mounted || !onHomepage || !points || !tailPath) return null;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ zIndex: -1 }}
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="stripeHead" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id="tailOrganicEdge" x="-15%" y="-5%" width="130%" height="110%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.06" numOctaves="2" seed="14" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.25" xChannelSelector="R" yChannelSelector="B" />
        </filter>
      </defs>

      {/* One uninterrupted reveal. The route itself is steered around copy,
          so the tail never gets rectangular holes punched through it. */}
      <mask id="stripeReveal" maskUnits="userSpaceOnUse" x="0" y="0" width={VB_W} height={VB_H}>
        {prefersReduced ? (
          <rect x="0" y="0" width={VB_W} height={VB_H} fill="#fff" />
        ) : (
          <>
            <motion.rect x="0" y="0" width={VB_W} height={revealY} fill="#fff" />
            <motion.rect x="0" y={revealY} width={VB_W} height={HEAD_FADE} fill="url(#stripeHead)" />
          </>
        )}
      </mask>

      <motion.g
        mask="url(#stripeReveal)"
        filter="url(#tailOrganicEdge)"
      >
        {/* Broad orange body first. The irregular black rings sit *inside*
            it, leaving a warm orange edge exactly like a real tiger tail. */}
        <path
          d={tailPath}
          fill="none"
          stroke="#D97721"
          strokeWidth="25"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={tailPath}
          fill="none"
          stroke="#16140F"
          strokeWidth="20"
          strokeLinecap="butt"
          strokeLinejoin="round"
          strokeDasharray="8 15 11 18 7 16 13 20 9 17 12 19"
          strokeDashoffset="4"
          vectorEffect="non-scaling-stroke"
        />
        {/* A warm highlight breaks the flat vector look without turning the
            tail glossy. It is intentionally faint and irregular. */}
        <path
          d={tailPath}
          fill="none"
          stroke="#F0A04B"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeDasharray="46 24 14 56 31 38"
          strokeDashoffset="-11"
          vectorEffect="non-scaling-stroke"
          opacity="0.38"
        />
      </motion.g>
    </svg>
  );
}
