"use client";

import { motion } from "framer-motion";
import Link from "next/link";

/* ---------------------------------------------------------------------
   /about — four ideas, nothing else.

     01  why we exist
     02  what makes a Tiger Club experience   <- ~half the page
     03  what we're building
     04  the standard

   Everything that was explanation rather than argument has been cut:
   the made/with/found breakdown, the "what we believe" definitions, the
   supporting paragraphs under each principle. Someone skimming for
   twenty seconds should still come away with why we exist, what makes
   us different, and what we're building.

   One idea per viewport. The principles carry the weight, so they get
   the largest type on the page and the most air around them.
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

const PRINCIPLES = [
  { n: "01", name: "No spectators", claim: "Take part." },
  { n: "02", name: "Strangers don't leave as strangers", claim: "Connection by design." },
  { n: "03", name: "Break the script", claim: "Expect something unexpected." },
  { n: "04", name: "Discovery by design", claim: "Leave with something new." },
];

export default function AboutClient() {
  return (
    <main className="pt-28 md:pt-36">
      {/* ============ 01 — WHY WE EXIST ============ */}
      <section className="relative min-h-[70vh] md:min-h-[78vh] flex items-center py-16 md:py-24">
        <div className="max-w-content mx-auto px-6 md:px-10 w-full">
          <Rise>
            <h1 className="font-display text-ink tracking-tight leading-[0.92] text-[15vw] sm:text-[11vw] md:text-[8vw] lg:text-[7vw] max-w-[12ch]">
              Life is better together.
            </h1>
          </Rise>

          <Rise delay={0.08}>
            <p className="mt-12 md:mt-16 text-base md:text-lg text-ink/75 leading-relaxed max-w-xl">
              Growing up hands you connection for free — classrooms, teams,
              campuses, neighbourhoods. Adulthood quietly takes all of it away,
              and more of life has moved behind a screen. A Tiger Cub started
              with a mission to make community easier to find; Tiger Club is
              the part of it that builds reasons to experience life together.
            </p>
          </Rise>

          <Rise delay={0.16}>
            <p className="mt-12 md:mt-16 font-tagline italic text-[7.5vw] sm:text-[5.2vw] md:text-[3.6vw] lg:text-[3.1vw] leading-[1.15]">
              <span className="text-ink">Tigers are solitary.</span>{" "}
              <span className="text-tiger">We don&rsquo;t have to be.</span>
            </p>
          </Rise>
        </div>
      </section>

      {/* ============ 02 — THE CENTREPIECE ============ */}
      <section className="relative pt-20 md:pt-32">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <Rise>
            <h2 className="font-display text-ink tracking-tight leading-[0.94] text-[12vw] sm:text-[8.5vw] md:text-[6.4vw] lg:text-[5.6vw] max-w-[14ch]">
              We don&rsquo;t just put people in the same room.
            </h2>
          </Rise>
        </div>

        <div className="mt-20 md:mt-32">
          {PRINCIPLES.map((p) => (
            <motion.article
              key={p.n}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.85, ease: EASE }}
              className="border-t border-ink/12 last:border-b"
            >
              <div className="max-w-content mx-auto px-6 md:px-10 py-16 md:py-28">
                <div className="flex items-baseline gap-5 md:gap-10">
                  <span
                    aria-hidden="true"
                    className="font-display leading-none text-tiger/40 select-none shrink-0
                               text-[9vw] md:text-[4.4vw] lg:text-[3.8vw]"
                  >
                    {p.n}
                  </span>
                  <div>
                    <p className="font-mono text-[10px] md:text-[11px] tracking-wideish uppercase text-tiger-text mb-4 md:mb-6">
                      {p.name}
                    </p>
                    <p className="font-display text-ink tracking-tight leading-[0.98] text-[11vw] sm:text-[8vw] md:text-[5.4vw] lg:text-[4.7vw]">
                      {p.claim}
                    </p>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ============ 03 — WHAT WE'RE BUILDING ============ */}
      <section className="relative min-h-[76vh] flex items-center py-20 md:py-32">
        <div className="max-w-content mx-auto px-6 md:px-10 w-full">
          <Rise>
            <h2 className="font-display text-ink tracking-tight leading-[0.94] text-[12vw] sm:text-[8.5vw] md:text-[6vw] lg:text-[5.2vw] max-w-[13ch]">
              Events are just the start.
            </h2>
          </Rise>
          <Rise delay={0.08}>
            <p className="mt-10 md:mt-12 text-base md:text-lg text-ink/75 leading-relaxed max-w-xl">
              We&rsquo;re building social infrastructure for real life — more
              reasons to show up, meet people, and feel part of the city around
              you.
            </p>
          </Rise>
          <Rise delay={0.16}>
            <p className="mt-16 md:mt-24 font-display text-ink tracking-tight leading-[0.95] text-[11.5vw] sm:text-[8.5vw] md:text-[6.2vw] lg:text-[5.4vw] max-w-[15ch]">
              A city full of people isn&rsquo;t necessarily a connected city.
            </p>
          </Rise>
        </div>
      </section>

      {/* ============ 04 — THE STANDARD ============ */}
      <section className="relative min-h-[80vh] flex items-center py-20 md:py-32">
        <div className="max-w-content mx-auto px-6 md:px-10 w-full">
          <Rise>
            <h2 className="font-display text-ink tracking-tight leading-[0.96] text-[10vw] sm:text-[7vw] md:text-[4.8vw] lg:text-[4.2vw] max-w-[20ch]">
              When you see Tiger Club, we want it to mean something.
            </h2>
          </Rise>

          <Rise delay={0.1}>
            <p className="mt-12 md:mt-16 font-tagline italic text-ink text-[7.5vw] sm:text-[5.2vw] md:text-[3.6vw] lg:text-[3.1vw] leading-[1.15] max-w-[22ch]">
              Someone thought about how this would actually feel.
            </p>
          </Rise>

          <div className="mt-12 md:mt-16 flex flex-wrap gap-x-8 gap-y-3 md:gap-x-14">
            {["Participate.", "Meet.", "Discover.", "Be surprised."].map((t, i) => (
              <motion.p
                key={t}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                className="font-mono text-[11px] md:text-xs tracking-wideish uppercase text-ink"
              >
                {t}
              </motion.p>
            ))}
          </div>

          <Rise delay={0.2}>
            <p className="mt-14 md:mt-20 font-display text-ink text-2xl md:text-4xl leading-snug max-w-[22ch]">
              That&rsquo;s the standard we&rsquo;re building toward.
            </p>
          </Rise>

          <Rise delay={0.26}>
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
