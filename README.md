# Tiger Club — atigerclub.com

Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion.

## Run locally

You'll need [Node.js](https://nodejs.org) 18+ installed.

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Project structure

- `app/page.tsx` — the full editorial homepage: minimal hero with the six
  interactive medium words (EAT · CREATE · MOVE · EXPLORE · SERVE · LEARN),
  a scroll-triggered scrapbook story, upcoming experiences, the "Tiger Club
  Was Here" map, and the closing section.
- `app/events/` — the experiences page: same visual identity, editorial rows
  instead of cards, filterable by medium (`/events?medium=Eat` etc., which is
  exactly what clicking a homepage word links to).
- `components/MediumWord.tsx` — the six bespoke micro-interactions (bite,
  draw-in, flee-the-cursor, scatter, reach-and-give, scramble/resolve).
- `components/ScrollStory.tsx` — the candid photo/annotation scroll sequence.
- `components/TigerWasHere.tsx` — the abstracted city map with clickable
  memory dots (`lib/events.ts` → `memories`).
- `components/EventRow.tsx` — shared editorial row used on both the homepage
  preview and the full events page; expands in place on click.
- `lib/events.ts` — event + memory data (swap for a real data source later —
  CMS, database, API).
- `tailwind.config.ts` — the full design token system (colors, fonts, spacing,
  the walk/grain keyframes used in the ending section).

Placeholder photography is pulled from Unsplash — swap the `image` URLs in
`lib/events.ts` for real candid Tiger Club photos when you have them. The
brief specifically wants imperfect, human photography rather than polished
event photography, so lean toward phone photos over anything staged.

The Discord link (`https://discord.gg/6u83g4P8Cb`) is wired into the nav,
footer, and the final "join the community" line — update it in those three
spots (`components/Nav.tsx`, `components/Footer.tsx`, `components/Ending.tsx`)
if it ever changes.

## Deploying to Cloudflare Pages (your domain: atigerclub.com)

This is a real Next.js app, so you can't drag-and-drop static files the way
Cloudflare's "Upload static files" flow expects. Instead:

1. Push this project to a GitHub repo.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**.
3. Select your repo. Cloudflare auto-detects Next.js — framework preset should
   say "Next.js." Build command: `npx @cloudflare/next-on-pages@1`, output
   directory: `.vercel/output/static` (Cloudflare will suggest this once it
   detects Next.js — accept the suggested values).
4. Deploy. Cloudflare gives you a `*.pages.dev` URL first.
5. Go to your Pages project → **Custom domains** → add `atigerclub.com`.
   Since the domain's already on Cloudflare, DNS connects automatically.

From then on, every `git push` redeploys the site automatically.

## What's intentionally not built yet

Per the brief: memberships, member profiles, saved events, event history,
city guides, community groups, calendar, and notifications are not built.
The data model (`lib/events.ts`) and component structure are set up so these
can be added later without a rewrite — e.g. `TigerEvent` can gain a `saved`
relation, and category filtering already exists as a pattern.

---

## Background system update

The tiger-marble was previously `fixed inset-0` at full strength behind every
section (`app/layout.tsx`). That is why each block carried its own blurred
cream blob — the pattern and the copy were fighting and the glow was the
referee. That layer is gone, and with it `.quiet-zone`, `.quiet-zone-word`
and `.glyph-halo` (zero references remain).

The material now appears deliberately:

```
Hero ............. marble, full strength
MediumsSpread .... quiet cream
ScrollStory ...... quiet cream + one fragment cutting behind the postcard
MarbleWedge ...... accent from the left edge
UpcomingRows ..... quiet cream
MarbleWedge ...... accent from the right edge
Ending ........... marble returning, scroll-driven
```

The page surface is cream plus a seamless grain tile cut from the marble's own
cream, so the connection survives where the pattern doesn't.

**Cream matching.** The supplied marble's cream measured `rgb(248,229,199)`.
Its highlights were corrected so the cream lands exactly on `#F4E9D6`, blacks
and oranges untouched. Re-exporting the pattern means redoing this, or the
seam between hero and page will show.

**Hero crop.** The artwork was gridded for ink coverage and the crop
(`118%` at `66% 46%`, `.marble-field`) puts the tagline on the image's own
cream — measured under 1% ink behind the type, 50–88% down the right edge.
Position does the work a scrim used to do badly. Re-check both wide and tall
window shapes if you move it.

## Colour

`#e0521c` is THE Tiger Club orange and is used wherever brand orange is meant.
It is 3.24:1 on cream — fine for graphics (needs 3:1), below AA for small text
(needs 4.5:1). So two deeper steps exist *only* where orange carries text or
sits behind it, leaving the brand orange itself uncompromised:

| Token | Value | Use |
|---|---|---|
| `tiger` | `#e0521c` | rules, marks, borders, the wordmark artwork |
| `tiger-text` | `#BE3F0E` | small orange text (4.47:1) |
| `tiger-fill` | `#CC4413` | button fills w/ `#FFF7EF` text (4.50:1) |
| `tiger-deep` | `#A9350C` | hover on filled buttons |

## Ending section

Copy left, tiger right, bottom-aligned so the tail (which sits ~63% down the
illustration) lands beside the headline rather than stranded below it. Section
height and top padding keep the tiger's head clear of the fixed nav, which
overlays the first 78px of the viewport.

A clip-path wipe originally "drew" the tail outward but the inset interpolation
reliably stalled near 18%, permanently chopping off the tail tip. It is now a
fade plus a short slide — less clever, always renders the whole animal. Runs
once, then settles.

`.finale-copy` sits above the tiger in z-order, so the tail may pass behind
type but can never sit on top of it.

## Known gap: the PLAY icon

`public/images/icons/play.png` is a **placeholder**. The other six icons are
illustrated tiger mascots; this one is a striped ball drawn to match the
palette, outline weight and flat style, but it is not a mascot and will not
pass close inspection beside the others. Commission a matching PLAY tiger and
drop it in at 500×344 RGBA — no code change needed.

## Build note

`next/font/google` fetches at build time. Verified compiling clean (all 8
routes prerender). Screenshots were taken with the fonts temporarily stubbed
because this sandbox cannot reach `fonts.googleapis.com`; the shipped
`app/layout.tsx` contains the real font implementation.
