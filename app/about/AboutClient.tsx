"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/* ---------------------------------------------------------------------
   /about — typography only, and deliberately few sizes.

   The whole page uses three type scales and nothing else:

     display  — the three section headlines and the four claims
     body     — the short supporting lines
     mark     — the mono labels

   Everything is Bricolage for display and the body face for prose; no
   italic serif, no fourth or fifth size. Restraint is the design here.
   --------------------------------------------------------------------- */

const EASE = [0.22, 1, 0.36, 1] as const;

// A real hierarchy, three steps and no more:
//   TITLE   — "Why Tiger Club?" only. The largest thing on the page.
//   SUB     — the four claims and the closing line. Clearly secondary.
//   BODY / MARK — prose and the mono labels.
const TITLE =
  "font-wordmark font-extrabold text-ink tracking-tight leading-[0.9] text-[14vw] md:text-[7.4vw] lg:text-[6.4vw]";
const SUB =
  "font-wordmark font-extrabold text-ink tracking-tight leading-[1.0] text-[7.5vw] md:text-[3.4vw] lg:text-[2.9vw]";
const BODY = "text-base md:text-lg text-ink/70 leading-relaxed";
const MARK = "font-mono text-[11px] tracking-wideish uppercase";

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
      <section className="max-w-content mx-auto px-6 md:px-10 pt-28 md:pt-36 pb-14 md:pb-20">
        <div className="grid md:grid-cols-12 gap-6 md:gap-10 items-end">
          <Rise className="md:col-span-6">
            <h1 className={TITLE}>Why Tiger&nbsp;Club?</h1>
          </Rise>
          <Rise delay={0.1} className="md:col-span-6 md:pb-1">
            <p className={BODY}>
              Getting out, trying things and meeting people doesn&rsquo;t happen
              by accident once you&rsquo;re an adult. So we make experiences that
              give people a reason to.
            </p>
          </Rise>
        </div>
      </section>

      {/* ============ FOUR PRINCIPLES ============ */}
      <section className="border-t border-ink/12">
        <div className="max-w-content mx-auto px-6 md:px-10 pt-8 md:pt-12 pb-2">
          <Rise>
            <p className={`${MARK} text-tiger-text`}>
              We don&rsquo;t just put people in the same room
            </p>
          </Rise>
        </div>

        {PRINCIPLES.map(([n, name, claim]) => (
          <motion.article
            key={n}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-90px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="border-b border-ink/12"
          >
            {/* Label sits above the claim and both start at the page
                gutter, so every line on the page shares one left edge —
                the previous version indented the claims into a grid
                column and nothing lined up. */}
            <div className="max-w-content mx-auto px-6 md:px-10 py-8 md:py-12">
              <p className={`${MARK} text-ink/45 mb-2 md:mb-3`}>
                <span className="text-tiger-text">{n}</span>
                <span className="ml-3">{name}</span>
              </p>
              <p className={SUB}>{claim}</p>
            </div>
          </motion.article>
        ))}
      </section>

      {/* ============ CLOSE ============ */}
      <section className="max-w-content mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="grid md:grid-cols-12 gap-6 md:gap-10 items-end">
          <Rise className="md:col-span-7">
            <p className={SUB}>Events are just the start.</p>
          </Rise>
          <Rise delay={0.1} className="md:col-span-5 md:pb-1">
            <p className={BODY}>
              We&rsquo;re building the social infrastructure for a more connected
              city.
            </p>
            <Link
              href="/events"
              className={`organic-underline mt-8 inline-block ${MARK} text-ink hover:text-tiger-text transition-colors`}
            >
              see what&rsquo;s happening →
            </Link>
          </Rise>
        </div>
      </section>
    </main>
  );
}
