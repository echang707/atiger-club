"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

/* ---------------------------------------------------------------------
   /about — recomposed as an editorial spread rather than an essay.

   The previous version was words on an empty canvas: everything anchored
   to the left 40%, huge dead vertical areas, no imagery. This one uses
   the full width, alternates left / right / centre as you scroll, and
   leans on real event photography, the tail asset and the medium tigers
   for personality. Copy is down to the four things worth saying.

   Same system throughout: Fraunces display, Instrument italic, JetBrains
   for the small marks, ink / cream / tiger, `max-w-content`.
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
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.75, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* A photo that scales up very slightly as it comes into view — enough to
   feel alive, not enough to read as an effect. */
function Frame({
  src,
  className = "",
  priority = false,
  alt = "",
}: {
  src: string;
  className?: string;
  priority?: boolean;
  alt?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.06 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.1, ease: EASE }}
      className={`relative overflow-hidden ${className}`}
    >
      <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 50vw" priority={priority} className="object-cover" />
    </motion.div>
  );
}

const PRINCIPLES = [
  {
    n: "01",
    name: "No spectators",
    claim: "Take part.",
    img: "/images/create-mural.jpg",
  },
  {
    n: "02",
    name: "Strangers don't leave as strangers",
    claim: "Connection by design.",
    img: "/images/eat-dinner.jpg",
  },
  {
    n: "03",
    name: "Break the script",
    claim: "Expect something unexpected.",
    img: "/images/explore-festival.jpg",
  },
  {
    n: "04",
    name: "Discovery by design",
    claim: "Leave with something new.",
    img: "/images/serve-treeplanting.jpg",
  },
];

export default function AboutClient() {
  return (
    <main className="overflow-x-hidden">
      {/* ============ OPENING — type left, photo bleeding off the right ============ */}
      <section className="relative pt-28 md:pt-36 pb-16 md:pb-24">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-12 gap-8 md:gap-10 items-center">
            <div className="md:col-span-7">
              <Rise>
                <h1 className="font-display text-ink tracking-tight leading-[0.9] text-[15vw] sm:text-[11vw] md:text-[7.6vw] lg:text-[6.6vw]">
                  Life is better together.
                </h1>
              </Rise>
              <Rise delay={0.1}>
                <p className="mt-8 md:mt-10 font-display text-ink text-xl md:text-3xl leading-snug max-w-[24ch]">
                  A Tiger Cub started with a simple goal: bring people together.
                  Tiger Club is how we do it in real life.
                </p>
              </Rise>
              <Rise delay={0.16}>
                <p className="mt-6 text-base md:text-lg text-ink/75 leading-relaxed max-w-[46ch]">
                  We create experiences designed around participation, connection
                  and discovery — and we&rsquo;re building the social
                  infrastructure that makes a city feel less like somewhere you
                  live and more like somewhere you belong.
                </p>
              </Rise>
            </div>

            {/* photo bleeds off the right edge of the page */}
            <div className="md:col-span-5 relative">
              <Frame
                src="/images/bite-club-01.jpeg"
                priority
                className="h-[46vh] md:h-[68vh] rounded-sm md:-mr-[14vw] w-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ PRINCIPLES — the main visual experience ============ */}
      <section className="relative">
        <div className="max-w-content mx-auto px-6 md:px-10 pt-10 md:pt-16 pb-6 md:pb-10">
          <Rise>
            <p className="font-mono text-[11px] tracking-wideish uppercase text-tiger-text mb-5">
              What makes it a Tiger Club experience
            </p>
          </Rise>
          <Rise delay={0.06}>
            <h2 className="font-display text-ink tracking-tight leading-[0.94] text-[11vw] sm:text-[8vw] md:text-[5.6vw] lg:text-[4.9vw] max-w-[15ch]">
              We don&rsquo;t just put people in the same room.
            </h2>
          </Rise>
        </div>

        {PRINCIPLES.map((p, i) => {
          const flip = i % 2 === 1;
          return (
            <article key={p.n} className="relative py-10 md:py-16">
              <div className="max-w-content mx-auto px-6 md:px-10">
                <div
                  className={`grid md:grid-cols-12 gap-6 md:gap-10 items-center ${
                    flip ? "md:[direction:rtl]" : ""
                  }`}
                >
                  {/* image, alternating side, cropped tall and bleeding out */}
                  <div className="md:col-span-6 [direction:ltr]">
                    <Frame
                      src={p.img}
                      // Bleed toward the OUTER page edge, never toward the
                      // copy. With direction:rtl the image sits on the right,
                      // so it must bleed right; unflipped it sits left and
                      // bleeds left. Reversed, it ran under the headline.
                      className={`h-[38vh] md:h-[62vh] rounded-sm ${
                        flip ? "md:-mr-[10vw]" : "md:-ml-[10vw]"
                      }`}
                    />
                  </div>

                  {/* claim, set large, opposite the picture */}
                  <div
                    className={`md:col-span-6 [direction:ltr] ${
                      flip ? "md:pr-4" : "md:pl-4"
                    }`}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.8, ease: EASE }}
                    >
                      <div className="flex items-baseline gap-4">
                        <span
                          aria-hidden="true"
                          className="font-display leading-none text-tiger/45 select-none text-[8vw] md:text-[3.4vw]"
                        >
                          {p.n}
                        </span>
                        <p className="font-mono text-[10px] md:text-[11px] tracking-wideish uppercase text-tiger-text">
                          {p.name}
                        </p>
                      </div>
                      <p className="mt-3 md:mt-5 font-display text-ink tracking-tight leading-[0.96] text-[12vw] sm:text-[8.5vw] md:text-[5vw] lg:text-[4.4vw]">
                        {p.claim}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* ============ EVENTS ARE JUST THE START — centred, with the tail ============ */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="max-w-content mx-auto px-6 md:px-10 text-center relative z-10">
          <Rise>
            <h2 className="font-display text-ink tracking-tight leading-[0.94] text-[12vw] sm:text-[8.5vw] md:text-[6vw] lg:text-[5.2vw] mx-auto max-w-[13ch]">
              Events are just the start.
            </h2>
          </Rise>
          <Rise delay={0.1}>
            <p className="mt-8 md:mt-10 text-base md:text-lg text-ink/75 leading-relaxed mx-auto max-w-[42ch]">
              We&rsquo;re building the social infrastructure for a more connected
              city.
            </p>
          </Rise>
        </div>

        {/* the tail, entering low from the right as a brand signature */}
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, x: "18%" }}
          whileInView={{ opacity: 1, x: "0%" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, ease: EASE }}
          className="pointer-events-none absolute right-0 -bottom-[6%] w-[86%] md:w-[46%] opacity-90"
        >
          <Image
            src="/images/tiger-tail.webp"
            alt=""
            width={1200}
            height={363}
            className="h-auto w-full"
          />
        </motion.div>
      </section>

      {/* ============ THE STANDARD ============ */}
      <section className="relative py-20 md:py-32">
        <div className="max-w-content mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-end">
            <div className="md:col-span-7">
              <Rise>
                <h2 className="font-display text-ink tracking-tight leading-[0.95] text-[11vw] sm:text-[8vw] md:text-[5.2vw] lg:text-[4.5vw] max-w-[16ch]">
                  When you see Tiger Club, it should mean something.
                </h2>
              </Rise>
              <Rise delay={0.12}>
                <p className="mt-8 md:mt-10 font-tagline italic text-ink text-[7vw] sm:text-[4.8vw] md:text-[2.9vw] lg:text-[2.5vw] leading-[1.15] max-w-[24ch]">
                  Thoughtfully designed. Easy to join. Worth showing up for.
                </p>
              </Rise>
              <Rise delay={0.2}>
                <Link
                  href="/events"
                  className="organic-underline mt-10 md:mt-14 inline-block font-mono text-[11px] md:text-xs tracking-wideish uppercase text-ink hover:text-tiger-text transition-colors"
                >
                  see what&rsquo;s happening →
                </Link>
              </Rise>
            </div>

            {/* the medium tigers, small, as a signature rather than a grid */}
            <div className="md:col-span-5">
              <div className="flex flex-wrap gap-3 md:gap-4 md:justify-end">
                {["eat", "create", "move", "explore", "serve", "learn", "play"].map(
                  (m, i) => (
                    <motion.span
                      key={m}
                      initial={{ opacity: 0, y: 12, rotate: -6 }}
                      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                      className="relative h-10 w-10 md:h-12 md:w-12"
                    >
                      <Image
                        src={`/images/icons/${m}.png`}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-contain"
                      />
                    </motion.span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
