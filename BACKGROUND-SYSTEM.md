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
