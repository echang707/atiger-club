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

---

# The quiet beat between the two photo sections

The homepage had a photograph immediately below the seven mediums, then the
five-photo scatter — two photo-heavy sections back to back. The first one is
replaced with a purely typographic quote spread, so the rhythm reads:

    seven mediums  →  quiet philosophy  →  made for something more
    what we do     →  why it matters    →  what it feels like

## The quote section

Robert Waldinger, Harvard Study of Adult Development: the good life is built
with good relationships.

Deliberately **not** a centred inspirational card. The three lines are stepped
at different indents, the opening quote mark is oversized and hangs out into the
left gutter at 20% tint, and the attribution sits far right on its own hairline
rule in two sizes of mono. The only motion is a staggered line reveal and one
restrained hand-drawn stroke under "good relationships", drawn after the last
line lands.

No images in the section — verified programmatically at both 1440 and 390.

The five-photo scatter below is untouched and stays as rich as it was.

## Bug found while verifying

One of the five scatter photos pointed at `memories[3].image`, a remote
Unsplash URL that returns **403** — it was rendering as an empty postcard frame.
It now uses `/images/bite-club-01.jpeg`, which is local and reliable and was
freed up when the hero postcard was removed, with a caption that matches what is
actually in the picture.

Worth knowing: several entries in `lib/events.ts` still point at Unsplash URLs.
They are fine where they are only used as event thumbnails, but any of them can
fail the same way.

---

# Tail underline, principle marks, paw prints removed

## The quote underline is a tail

The plain orange stroke under "good relationships" is now a small tiger tail:
an orange body, black bands laid over it with a dashed stroke, and a black
rounded tip at the left end. Same single draw-in reveal as before — three paths,
no new assets.

## Principle marks

`app/about/PrincipleMark.tsx`. One oversized graphic per row, filling the right
third so that side reads as composed rather than empty:

- **01** an arrow pointing back inward, toward the claim
- **02** two large outlined circles, overlapping
- **03** the numeral itself, oversized and rotated out of the grid
- **04** a four-point spark

Built entirely from divs, borders and two `clip-path` polygons — no icons, no
illustrations, no cards, no gradients, no labels. Near-black at low opacity with
one restrained orange accent each. They are `aria-hidden`, sit behind the type
(`z-10` on the label and claim), and are hidden below `md`, where there is no
empty right side to fill. Row typography and horizontal structure are untouched.

*Sized to the row on purpose:* a first pass drew circles taller than the row and
`overflow-hidden` clipped them into arcs. Everything now fits inside the row's
content box.

## Paw prints — removed, then restored

Briefly removed, then put back on every page at the client's request.
`components/PawPrints.tsx` was recovered from the original v32 package rather
than rewritten, so the interaction is byte-identical to what it always was, and
the `.paw-print-mark` rule, `paw-stamp-in` keyframes and reduced-motion override
were restored alongside it. Mounted once in `layout.tsx`, so it applies to every
route.

Verified by clicking empty space on `/`, `/about`, `/events` and
`/work-with-us`: a mark stamps on each. Clicks that land on a button, link or
other interactive element correctly do not stamp — that exclusion is the
component's own behaviour and is unchanged.

---

# About refinements: thin lines, annotation, refined tail

## Principle marks are now single hairlines

The arrow / circles / numeral / star are gone (`PrincipleMark.tsx` deleted).
`PrincipleLine.tsx` replaces them with one thin stroke per row, low contrast,
no fill and no shape — a gesture inside the whitespace rather than something
filling it. Each behaves in a way that answers its principle:

- **01** a line extends inward, toward the claim
- **02** two lines approach from opposite sides and meet
- **03** a line travels straight, then takes one small unexpected kink
- **04** a line travels across and arrives at a small orange dot

They draw once when the row enters view. Nothing loops.

Note: the paw prints are generated by clicking, not placed — there is no static
paw in this section to remove, and the click interaction stays on every page as
requested last round.

## "Why Tiger Club?"

Headline untouched. The paragraph now starts further right and hangs below the
headline's baseline instead of aligning to it, so it reads as an annotation
answering the question rather than a second column that has to line up.

## The quote tail

Moved down so it clears the descender of the g in "good" — it was cutting
straight through it. Redrawn as one gentle organic curve at even thickness with
a slight upward flick at the tip, a handful of restrained stripes, and a dark
tip. It draws left to right when the section arrives, then the tip gives one
small flick, once.

*Bug fixed along the way:* the stripes were animated with `pathLength`, and
framer drives that by writing its own `stroke-dasharray` — which overwrote the
stripe pattern and painted the whole tail solid black. The stripes now fade in
after the body finishes drawing instead.

---

# One tail per section, a livelier quote tail, LLC

## The quote tail comes alive

`components/QuoteTail.tsx`. It no longer reveals a fixed path — three changes:

1. The path `d` is animated through **four shapes while it draws**, so the curve
   keeps shifting as it grows. The last two lift the far end, so the upward curl
   only appears near the end of the draw rather than being there all along.
2. The tip is a **separate, thinner stroke** continuing past the body with a
   round cap — a stepped taper, since SVG strokes cannot taper on their own.
3. Once extended, the tip group makes **one flick**: up, slight overshoot, then
   settles. It pivots from where the tip meets the body, so only the end moves.

Then it is completely still. Sat lower again so it clears the g's descender.

## One tail for the whole principles section

The four per-row hairlines are deleted (`PrincipleLine.tsx` gone). In their place
`SectionTail.tsx` draws a single continuous line wandering down the right ~30%
of the section, across all four rows — orange, thin, with a few sparse black
stripes.

Deliberately **not** aligned to the rows: the swings differ in width and length
so it reads as something that drifted in from off-screen, not a wave, a
timeline or a connector. Verified programmatically that no text reaches its
column.

`vector-effect="non-scaling-stroke"` keeps the line the same weight however the
viewBox stretches to the section height, so it stays thin on short and tall
viewports alike. Motion is a few px of parallax drift and about a degree of sway
tied to scroll position — no loop, no wag.

## Legal name

Footer now reads **Tiger Club LLC, Atlanta**.

---

# The quote tail is one continuous shape

## What was broken

The tail was three separate animated elements — body, stripes, tip. The stripes
path rendered at full length while the body was still drawing, so they appeared
as loose black squares floating past the end of the orange, with a detached tip
beyond them. Nothing kept the pieces in step.

## How it stays whole now

- **One shape.** The orange body and the black stripes are the *same* path
  geometry; the stripes are that identical path stroked in black with a dash
  pattern, so they are bands painted onto the tail rather than their own
  objects. The separate tip element is gone.
- **One reveal.** Both strokes sit inside a single `clipPath` whose rectangle
  sweeps left → right. Nothing can render beyond the drawn tip, because
  nothing outside the clip exists. Body and stripes are revealed by the same
  animation, so they cannot drift apart.
- **One morph.** Growth, the upward curl over the last ~18%, the flick and the
  settle are all done by morphing `d` through six keyframes that share a command
  structure. The stroke is never split at any point.

Verified frame by frame at 700 / 1150 / 1600 / 2000 / 3200 ms: continuous at
every step, stripes attached throughout, no floating marks, tip resting with a
gentle upward curve. Runs once and stops.

---

# Mobile responsiveness pass

Desktop is unchanged throughout — every fix below is behind a mobile
breakpoint. Checked at 375, 390 and 430px on `/`, `/about`, `/events` and
`/work-with-us`.

## Result

`document.scrollWidth` equals the viewport at all three widths on all four
pages, and no text, link or caption extends past the edge. **Zero horizontal
scrolling anywhere.**

## Header

Grid changed from `[1fr_auto_1fr]` to `[auto_1fr_auto]` so the logo and the
right-hand cluster define their own columns instead of being centred against an
empty nav cell. Height 64 → 56 on mobile, gutters evened to 20px, button given
symmetrical padding and `leading-none` so its text is optically centred, and the
hamburger nudged to sit on the same right margin. Logo, button and hamburger now
share one centre line.

## Hero and the duplicated graphic

The artwork appeared twice on mobile — once in the hero, then again immediately
below in the transitional wash band, with a visible seam between two copies of
the same graphic. `.jungle-wash` is now hidden below `md`; desktop keeps it. The
hero crop was retuned (`auto 116%` at `44% 100%`) so the markings gather along
the lower edge, and the fade-out is 240px so the artwork dissolves rather than
ending on an edge. Hero height 100svh → 82svh with tighter padding, which
removes most of the dead space above the tagline.

## Quote

Type scale is mobile-specific (13vw with looser leading). The attribution was
right-aligned in a block with no room for it, so it ran off the edge; it now
aligns left below `md` and keeps the far-right editorial placement above.

**The tail is restored on mobile, and the reason it was missing is worth
recording:** the reveal rectangle lives inside `<defs>`, which has no layout
box, so the `whileInView` observer attached to it never fired — the clip stayed
at `width: 0` and the entire tail rendered invisible. The trigger now comes from
the `<svg>` element, which does have a box, and every child animates off that
one flag. Confirmed drawing at 375, 390 and 430, fully on screen, with the draw
and flick intact.

## Finale

The tail was pushed so far right it read as accidentally cropped. Narrowed to
104% with a 3% offset on mobile so the whole sweep is visible and only the thick
base bleeds off the edge, with extra bottom padding keeping it clear of the CTA.

## Footer

Rebuilt for mobile: logo, then a two-column grid of links, then the sign-off and
copyright. Every link carries `white-space: nowrap`, so "Work With Us" stays on
one line (verified: 1 line at all three widths) and Discord no longer runs past
the edge. From `md` up it is the original single row, unchanged.

---

# Mobile hero: artwork at full strength

Desktop untouched — both changes are inside the `max-width: 767px` block.

## The fade was the problem

`.marble-fade-bottom` was 240px tall on mobile. On a phone that covered most of
the artwork actually on screen, so the whole lower half sat under a cream
gradient and the orange and black read as washed out and unfinished.

It is now a **72px band hugging the very bottom edge**, reaching solid cream
only in the last few pixels so the join to the section below is still clean.
Everything above it is the artwork at full opacity and full contrast — no mask,
no large gradient, no duplicated copy faking continuity.

## The crop was solved, not guessed

With the veil gone the artwork rose into the copy, so the crop was measured
against the asset rather than eyeballed. At `auto 134%` / `40% 100%`:

- ink behind the tagline: **0%**
- ink behind the subline: **0.2%**
- lower-right of the viewport: **64% painted**

So the copy sits on genuinely clean cream while the painting stays strong
through the lower right, then meets the cream section below over the short band.
Checked at 375, 390 and 430.

## On the paw print

Not removed, because there is nothing static to remove: paw prints are only ever
created by clicking, and the page loads with **zero** of them (verified on a
fresh load with no clicks). The one in the screenshot came from a click landing
in that area. The interaction is still on every page, as requested earlier — if
you'd rather it were excluded from the hero specifically, that is a small
addition to the exclusion list in `PawPrints.tsx`.

---

# Mobile finale: the tail belongs to "wild."

Desktop untouched — every value below is `sm:` reset to exactly what it was.

## Composition

Centred low across the section, the tail read as a smile under everything with
no relationship to the word. Below `sm` it is now anchored to the right edge,
rotated `-38°` about that edge and lifted to `top: 54%`, so:

- the tapered tip finishes just below and right of **wild.**
- the curve sweeps down and to the left of it
- the thick base runs off the right edge of the screen on purpose
- nothing is centred, and the silhouette stays asymmetric and directional

The geometry was solved by probing candidate width/rotation pairs in the browser
and measuring the tip against the headline box, not by eye. Two intermediate
values were rejected on inspection: at `-54°` the tail swung up across the
headline, and at `46%` it crowded the CTA.

## Animation

On mobile the tail starts at `x: 88%` — mostly off the right edge — and whips
in over 0.62s on a fast-out curve, rather than easing up from below as it does
on desktop. As it lands, **wild.** takes a small hit: a 5px shake with a slight
rotation, damping out over 0.42s. Once, on entering view, then still.

Reduced motion gets the settled composition with no whip and no shake.

Verified at 375, 390 and 430: `scrollWidth` equals the viewport, the CTA sits
clear of the tail, and the headline is never crossed.

---

# The duplicated artwork band is gone (desktop and mobile)

## Cause

`JungleWash` sat directly under the hero, and `jungle-wash.webp` is a crop of
**the same marble** used in the hero. Underneath the real thing it read as a
washed-out second copy of the artwork with a visible seam where one ended and
the other began — the "glitch" in the screenshot. Raising its opacity to 34% in
an earlier pass made it far more obvious.

Mobile had been patched with `display: none`, which fixed the symptom on phones
and left desktop showing it.

## Fix

The band is removed everywhere: the `<JungleWash />` mount, the component file,
the `.jungle-wash` / `.jungle-wash-late` rules and the mobile override are all
deleted. The hero now fades straight into cream through its own
`.marble-fade-bottom`, which is the only hand-off.

The closing section keeps `.ending-wash`. That one is safe: it is masked to the
outer edges, sits at the far end of the page, and is never adjacent to the hero,
so it cannot read as a duplicate. It still uses `jungle-wash.webp`, so the asset
is retained.

Verified on desktop (1440) and mobile (390): `.jungle-wash` count is **0**, one
`.marble-field`, one `.ending-wash`, and no seam below the hero.

---

# Human tiger stripes (hero)

The hero's stripes are no longer artwork — they are people. `HumanStripes.tsx`
replaces `.marble-field` in the hero only; nothing else in the design system
changed.

## How it's built

- **One `<symbol>`, stamped with `<use>`.** ~270 figures on desktop, ~127 on
  mobile, from a single drawing definition. Each figure has a shadow, shoulders,
  a head and a lighter crown so it reads as a person at close range rather than
  a dot.
- **Positions sampled off real bezier paths** with `getPointAtLength`, then
  pushed along the path normal by a random amount, so bands have organic
  thickness instead of beads on a wire. Colours are weighted toward orange
  `#E0521C` and charcoal, with a few paler figures breaking up the mass.
- **The walk-in is one CSS transform transition per figure** with its own delay
  — no rAF loop and no per-frame JS, so the compositor does the work. Measured
  travel: 313px for a sampled figure.
- **~6% arrive late** (2.1–3.2s), so gaps sit visibly open and are then filled.
  That metaphor is explicit in the data rather than left to chance.
- Idle motion is ~1 unit in a 1600-unit viewBox — under a pixel on screen.

Bands enter from the left and right edges only; the centre column is empty by
construction, so the copy always sits on clean cream.

## Join hover

Hovering **Join the Club** dispatches a window event; one reserved figure walks
into an open slot in the upper-right band and stays while the hover holds. On
leave it walks back out. Nobody else moves. Verified: opacity 1 at x=1196 on
hover, back to opacity 0 at x=1760 after leave.

*Bug caught in review:* the guard originally required
`(hover: hover) and (pointer: fine)`, which also excludes browsers that don't
report a pointer type — it silently disabled the whole interaction. It now skips
only on a genuinely coarse pointer or mobile widths.

Reduced motion renders the crowd already assembled, with no walk-in and no idle.

## Still to do

This is the hero only, as asked. The marble treatment is untouched everywhere
else, so the two visual languages currently coexist — worth a look before
propagating.

---

# Human stripes v2 — actual people

The first attempt used one pawn-shaped symbol, which read as pins. Rebuilt.

## Sprite library

`components/PersonSprites.tsx` — six top-down poses (walking away, walking
toward, long stride, standing, carrying a bag, long hair) × three colourways =
**18 distinct sprites**. Each figure has a head with hair, shoulders, two arms,
two legs mid-stride, shoes and a soft shadow thrown down-right. Drawn at the
same high oblique angle as the reference.

Still one `<symbol>` per sprite stamped with `<use>`, so 450+ figures cost 18
definitions. Per-figure variation comes from scale (0.82–1.24), rotation (±8°)
and which sprite is picked.

## Composition

Bands are now **dense clumps, not threaded lines** — people scatter across the
full width of each band with a centre-weighted distribution, plus positional
jitter. 459 figures on desktop, 169 on mobile.

**Protected zone:** any figure whose final *or* starting position lands inside
the centre rectangle is discarded outright, so nothing can touch the headline,
subline or nav — at rest or mid-walk.

*Mobile needed its own coordinate space.* A landscape viewBox rendered with
`slice` into a portrait phone crops the left and right edges away — exactly
where the bands were — so mobile rendered empty. It now has a portrait viewBox
(620×1100) with bands running across the top and bottom instead of the sides.

## Animation

About a quarter of the crowd are "walkers" who travel 300–760 units in from
off-frame over 3s on a human-feeling ease; the rest are effectively in place and
settle 26–80 units. That gives the gathering read without hundreds of long
transitions. Idle motion afterwards is sub-pixel.

## Join hover

Unchanged in behaviour: one extra figure walks into a reserved gap and back out
again, with its own slot per layout. Nothing else in the crowd reacts.

Reduced motion renders the crowd assembled.

Hero only — the rest of the site is untouched.

---

# Hero crowd v3 — the artwork IS the assembled state

Both previous attempts drew the crowd in code and both read as clip art. That
approach is abandoned: no SVG people, no procedural crowd.

## Assembled state

`/images/crowd-stripes.webp` is the supplied crowd artwork itself — dense,
overlapping, real bodies, real shadows. Its cream was colour-matched to
`#F4E9D6` (measured `252,234,207` → `243,233,214`) so it sits on the page
rather than on top of it.

The crop is solved, not eyeballed: at `128%` / `50% 55%` the headline and
subline zone measures **0.6% inked** while both bands hold **~28%**. The
artwork's own negative space lands under the copy.

## Arrival animation

14 transparent human cutouts were extracted from the close-up reference by
keying the flat background, taking connected components over 900px, and
dilating each to keep its shadow. Alpha ramps across the soft shadow and the
colour is un-premultiplied against the cream, so there is no halo.

They start off the outer edges, walk to positions **on** the bands over
2.3–3.4s with staggered delays, and fade out as they arrive — so the crowd
appears to have assembled without a single figure being redrawn.

Every walker's travel line stays on its own side of the hero: destinations are
x<26 or x>74, starts are off-frame at −14 or +114, so no walker ever crosses
the protected centre.

## Portrait

The artwork is landscape, so one crop on a tall screen shows either the empty
cream middle or a single corner. Mobile therefore uses **two different slices** —
the upper-left crowd across the top, and the lower-right crowd mirrored across
the bottom, each masked off toward the middle. Different regions and opposite
handedness, so it never reads as the same picture twice.

## Join hover

One real cutout walks in from off-frame to a gap beside the crowd and back out
on leave. The artwork itself is never touched.

Reduced motion: the artwork alone, no walkers.

Hero only — nothing else on the site changed.

---

# Hero v4 — static artwork, one hover interaction

## Background

The new crowd image is the hero, loaded complete. **No load animation at all** —
no assembling, no walk-in, no fades, no moving crowd.

Processed for crispness: cream colour-matched to `#F4E9D6`
(`250,227,196` → `244,232,213`), then **supersampled 2× to 3344×1882** with an
unsharp pass and saved at WebP q92, so large viewports downsample rather than
upscale a 1672px source.

Crop solved by measurement: at `130%` / `50% 52%` the headline and subline zone
is **0.22% inked** while the left and right bands hold **35%** and **37%**. A
short cream gradient across the top keeps the nav legible where the crowd runs
under it.

## The one interaction

Hovering "Join the Club" walks a single figure in from the right edge to a gap
at the outer end of the lower-right stripe, where they stop. Hover-out turns
them around and walks them back off-frame.

**Scale was derived, not guessed.** Isolated figures in the artwork have a
median height of 39.5px in a 1672px-wide source; at a 130% background that is

    39.5 / 1672 × 1.30 × 100vw = 3.07vw

which is exactly what the sprite is sized to. The cutout comes from the same
family of aerial figures, so angle, lighting and shadow direction already match.

**No opacity is ever animated.** The figure is parked off-frame when idle and
only its position transitions, so nothing fades and it is never unmounted
mid-walk. Same sprite, path, size and destination on every hover. Disabled on
touch and under reduced motion.

Verified: idle at x=1594 (off-screen), joined at x=1198 / y=527, height 44px
both times, opacity 1 throughout, and fully off-screen again after hover-out.

## Portrait

Two different slices — upper-left crowd across the top, lower-right mirrored
across the bottom, each masked toward the middle, with the copy on clean cream
between them.

Unused walker sprites were deleted; only the one used by the hover remains.
Hero only — nothing else on the site changed.

---

# Hero v5 — eight people join a static crowd

## Background

The new ultra-HD artwork, static and untouched. Cream colour-matched to
`#F4E9D6` (`251,237,218` → `244,232,213`), supersampled 2× to 3344×1882 with an
unsharp pass at q93 so big viewports downsample rather than upscale. Rendered at
`132%` / `50% 52%`, which keeps the copy zone effectively clear while both bands
stay out at the edges. Nothing about the crowd is recreated or animated.

## The walk is a real cycle

Each sprite is a **four-frame sheet** cut from the same aerial photography as the
crowd. Frames are generated by shearing the leg band progressively — ramped from
zero at the hip with a squared falloff, so the legs swing without leaving a seam
across the waist (the first attempt sheared from full amplitude and printed a
visible line there). CSS `steps(4)` swaps frames while the element translates,
so the figures walk rather than slide.

## Blending

Scale is derived, not guessed. Isolated figures in the artwork have a median
height of **46px in a 1672px source**, so at a 132% background a person is
`46 / 1672 × 1.32 × 100vw = 3.63vw`. Each of the eight then carries a per-person
factor (0.84–1.14) matched to the people immediately around its destination,
because the artwork has perspective — figures lower in the frame are larger.
Eight different sprites, so none of them are clones.

## Behaviour

Seven arrive one at a time from ~0.9s, every 1.7s, each from an off-screen edge
to a fixed spot, then stop and stay for the session. **No opacity is animated
anywhere** — figures are mounted off-frame and translate in. Reset only on
refresh.

The eighth is reserved for the Join hover: walks in on hover, turns and walks
fully off-frame on hover-out, same sprite/path/scale/destination every time.
Verified: joins at x=1214 h=57px opacity 1, exits fully off-screen at x=1588
still at opacity 1.

Paths run through the artwork's cream negative space and stay on their own side
of the hero, so nothing crosses the headline, subline, logo, nav or CTA.

Disabled on mobile and under reduced motion (static artwork only). Unused walk
sheets pruned; only the eight in use ship.

---

# Hero v6 — real walk cycles, shadows only after landing

## Shadows

The sprites are now cut **body-only**. Separating body from cast shadow needed a
colour test, not a threshold: the connected component bridges the two, so any
brightness cut either kept the shadow or ate the figure. Pixels that are pale
*and* desaturated (`lum > 150 && sat < 60`) are classified as shadow and dropped;
bodies are either dark or strongly coloured, so they survive. Bottom-band opaque
pixels fell from 36% to 9%.

Each figure's shadow is drawn separately as a soft radial ellipse and revealed
only once it has stopped. So a walking figure never drags a shadow across the
artwork, and no two shadows overlap.

## The walk is no longer a slide

Everything is written per frame from one `requestAnimationFrame` loop — a CSS
transition can only interpolate between two states, which is exactly why the
previous version read as a sprite being translated.

Per figure, per frame:

- position advances along a **quadratic bezier**, so the path curves
- easing is slow-in, steady, slow-out, with **one small settling oscillation**
  in the last 14%
- a **six-frame** sheet steps at a cadence tied to distance covered, so the
  stride matches the speed
- a small vertical **bob** and body **sway** come off the same phase
- the figure **leans** slightly toward its direction of travel

The sheets themselves now swing legs *and* counter-swing arms, ramped from zero
at the hip and shoulder so no seam appears across the body.

Verified in Chromium: **all 6 frames used across 151 distinct positions** during
one arrival, and 7 shadows present only after the walkers stopped.

## Join hover

Same path, driven by a normalised 0→1 that hover pushes toward 1 and hover-out
back toward 0 from wherever it currently is — so an interrupted walk turns
around cleanly rather than snapping. No fading; disabled on touch and mobile.

---

# Adapted to the new backdrop

Same system, re-fitted to the latest crowd artwork. Everything below was
re-derived from the new image rather than carried over.

- **Artwork**: cream matched (`250,234,215` → `244,232,213`), supersampled 2× to
  3344×1882, unsharp, q93.
- **Crop**: solved at `134%` / `50% 58%` — copy zone **0.4% inked**, left and
  right crowds **~37% each**.
- **Scale**: isolated figures measure a median **47px in a 1672px source**, so a
  person is `47 / 1672 × 1.34 × 100vw = 3.77vw`. Per-figure factors 0.80–1.20
  track the artwork's perspective.
- **Destinations**: found by scanning the artwork itself rather than guessing.
  Each of the eight spots has almost no ink in a tight radius (open ground you
  could stand in) but plenty within a wider one (right beside a crowd). Verified
  clear ≤0.008, near ≥0.29.
- **Shadows**: elongated and thrown to the lower right to match the artwork's
  own cast direction, instead of round pools under the feet.

Walk cycles, bezier paths, easing, settling steps, the rAF loop and the hover
joiner are unchanged from v6.

---

# Fixing the mismatch: walkers cut from the artwork itself

## The background

The supplied file was byte-identical to what already shipped — the difference
you were seeing was **my processing**. The cream colour-match plus an unsharp
pass had pushed the shipped version 4.22 mean pixel units away from the
original.

It is now shipped with minimal handling: a gentle cream lift applied only to the
brightest tones, a straight 2× LANCZOS upscale, no sharpening, q95. Mean
difference from the supplied file is down to **2.63**, and that residual is
almost entirely the cream shift needed to sit on `#F4E9D6`.

## The glitchy figures

Root cause: the walkers came from a **different source image** — the
photographic close-up — so they were a different renderer, palette and lighting
model from the backdrop and could never match. The heavy leg/arm shear then
smeared soft edges, which is what turned the long-haired figure into a blur.

All eight are now cut **from this artwork**, using the isolated individuals
already walking in its cream space. Found by scanning for components that are
person-sized *and* have a nearly empty ring around them — 31 candidates, best 12
kept, 8 used. Same renderer, same lighting, same palette, same proportions,
by construction.

Two knock-on fixes:

- **Scale is now exact, not approximated.** Each sprite carries its real pixel
  height in the source (42–49px), so its rendered size is
  `srcH / 1672 × 1.34 × 100vw` — no per-figure fudge factor.
- **Shear amplitude cut from 3.4px to 1.4px** and arm counter-swing dropped.
  The source figures are ~45px tall, so the old amplitude was far too violent
  and was what produced the smearing.

Alpha threshold tightened (`diff−30 / 34`) to remove the pale fringe around the
cutouts.

---

# Routes are solved, not placed

You were right that the walkers were pathing through the crowd. The
destinations had been chosen for being open ground, but nothing checked the
journey to them.

The eight routes are now **solved against the artwork**. For every candidate
spot the whole bezier is sampled at 50 points and only accepted if:

- every point on the path is open ground (worst ink < 0.012), and
- the path never enters the copy keep-out box, and
- the destination itself is clear but has a crowd nearby, so the figure
  arrives *at* a group rather than in empty space.

Entry points are searched across all four edges rather than assumed to be left
or right. That turned out to matter: the crowd bands run right to the left and
right edges, so most side entries would have to walk through people. Several
walkers now come in from the **top or bottom**, along the cream corridors —
which is exactly the kind of route your circled figures take.

Search results: worst ink on path 0.0000–0.0099 across the eight, with the
destination's local crowd density 0.07–0.27.

Everything else is unchanged: sprites cut from this artwork, per-figure exact
scale (`srcH / 1672 × 1.34 × 100vw`), four-frame walk cycles, shadows drawn
separately and revealed only on arrival, and the hover joiner using the eighth
solved route.

---

# Routes: strict constraints, fewer walkers

Two things were still wrong: a route clipped the nav, and figures were moving in
directions they weren't facing.

**Direction.** These sprites are back views. In this artwork a figure whose back
you can see is walking *away* from the camera, which on screen means moving **up**
the frame. Every route therefore enters from the **bottom edge** and heads
upward, and the solver rejects any path that ever moves back down.

**Obstacles.** A route is only accepted if, over 60 samples along the whole
bezier, it:

- never touches a crowd pixel (worst ink < 0.014),
- never enters the headline / subline box, and
- never enters the top band holding the logo, nav and CTA.

Only **five** spots in the entire composition satisfy all of that — so there are
now four arrivals and one hover joiner rather than seven and one. You said you
didn't mind a few, and this is the honest number: every remaining walker has a
genuinely clean route.

Verified in Chromium by tracking each walker's `y` across 14s: **zero downward
steps** for all four, across 198–249 distinct positions each.

Solver output: worst ink on path 0.0000–0.0099, destination crowd density
0.027–0.264, travel distance 22–43% of the frame height.

---

# The hover joiner now follows the same rules

It always shared the arrivals' machinery — same sprite family cut from this
artwork, same exact-scale formula, same four-frame cycle, same upward walk, same
separately-drawn shadow revealed on arrival.

What made it look different was its **destination**. Routes are ranked by how
much crowd sits near the end point, and the joiner had been handed the weakest
of the five (adjacency 0.027): it walked out and stopped alone in open cream,
so it read as a lone figure rather than someone joining.

It now gets the **strongest** solved route in the set (adjacency 0.264), landing
right beside a group, and the four arrivals take the next four. Nothing else
changed.

Verified: all five figures render at 52–54px — the same size as the artwork's
own people — the joiner records **zero downward steps** across 194 positions on
its walk in, and its shadow appears only once it stops.

---

# Mobile hero: full bleed, no dead middle

Two fixes, both mobile-only — desktop is untouched.

## The crowd now fills the viewport

The old portrait treatment was two 34%-tall strips with a blank cream gap
between them, which read as the artwork being switched off behind the copy.
It is now **one full-bleed crop** covering the whole hero, and the hero itself
is `100svh` rather than `82svh`, so the artwork reaches every edge.

The crop was measured rather than picked: at `auto 115%` / `85% 50%` the frame
carries **37% ink across the top and 47% across the bottom, but only 8%
directly behind the headline** — the crowd is everywhere, and it naturally
thins exactly where the words sit.

## The middle is lifted, not cleared

Instead of a cream block, there is a soft radial lift behind the copy only:
82% cream at its centre, falling to nothing by its edge. The type stays fully
legible and the people remain visible through it, rather than being covered.

Verified at 375, 390 and 430: hero height equals viewport height exactly
(812/844/932), and `scrollWidth` equals the viewport at all three.

---

# Event added: 81st Indonesia Independence Day Celebration

Listed as a **Tiger Pick** — the "found by us" category from the About page —
because Tiger Club is promoting it, not hosting or collaborating on it.

To make that distinction real rather than implied, `TigerEvent` gained two
optional fields:

    origin?: "with" | "found"     // undefined = produced by Tiger Club
    presentedBy?: string

`EventRow` surfaces them: a small orange **TIGER PICK** mark under the location
in the collapsed row, and in the expanded panel a line reading *"Tiger Pick ·
presented by Indonesian Community Heritage Foundation — not hosted or organised
by Tiger Club."* Nobody can mistake it for one of ours.

Filed under **Explore**, Atlanta, Aug 30. Free, 4–8pm, Korean Community Culture
Center, Norcross. Sits in the upcoming list, not the past archive.

The two fields are there for future use too — `"with"` is ready for Tiger Club ×
partner events when you have them.

*One thing to check:* the listing uses the existing festival photo as its
image. If ICHF supply artwork, drop it in `public/images/` and swap the
`image` path.

---

# Mobile hero: a purpose-built portrait composition

## The seam

The rectangular patch across the crowd was mine: `.hero-copy-lift`, a
hard-edged gradient rectangle sitting over the artwork to hold the type. It is
deleted, along with the top gradient on mobile. The mobile hero now renders
**one layer** — verified in the browser: `.hero-crowd > div` count is 1 at 375,
390 and 430.

## The new asset

`crowd-mobile.webp` is a dedicated portrait canvas (1000×2100), not a crop of
the desktop image. Bands are lifted from the same artwork and composited onto
cream with **per-edge feathering**: the edge facing the copy gets a long, gentle
falloff (340–430px) so the crowd genuinely thins out over distance, while the
outer edges stay tight against the frame.

Composition: a band entering upper-right, a lighter one upper-left for balance,
a band entering lower-right, and a quiet one lower-left — with the middle left
completely open.

Measured on the asset: **36% ink across the upper band, 49% across the lower,
0% through the middle** where the headline and subline sit. Largest row-to-row
density change is **0.085**, so there is no hard edge anywhere in the image.

Two intermediate versions were rejected on inspection: an exponent-0.85 feather
left figures semi-transparent and ghosted, and an exponent-0.42 one produced a
visible straight cut where the upper band ended.

## Gap

`MediumsSpread` gains `pt-10` below `md`, so the hero and "seven ways to dive
in" no longer butt against each other on a phone. Desktop spacing unchanged.

---

# New artwork, full bleed bottom, real walk cycles, balloon hover

## Background

The new crowd artwork, shipped with minimal handling: cream lifted only in the
brightest tones, 2× LANCZOS upscale, no sharpening, q95.

**Nothing is cropped.** It renders at `100%` of the hero width anchored to the
top, and the hero's own height is set from the artwork's 3:2 aspect
(`calc(66.67vw + 7rem)`), so the full composition including its bottom edge is
visible, with a band of cream underneath before "seven ways to dive in". A short
taper over the final 7% lets the picture resolve into the cream instead of
stopping on a hard line.

## The seven, and the walk

All eight figures are cut from **this** artwork's isolated individuals, so
scale, perspective, lighting and shadow direction match by construction.
Rendered heights measured 49–52px against the artwork's own ~52px people.

Walk cycles are now **five frames**, with the leg band sheared progressively per
frame. Verified in Chromium: all 5 frames used across 296 distinct positions
during one arrival.

**No rotation and no flipping.** Both were removed — the figures already face
the direction they travel, and turning them broke the illusion. Routes are
solved so the destination lies in the direction the figure already faces: every
one enters from the bottom edge and walks up-screen, which is what a back-view
figure is doing.

Routes are rejected unless the whole bezier stays clear of the crowd, the
headline/subline, and the nav band.

## Balloon person

The figure holding the orange balloon in the artwork is cut as its own sprite —
balloon, string and all — and is the Join hover. The leg shear is confined below
the hip so the balloon never distorts, and the balloon drifts a little against
the stride.

Its destination is deliberately the solved route **furthest from the artwork's
own balloon figure** (71 units away), so the two are never close enough to read
as one person duplicated — an earlier placement put them side by side.

---

# Centring, pace, and making the balloon hover visible

## Headline centring

The hero was `min-height: calc(66.67vw + 7rem)` with the extra 7rem added to
height but padding applied only to the bottom — so the copy sat exactly 3.5rem
below the artwork's centre. The box is now **exactly** the artwork's 3:2 aspect
(`66.67vw`) with symmetrical `py`, and the breathing space before the next
section moved to a `margin-bottom`.

Measured in the browser: artwork centre 480px, copy centre 480px — **offset 0**.

## Pace

Walk durations were 5.2–7.3s, which is what made them feel slow. They are now
**3.0–3.9s**, and the gap between arrivals is **1.5s** (was 1.7s). All seven are
settled **14.4s** after load, down from ~26s.

## The balloon hover

It was working — a real hover on the button moved it 963px → 771px — but its
destination was the far bottom-right corner at 94%/88%, partly below the fold
and buried in dense crowd, so nothing appeared to happen.

It now walks to **80.8%/80.5%**: on the right-hand side, well inside the
viewport, against the open cream where it is unmissable. That spot is still 55
units from the artwork's own balloon figure, so the two never read as a
duplicate. The arrival that previously held it took the corner instead.

---

# Hero layout architecture: viewport-driven, not image-driven

You diagnosed it correctly. The hero's height was `calc(66.67vw + …)` — derived
from the artwork's aspect ratio — so the copy's position was a function of the
picture, and every change of window shape moved it.

The two layers are now fully independent:

**Background** — `position: absolute; inset: 0; width/height: 100%;
background-size: cover; background-position: center`. Free to crop differently
at any aspect ratio. It contributes nothing to layout.

**Content** — `position: relative; z-index: 10; min-height: 100svh`, flex-centred
on both axes, sized purely by the viewport. It reads no dimension, percentage or
transform from the image. Nav height is added as top padding so the block
centres on the usable area *below* the nav rather than the whole screen.

Measured across four viewports — 1440×900, 1920×1080, 1280×720 and 390×844 —
the copy's offset from the usable centre is **identical at every one** (−57px,
which is simply the subline sitting below the tagline inside the centred block).
Hero height equals viewport height exactly in all four. The artwork crops
differently in each and the typography does not move.

# The original balloon person is erased

Since the hover brings a balloon person in, the one already in the artwork was a
duplicate. It is painted out of the source image — figure and cast shadow — by
sampling the surrounding cream for its local tone and grain and refilling the
region with feathered edges. Ink in that region drops from 9.3% to **0.26%**,
with no visible patch.

The hover sprite was cut before the erase, so the character itself is unchanged.

---

# Mobile re-art-directed (desktop untouched)

Everything below lives under `max-width: 767px`. Desktop measured before and
after: hero 900px, nav 81px, tagline 73px — unchanged.

| | 375 | 390 | 430 |
|---|---|---|---|
| nav height | 77px | 77px | 77px |
| hero height | 715 (88svh) | 743 | 820 |
| gap to "seven ways" | 72px | 72px | 72px |
| headline | 38px, 1 line | 38px | 39px |
| subline | 19px, 79% wide | 19px, 79% | 19px, 80% |
| horizontal scroll | none | none | none |

## Nav
Logo down to 10.5px, the Join button roughly halved (11px text, tighter padding,
1px border), hamburger 32px. Bar is a fixed 76px.

## Hero
88svh, so the next section follows naturally instead of after a screenful of
dead space. Content layer still sized purely by the viewport.

## Background
`crowd-mobile.webp` is a portrait asset built for this breakpoint: **one
continuous image**, no stacking, no patches. A 3:2 landscape cannot frame both
edges of a portrait screen at any crop, which is why mobile has its own art.

Two things had to be got right, and neither worked first time:

- **Aspect.** My first attempt squashed a narrow slice into a tall box and
  smeared every figure vertically. Each band is now cropped at the aspect it
  will be drawn at, so the resize is uniform.
- **The text rows.** With bands at both edges the headline still ran into the
  right-hand crowd. Each band now retreats toward its outer edge across the copy
  rows, so the edges stay framed while the middle band of the image is clear.
  Ink in the text rows: **4.8%**, against 21% top and 20% bottom.

---

# Full uncropped artwork + viewport-centred copy

## Artwork is never cropped

The hero's height IS the artwork's height at full width — 66.67vw on desktop
(3072×2048), 211.11vw on mobile (900×1900) — with
`background-size: 100% auto` anchored to the top. Nothing is cut on any side,
and the hero is free to be taller than the viewport.

*Two crop rules were still active and had to go:* a `max-aspect-ratio: 16/10`
override that switched the hero to `auto 122%`, and an older `cover` on the
background layer. Both were trimming the sides on common window shapes.

## Copy is centred on the viewport, not the image

The content layer is `position: sticky; top: 0; height: 100svh` (88svh mobile)
with flex centring. It sticks to the top of the hero for exactly one screen, so
"life is better together." sits in the middle of whatever you can currently see
while the artwork continues above and below. It reads no dimension from the
image.

Measured at 1440×900: tagline centre 446px against a viewport midpoint of 450.

## Transition

| | desktop | mobile |
|---|---|---|
| hero height | 960px (full art) | 823px (full art) |
| cream before "seven ways" | 81px | 76px |
| heading → EAT | 174px | 109px |

Both gaps sit inside the ranges you asked for, and the heading only begins after
the artwork has finished — nothing overlaps the bottom of the crowd.

## Mobile density

The portrait asset is rebuilt from the artwork's **densest** vertical slices
(42% and 37% ink, found by scanning every slice) rather than arbitrary edges, so
the bands read as orange-and-black stripes instead of scattered figures. Ink is
26% at the top and 22% at the bottom, with the bands retreating to **6%** across
the copy rows so no one crosses the type.

---

# Hero shifted up to end at the fold (v79)

The hero was `66.67vw` — the artwork's full height — which came to 960px on a
1440×900 screen, so 60px hung below the fold and you had to scroll to finish it.

It is now `height: 100svh` with the artwork **anchored to the bottom**
(`background-position: 50% 100%`). The overflow is taken off the top, where the
nav gradient already sits, so nothing visible is lost and nothing hangs past the
first screen.

Measured: hero height equals viewport height exactly at 1440×900 and 1920×1080
(**overflow 0**), and mobile is 823px inside an 844px screen, so it does not
overflow either. Cream spacing before "seven ways to dive in" is unchanged at
81px desktop / 76px mobile.

---

# Bottom gap and centring (v80)

## The extra space

The artwork carries about **4.6% of empty cream along its own bottom edge**, so
anchoring it to `100%` still left that band showing as a gap. The background is
now pushed a further `4.6vw` down (`background-position: 50% calc(100% + 4.6vw)`),
which puts the artwork's blank strip below the fold and runs the crowd right to
the bottom of the hero.

## Centring

`--hero-content-top` was 43% desktop / 49% mobile, which sat the copy visibly
high. Set to 50% first and measured: the block still landed **7px high on
desktop and 12px on mobile**, because the value positions the block's top edge
rather than its centre.

Corrected to **50.8%** desktop and **51.4%** mobile. Measured block centre
against viewport centre:

| | block centre | viewport centre | offset |
|---|---|---|---|
| 1440×900 | 450 | 450 | **0** |
| 1920×1080 | 542 | 540 | **+2** |
| 390×844 | 421 | 422 | **−1** |

---

# No clipped figures at the fold (v81)

The 4.6vw downward shift was too far and was cutting legs off the bottom row of
people.

Measured against the artwork's **body** pixels (cast shadows excluded, so this
finds real feet rather than shadow tips): the lowest body pixel is at row
**1930 of 2048**, leaving 118px of empty cream beneath it. At the rendered scale
that is **3.84vw** — the hard maximum before feet start being clipped.

The shift is now **3.6vw**, which closes the gap and keeps a margin under the
lowest feet.

Verified with the walkers hidden, so the artwork alone is measured:

| viewport | lowest body row | clearance below feet | pixels touching bottom |
|---|---|---|---|
| 1440×900 | 1793 / 1800 | 6px | **0** |
| 1920×1080 | 2151 / 2160 | 8px | **0** |
| 1280×720 | 1434 / 1440 | 5px | **0** |
| 1600×1000 | 1993 / 2000 | 6px | **0** |

Because both the shift and the artwork's empty band scale with viewport width,
the 3.6 < 3.84 relationship holds at every window shape — no aspect ratio can
reintroduce clipping.

---

# Three event kinds + the SERVE animation (v82)

## Event kinds

`TigerEvent` now carries a `kind`, replacing the old two-value `origin`:

    original — Tiger Club creates and hosts it from scratch
    pick     — an existing Atlanta experience we curate and bring people to
    collab   — co-created with another organisation, venue or community

It defaults to `"original"` when omitted, so every existing event is labelled
correctly without touching its data. `EventRow` prints the label under the
location on every row, and in the expanded panel adds who it is with or
presented by, plus a one-line explanation of what that kind means.

Verified on the live page: **8 of 8 rows carry a kind label** — the Indonesia
listing as a Tiger Pick, everything else as a Tiger Original.

Bite Club is a Tiger Original, not a collab. I had tagged it as one purely to
demonstrate the third state; that was wrong and has been reverted. No event is
currently marked  — set  plus  on one when
you have a genuine partner event.

## SERVE

The old cursor-following dot is gone, along with its `passIndex` / `following`
state. The word now animates its own letters: the **V** drops, the **R** and the
**final E** lean in toward it, and it rises back to the baseline as they
straighten.

Pure transforms on the letters, so there is no layout shift, and every keyframe
resolves to the identity transform so the word ends exactly as it started. The
letters are keyed on a run counter, so it replays on every hover.

Measured over one hover:

| letter | translateY | rotation |
|---|---|---|
| S | 0 | 0 |
| E (first) | 0 | 0 |
| R | 0 | −1° … **+8.5°** |
| V | −1.1 … **+13.7px** | 0 |
| E (final) | 0 | **−8.5°** … +1° |

S and the first E never move, exactly as specified, and all five letters end at
zero.

---

# Mobile fixes (v84)

## Hero fits one screen, copy centred on the viewport

The mobile hero was `211.11vw` — the portrait asset's own aspect — which is
taller than a phone viewport once the browser chrome is showing, so the bottom
two stripes needed a scroll. It is now **`100svh`** with the artwork on
`background-size: contain`, which scales the whole composition down until all
four stripes fit; the leftover is page cream.

Verified at 390×750, 390×844 and 375×700: hero height equals viewport height
exactly at all three, and the copy wrapper centres on the viewport (375 of 750,
422 of 844).

## The quote tail ends black

A real tail has a solid dark tip. A third stroke is layered on the same path
with a single long dash positioned at the far end, so the stretch beside
"relationships." is solid black and the stripes read as leading up to it. Same
path, same morph — still one continuous stroke.

## Mediums auto-play on mobile

There is no hover on touch, so each word now plays its animation once, the first
time it scrolls into view, then settles. Gated on `pointer: coarse` or a small
viewport, and skipped under reduced motion; desktop hover behaviour is
unchanged.

*Detail worth recording:* the effect has to be declared **after** `runEnter` and
`runLeave`, since it lists them as dependencies — placed above, it throws a
temporal-dead-zone error at render.

## Finale tail clearance

The tail was crowding "SEE WHAT'S HAPPENING". Dropped from `top: 54%` to `64%`
and narrowed slightly. Measured gap from the CTA's bottom edge to the top of the
tail: **55px**.

---

# v85 — tail tip, mobile edges, event kinds, stale listings

## One black section, at the tip

The dashed stripes are gone. The tail is orange for its whole length with a
single solid black tip at the far end, beside "relationships."

Two bugs had to be found to get it there:

1. A dash pattern whose gap is shorter than the path **repeats**, which is why
   two black sections kept appearing. The gap is now longer than the whole path.
2. `vector-effect: non-scaling-stroke` makes dash lengths **screen units, not
   viewBox units**. The path is 290 user units but the svg draws ~1.92× wider,
   so it measures ~557px on screen — an offset computed from 290 put the black
   halfway along. Recomputed against the screen length, it lands on the tip.

## Mobile is edge-to-edge

`contain` was leaving cream bars down both sides. The asset is rebuilt at a
phone-like 1:2 aspect with **every stripe running well off its own edge**, and
the hero uses `cover`, so whatever the crop trims, all four still bleed.

Measured left vs right edge ink: 17.5/17.4 at 390×750, 23.7/25.1 at 390×844,
17.1/16.3 at 430×800 — consistent on both sides at every size, which is what
was wrong before (orange bled, black was clipped).

## Event kinds

Dragon Boat, Refuge Coffee Run and CompassionCon are **Tiger Collabs**.
JapanFest and Mini-KennyCon are **Tiger Picks**. Verified on the page.

## Stale listings on the homepage

"What are you doing this week?" was `events.slice(0, 5)` — the first five
entries in the file, with **no date filter at all**, which is why July events
were still showing. The date logic now lives in one place
(`upcomingEvents()` in `lib/events.ts`) and both the homepage and the events
page use it. The homepage list now starts at the next future event.

---

# v86 — the tail is a real shape, and mobile autoplay is off

## The tail

Rebuilt as a **filled shape**, not a stroked path. A stroke can only ever be a
line of constant width with dashes laid on top, which is exactly why the old
version read as an orange rule with a stray black mark.

The geometry is generated off a curved centreline with varying thickness:

- **Taper** — half-width runs 9.3 units at the base to 2.0 at the tip, with a
  small sinusoidal variation so it does not look like a perfect SVG stroke.
- **Six black stripes**, each generated as a *slice of the tail itself* between
  two points along both edges — so every stripe wraps across the full width
  rather than sitting on top of a line. Spacing, width and skew are all
  irregular.
- **A black tip** built the same way, from 79% to the end, so it is part of the
  shape rather than a separate stroke.

Stripes and tip are clipped to the tail body, so nothing can spill past its
edge. The draw-in reveal is unchanged. Rendered height raised 0.30em → 0.46em so
the thickness actually reads.

## Mediums

The mobile autoplay added in v84 is removed — the seven words animate on
hover/tap only, on every device. Verified: LEARN holds a single static state
while idle on a touch viewport.

*Note:* removing it duplicated the surrounding block on the first attempt and
broke the build with a duplicate `runEnter`; the duplicate was cut and the file
compiles clean.

---

# v87 — mobile hero recomposed

The portrait asset is rebuilt as **four separate corner formations** rather than
bands that met in the middle.

Each one is placed toward its own corner and tapers only on the end that faces
the centre; the outer end runs well past the canvas edge, so no viewport crop
can ever reveal where a crowd stops. That is what makes the bleed read as
intentional on both sides instead of one edge looking clipped.

Measured on the shipped asset:

- vertical centre column (40–60% of width): **1.5% ink** — the pairs no longer
  meet
- nav band (top 9%): **0%** — logo and button sit on clean cream
- copy band (40–62% of height): **0%**
- edge ink left 15.9% / right 23.5% — both sides bleed

Rendered at 390×750, 390×844 and 430×800: `scrollWidth` equals the viewport at
all three, all four formations are visible in the first screen, and the copy sits
on cream.

Two intermediate versions were rejected on inspection: the first put crowd
across the nav and buried the logo, the second still had the top pair merging
into a single chevron across the middle.

---

# v88 — the hero is a picture again

The whole crowd-animation system is removed: `HumanStripes.tsx`, the eight
walking figures and their sprite sheets, the separate shadow layer, the rAF
loop, the solved bezier routes, the Join-hover joiner, and every `.hero-crowd*`
/ `.hero-walker` / `.hero-shadow` rule. The `public/images/walkers/` folder is
deleted. Grep confirms no references remain.

In its place, `HeroBackdrop.tsx` renders **one static illustration**, with
desktop and mobile getting their own artwork rather than one image re-cropped —
the two compositions leave their clear space in different places.

Both were colour-matched to `#F4E9D6` and supersampled 2×:

- `hero-desktop.webp` — 3072×2048
- `hero-mobile.webp` — 1882×3344

## Copy centring

Hero is `100svh` and the copy is centred in it. Both illustrations carry an open
cream middle, so one position satisfies "centred in the viewport" and "centred
in the artwork" at once — measured centre-box ink is 0.02% desktop, 0.42%
mobile.

The percentage positions the block's top edge, so it was measured rather than
assumed: at 50% the visual block sat 7px high on desktop and 49px high on
mobile, because the rotating-line container is taller than its text. Corrected
to 50.8% and 56.5%.

| viewport | hero | block centre | viewport centre | offset | artwork |
|---|---|---|---|---|---|
| 1440×900 | 900 | 450 | 450 | **0** | desktop |
| 1920×1080 | 1080 | 542 | 540 | **+2** | desktop |
| 390×750 | 750 | 375 | 375 | **0** | mobile |
| 390×844 | 844 | 428 | 422 | **+6** | mobile |

One `.hero-backdrop` layer at every size, and `scrollWidth` equals the viewport
throughout.

---

# v90 — the tail clears the type

The tail's rising tip was crossing the descender of the "p" in
"relationships" and clipping letters.

Two changes: the centreline's upward lift at the tip is flattened (−20 → −11
units), and the whole shape sits lower (`-bottom-0.40em` → `-bottom-0.56em`).
It still curves up at the end, just under the type rather than into it.

**Verified by pixel comparison, not by eye.** The line was captured twice —
once with the type set to `transparent` (tail only) and once with the svg
hidden (text only) — then the two masks were intersected, scoped to the final
line so the quote mark and attribution rule could not contaminate the result:

- tail pixels: 30,408
- text pixels: 37,303
- **overlapping pixels: 0**
- gap between the lowest glyph pixel and the highest tail pixel: **20px**

---

# v91 — the correct artwork pair

You were right to check. The desktop file shipped in v89/v90 was the **earlier**
upload, not the one you meant — mean pixel difference 3.93 against the version
you re-sent. Both are now the files from this round:

- `hero-desktop.webp` — from the 1344×896 upload, supersampled to 2688×1792
- `hero-mobile.webp` — from the 819×1456 portrait upload, supersampled to
  1638×2912

Both cream-matched to `#F4E9D6`.

## Mobile copy zone cleared

A centred copy block measured **1.69% ink** on the new portrait artwork, so 21
marks (connector lines and small figures) falling inside that band were painted
out using the surrounding cream's own tone and grain. The band now measures
**0.0003%**, so the copy stays centred rather than being pushed off-centre to
dodge the illustration.

## Verified with the text hidden

Ink inside the exact rendered copy box, artwork only:

| viewport | ink behind copy |
|---|---|
| 1440×900 | 0.57% |
| 1920×1080 | **0.000%** |
| 390×750 | **0.000%** |
| 390×844 | **0.000%** |

The 0.57% on 1440×900 is two connector lines clipping the extreme corners of
the bounding box — inspected, nothing sits behind the words. `scrollWidth`
equals the viewport at all sizes.
