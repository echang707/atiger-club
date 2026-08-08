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

- `app/page.tsx` — landing page (hero + upcoming experiences preview)
- `app/events/` — the main experiences/events page with category filtering
- `components/` — Nav, Footer, Hero, EventCard, UpcomingStrip
- `lib/events.ts` — event data (swap this for a real data source later — CMS, database, API)
- `tailwind.config.ts` — the full design token system (colors, fonts, spacing)

Placeholder photography is pulled from Unsplash — swap `lib/events.ts` image URLs
and the hero image in `components/Hero.tsx` for real photos when you have them.

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
