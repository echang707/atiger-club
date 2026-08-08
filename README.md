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
