"use client";

import { motion } from "framer-motion";
import Link from "next/link";

/* ---------------------------------------------------------------------
   /about — one continuous editorial story in five movements:

     01  why we exist
     02  what we believe
     03  what makes it a Tiger Club experience   <- centrepiece
     04  what we're building
     05  made / with / found, and the close

   The previous version was structurally cluttered: ten movements, an
   eyebrow label on every one, and three or four competing display sizes
   per screen. This is the same argument with the scaffolding removed —
   fewer headlines, fewer labels, more cream. Only the four principles
   are allowed to be loud, because they're the part that has to land.

   Nothing new was invented for this page: Fraunces display, Instrument
   italic for the turns, JetBrains for the few small-caps marks, the
   ink/cream/tiger palette, `max-w-content`, `organic-underline`, and the
   same rise-on-enter motion as the homepage.
   --------------------------------------------------------------------- */

const EASE = [0.22, 1, 0.36, 1] as const;

function Rise({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* The only decoration on the page: three stripes entering from one outer
   edge. Used twice, never behind copy. */
function EdgeStripes({ side = "left" }: { side?: "left" | "right" }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      {[0.26, 0.5, 0.74].map((top, i) => (
        <motion.div
          key={top}
          className={`absolute rounded-full ${side === "right" ? "right-0" : "left-0"} ${
            i === 1 ? "bg-tiger h-[7px] md:h-[10px]" : "bg-ink/70 h-[4px] md:h-[6px]"
          }`}
          style={{
            top: `${top * 100}%`,
            width: `clamp(40px, ${7 + i * 3}vw, 150px)`,
            transformOrigin: side === "right" ? "right" : "left",
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: i === 1 ? 1 : 0.45 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.85, delay: i * 0.1, ease: EASE }}
        />
      ))}
    </div>
  );
}

const PRINCIPLES = [
  {
    n: "01",
    name: "No spectators",
    claim: "Don't just attend. Participate.",
    body: "People aren't the audience. They're part of what makes the experience happen.",
  },
  {
    n: "02",
    name: "Strangers don't leave as strangers",
    claim: "Connection by design, not by chance.",
    body: "Natural reasons to interact. Someone should be able to show up alone and still feel like they belong.",
  },
  {
    n: "03",
    name: "Break the script",
    claim: "There should be something you didn't expect.",
    body: "One defining unexpected moment — playful, thoughtful, surprising, strange. We call it the Wild Card.",
  },
  {
    n: "04",
    name: "Discovery by design",
    claim: "Leave knowing something you didn't before.",
    body: "A person. A place. A culture, skill, idea, neighbourhood — or a side of yourself.",
  },
];

export default function AboutClient() {
  return (
    <main className="pt-28 md:pt-36">
      {/* ============ 01 — WHY WE EXIST ============ */}
      <section className="relative py-12 md:py-20">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <Rise>
            <h1 className="font-display text-ink tracking-tight leading-[0.95] text-[10.5vw] sm:text-[8vw] md:text-[6.2vw] lg:text-[5.4vw] max-w-[15ch]">
              Why does finding your people get harder as you get older?
            </h1>
          </Rise>

          <div className="mt-12 md:mt-16 grid md:grid-cols-2 gap-8 md:gap-16 max-w-4xl">
            <Rise delay={0.06}>
              <p className="text-base md:text-lg text-ink/75 leading-relaxed">
                Growing up hands you social infrastructure for free — classrooms,
                teams, clubs, campuses, neighbourhoods. Recurring places where
                relationships happen without anyone trying.
              </p>
            </Rise>
            <Rise delay={0.12}>
              <p className="text-base md:text-lg text-ink/75 leading-relaxed">
                Adulthood removes most of it, and more of life has moved behind a
                screen. You can be surrounded by people and still have very few
                real chances to meet any of them.
              </p>
            </Rise>
          </div>

          <Rise delay={0.1}>
            <p className="mt-14 md:mt-20 text-base md:text-lg text-ink/75 leading-relaxed max-w-2xl">
              A Tiger Cub started with a mission to make relationships, community
              and belonging easier to find. Tiger Club grew from one realisation
              inside it.
            </p>
          </Rise>

          <Rise delay={0.14}>
            <p className="mt-8 md:mt-10 font-tagline italic text-ink text-[7.5vw] sm:text-[5.2vw] md:text-[3.7vw] lg:text-[3.1vw] leading-[1.14] max-w-[19ch]">
              Sometimes the best way to bring people together is to give them
              something worth experiencing together.
            </p>
          </Rise>

          <Rise delay={0.18}>
            <p className="mt-10 font-mono text-[11px] md:text-xs tracking-wideish uppercase text-ink/60 leading-loose">
              Food · Art · Movement · Culture · Learning · Exploring · Giving back
            </p>
          </Rise>

          <Rise delay={0.22}>
            <p className="mt-8 text-base md:text-lg text-ink/75 leading-relaxed max-w-xl">
              The activity gives people a reason to show up.{" "}
              <span className="text-ink font-medium">
                The shared experience gives them a reason to connect.
              </span>
            </p>
          </Rise>
        </div>
      </section>

      {/* the tiger name, folded in rather than given its own section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <EdgeStripes side="left" />
        <div className="max-w-content mx-auto px-6 md:px-10 relative z-10">
          <Rise>
            <p className="font-display tracking-tight leading-[0.95] text-[9.5vw] sm:text-[7vw] md:text-[5vw] lg:text-[4.3vw] max-w-[16ch]">
              <span className="text-ink">Tigers are solitary.</span>{" "}
              <span className="text-tiger">We don&rsquo;t have to be.</span>
            </p>
          </Rise>
        </div>
      </section>

      {/* ============ 02 — WHAT WE BELIEVE ============ */}
      <section className="relative py-16 md:py-28">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <Rise>
            <h2 className="font-display text-ink tracking-tight leading-[0.98] text-[9vw] sm:text-[6.4vw] md:text-[4.6vw] lg:text-[4vw] max-w-[17ch]">
              The activity is the starting point. What it creates is what matters.
            </h2>
          </Rise>

          <Rise delay={0.08}>
            <p className="mt-12 md:mt-16 text-base md:text-lg text-ink/75">
              A meaningful experience leaves you more connected to:
            </p>
          </Rise>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 max-w-4xl">
            {["People", "Community", "The world around you", "Yourself"].map((t, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
              >
                <div className="h-[3px] w-8 bg-tiger rounded-full mb-3" />
                <p className="font-display text-lg md:text-2xl text-ink leading-tight">{t}</p>
              </motion.div>
            ))}
          </div>

          <Rise delay={0.1}>
            <p className="mt-16 md:mt-24 max-w-xl text-base md:text-lg text-ink/75 leading-relaxed">
              Technology can help us find each other.{" "}
              <span className="text-ink font-medium">It can&rsquo;t replace being there.</span>
            </p>
          </Rise>
        </div>
      </section>

      {/* ============ 03 — THE CENTREPIECE ============ */}
      <section className="relative pt-16 md:pt-28">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <Rise>
            <h2 className="font-display text-ink tracking-tight leading-[0.94] text-[11vw] sm:text-[8vw] md:text-[5.8vw] lg:text-[5vw] max-w-[13ch]">
              What makes it a Tiger Club experience?
            </h2>
          </Rise>
          <Rise delay={0.08}>
            <p className="mt-8 md:mt-10 text-base md:text-lg text-ink/75 leading-relaxed max-w-xl">
              Putting people in the same room isn&rsquo;t enough. We design
              experiences so something can happen between them.
            </p>
          </Rise>
        </div>

        <div className="mt-16 md:mt-28">
          {PRINCIPLES.map((p, i) => (
            <motion.article
              key={p.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-90px" }}
              transition={{ duration: 0.8, ease: EASE }}
              className="border-t border-ink/12 py-14 md:py-24 last:border-b"
            >
              <div className="max-w-content mx-auto px-6 md:px-10">
                <div className="grid gap-x-10 gap-y-5 md:grid-cols-12 md:items-baseline">
                  <p
                    aria-hidden="true"
                    className="font-display leading-none text-tiger/40 select-none
                               text-[13vw] md:text-[5.5vw] lg:text-[4.6vw] md:col-span-2"
                  >
                    {p.n}
                  </p>
                  <div className="md:col-span-6">
                    <p className="font-mono text-[11px] tracking-wideish uppercase text-tiger-text mb-4">
                      {p.name}
                    </p>
                    <h3 className="font-display text-ink tracking-tight leading-[1.02] text-[8.5vw] sm:text-[5.8vw] md:text-[3.5vw] lg:text-[3vw]">
                      {p.claim}
                    </h3>
                  </div>
                  <p className="md:col-span-4 text-base md:text-lg text-ink/75 leading-relaxed max-w-md">
                    {p.body}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ============ 04 — WHAT WE'RE BUILDING ============ */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <EdgeStripes side="right" />
        <div className="max-w-content mx-auto px-6 md:px-10 relative z-10">
          <Rise>
            <h2 className="font-display text-ink tracking-tight leading-[0.94] text-[11.5vw] sm:text-[8vw] md:text-[6vw] lg:text-[5.2vw] max-w-[14ch]">
              Events are the starting point.
            </h2>
          </Rise>

          <Rise delay={0.08}>
            <p className="mt-10 md:mt-12 text-base md:text-lg text-ink/75 leading-relaxed max-w-2xl">
              We aren&rsquo;t trying to become another events company. We&rsquo;re
              trying to help build{" "}
              <span className="text-ink font-medium">social infrastructure</span>{" "}
              for modern city life — the places, rituals and communities that make
              it easier to meet people, take part in your city, and feel like you
              belong there.
            </p>
          </Rise>

          <div className="mt-12 md:mt-16 max-w-3xl border-t border-ink/10">
            {[
              "A reason to leave the apartment.",
              "A place where showing up alone is normal.",
              "A way to discover what's around you.",
              "A bridge into communities you weren't already part of.",
              "Recurring enough that relationships actually form.",
            ].map((t, i) => (
              <motion.p
                key={t}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                className="font-display text-lg md:text-2xl text-ink border-b border-ink/10 py-4"
              >
                {t}
              </motion.p>
            ))}
          </div>

          <Rise delay={0.1}>
            <p className="mt-16 md:mt-24 text-base md:text-lg text-ink/75 max-w-xl leading-relaxed">
              Over time, seeing{" "}
              <span className="font-display text-ink">Tiger Club</span> on an
              experience should mean something. Not luxury, exclusivity or
              perfection. It should mean:
            </p>
          </Rise>

          <Rise delay={0.14}>
            <p className="mt-8 font-display text-ink tracking-tight leading-[1.02] text-[8.5vw] sm:text-[6vw] md:text-[4.2vw] lg:text-[3.6vw] max-w-[18ch]">
              Someone thought about how this would actually feel.
            </p>
          </Rise>

          <Rise delay={0.18}>
            <p className="mt-10 text-base md:text-lg text-ink/75 leading-relaxed max-w-lg">
              You can come alone. You&rsquo;ll take part. You&rsquo;ll probably
              meet someone, and discover something. And something might surprise
              you.
            </p>
          </Rise>

          <Rise delay={0.22}>
            <p className="mt-10 font-tagline italic text-ink text-[7vw] sm:text-[4.8vw] md:text-[3.2vw] lg:text-[2.8vw] leading-[1.15] max-w-[20ch]">
              That&rsquo;s the standard we&rsquo;re building toward.
            </p>
          </Rise>
        </div>
      </section>

      {/* ============ 05 — MADE / WITH / FOUND, AND THE CLOSE ============ */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <Rise>
            <p className="text-base md:text-lg text-ink/75 max-w-xl">
              Not everything on Tiger Club is made by Tiger Club. Here&rsquo;s how
              to tell.
            </p>
          </Rise>

          <div className="mt-10 md:mt-14 border-t border-ink/12">
            {[
              {
                kind: "Made by us",
                name: "Tiger Club Experiences",
                body: "Designed around the full experience philosophy above.",
              },
              {
                kind: "Made with us",
                name: "Tiger Club ×",
                body: "Partners bring what they do best. We bring the social and experience-design layer.",
              },
              {
                kind: "Found by us",
                name: "Tiger Picks",
                body: "Things already happening around the city that we think are worth discovering.",
              },
            ].map((row, i) => (
              <motion.div
                key={row.kind}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                className="grid md:grid-cols-[170px_1fr] gap-1 md:gap-10 border-b border-ink/12 py-6 md:py-8"
              >
                <p className="font-mono text-[11px] tracking-wideish uppercase text-tiger-text md:pt-2">
                  {row.kind}
                </p>
                <div>
                  <p className="font-display text-2xl md:text-3xl text-ink leading-tight">
                    {row.name}
                  </p>
                  <p className="mt-1.5 text-base text-ink/70 max-w-xl">{row.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-32">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <Rise>
            <p className="font-display text-ink tracking-tight leading-[0.93] text-[11.5vw] sm:text-[8.5vw] md:text-[6.4vw] lg:text-[5.6vw] max-w-[15ch]">
              A city full of people isn&rsquo;t necessarily a connected city.
            </p>
          </Rise>
          <Rise delay={0.1}>
            <p className="mt-8 md:mt-10 font-tagline italic text-ink text-[7vw] sm:text-[4.6vw] md:text-[3vw] lg:text-[2.6vw]">
              We&rsquo;re working on that.
            </p>
          </Rise>
          <Rise delay={0.16}>
            <Link
              href="/events"
              className="organic-underline mt-12 md:mt-16 inline-block font-mono text-[11px] md:text-xs tracking-wideish uppercase text-ink hover:text-tiger-text transition-colors"
            >
              see what&rsquo;s happening →
            </Link>
          </Rise>
        </div>
      </section>
    </main>
  );
}
