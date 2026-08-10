// ---------------------------------------------------------------------
// The tail: pure geometry.
//
// No React, no DOM. The component measures the page and hands the
// results in; everything about the *shape* of the tail lives here, so it
// can be generated and inspected outside a browser.
// ---------------------------------------------------------------------

export type Pt = { x: number; y: number };
export type Box = { x0: number; y0: number; x1: number; y1: number };

// ---------------------------------------------------------------------
// Coordinate space
//
// Everything below is in real page pixels: the viewBox is
// "0 0 winWidth docHeight" stretched over the page-tall wrapper, so one
// user unit is one CSS pixel on both axes.
//
// The previous version used a fixed 100 x 1000 viewBox with
// preserveAspectRatio="none", which scaled x and y by wildly different
// factors. Every width, normal and radius then had to be un-distorted
// per sample, and anything that missed the conversion (the highlight
// stroke, the noise filter, the loop radii) came out stretched. Working
// in pixels deletes that whole class of bug, and is why the tail can
// now hold an even thickness through a tight curl.
// ---------------------------------------------------------------------

// Spacing between centreline samples: fine enough for a tight curl,
// coarse enough that a very long page stays cheap.
export const STEP = 6;

// Tail half-width at the tip and at the rump. A real tail tapers the
// whole way; the growth is what sells which end is which. These are
// deliberately heavier than a decorative hairline — below about 24px
// across, the banding stops reading as rings around a tail and starts
// reading as a dashed line.
const TIP_HALF = 3.2;
const BASE_HALF = 18;

// Padding around measured text, so the tail commits to a detour well
// before it reaches a glyph.
export const TEXT_PAD_X = 18;
export const TEXT_PAD_Y = 10;

// How far sideways the route may bend to clear a line of type.
const MAX_PUSH = 170;

// Where it has to pass behind a word anyway, the tail tapers out over
// this distance so the break reads as slipping under the type.
const CUT_TAPER = 34;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function smoothstep(e0: number, e1: number, x: number) {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}

// Deterministic 0..1 noise. The marks need to be irregular but identical
// between renders — Math.random here would reshuffle the whole tail on
// every resize.
function jitter(n: number): number {
  const s = Math.sin(n * 12.9898 + 4.1414) * 43758.5453;
  return s - Math.floor(s);
}

const signed = (n: number) => jitter(n) * 2 - 1;

// ---------------------------------------------------------------------
// Centreline
// ---------------------------------------------------------------------

// Catmull-Rom through the route anchors. Subdivision scales with segment
// length, so the dense points describing the tip curl don't get the same
// treatment as a 2000px straight run down the page.
function sampleSmooth(points: Pt[]): Pt[] {
  const p = points;
  if (p.length < 2) return p;
  const out: Pt[] = [];
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] || p2;
    const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const n = clamp(Math.round(dist / 9), 3, 48);
    for (let s = 0; s < n; s++) {
      const t = s / n;
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

// Even spacing along the curve. Band pitch, taper lengths and the
// arclength lookup all assume a constant STEP between samples, which
// turns every one of them into index arithmetic.
function resampleUniform(pts: Pt[], step: number): Pt[] {
  if (pts.length < 2) return pts;
  const out: Pt[] = [pts[0]];
  let carry = 0;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const seg = Math.hypot(b.x - a.x, b.y - a.y);
    if (seg < 1e-6) continue;
    let t = 0;
    while (carry + (1 - t) * seg >= step) {
      t += (step - carry) / seg;
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      carry = 0;
      if (out.length > 20000) return out;
    }
    carry += (1 - t) * seg;
  }
  const last = pts[pts.length - 1];
  if (Math.hypot(last.x - out[out.length - 1].x, last.y - out[out.length - 1].y) > step * 0.4) {
    out.push(last);
  }
  return out;
}

function boxBlur(values: number[], radius: number): number[] {
  const n = values.length;
  if (!n) return values;
  const prefix = new Array<number>(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + values[i];
  const out = new Array<number>(n);
  for (let i = 0; i < n; i++) {
    const lo = clamp(i - radius, 0, n - 1);
    const hi = clamp(i + radius, 0, n - 1);
    out[i] = (prefix[hi + 1] - prefix[lo]) / (hi - lo + 1);
  }
  return out;
}

// Widens isolated spikes into plateaus before smoothing. Blurring a
// spike destroys its amplitude; blurring a plateau of the same height
// keeps it — that difference is the reason a detour survives being
// smoothed into a lazy bend instead of a jag.
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

// Bend the route sideways out of type. `freedom` protects the two ends:
// the tip curl and the run into the tiger both have to land on an exact
// point, so they're excluded rather than dragged off their mark by a
// nearby headline.
function steerAroundText(
  samples: Pt[],
  boxes: Box[],
  width: number,
  freedom: (i: number) => number
): Pt[] {
  let current = samples;

  for (let pass = 0; pass < 4; pass++) {
    let needed = false;
    const push = current.map((p, i) => {
      const free = freedom(i);
      if (free <= 0.001) return 0;
      let best = 0;
      for (const b of boxes) {
        if (p.y < b.y0 || p.y > b.y1 || p.x < b.x0 || p.x > b.x1) continue;
        const outLeft = p.x - b.x0 + 8;
        const outRight = b.x1 - p.x + 8;
        const d = outLeft < outRight ? -outLeft : outRight;
        if (Math.abs(d) > Math.abs(best)) best = d;
      }
      if (Math.abs(best) > MAX_PUSH) return 0;
      if (best !== 0) needed = true;
      return best * free;
    });

    if (!needed) break;

    // Only samples that are actually being pushed get clamped back into
    // the viewport. Clamping unconditionally is what used to drag the
    // off-canvas excursion beside the events list back onto the page.
    const spread = boxBlur(boxBlur(extremeFilter(push, 22), 26), 26);
    current = current.map((p, i) =>
      Math.abs(spread[i]) < 0.01
        ? p
        : { x: clamp(p.x + spread[i], width * 0.045, width * 0.955), y: p.y }
    );
  }

  return current;
}

// Laplacian relaxation: pulls every sample a little toward the midpoint
// of its neighbours. Curves lose nothing — a lazy S is already close to
// its own midpoints — but a hairpin is a long way from them, so the
// tight turns round out first. This is what stops the route snapping
// between one side of the page and the other when two anchors sit far
// apart; the weight argument keeps the tip curl and the join into the
// tiger locked in place while everything between them softens.
function relax(samples: Pt[], iterations: number, rate: number, weight: (i: number) => number): Pt[] {
  let cur = samples;
  for (let pass = 0; pass < iterations; pass++) {
    const next = cur.slice();
    for (let i = 1; i < cur.length - 1; i++) {
      const w = weight(i) * rate;
      if (w <= 0.001) continue;
      const mx = (cur[i - 1].x + cur[i + 1].x) / 2;
      const my = (cur[i - 1].y + cur[i + 1].y) / 2;
      next[i] = { x: cur[i].x + (mx - cur[i].x) * w, y: cur[i].y + (my - cur[i].y) * w };
    }
    cur = next;
  }
  return cur;
}

// The emptiest vertical lane through a band of the page — used for the
// final descent, where the event rows are far too wide to bend around
// one at a time.
function bestChannel(boxes: Box[], y0: number, y1: number, width: number): number {
  const relevant = boxes.filter((b) => b.y1 > y0 && b.y0 < y1);
  let bestX = width / 2;
  let bestScore = Infinity;
  const span = Math.max(1, y1 - y0);

  for (let x = width * 0.08; x <= width * 0.92; x += width / 200) {
    let covered = 0;
    for (const b of relevant) {
      if (x >= b.x0 && x <= b.x1) covered += Math.min(y1, b.y1) - Math.max(y0, b.y0);
    }
    const score = covered + Math.abs(x - width / 2) * 0.004 * span;
    if (score < bestScore) {
      bestScore = score;
      bestX = x;
    }
  }
  return bestX;
}

// ---------------------------------------------------------------------
// The hero flourish
//
// This is authored, not solved. An earlier version generated a spiral
// and then searched a list of candidate offsets for somewhere it would
// fit — which is why it kept ending up as an ornament sitting beside the
// headline rather than doing anything to it. There is no search here and
// no circle: six cubic Bézier segments, laid out from the measured box
// of the word itself, that pass under the word, around its left side,
// back over the top, and away to the right. The word sits in the
// negative space. The loop never closes and never crosses itself.
// ---------------------------------------------------------------------

function cubic(p0: Pt, c1: Pt, c2: Pt, p1: Pt, n: number, skipFirst: boolean): Pt[] {
  const out: Pt[] = [];
  for (let i = skipFirst ? 1 : 0; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;
    out.push({
      x: u * u * u * p0.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p1.x,
      y: u * u * u * p0.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p1.y,
    });
  }
  return out;
}

// `period` is the full stop after the word — the tail's tip, and the
// only point the path is pinned to. `word` is the measured box of
// "together" on its own.
function heroHug(period: Pt, word: Box, winWidth: number): { pts: Pt[]; exit: Pt } {
  const w = word.x1 - word.x0;
  const h = word.y1 - word.y0;

  // Clearance from the letters. Held between roughly 30 and 50px, and
  // deliberately unequal above and below so the shape doesn't read as a
  // machined outline of the word.
  const tight = winWidth < 620;
  const padUnder = tight ? 26 : 46;
  const padOver = tight ? 22 : 37;
  const padLeft = tight ? 24 : 42;

  const yUnder = word.y1 + padUnder;
  const yOver = word.y0 - padOver;
  const xLeft = Math.max(winWidth * 0.03, word.x0 - padLeft);
  const xRight = Math.min(winWidth * 0.965, word.x1 + padLeft * 1.5);
  const cy = (word.y0 + word.y1) / 2;

  // Waypoints. Deliberately unequal at every turn: the underside runs
  // deepest near the tip and rises as it travels left, the top stroke
  // does the opposite, and the left shoulder is a broad round sweep
  // while the exit is a long shallow one. Matching them up would produce
  // a racetrack — a rounded rectangle with the word parked in it — which
  // is exactly what this is trying not to be.
  const U1 = { x: word.x0 + w * 0.64, y: yUnder + h * 0.16 };
  const U2 = { x: word.x0 + w * 0.08, y: yUnder - h * 0.17 };
  const T1 = { x: word.x0 + w * 0.12, y: yOver + h * 0.15 };
  const T2 = { x: word.x0 + w * 0.9, y: yOver - h * 0.14 };
  const exit = { x: xRight, y: cy - h * 0.05 };

  const pts: Pt[] = [];
  // 1 — leaves the period on a short outward flick before dropping and
  //     turning back under the word. Going straight down instead reads
  //     as a hook dangling inside the loop; the flick makes the full
  //     stop the start of a stroke rather than the end of one.
  pts.push(
    ...cubic(
      period,
      { x: period.x + w * 0.05, y: period.y + h * 0.34 },
      { x: U1.x + w * 0.42, y: yUnder + h * 0.34 },
      U1,
      18,
      false
    )
  );
  // 2 — under the word, sagging low then rising toward the left.
  pts.push(
    ...cubic(
      U1,
      { x: word.x0 + w * 0.44, y: yUnder + h * 0.2 },
      { x: word.x0 + w * 0.22, y: yUnder + h * 0.02 },
      U2,
      18,
      true
    )
  );
  // 3 — the left shoulder: one broad round sweep, controls pushed well
  //     past xLeft so it opens out instead of turning a corner.
  pts.push(
    ...cubic(
      U2,
      { x: xLeft - w * 0.13, y: yUnder - h * 0.34 },
      { x: xLeft - w * 0.14, y: yOver + h * 0.42 },
      T1,
      22,
      true
    )
  );
  // 4 — back across the top, arcing highest just past the middle.
  pts.push(
    ...cubic(
      T1,
      { x: word.x0 + w * 0.3, y: yOver - h * 0.13 },
      { x: word.x0 + w * 0.6, y: yOver - h * 0.15 },
      T2,
      18,
      true
    )
  );
  // 5 — out past the final letters on a long shallow turn down the
  //     right, kept wide of the tip so the two strands never pinch.
  pts.push(
    ...cubic(
      T2,
      { x: word.x1 + padLeft * 1.15, y: yOver - h * 0.06 },
      { x: xRight + w * 0.07, y: cy - h * 0.55 },
      exit,
      18,
      true
    )
  );
  // 6 — and away down the page, still leaning rather than dropping
  //     plumb, so the flourish hands off to the descent.
  const away = { x: xRight + w * 0.05, y: word.y1 + h * 2.9 };
  pts.push(
    ...cubic(
      exit,
      { x: xRight + w * 0.03, y: cy + h * 0.8 },
      { x: away.x - w * 0.02, y: away.y - h * 0.9 },
      away,
      18,
      true
    )
  );

  return { pts, exit: away };
}

// ---------------------------------------------------------------------
// Banding
//
// This is the part that was wrong before. The old build ran its black
// marks ALONG the tail, which produces a rope with a dark stripe painted
// down the middle of it. A tiger's tail is banded ACROSS: rings that
// wrap the whole circumference, bowed into soft chevrons, separated by
// orange gaps that tighten toward a solid black tip.
// ---------------------------------------------------------------------

type BandSpec = { s0: number; s1: number; seed: number; side: number; tip: boolean };

function planBands(totalLen: number, halfAt: (s: number) => number): BandSpec[] {
  const bands: BandSpec[] = [];

  // The very point is solid, which is what lets the black full stop at
  // the end of the headline read as the tip of the tail rather than as a
  // dot the tail happens to start next to. It is kept short so it reads
  // as a point, not as a band.
  const tipLen = clamp(totalLen * 0.004, 26, 46);
  bands.push({ s0: -STEP, s1: tipLen, seed: 0.5, side: 0, tip: true });

  let s = tipLen;
  let k = 1;
  let side = 1;
  while (s < totalLen - 40) {
    const w = halfAt(s);
    // Pitch scales with the tail's own thickness, so a mark is always
    // about as long as the tail is wide wherever you are along it. A
    // fixed minimum pitch was the bug that made the thin upper stretch
    // read as a dashed line.
    const pitch = Math.max(24, w * 4.2);
    // Spacing and length both vary widely, and every so often a much
    // wider gap or a much shorter mark lands. Evenly spaced marks of
    // equal size read as a pattern stamped onto the tail; real markings
    // are irregular enough that you can't find the repeat.
    const rare = jitter(k * 11.7);
    const gapMul = rare > 0.88 ? 1.9 : rare < 0.12 ? 0.55 : 1;
    const lenMul = jitter(k * 13.3) > 0.82 ? 0.5 : 1;
    s += pitch * (0.26 + 0.2 * jitter(k * 3.7)) * gapMul;
    if (s >= totalLen - 30) break;
    const s1 = Math.min(totalLen, s + pitch * (0.22 + 0.2 * jitter(k * 5.1)) * lenMul);

    // Alternate which flank the mark grows from — but not mechanically.
    // Roughly one in five repeats the previous side, which is what stops
    // the run reading as a zip.
    if (jitter(k * 7.31) > 0.8) side = -side;
    bands.push({ s0: s, s1, seed: k * 1.37, side, tip: false });
    side = -side;

    s = s1;
    k++;
  }

  return bands;
}

// ---------------------------------------------------------------------
// Tail geometry
//
// Pure: route anchors and text boxes in, drawable slices out. Kept free
// of React and of the DOM so the shape of the tail can be generated and
// eyeballed outside a browser.
// ---------------------------------------------------------------------

export type Segment = { body: string; bands: string[] };

export function buildTail(route: Pt[], textBoxes: Box[], width: number): Segment[] {
  if (!route || route.length < 3) return [];

  const dense = resampleUniform(sampleSmooth(route), STEP);
  if (dense.length < 8) return [];

  const n = dense.length;

  // Freeze the curl and the final approach against text-steering: both
  // have to land exactly where they were aimed.
  const curlEnd = Math.round(Math.min(n * 0.08, 900 / STEP));
  const joinStart = n - Math.round(Math.min(n * 0.1, 620 / STEP));
  const freedom = (i: number) =>
    smoothstep(curlEnd, curlEnd + 40, i) * (1 - smoothstep(joinStart, n - 1, i));

  // Steer out of the type, soften what that produced, then steer again
  // to catch anything the softening pushed back under a word. The final
  // light relax is cosmetic: it takes the last small kinks out of the
  // corrections without undoing them.
  let path = steerAroundText(dense, textBoxes, width, freedom);
  path = relax(path, 42, 0.42, freedom);
  path = steerAroundText(path, textBoxes, width, freedom);
  path = relax(path, 6, 0.25, freedom);

  const line = resampleUniform(path, STEP);
  const m = line.length;
  if (m < 8) return [];
  const len = (m - 1) * STEP;

  // Normals.
  const nx = new Array<number>(m);
  const ny = new Array<number>(m);
  for (let i = 0; i < m; i++) {
    const a = line[Math.max(0, i - 2)];
    const b = line[Math.min(m - 1, i + 2)];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const d = Math.hypot(dx, dy) || 1;
    nx[i] = -dy / d;
    ny[i] = dx / d;
  }

  // Thickness: a slow taper from tip to rump, with a gentle flare where
  // it meets the animal. The two edges carry their own low-frequency
  // wobble at different phases, so the tail breathes slightly instead of
  // reading as a constant-width ribbon — and because the wobble is keyed
  // to sample index rather than normalised position, it stays the same
  // physical size whether the page is short or very long.
  const hL = new Array<number>(m);
  const hR = new Array<number>(m);
  for (let i = 0; i < m; i++) {
    const u = i / (m - 1);
    // Thin for most of the run, thickening toward the base — a tail is
    // heaviest where it meets the animal. The earlier pow(u, 0.55) put
    // nearly full weight on within the first fifth of the page, which
    // left nothing to grow into.
    const t = 0.45 * u + 0.55 * Math.pow(u, 1.9);
    const grow = TIP_HALF + (BASE_HALF - TIP_HALF) * t;
    const flare = 1 + 0.3 * smoothstep(0.9, 1, u);
    const base = grow * flare;
    // The first few samples close to a point, so the tail ends in a tip
    // rather than a flat cap sticking out from under the full stop.
    const point = 0.34 + 0.66 * smoothstep(0, 26, i * STEP);
    hL[i] = base * point * (1 + 0.055 * Math.sin(i * 0.031) + 0.03 * Math.sin(i * 0.091 + 1.7));
    hR[i] = base * point * (1 + 0.055 * Math.sin(i * 0.027 + 2.4) + 0.03 * Math.sin(i * 0.085 + 4.1));
  }

  // Where the tail can't avoid a line of type, it goes behind it. These
  // runs are the visible stretches; each cut end tapers to a needle
  // point, so the break reads as the tail slipping under the word rather
  // than as a rectangle punched out of it.
  const hidden = new Array<boolean>(m).fill(false);
  for (let i = 0; i < m; i++) {
    const p = line[i];
    for (const b of textBoxes) {
      if (p.x >= b.x0 && p.x <= b.x1 && p.y >= b.y0 && p.y <= b.y1) {
        hidden[i] = true;
        break;
      }
    }
  }
  for (let i = 0; i < Math.min(m, curlEnd + 20); i++) hidden[i] = false;
  for (let i = Math.max(0, joinStart); i < m; i++) hidden[i] = false;

  const runs: Array<[number, number]> = [];
  let runStart = -1;
  for (let i = 0; i < m; i++) {
    if (!hidden[i] && runStart === -1) runStart = i;
    if ((hidden[i] || i === m - 1) && runStart !== -1) {
      const end = hidden[i] ? i - 1 : i;
      if ((end - runStart) * STEP > 70) runs.push([runStart, end]);
      runStart = -1;
    }
  }
  if (!runs.length) return [];

  for (const [a, b] of runs) {
    for (let i = a; i <= b; i++) {
      let f = 1;
      if (a > 0) f = Math.min(f, smoothstep(0, CUT_TAPER, (i - a) * STEP));
      if (b < m - 1) f = Math.min(f, smoothstep(0, CUT_TAPER, (b - i) * STEP));
      hL[i] *= f;
      hR[i] *= f;
    }
  }

  const idx = (s: number) => clamp(Math.round(s / STEP), 0, m - 1);
  const halfAt = (s: number) => (hL[idx(s)] + hR[idx(s)]) / 2;

  // A point on the tail's surface. `v` is the cross-position: -1 at one
  // edge, +1 at the other. Bands are built from this same function as
  // the body outline, so a band at v = ±1 meets the silhouette exactly
  // and needs no clipping.
  //
  // Position, normal and width are all interpolated BETWEEN samples.
  // Rounding s to the nearest sample instead is what put a 6px staircase
  // along every band edge: twenty points sampled across the width would
  // collapse onto three or four distinct arclengths and come out as
  // steps rather than a curve.
  const P = (s: number, v: number): Pt => {
    const f = clamp(s / STEP, 0, m - 1);
    const i0 = Math.floor(f);
    const i1 = Math.min(m - 1, i0 + 1);
    const t = f - i0;

    const px = line[i0].x + (line[i1].x - line[i0].x) * t;
    const py = line[i0].y + (line[i1].y - line[i0].y) * t;

    let ax = nx[i0] + (nx[i1] - nx[i0]) * t;
    let ay = ny[i0] + (ny[i1] - ny[i0]) * t;
    const d = Math.hypot(ax, ay) || 1;
    ax /= d;
    ay /= d;

    // Blend between the two edge widths rather than switching at v = 0,
    // which would put a visible kink down the middle of every band.
    const l = hL[i0] + (hL[i1] - hL[i0]) * t;
    const r = hR[i0] + (hR[i1] - hR[i0]) * t;
    const h = l + (r - l) * ((v + 1) / 2);

    return { x: px + ax * v * h, y: py + ay * v * h };
  };

  const fmt = (p: Pt) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
  const poly = (pts: Pt[]) =>
    pts.length < 3 ? "" : `M ${fmt(pts[0])} ${pts.slice(1).map((p) => `L ${fmt(p)}`).join(" ")} Z`;

  // Bands are planned over the whole tail, then handed to whichever
  // visible run contains them — so the rhythm stays continuous across a
  // break instead of restarting at every word.
  const bands = planBands(len, halfAt);

  // A tiger's tail marking is not a bar across the tail and not a blob:
  // it is a brush stroke that ROOTS on one flank and grows inward,
  // widest where it meets the edge and tapering to a needle point
  // somewhere past the middle. Consecutive marks root on opposite
  // flanks, and each drifts along the tail as it reaches inward, so the
  // run leans with the curve instead of sitting square to it.
  //
  //   reach  how far across it gets — under 1 stops short of centre,
  //          near 2 almost touches the far flank and reads as a ring.
  //   lean   drift along the tail from root to point.
  //   curve  extra bend in that drift, so the stroke hooks rather than
  //          running dead straight.
  const NV = 18;
  const stripePath = (spec: BandSpec, lo: number, hi: number): string => {
    const c = (spec.s0 + spec.s1) / 2;
    const w0 = (spec.s1 - spec.s0) / 2;
    if (w0 <= 0.6) return "";
    const at = (sv: number) => clamp(sv, lo, hi);

    // The solid tip is the one mark that does wrap the whole tail.
    if (spec.tip) {
      const out: Pt[] = [];
      const i0 = idx(Math.max(0, spec.s0));
      const i1 = idx(spec.s1);
      for (let i = i0; i <= i1; i++) out.push(P(i * STEP, 1));
      for (let i = i1; i >= i0; i--) out.push(P(i * STEP, -1));
      return poly(out);
    }

    const side = spec.side;
    const reach = 1.15 + 0.78 * jitter(spec.seed + 1.1);
    const lean = 0.85 * signed(spec.seed + 2.3);
    const curve = 0.55 * signed(spec.seed + 3.1);
    // Roots aren't flat cuts: one corner sits further along the tail.
    const rootSkew = 0.3 * signed(spec.seed + 4.7);

    const front: Pt[] = [];
    const back: Pt[] = [];
    for (let j = 0; j <= NV; j++) {
      const t = j / NV;
      const v = clamp(side * (1 - reach * t), -1, 1);
      const drift = w0 * (lean * t + curve * t * t) - w0 * rootSkew * (1 - t);
      // Full weight at the root, held well past halfway, then closed to
      // a point. Shedding width early — a linear taper, or a low power
      // of (1 - t) — collapses the stroke into a triangle sitting on the
      // edge, which is what made the first attempt read as sawteeth.
      // Note the stroke is deliberately SHORT along the tail and LONG
      // across it: that ratio is the difference between a stripe and a
      // thumbprint.
      const hw = w0 * Math.sqrt(Math.max(0, 1 - Math.pow(t, 2.4)));
      front.push(P(at(c + drift - hw), v));
      back.push(P(at(c + drift + hw), v));
    }

    return poly([...front, ...back.reverse()]);
  };

  // Body slices are painted tip-first, one per band, so where the curl
  // crosses over itself the later (thicker, base-ward) pass covers the
  // earlier one. That's real overlap, instead of two shapes fighting.
  const out: Segment[] = [];

  for (const [a, b] of runs) {
    const sA = a * STEP;
    const sB = b * STEP;
    const mine = bands
      .filter((band) => {
        const c = (band.s0 + band.s1) / 2;
        return c > sA && c < sB;
      })
      .map((band) => ({ ...band, s0: Math.max(band.s0, sA), s1: Math.min(band.s1, sB) }));

    // Slice boundaries sit in the orange gaps between bands, so a slice
    // never cuts a band in half.
    const cuts: number[] = [sA];
    for (let k = 0; k < mine.length - 1; k++) cuts.push((mine[k].s1 + mine[k + 1].s0) / 2);
    cuts.push(sB);

    for (let k = 0; k < cuts.length - 1; k++) {
      const i0 = idx(cuts[k]);
      // Overlap forward only: the next slice paints over the overhang, so
      // slices abut without a hairline seam, and no slice ever covers the
      // band belonging to the one before it.
      const i1 = Math.min(b, idx(cuts[k + 1]) + 2);
      if (i1 - i0 < 2) continue;

      const edge: Pt[] = [];
      for (let i = i0; i <= i1; i++) edge.push(P(i * STEP, 1));
      for (let i = i1; i >= i0; i--) edge.push(P(i * STEP, -1));

      const band = mine[k];
      out.push({
        body: poly(edge),
        bands: band ? [stripePath(band, cuts[k] - STEP, cuts[k + 1] + STEP)].filter(Boolean) : [],
      });
    }
  }

  return out;
}

// Builds the route the tail follows: the flourish around the headline,
// the wander down the page, the excursion off-canvas past the events
// list, and the centred descent into the tiger. Pure, so the same route
// can be generated in a test harness.
export function buildRoute(
  start: Pt,
  end: Pt,
  word: Box | null,
  events: { top: number; bottom: number } | null,
  anchors: Pt[],
  boxes: Box[],
  winWidth: number
): Pt[] | null {
  void boxes;

  // --- 1. the flourish around the headline --------------------------
  // Without a measured word there is nothing to hug, so the tail simply
  // falls from the period rather than inventing a shape.
  const hug = word
    ? heroHug(start, word, winWidth)
    : { pts: [start, { x: start.x, y: start.y + 260 }], exit: { x: start.x, y: start.y + 260 } };

  const pts: Pt[] = [...hug.pts];
  const exit = hug.exit;

  // Anything above the flourish's exit belongs to the headline, not to
  // the descent.
  const cutoff = exit.y + 60;
  const eventsTop = events ? events.top : end.y - 900;
  const eventsBottom = events ? events.bottom : end.y - 300;

  const usable = anchors
    .filter((a) => a.y > cutoff && a.y < eventsTop - 120)
    .sort((a, b) => {
      // Anchors within ~110px of each other vertically are one row and
      // get ordered left to right within it, so the tail visits them in
      // reading order instead of doubling back up the page.
      const ra = Math.round(a.y / 110);
      const rb = Math.round(b.y / 110);
      return ra !== rb ? ra - rb : a.x - b.x;
    });

  // --- 2. the wander down the page ----------------------------------
  // Anchors are waypoints, not commands. Left to itself the route swings
  // the full width of the page between two anchors a couple of hundred
  // pixels apart vertically, and no amount of smoothing turns that into
  // anything but a hairpin. So each anchor's x is pulled back toward the
  // previous one until a leg's horizontal travel is at most its vertical
  // drop: the tail can lean hard, but it can never double back. That is
  // what keeps the descent one continuous S rather than a zigzag, and it
  // holds for any content — a row of scattered photos at nearly the same
  // height is visited as a drift rather than a saw blade.
  const MAX_SLOPE = 0.9;
  {
    let px = exit.x;
    let py = exit.y;
    for (const a of usable) {
      const room = Math.max(50, (a.y - py) * MAX_SLOPE);
      a.x = clamp(a.x, px - room, px + room);
      px = a.x;
      py = a.y;
    }
  }

  let prev = pts[pts.length - 1];
  for (const a of usable) {
    const dy = Math.max(1, a.y - prev.y);
    const lean = clamp((a.x - prev.x) * 0.18, -95, 95);
    pts.push({
      x: clamp((prev.x + a.x) / 2 + lean, winWidth * 0.06, winWidth * 0.94),
      y: prev.y + dy * 0.5,
    });
    pts.push(a);
    prev = a;
  }

  // --- 3. out past the events list ----------------------------------
  // Running a tail down through a list of dates and event names makes
  // both harder to read, so it doesn't: the same continuous path sweeps
  // out to the right, leaves the canvas beside the list, and comes back
  // in below it. The SVG clips at the viewport edge, so the off-canvas
  // control points cost nothing to draw.
  const OFF = winWidth + 240;
  pts.push({
    x: clamp(prev.x + (winWidth * 0.88 - prev.x) * 0.55, winWidth * 0.1, winWidth * 0.92),
    y: prev.y + (eventsTop - prev.y) * 0.5,
  });
  // Off the canvas ABOVE the list, not beside its first row — otherwise
  // the sweep out still clips the top couple of event names.
  pts.push({ x: winWidth * 0.92, y: eventsTop - 210 });
  pts.push({ x: OFF, y: eventsTop - 10 });
  pts.push({ x: OFF, y: eventsTop + (eventsBottom - eventsTop) * 0.34 });
  pts.push({ x: OFF + 30, y: eventsTop + (eventsBottom - eventsTop) * 0.72 });
  pts.push({ x: winWidth * 0.93, y: eventsBottom + 70 });

  // --- 4. the return, and the descent into the tiger ----------------
  // One broad curve back toward the centre, a last gentle S, and only
  // then a short straight run into the rump. Straightening earlier than
  // that turns the tail into a flagpole.
  const cx = winWidth / 2;
  // Waypoints are placed as fractions of the remaining drop and in
  // strictly descending order. Mixing fractional and fixed offsets here
  // is what previously put one waypoint above the one before it, which
  // folded the return into a near-horizontal run along the bottom of the
  // page instead of a descent.
  const span = Math.max(460, end.y - eventsBottom);
  const at = (f: number) => end.y - span * f;

  pts.push({ x: winWidth * 0.84, y: at(0.82) });
  pts.push({ x: cx + winWidth * 0.105, y: at(0.62) });
  pts.push({ x: cx - winWidth * 0.032, y: at(0.4) });
  // Straight only for the last stretch. Any longer and the tail stops
  // being a tail and starts being a flagpole.
  pts.push({ x: cx, y: end.y - 215 });
  pts.push({ x: cx, y: end.y });

  return pts;
}

