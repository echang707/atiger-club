"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/* ---------------------------------------------------------------------
   /about — typography only.

   No photography, no decoration. The page is four statements at four
   different scales, and the composition does the work: the opening runs
   nearly full-bleed, the four principles are a numbered column set in the
   largest type on the site, and the close is a single line.

   Copy is cut to what actually matters — Tiger Club makes experiences that
   give people reasons to get out, try things and meet each other. No
   mission language, no "it should mean something".
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
  ["01", "No spectators", "Take part."],
  ["02", "Strangers don't leave as strangers", "Connection by design."],
  ["03", "Break the script", "Expect something unexpected."],
  ["04", "Discovery by design", "Leave with something new."],
];

export default function AboutClient() {
  return (
    <main className="overflow-x-hidden">
      {/* ============ OPENING ============ */}
      <section className="max-w-content mx-auto px-6 md:px-10 pt-32 md:pt-44 pb-16 md:pb-24">
        <Rise>
          <h1 className="font-wordmark font-extrabold text-ink tracking-tight leading-[0.86] text-[17vw] md:text-[12vw] lg:text-[10.5vw]">
            Life is better
            <br />
            together.
          </h1>
        </Rise>

        <div className="mt-10 md:mt-14 grid md:grid-cols-12 gap-6">
          <Rise delay={0.1} className="md:col-span-7 md:col-start-6">
            <p className="font-display text-ink text-xl md:text-3xl leading-snug">
              A Tiger Cub started with a simple goal: bring people together.
              Tiger Club is how we do it in real life.
            </p>
            <p className="mt-5 text-base md:text-lg text-ink/70 leading-relaxed max-w-[44ch]">
              We make experiences that give people a reason to get out, try
              something, and meet the people around them.
            </p>
          </Rise>
        </div>
      </section>

      {/* ============ FOUR PRINCIPLES — the largest type on the site ============ */}
      <section className="border-t border-ink/12">
        <div className="max-w-content mx-auto px-6 md:px-10 pt-10 md:pt-14 pb-2">
          <Rise>
            <p className="font-mono text-[11px] tracking-wideish uppercase text-tiger-text">
              We don&rsquo;t just put people in the same room
            </p>
          </Rise>
        </div>

        {PRINCIPLES.map(([n, name, claim], i) => (
          <motion.article
            key={n}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-90px" }}
            transition={{ duration: 0.75, ease: EASE }}
            className="group border-b border-ink/12"
          >
            <div className="max-w-content mx-auto px-6 md:px-10 py-10 md:py-16">
              <div className="flex items-baseline gap-4 md:gap-8">
                <span
                  aria-hidden="true"
                  className="font-wordmark font-extrabold leading-none text-tiger/35 select-none shrink-0
                             text-[7vw] md:text-[3vw] transition-colors duration-500 group-hover:text-tiger/70"
                >
                  {n}
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] md:text-[11px] tracking-wideish uppercase text-ink/55 mb-2 md:mb-4">
                    {name}
                  </p>
                  <p className="font-wordmark font-extrabold text-ink tracking-tight leading-[0.92] text-[11vw] md:text-[6.4vw] lg:text-[5.6vw]">
                    {claim}
                  </p>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </section>

      {/* ============ CLOSE ============ */}
      <section className="max-w-content mx-auto px-6 md:px-10 py-24 md:py-36">
        <div className="grid md:grid-cols-12 gap-8">
          <Rise className="md:col-span-9">
            <p className="font-wordmark font-extrabold text-ink tracking-tight leading-[0.9] text-[13vw] md:text-[7.4vw] lg:text-[6.4vw]">
              Events are just the start.
            </p>
          </Rise>
          <Rise delay={0.1} className="md:col-span-7 md:col-start-6">
            <p className="mt-4 md:mt-6 text-base md:text-lg text-ink/70 leading-relaxed max-w-[44ch]">
              We&rsquo;re building the social infrastructure for a more
              connected city.
            </p>
            <Link
              href="/events"
              className="organic-underline mt-10 md:mt-12 inline-block font-mono text-[11px] md:text-xs tracking-wideish uppercase text-ink hover:text-tiger-text transition-colors"
            >
              see what&rsquo;s happening →
            </Link>
          </Rise>
        </div>
      </section>
    </main>
  );
}
