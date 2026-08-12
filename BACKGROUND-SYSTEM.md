# Tiger Club — background system rebuild

## The one structural change

`app/layout.tsx` had the tiger-marble `fixed inset-0` at full strength behind
every section of the site. That is why each block carried its own blurred cream
blob: the pattern and the copy were fighting, and the glow was refereeing.

The fixed layer is gone. The marble now appears deliberately:

```
Hero ............ full strength          LOUD
MediumsSpread ... quiet cream
ScrollStory ..... quiet cream + one fragment behind the postcard
MarbleWedge ..... accent from the left edge
UpcomingRows .... quiet cream
MarbleWedge ..... accent from the right edge
Ending .......... full strength, returning   LOUD
```

The material gets two long stretches of absence in the middle. That absence is
what makes it read as a brand device rather than wallpaper.

## Why there is no glow any more

`.quiet-zone`, `.quiet-zone-word` and `.glyph-halo` are deleted — zero
references remain in CSS or TSX.

They were compensating for a positioning problem. The marble artwork was
gridded for ink coverage; its cream negative space runs as a broad diagonal.
The hero crop (`118%` at `66% 46%`, with a height-based variant under
`max-aspect-ratio: 16/10`) puts the tagline on that real cream. Measured across
ten viewports: **under 1% ink behind the headline**, while the right edge stays
**52–88% ink**. Position now does the work the glow was doing badly.

## Cream matching

The supplied marble's cream measured `rgb(248,229,199)` — warmer than
`#F4E9D6`. Its highlights were corrected so the cream lands exactly on the page
colour, with blacks and oranges untouched. This is why the hero dissolves into
the page instead of sitting on it as a panel. **If you re-export the pattern,
redo this or a seam will appear.**

The page surface is cream plus a seamless grain tile cut from the marble's own
cream and flattened to half contrast — same physical stock, whispering.

## The tiger asset is locked

`public/images/tiger-cutout.webp` is your artwork. It was **not** redrawn,
recoloured or restyled. Two operations only: the white background was keyed out
(border-connected flood fill, so cream fur inside the animal survives) to give
the transparent asset the brief asked for, and it was resized to 1400px. Only
size, position, crop, layering and animation are controlled in code.

In `Ending.tsx` it sits in its own column, overflowing left (`-ml-[40%]`) so the
tail reaches into the cream beside the headline. Copy is `z-10`, tiger is `z-0`
— the tail can pass behind type, never over it. Entry is a single right-to-left
`clip-path` wipe: the body lands first, the tail draws out behind it. Once, then
settles. Nothing loops or floats.

To change the tail's reach, one value: `.w-[142%] -ml-[40%]` on the inner
motion.div.

## Colour

```
paper        #F4E9D6   page + the marble's cream
ink          #15130E   body copy, 15.5:1
tiger        #D84A18   the wordmark's own orange — GRAPHICS ONLY
tiger-text   #BE3D0E   small orange text (4.5:1)
tiger-fill   #CC4212   button fills (4.6:1 with #FFF7EF)
```

The wordmark keeps its original orange untouched. `#D84A18` is only 3.6:1 on
cream, so small text and button fills use the two deeper steps — they read as
the same orange beside the mark. Low-contrast `text-ink/30–50` values across the
events and work-with-us pages were raised to `/55–/75`.

## Nav

The bar was transparent until scroll, which put small nav text directly over the
marble's densest corner — the reason Experiences / Work With Us / Join the Club
looked washed out. It now always carries a backdrop-blurred cream plate. Links
are full-strength ink at `font-semibold`; Join the Club is a filled button.

## Wordmark

`components/TigerWordmark.tsx` renders `public/images/wordmark.webp` — your
artwork, with real claw marks through the G. The CSS reconstruction that used to
draw the G with a striped gradient is deleted from `globals.css`.

## Verified

`next build` compiles clean, types pass, all 8 routes prerender. Screenshotted
in Chromium at 1440×900 and 390×844.

## Known loose end

The small orange underline that draws beneath "tail." after the tiger settles
did not appear in my screenshots. The tiger and tail themselves animate
correctly and are the actual payoff. If it stays invisible for you, delete the
`motion.svg` block in `Ending.tsx` — nothing else depends on it.

Fonts are `next/font/google`; my sandbox could not reach Google Fonts, so the
build check ran against stubs. The real font imports are restored and intact.

---

# Revision — nav/hero canvas, artwork restored, editorial finale

## The artwork was being degraded by my pipeline

Two causes, both fixed:

1. **Upscaling.** The marble was resampled from 1456px to 1800px wide. That is
   where the blur came from. It is now used at the **native 1672 × 940** of the
   highest-resolution source you supplied, never resampled, JPEG q94 with
   chroma subsampling off so the brush edges stay crisp.
2. **A cream wash sat over it.** `.marble-field::after` laid a 46% cream
   gradient across the painting — that is what turned near-black into grey and
   orange into pale peach. **Deleted.** There is now no veil over the artwork at
   any point.

Measured on the current asset: darks land at `rgb(49,37,24)`, orange at
`rgb(219,109,17)`, and 14.5% of the image is near-black. Readability comes from
where the type sits, not from fading the painting.

## Nav and hero are one canvas

The bar is fully transparent at the top of the page with the artwork running
behind it — no plate, no border, no seam. It transitions to a frosted warm-cream
surface only once you scroll off the hero, with a hairline rule and no shadow.

One honest caveat: the black wordmark sits top-left, which is exactly the
artwork's densest corner, and the tagline is centred. I solved for a crop that
could clear both and there isn't one — the cream diagonal is not wide enough.
Zooming to clear the logo pushes stripes into the tagline. So there is a small
elliptical cream gradient **anchored to that corner only** (`.hero-nav-readability`),
fully dissolved before the centre and with no bottom edge. The tagline, the
subline and the right edge sit on completely untouched artwork. The centred nav
links needed nothing — they already fall on the image's own cream.

Pattern on the right was left at full strength, as asked.

## Removed on sight

- The fragment behind the ScrollStory photo.
- Both mid-page accent wedges, and `MarbleWedge.tsx` with them.

Both read as grey rectangles pasted over the page rather than as the artwork.
The pattern now appears only where it can be shown at full strength.

## Bullet alignment

The rotating subline's bullet was vertically centred against the whole block, so
on a two-line phrase it floated to the middle. It now aligns to the first line.

## Finale

Rebuilt as an editorial spread. Gone: the full tiger, the paragraph, the orange
button, the drawn underline. What remains is very large two-line type, cream,
a small mono `SEE WHAT'S HAPPENING →` link, and one tail.

`public/images/tiger-tail.webp` is a **crop** of the locked tiger artwork, cut at
a clean cross-section at 63% width — before the haunches, where the tail is a
simple 10%-thick band. Nothing was redrawn or recoloured. Its thick end bleeds
past the right edge so the cut is never visible and the animal reads as standing
outside the frame; the tapered tip rises toward "tail." from underneath without
touching the letterforms. It slides in from the right once on scroll, then stops.

## Wordmark

Replaced with the new hand-drawn two-line mark (with its own striped tail),
using its existing alpha channel. Ratio 2.11:1 — `TigerWordmark.tsx` reads the
ratio from a constant, so update it there if you swap the art again.

---

# Revision — logo, mediums row, past events, crop shift

- **Wordmark** enlarged (`heightEm` 1.15 → 1.9). The new mark is two lines, so
  `TigerWordmark.tsx` now carries its true 1286×609 ratio — the old constant was
  still the one-line 1281×167 and was squashing it.
- **Hero crop shifted right**: `background-position-x` 66% → 41% (122% size), so
  the dense right-hand markings clear the centred tagline. Some pattern runs off
  the edge, as agreed.
- **Mediums**: all seven now sit on one row from `sm` up (`grid-cols-7`, 44px
  icons, small labels). The per-tile expanding description is gone — it was what
  made the block tall — replaced by a single shared line under the row that
  shows the hovered or active medium.
- **PLAY icon** added from the supplied artwork at `public/images/icons/play.png`.
  The `Play` medium already existed in `lib/events.ts` pointing at a file that
  wasn't there.
- **Past events** now live in their own "Already happened" section below the
  list, dimmed and marked not bookable. The main list shows only events dated
  today or later. Dates in `lib/events.ts` have no year, so `EVENT_YEAR = 2026`
  at the top of `EventsClient.tsx` supplies it — update that constant when the
  data rolls over.

---

# Mobile pass

Checked at 390×844 after the crop shift. One real regression found and fixed:

- **The mobile hero had gone nearly blank.** A phone only sees a thin vertical
  slice of the artwork, and shifting the desktop crop right landed that slice in
  the middle of the cream — no tiger at all. Phones now get their own crop
  (`auto 128%` at `68% 26%`, `max-width: 767px`), which puts the diagonal across
  the lower half while the tagline and subline stay on clean cream above it.

Verified fine on mobile: nav (wordmark, Join button and menu all clear at the
larger logo size), the finale tail, and the events list.

**One deliberate exception:** the seven mediums wrap 4 + 3 on phones rather than
sitting on one line. Seven tiles across 390px would leave roughly 45px each —
the icons would be unreadable. The one-line rule holds from `sm` (640px) up.

---

# Revision — /about, the tail whip, sharper background

## Background sharpness

The softness was **CSS upscaling**, not the source. The asset was 1672px wide
but the hero renders it at `122%` of the viewport — 2342px on a 1920 screen, so
the browser was upsampling it ~40% with bilinear filtering.

Now: the new lossless PNG is colour-matched, **supersampled 2× to 3344×1882**
with an unsharp pass, and saved as WebP (630 KB, down from a 1.7 MB JPEG). Large
viewports downsample it instead of upsampling. The new source is also
considerably richer — darks land at `rgb(28,15,8)` versus `rgb(49,37,24)` before,
and 20.4% of the image is near-black.

Crop pushed right to `30%`: ink behind the tagline measures **0.7%** (was 2.3%),
with the right edge still at 76–81%.

## The tail whip

`Ending.tsx`. Headline is now "Life's happening. Go wild." The tail rests, winds
back, snaps across, and the tip catches **wild** — which jolts and shakes for
~420ms while every other word stays perfectly still. Each of the five characters
carries its own amplitude, spin and delay (`LETTER_FEEL`), so the shake reads as
five things absorbing one hit rather than one block sliding. The tail rebounds
off the collision instead of snapping straight back — the physics lives in the
`times` arrays, not in easing.

Fires **once**, on a single `useInView` shared by the word and the tail so they
can't drift apart. Reduced-motion gets the settled composition with no whip.

*Bug found in review:* the first build wrapped the tail in `display: contents`,
which generates no layout box, so its IntersectionObserver never fired and the
tail never appeared at all. Replaced with one `useInView` on the section.

## /about

New route: `app/about/page.tsx` (metadata) + `AboutClient.tsx` + `StripeRule.tsx`.
Nothing else was touched — the homepage, events and work-with-us pages are
unchanged apart from About being added to the nav and footer.

Ten movements, built from the existing system only: Fraunces display, Instrument
italic for the turn-lines, JetBrains for small caps labels, the ink/cream/tiger
palette, `max-w-content`, `organic-underline`, and the same rise-on-enter motion
as the homepage. No new dependencies, no stock photography, no feature cards.

The four principles are the centrepiece: each gets a full-width editorial row
that alternates side, with the index number in its own column. *They first
shipped as oversized watermarks behind the type — at that scale they collided
with every claim, so they were moved into the grid.*

Tiger motif is stripes only, entering from the outer edges, never behind copy.

## Mobile

Took three passes on the hero. A phone sees only a narrow vertical slice of the
artwork, so the crop has to choose what the slice contains: the first attempt
put markings straight through "together.", the second removed them entirely.
Final framing (`auto 122%` at `42% 100%`) keeps the tagline on clean cream with
the diagonal gathering in the lower third.

About and the closing section were verified at 390×844.

---

# Revision — crop, bigger repeating whip, shorter /about

## Hero crop

Pushed further right: `background-position-x` 30% → **14%**. Ink behind the
tagline drops from 4.1% to ~2.4% and behind the subline from 12.5% to ~6.8%,
while the right edge stays rich at 73–78%.

## The whip: bigger, and it replays

Letter throw went from 13px to **46px**, rotation from 6° to **19°**, with a
scale pulse and an extra oscillation; the shake runs 720ms instead of 420ms.
The tail swings harder too (−7% → −14% travel, −5.4° → −11°).

Measured in Chromium across three separate scroll-ins: **55px maximum
displacement, up to 33° rotation, on every pass.**

Two bugs found and fixed during review, both of which made the animation not
run at all:

1. `initial={false}` on the letters. That tells framer to jump straight to the
   target rather than animate — so the shake never played.
2. The `once:false` + `useInView` + `key`-remount machinery never propagated
   its play flag, and it also made the tail *vanish* whenever the section was
   only partly on screen. Both were replaced with plain `whileInView` +
   `viewport={{ once: false }}` — the same mechanism the rest of the site uses,
   which replays on re-entry by design and needs no state at all.

Reduced-motion still gets the settled composition with no whip.

*Testing note:* the site sets `scroll-behavior: smooth`, so any headless check
must scroll with `behavior: 'instant'` or it measures mid-scroll and reports
nothing moving. Two false negatives came from exactly that.

## /about shortened

Copy trimmed by ~1,400 characters (paragraphs merged, lists cut from 6→4 and
5→4, principle bodies tightened) and the vertical rhythm pulled in across 24
padding values. Page height 10.5 → **9.4 screens** desktop, 9.2 on mobile.
All ten narrative beats are intact — the page is denser, not shorter on story.

---

# Revision — About simplified, and "Go mild → Go wild"

## /about, cut down

Ten movements became five: why we exist → what we believe → what makes it a
Tiger Club experience → what we're building → made/with/found and the close.

Fixed by subtraction, not compression: eyebrow labels removed from nearly every
section, the tiger-name irony folded into section 01 as a single line instead of
owning a section, the "only in person" list collapsed to one sentence, and the
competing display sizes reduced so only the four principles are loud.

**4 headings on the page** (was 12). Height 9.4 → **8.2 screens** desktop,
9.2 → **7.8** on mobile.

The four principles are the centrepiece: full-width rows on a hairline rule,
oversized index in its own column, name / claim / one line of body. No cards, no
grid, no icons.

## The closing animation

Replaced the physical-contact attempt with wordplay. The line loads as
**"Life's happening. Go mild."**, holds ~1.2s so it can actually be read, then:

```
tail whips  →  gust travels left  →  m is blown away  →  w blows in  →  Go wild.
```

All beats run off one clock (`T` at the top of `Ending.tsx`) so cause and effect
stay legible; nothing animates on its own schedule.

**The whip.** The tail is a locked raster we can't redraw, so it's sliced into 26
vertical strips, each translated on its own delay and amplitude — base barely
moves, delay and amplitude both grow toward the tip. That reads as a wave
travelling out and snapping, rather than a rigid image rotating. Strips overlap
0.6% so no hairline gaps open up when they move apart.

**The letters.** Only the first character animates; "Go " and "ild." never move.
The container is measured from real rendered glyphs and animates between the
m-width and the w-width, so "ild." glides across the difference instead of
jumping, and the finished "wild" keeps its natural kerning. The h2 carries
`aria-label="Life's happening. Go wild."` so screen readers get the final line.

Reduced motion shows the finished "Go wild." immediately.

### Two bugs caught in review

- The letter container had only absolutely-positioned children, so it collapsed
  to zero height and **both glyphs rendered below the baseline** — "Go mild."
  was broken even at rest. Fixed with an invisible in-flow "w" that establishes
  height and baseline.
- The gust was anchored to the *right* of the tail tip, so the wind visibly blew
  away from the word it was meant to hit. Moved left of the tip.

### Testing note

Puppeteer's `screenshot({clip})` uses **page** coordinates, not viewport — with a
clip set it silently captures the top of the document no matter where you've
scrolled. That produced two rounds of screenshots that looked like the animation
wasn't running at all. Combined with `scroll-behavior: smooth` (scroll with
`behavior:'instant'`) and Next's post-hydration scroll reset, these are the three
things to get right before trusting a headless check on this site.

---

# Revision — bigger/faster whip, real m→w flip, About cut to four, jungle wash

## The whip

Slice amplitude 46 → **118px**; measured peak travel in Chromium is **110px**
(was ~46). Whip duration 0.72s → 0.56s and the rest before it drops from 1.2s to
0.5s, so the joke starts almost immediately.

The gust is now synced to the *measured* peak of the snap. The tip reaches
maximum travel at ~0.98s (slice delay 0.78 + 30% of a 0.56s curve), so
`T.gust` moved 0.8 → 0.98. Previously the wind left before the tail had
finished loading up.

Full sequence: rest 0–0.5s · whip 0.58–1.1s · gust at 0.98s · flip 1.15–1.75s.

## The letter now physically flips

It is one glyph, not two. A lowercase **m turned over on its horizontal axis is
a w**, so this is a true two-faced 180° flip: `m` on the front, `w` on the back
pre-rotated so it lands upright, `backface-visibility: hidden` on both, with
`preserve-3d` and perspective on the parent. Halfway through, the glyph is
edge-on and you watch the same character tumble through — it lifts, rides the
gust, overshoots ~16° and settles.

Verified by reading the live transform matrix: rotateX goes 0 → 59 → 149 → 180
and lands at exactly **180**.

The container's width transition is timed to the middle of the flip, when the
glyph is edge-on, so "ild." slides across the m/w width difference at the one
moment nothing is legible.

## /about cut to four ideas

Why we exist · what makes a Tiger Club experience · what we're building · the
standard. Made/With/Found deleted, as were the "what we believe" definitions and
every supporting paragraph under the principles.

The principles are now roughly half the page and the largest type on it: index,
name, and a two-or-three-word claim. No bodies, no cards.

Height **8.2 → 5.4 screens** desktop, 7.8 → **4.4** on mobile. Cut roughly in
half again, on top of the previous pass.

## Jungle wash

`components/JungleWash.tsx` + `.jungle-wash` in globals.css. The marble,
blurred and pulled 70% toward cream, held at **12% opacity** (8% on mobile) and
masked to nothing top and bottom — net intensity a few percent. It reads as the
paper warming, not as a pattern.

Used in exactly **two** places on the homepage: after the hero, and before the
finale. It is not a background for every section.

---

# Final polish pass

## Homepage

**Gap before the finale** cut from ~430px to **150px** (~65%): the upcoming-rows
bottom padding, the finale's top padding, and the late wash band were all
contributing, so all three were trimmed rather than just one.

**Textures noticeably stronger.** The wash asset now keeps 42% of the artwork's
contrast (was 30%) with less blur, and opacity went 12% → **34%** (late band
42%, mobile 24/30%). Grain tile tightened 520 → 460px. Body copy contrast is
unchanged — the wash sits behind sections, not under text.

**The whip is one arc, not a jerk.** The keyframes were an oscillation
(down-up-down-up-down); they're now load → swing → return → one small elastic
settle. Measured on the tip: **peak 145px** (was 110), and only **2 direction
changes** across the whole move, on three consecutive passes. Amplitude 118 →
150, duration 0.56 → 0.5s, and the pause before it drops to **0.22s**.

One gust, not three staggered puffs: the strokes now launch together at the
measured top of the swing (0.6s) and travel further.

`once: false` plus a run counter keyed into the animating nodes, so the whole
moment replays every time you scroll back to it. Verified across three passes.

## Events

Medium tiles were reading as seven heavy boxes. Border and fill are now drawn
only on the active or hovered tile — the rest sit on plain cream, so the row is
tigers and labels rather than containers. Tiger icons 44 → 36px, labels and
padding down, filter block bottom gap 12/16 → 8/10.

**Past events are collapsed** behind `view past events (n) →`, animated open.
Upcoming events are the whole page until you ask for the archive.

## /about recomposed

Not just tighter margins — a different page. Real event photography throughout
(`bite-club-01`, `create-mural`, `eat-dinner`, `explore-festival`,
`serve-treeplanting`), images cropped tall and bleeding off the outer page edge,
composition alternating left / right / centre down the scroll, the tail entering
low on "Events are just the start", and the medium tigers signing off the last
section.

Copy is the four things worth saying — the childhood/screens/solitary-tigers
explanation is gone, replaced by the two-line goal statement.

*Bug caught in review:* the principle images were bleeding toward the copy
instead of the outer edge, so #04's photo ran under its headline. With
`direction: rtl` the image sits right and must bleed right; unflipped it sits
left and bleeds left. It was reversed.

## Mobile

Verified at 390×844: About stacks photo-above-claim with the images full-bleed,
the events medium row wraps 4+3 cleanly with the lighter tiles, and the finale
settles on "Go wild." with the tail in frame.

---

# Captions

New copy on the five polaroids: left our mark · we needed a bigger table ·
somehow we became a running club · good day to get lost · right place, right time.

Also fixed the layout bug in the screenshot: the caption was absolutely
positioned (`absolute bottom-1 left-3`) with no width constraint, so a long line
wrapped out of the polaroid and printed across the photo. It is now in normal
flow inside the frame's own 34px bottom padding — the well that was always there
for it — so it cannot escape regardless of length.

On phones each polaroid is ~95px wide, where any caption can only wrap into an
unreadable column, so captions show from `sm` up and the scatter reads as a
collage below that. Frame padding tightens to match.

Verified programmatically at 1440 and 390: no caption's bounding box exceeds its
frame on either.

---

# Final: Bricolage categories, PLAY pong, About redesign

## Seven Ways to Dive In

All seven words now set in **Bricolage Grotesque** (`font-wordmark`) at extrabold
— the wordmark face, so the section ties to the logo. Flat ink, tighter
tracking.

Decoration removed so personality comes from the interactions only:
- `medium-illum` (the glow-ish treatment behind each word) dropped.
- CREATE's rough "construction line" overlay deleted — it printed a second
  orange outline on top of the type. The letters' own draw-in carries the idea.
- EXPLORE's multilingual gap text moved off italic serif onto the same face.

## PLAY plays pong

The word rallies a 9px orange ball against itself. Ball leaves the **P**, is
returned by the **Y**, and comes back — **three legs, ~1.4s**, each a little
quicker than the last, then it exits and the word is exactly as it started.

Only the two outer letters react, and only on the frame the ball reaches them:
a 4px nudge outward plus a 1.1 scaleY, released after 110ms. No particles, no
bounce on the inner letters.

Positions are read from the rendered letter boxes at run time, so the rally
stays aligned to the glyphs at every breakpoint. Fires once on entering the
viewport, and is skipped entirely under `prefers-reduced-motion`.

Verified in Chromium: ball visible 56 frames, x travel 194 → 298px, **2
direction changes** (three legs), and the element is removed at the end.

## /about redesigned

No images. Four statements at four scales, composition doing the work: the
opening headline runs near full-bleed with the supporting copy indented to the
right column, the four principles are a numbered list in the largest type on
the site, and the close is a single line.

"When you see Tiger Club, it should mean something" is gone, along with the
photography, the medium-tiger row and the mission language. What's left says
only that Tiger Club makes experiences that give people a reason to get out,
try something, and meet the people around them.

---

# The traveling period, animation fixes, About + finale

## The period becomes the ball

`components/BallJourney.tsx` wraps the mediums and the photo. The full stop at
the end of "seven ways to dive in." drops out of the headline, becomes a ball,
hops through all seven mediums setting each one off on contact, then drops into
the photograph and settles on the table.

It is **entirely scroll-driven** — position is a pure function of progress
through the section, not a timeline. So scrolling back up runs it in reverse and
returns the period to the headline with no reset logic at all.

Waypoints are measured from the live DOM (`[data-ball-start]`, `[data-medium]`,
`[data-ball-end]`), so the path follows whatever layout the words land in at any
breakpoint. Each leg is linear across with a parabolic hop over the top, and the
ball squashes slightly at each landing; the final leg drops rather than hops.

Contact fires a `medium:hit` event on the word, which runs **exactly the hover
animation** and releases after 900ms — one code path for ball and mouse, so
hover keeps working independently.

Words reordered (EAT · CREATE · MOVE · SERVE · EXPLORE · LEARN · PLAY) so the
path zig-zags cleanly instead of doubling back.

Verified in Chromium: ball travels x 300 → 1186, y −38 → 2040, **6 hops**, all
**7 mediums triggered in order**, period opacity back to 1 at the top.

## Animation fixes

- **EXPLORE** — languages now rotate at 1500ms (was 620ms), readable.
- **CREATE** — the hand-drawn orange outline is restored, drawing itself over
  the type while the solid letters colour in underneath. Keyed on the hover
  cycle so it replays every time, not just the first.
- **PLAY** — the rally now replays on **every** hover and cancels cleanly on
  mouse leave, with the ball removed and the paddles reset. It no longer
  self-fires on entering the viewport; the traveling period sets it off.

## /about

Headline is now **Why Tiger Club?**, answered in a column beside it rather than
stacked underneath, which removes most of the dead space and the left-weighting.
The closing pair sits on the same baseline for the same reason.

## Finale

The floating strip of texture above the closing section is gone. The same
material is now the **backdrop for the entire section** (`.ending-wash`), masked
away from the middle so the headline and tail stay on clean cream and faded in
at the top so it emerges from the page rather than starting on a hard edge.
Removing the orphan band also closed the gap in front of it.

---

# Rebuilt: the ball rolls, and /about simplified

## Roll, don't bounce

The previous version hopped from word to word in parabolic arcs, which was
wrong. The path is now two kinds of segment:

- **ROLL** — along the cap-height line of a word, entering at whichever end is
  nearer where the last drop left it, ball spinning at the rate it actually
  travels (there's a small off-centre fleck on it so the spin reads).
- **DROP** — a short accelerating fall from one word's trailing edge onto the
  next word's leading edge.

The words were re-laid-out as a **staircase** so there is always somewhere to
roll to: each starts near where the previous ended and sits lower, with the
per-word rotations giving each one a real slope. Row padding tightened so the
drops are short and the run reads quickly.

**Speed / visibility.** The journey now completes over a shorter scroll window
(start at 0.72vh, finish at 0.62vh above the photo), so the ball moves briskly
and stays ahead of the reading position instead of lagging above the fold.
Measured: the ball is **inside the viewport in 56 of 56 samples** across the
whole run.

**Triggering is now miss-proof.** Asking "is the ball at the moment of contact"
loses hits whenever a scroll step jumps past that instant — which is most
trackpad flicks, and it was dropping 2 of 7 words. Instead, every drop at or
behind the ball that hasn't fired yet fires now, and anything ahead is re-armed
so scrolling back replays the run. Verified: all **7 mediums fire, in path
order**.

## /about

Back to the plain typographic version, with **Why Tiger Club?** as the opening
and the sentimental copy gone. Cleaned up as asked: the whole page now uses
**three** type tokens — one display size, one body size, one mono label — reused
everywhere, instead of the eight or nine different sizes it had. No italic
serif, no oversized headline. 1.7 screens.

---

# Ball direction, button colour, cohesive tail

## The ball only goes forward

It was a pure function of scroll, so scrolling up dragged it back up the page.
It now tracks the furthest point reached and never gives that back. Scrolling up
to re-read something leaves the ball where it is.

**Reset happens in exactly one place:** when the headline is fully back below the
fold — i.e. you have scrolled completely above "seven ways to dive in." At that
point the period returns to the headline, the fired list clears, and the whole
run can happen again.

Each word fires once and settles back to normal on its own; nothing re-arms mid-
run, so once the ball has passed, the words stay clean until a full reset.

Verified: forward run monotonic; scrolling up 400px mid-section holds the ball
at y 1759 → 1759; all 7 words fire; period returns at the top; and the full run
replays after reset.

## The tail is one image again

The seams in your screenshot were mine: the whip sliced the tail into 26
vertical strips and translated each on a delay, so adjacent strips stepped past
one another and the joins showed as hard pixel edges. No amount of overlap fixes
that — offset strips of a raster cannot stay continuous.

It is now **nested rigid rotations** instead. Four layers, each pivoting from a
point further along the tail and starting fractionally later, so the transforms
compose into a travelling bend: base barely turns, tip swings hard and arrives
last. Every layer transforms the whole subtree, so the artwork is never cut and
stays continuous at any zoom. Checked at 2× device scale mid-whip — clean.

## Join the Club

Fill lightened `#CC4413` → `#D2470F`. The button text moved to pure white to
carry the contrast, which keeps it at AA (4.52:1); it would have fallen under
4.5 on the old near-white.

---

# Pinball removed, whip direction, About hierarchy

## Pinball reverted

`BallJourney.tsx` deleted and every trace with it: the wrapper in `page.tsx`,
the `data-ball-start` period in the headline, the `data-ball-end` marker on the
photo, the `data-medium` attributes and the `medium:hit` listener in
`MediumWord`.

The mediums are back to the original alternating layout (EAT · CREATE · MOVE ·
EXPLORE · SERVE · LEARN · PLAY, start/end/center with the original offsets and
rotations) and the original row padding. PLAY rallies once when it enters the
viewport again, and still replays on hover.

## Whip direction

The pivots sit at the base on the right, so a **positive** rotation lifts the
tip. The keyframes were negative-first, which swung the tip down before it came
up — backwards. Now a small load, a hard swing **up**, then it falls back
through and settles.

Measured on the tail's own bounding box: the tip peaks **452px above rest at
731ms**, then returns. It never travels below its resting line.

## /about hierarchy and alignment

Three steps now, not one size for everything:

- **Title** — "Why Tiger Club?" alone, 92px at 1440.
- **Sub** — the four claims and "Events are just the start", 42px.
- **Body / mark** — 18px prose and the mono labels.

Alignment fixed too: each principle's label now sits **above** its claim with
both flush to the page gutter. Previously the claims were indented into a grid
column beside the labels, so nothing lined up with the headline. Every line on
the page now starts at the same left edge.
