"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import StripeRule from "./StripeRule";

/* ---------------------------------------------------------------------
   /about — the brand story.

   The homepage sells the feeling. This page explains the thinking, so it
   is built as a sequence of deliberate moments rather than blocks of copy:
   one idea per screen, large type, generous cream, and the tiger motif
   used only as stripes and a tail — never as a literal animal.

   Everything here is drawn from the existing system: Fraunces for display,
   Instrument for the italic taglines, JetBrains for the small caps labels,
   the ink/cream/tiger palette, `max-w-content`, `organic-underline`, and
   the same rise-on-enter motion language as the homepage.
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
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.75, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] md:text-xs tracking-wideish uppercase text-tiger-text mb-5">
      {children}
    </p>
  );
}

/* Section shell — keeps vertical rhythm identical across every movement. */
function Movement({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`relative py-10 md:py-16 ${className}`}>
      <div className="max-w-content mx-auto px-6 md:px-10">{children}</div>
    </section>
  );
}

export default function AboutClient() {
  return (
    <main className="pt-28 md:pt-36 pb-0">
      {/* ---------- 1. THE QUESTION ---------- */}
      <Movement className="pt-4 md:pt-10">
        <Rise>
          <Label>About Tiger Club</Label>
        </Rise>
        <Rise delay={0.05}>
          <p className="font-mono text-[11px] md:text-xs tracking-wideish uppercase text-ink/55 mb-6">
            We started with a question.
          </p>
        </Rise>
        <Rise delay={0.1}>
          <h1 className="font-display text-ink tracking-tight leading-[0.95] text-[10.5vw] sm:text-[8vw] md:text-[6.4vw] lg:text-[5.6vw] max-w-[16ch]">
            Why does finding your people get harder as you get older?
          </h1>
        </Rise>
        <Rise delay={0.15}>
          <StripeRule className="mt-7 md:mt-9" />
        </Rise>

        <Rise delay={0.1}>
          <p className="mt-7 md:mt-9 text-base md:text-lg text-ink/75 leading-relaxed max-w-2xl">
            Classrooms, teams, clubs, dorms — as students we get social
            infrastructure without asking for it. Adulthood quietly takes it
            away, and more of life has moved behind a screen. You can end up
            surrounded by people and still find it hard to meet any.
          </p>
        </Rise>

        <Rise delay={0.1}>
          <p className="font-tagline italic mt-8 md:mt-11 text-ink text-[7vw] sm:text-[5vw] md:text-[3.6vw] lg:text-[3.1vw] leading-[1.15] max-w-[20ch]">
            Maybe we don&rsquo;t need another social network. Maybe we need more
            reasons to be social in the real world.
          </p>
        </Rise>
      </Movement>

      {/* ---------- 2. FROM A TIGER CUB TO TIGER CLUB ---------- */}
      <Movement>
        <div className="grid md:grid-cols-[auto_1fr] gap-8 md:gap-20 items-start">
          <Rise>
            <p className="font-mono text-[11px] tracking-wideish uppercase text-ink/55 md:sticky md:top-32 whitespace-nowrap">
              A short history
            </p>
          </Rise>
          <div className="max-w-2xl">
            <Rise>
              <h2 className="font-display text-ink tracking-tight leading-[1.02] text-[8vw] sm:text-[5.5vw] md:text-[3.8vw] lg:text-[3.2vw] mb-8">
                From A Tiger Cub to Tiger Club.
              </h2>
            </Rise>
            <Rise delay={0.08}>
              <p className="text-base md:text-lg text-ink/75 leading-relaxed mb-6">
                A Tiger Cub began with a broader mission: making relationships,
                community and belonging easier to find. Tiger Club grew from one
                realisation inside it.
              </p>
            </Rise>
            <Rise delay={0.14}>
              <p className="font-display text-ink text-2xl md:text-3xl leading-snug mb-8">
                One of the easiest ways to bring people together is to give them
                something worth experiencing together.
              </p>
            </Rise>
            <Rise delay={0.2}>
              <p className="font-mono text-[11px] md:text-xs tracking-wideish uppercase text-ink/60 leading-loose">
                Food · Art · Movement · Culture · Learning · Exploring · Giving back
              </p>
            </Rise>
            <Rise delay={0.26}>
              <p className="mt-8 text-base md:text-lg text-ink/75 leading-relaxed">
                The activity is the reason to show up.{" "}
                <span className="text-ink font-medium">
                  The shared experience is the reason to connect.
                </span>
              </p>
            </Rise>
          </div>
        </div>
      </Movement>

      {/* ---------- 3. WHY A TIGER — the irony, set as the loudest type ---------- */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        {/* Stripes entering from both edges, never behind the words. */}
        <StripeBand />
        <div className="max-w-content mx-auto px-6 md:px-10 relative z-10">
          <Rise>
            <Label>Why a tiger?</Label>
          </Rise>
          <Rise delay={0.08}>
            <h2 className="font-display tracking-tight leading-[0.92] text-[11vw] sm:text-[8.5vw] md:text-[6.6vw] lg:text-[5.8vw]">
              <span className="text-ink">Tigers are solitary.</span>
              <br />
              <span className="text-tiger">We don&rsquo;t have to be.</span>
            </h2>
          </Rise>
          <Rise delay={0.16}>
            <p className="mt-8 md:mt-11 text-base md:text-lg text-ink/75 leading-relaxed max-w-xl">
              The irony is deliberate. Tigers live almost entirely alone —
              and increasingly, so do we. Tiger Club pushes the other way.
            </p>
          </Rise>
        </div>
      </section>

      {/* ---------- 4. ONLY IN PERSON ---------- */}
      <Movement>
        <Rise>
          <h2 className="font-display text-ink tracking-tight leading-[1.0] text-[9vw] sm:text-[6vw] md:text-[4.4vw] lg:text-[3.8vw] max-w-[18ch]">
            Some things only happen in person.
          </h2>
        </Rise>

        <ul className="mt-7 md:mt-9 max-w-3xl">
          {[
            "The unexpected conversation.",
            "Being terrible at something new together.",
            "Laughing about something nobody planned.",
            "Meeting someone whose path would never have crossed yours.",
          ].map((line, i) => (
            <motion.li
              key={line}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
              className="flex items-baseline gap-5 border-b border-ink/10 py-4 md:py-5"
            >
              <span className="font-mono text-[10px] text-tiger-text shrink-0 w-6">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-xl md:text-3xl text-ink leading-snug">
                {line}
              </span>
            </motion.li>
          ))}
        </ul>

        <Rise delay={0.1}>
          <div className="mt-7 md:mt-9 max-w-xl">
            <p className="text-base md:text-lg text-ink/75 leading-relaxed">
              Technology is good at helping us find each other.
            </p>
            <p className="font-tagline italic text-ink mt-3 text-[6.5vw] sm:text-[4.4vw] md:text-[3vw] lg:text-[2.6vw] leading-[1.15]">
              But it can&rsquo;t replace being there.
            </p>
            <p className="mt-6 text-base md:text-lg text-ink/75 leading-relaxed">
              So we use it for one thing: helping people get off it and into the
              world.
            </p>
          </div>
        </Rise>
      </Movement>

      {/* ---------- 5. WHAT MAKES AN EXPERIENCE MEANINGFUL ---------- */}
      <Movement>
        <Rise>
          <Label>What makes an experience meaningful?</Label>
        </Rise>
        <Rise delay={0.08}>
          <h2 className="font-display text-ink tracking-tight leading-[0.98] text-[9vw] sm:text-[6.4vw] md:text-[4.6vw] lg:text-[4vw] max-w-[17ch]">
            The activity is the starting point. What it creates is what matters.
          </h2>
        </Rise>

        <Rise delay={0.12}>
          <p className="mt-7 md:mt-9 text-base md:text-lg text-ink/75">
            A meaningful experience leaves you more connected to:
          </p>
        </Rise>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 max-w-4xl">
          {["Other people", "Your community", "The world around you", "Yourself"].map(
            (t, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              >
                <div className="h-[3px] w-8 bg-tiger rounded-full mb-3" />
                <p className="font-display text-lg md:text-2xl text-ink leading-tight">
                  {t}
                </p>
              </motion.div>
            )
          )}
        </div>

        <div className="mt-8 md:mt-11 max-w-2xl space-y-3">
          {[
            "Come for dinner, discover another culture.",
            "Come for a run, find someone you run with again.",
            "Come alone, leave knowing someone.",
          ].map((t, i) => (
            <Rise key={t} delay={i * 0.06}>
              <p className="text-base md:text-lg text-ink/75">{t}</p>
            </Rise>
          ))}
          <Rise delay={0.3}>
            <p className="pt-4 font-display text-xl md:text-2xl text-ink">
              That&rsquo;s the outcome we care about.
            </p>
          </Rise>
        </div>
      </Movement>

      {/* ---------- 6. THE FOUR PRINCIPLES — the centrepiece ---------- */}
      <Principles />

      {/* ---------- 7. THE BIGGER IDEA ---------- */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <StripeBand flip />
        <div className="max-w-content mx-auto px-6 md:px-10 relative z-10">
          <Rise>
            <Label>The bigger idea</Label>
          </Rise>
          <Rise delay={0.08}>
            <h2 className="font-display text-ink tracking-tight leading-[0.94] text-[11vw] sm:text-[8vw] md:text-[6vw] lg:text-[5.2vw] max-w-[14ch]">
              Events are the starting point.
            </h2>
          </Rise>
          <Rise delay={0.14}>
            <p className="mt-10 text-base md:text-lg text-ink/75 leading-relaxed max-w-2xl">
              The bigger ambition is to help rebuild{" "}
              <span className="text-ink font-medium">
                social infrastructure for modern life
              </span>{" "}
              — the places, rituals and communities that make it easier to meet
              people, take part in your city, and feel like you belong somewhere.
            </p>
          </Rise>

          <div className="mt-8 md:mt-11 max-w-3xl border-t border-ink/10">
            {[
              "A reason to leave the apartment.",
              "A place where coming alone is normal.",
              "A way into communities you weren't already part of.",
              "Recurring enough that relationships have time to form.",
            ].map((t, i) => (
              <motion.p
                key={t}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.07, ease: EASE }}
                className="font-display text-lg md:text-2xl text-ink border-b border-ink/10 py-4 md:py-5"
              >
                {t}
              </motion.p>
            ))}
          </div>

          <Rise delay={0.12}>
            <div className="mt-8 md:mt-11 max-w-2xl">
              <p className="font-mono text-[11px] tracking-wideish uppercase text-ink/55 mb-4">
                The question isn&rsquo;t only
              </p>
              <p className="font-display text-2xl md:text-4xl text-ink/45 leading-snug">
                &ldquo;What should I do this weekend?&rdquo;
              </p>
              <p className="font-mono text-[11px] tracking-wideish uppercase text-tiger-text mt-10 mb-4">
                Eventually we want to help answer
              </p>
              <p className="font-tagline italic text-ink text-[8vw] sm:text-[5.6vw] md:text-[4vw] lg:text-[3.4vw] leading-[1.12]">
                &ldquo;Where do I go to feel part of this city?&rdquo;
              </p>
            </div>
          </Rise>
        </div>
      </section>

      {/* ---------- 8. WHAT WE WANT IT TO MEAN ---------- */}
      <Movement>
        <Rise>
          <Label>What we want Tiger Club to mean</Label>
        </Rise>
        <Rise delay={0.08}>
          <p className="text-base md:text-lg text-ink/75 max-w-xl leading-relaxed">
            Over time, seeing <span className="font-display text-ink">Tiger Club</span>{" "}
            on an experience should tell you something. Not:
          </p>
        </Rise>

        <Rise delay={0.12}>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 font-display text-2xl md:text-4xl text-ink/30">
            <span className="line-through decoration-tiger/70 decoration-[3px]">
              Luxury
            </span>
            <span className="line-through decoration-tiger/70 decoration-[3px]">
              Exclusivity
            </span>
            <span className="line-through decoration-tiger/70 decoration-[3px]">
              Perfection
            </span>
          </div>
        </Rise>

        <Rise delay={0.18}>
          <p className="mt-7 md:mt-9 font-display text-ink tracking-tight leading-[1.02] text-[8.5vw] sm:text-[6vw] md:text-[4.2vw] lg:text-[3.6vw] max-w-[18ch]">
            It should mean someone thought about how this would actually feel.
          </p>
        </Rise>

        <div className="mt-7 md:mt-9 max-w-2xl space-y-3">
          {[
            "You can come alone.",
            "You'll take part instead of watch.",
            "You'll probably meet someone, and discover something.",
            "And something might happen you weren't expecting.",
          ].map((t, i) => (
            <Rise key={t} delay={i * 0.06}>
              <p className="text-base md:text-lg text-ink/75">{t}</p>
            </Rise>
          ))}
        </div>

        <Rise delay={0.2}>
          <StripeRule className="mt-12" />
          <p className="mt-6 font-display text-xl md:text-3xl text-ink">
            That&rsquo;s the standard we&rsquo;re building toward.
          </p>
        </Rise>
      </Movement>

      {/* ---------- 9. MADE BY / MADE WITH / FOUND BY ---------- */}
      <Movement>
        <Rise>
          <Label>Three kinds of experience</Label>
        </Rise>
        <Rise delay={0.06}>
          <h2 className="font-display text-ink tracking-tight leading-[1.0] text-[8.5vw] sm:text-[6vw] md:text-[4vw] lg:text-[3.4vw] max-w-[20ch]">
            Made by us. Made with us. Found by us.
          </h2>
        </Rise>
        <Rise delay={0.1}>
          <p className="mt-6 text-base md:text-lg text-ink/75 max-w-xl">
            Seeing something on Tiger Club doesn&rsquo;t mean we produced it.
            Here&rsquo;s how to tell.
          </p>
        </Rise>

        <div className="mt-7 md:mt-9 border-t border-ink/12">
          {[
            {
              kind: "Made by us",
              name: "Tiger Club Experiences",
              body: "Designed by us, start to finish, around everything above.",
            },
            {
              kind: "Made with us",
              name: "Tiger Club ×",
              body: "Partners bring what they do best. We bring the social layer.",
            },
            {
              kind: "Found by us",
              name: "Tiger Picks",
              body: "Things already happening around the city that more people should know about.",
            },
          ].map((row, i) => (
            <motion.div
              key={row.kind}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: i * 0.1, ease: EASE }}
              className="grid md:grid-cols-[190px_1fr] gap-2 md:gap-10 border-b border-ink/12 py-5 md:py-7"
            >
              <p className="font-mono text-[11px] tracking-wideish uppercase text-tiger-text md:pt-2">
                {row.kind}
              </p>
              <div>
                <p className="font-display text-2xl md:text-4xl text-ink leading-tight">
                  {row.name}
                </p>
                <p className="mt-2 text-base md:text-lg text-ink/70 max-w-xl">
                  {row.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Movement>

      {/* ---------- 10. CLOSING ---------- */}
      <section className="relative py-14 md:py-24 overflow-hidden">
        <StripeBand />
        <div className="max-w-content mx-auto px-6 md:px-10 relative z-10">
          <Rise>
            <h2 className="font-display text-ink tracking-tight leading-[0.92] text-[11.5vw] sm:text-[8.5vw] md:text-[6.4vw] lg:text-[5.6vw] max-w-[15ch]">
              A city full of people isn&rsquo;t necessarily a connected city.
            </h2>
          </Rise>
          <Rise delay={0.12}>
            <p className="mt-8 md:mt-11 text-base md:text-lg text-ink/75 leading-relaxed max-w-2xl">
              We&rsquo;re building more reasons to leave the house, more places
              where showing up alone is normal, and more ways to take part in
              the place you call home.
            </p>
          </Rise>
          <Rise delay={0.18}>
            <p className="mt-8 font-tagline italic text-ink text-[7.5vw] sm:text-[5vw] md:text-[3.4vw] lg:text-[2.9vw]">
              One shared experience at a time.
            </p>
          </Rise>
          <Rise delay={0.24}>
            <Link
              href="/events"
              className="organic-underline mt-7 md:mt-9 inline-block font-mono text-[11px] md:text-xs tracking-wideish uppercase text-ink hover:text-tiger-text transition-colors"
            >
              see what&rsquo;s happening →
            </Link>
          </Rise>
        </div>
      </section>
    </main>
  );
}

/* Stripes entering from the outer edges only. Same device as the homepage
   accents, kept thin and pushed to the margins so nothing busy ever sits
   behind a word. */
function StripeBand({ flip = false }: { flip?: boolean }) {
  const rows = [0.18, 0.44, 0.7];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      {rows.map((top, i) => (
        <motion.div
          key={top}
          className={`absolute h-[6px] md:h-[9px] rounded-full bg-tiger/85 ${
            flip ? "right-0" : "left-0"
          }`}
          style={{
            top: `${top * 100}%`,
            width: `clamp(56px, ${9 + i * 4}vw, 190px)`,
            transformOrigin: flip ? "right" : "left",
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: i === 1 ? 1 : 0.55 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, delay: i * 0.12, ease: EASE }}
        />
      ))}
      {rows.map((top, i) => (
        <motion.div
          key={`b-${top}`}
          className={`absolute h-[4px] md:h-[6px] rounded-full bg-ink/80 ${
            flip ? "right-0" : "left-0"
          }`}
          style={{
            top: `${top * 100 + 4}%`,
            width: `clamp(34px, ${5 + i * 3}vw, 120px)`,
            transformOrigin: flip ? "right" : "left",
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 0.5 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, delay: 0.06 + i * 0.12, ease: EASE }}
        />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------------
   The four principles — the strongest visual sequence on the page.

   Not cards. Each principle gets its own full editorial moment: an
   oversized index number bleeding behind the type, the claim set large,
   and the explanation held to a narrow measure. They alternate side so
   the eye has to travel, which slows the read down deliberately.
   --------------------------------------------------------------------- */
const PRINCIPLES = [
  {
    n: "01",
    title: "No spectators",
    claim: "Don't just attend. Participate.",
    body: "The people aren't an audience. They're part of what makes it happen.",
  },
  {
    n: "02",
    title: "Strangers don't leave as strangers",
    claim: "Connection by design, not by chance.",
    body: "Natural reasons to talk — no forced networking, no icebreakers. Arrive alone and still belong.",
  },
  {
    n: "03",
    title: "Break the script",
    claim: "There should be something you didn't expect.",
    body: "Every experience holds one moment that breaks the script. Internally we call it the Wild Card.",
  },
  {
    n: "04",
    title: "Discovery by design",
    claim: "Leave knowing something you didn't before.",
    body: "A person, a place, a skill, an idea — or a side of yourself.",
  },
];

function Principles() {
  return (
    <section className="relative py-10 md:py-16">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <Rise>
          <Label>The Tiger Club experience</Label>
        </Rise>
        <Rise delay={0.08}>
          <p className="font-display text-ink tracking-tight leading-[1.04] text-[8vw] sm:text-[5.5vw] md:text-[3.8vw] lg:text-[3.2vw] max-w-[22ch]">
            We&rsquo;re not interested in putting people in the same room. We
            design so something happens{" "}
            <span className="text-tiger">between them.</span>
          </p>
        </Rise>
      </div>

      <div className="mt-8 md:mt-12">
        {PRINCIPLES.map((p, i) => (
          <motion.article
            key={p.n}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-90px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative border-t border-ink/12 py-8 md:py-12"
          >
            <div className="max-w-content mx-auto px-6 md:px-10">
              {/* The index sits in its own column rather than as a watermark
                  behind the type — at watermark scale it collided with the
                  claim and read as clutter, not art direction. */}
              <div
                className={`grid gap-x-8 gap-y-4 md:grid-cols-12 md:items-start ${
                  i % 2 === 1 ? "md:[direction:rtl]" : ""
                }`}
              >
                <p
                  aria-hidden="true"
                  className="font-display leading-none text-tiger/35 select-none
                             text-[15vw] md:text-[7vw] lg:text-[6vw]
                             md:col-span-2 [direction:ltr]"
                >
                  {p.n}
                </p>

                <div className="md:col-span-5 [direction:ltr]">
                  <p className="font-mono text-[11px] tracking-wideish uppercase text-tiger-text mb-4">
                    {p.title}
                  </p>
                  <h3 className="font-display text-ink tracking-tight leading-[1.02] text-[8vw] sm:text-[5.5vw] md:text-[3.4vw] lg:text-[2.9vw]">
                    {p.claim}
                  </h3>
                </div>

                <div className="md:col-span-5 [direction:ltr]">
                  <p className="text-base md:text-lg text-ink/75 leading-relaxed max-w-md md:mt-2">
                    {p.body}
                  </p>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
        <div className="border-t border-ink/12" />
      </div>
    </section>
  );
}
