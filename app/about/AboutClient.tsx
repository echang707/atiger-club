"use client";

import Image from "next/image";
import Link from "next/link";
import { MotionConfig, motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/* ---------------------------------------------------------------------
   /about

   An editorial spread, not a list. The page opens quiet and gets louder
   as you scroll: each principle is its own composed moment, and each one
   adds a little more than the last.

     OPENING   the title, a serif lede and one photo
     01        number + claim, one photo             (cream, simple)
     02        photo + claim, mirrored               (cream)
     03        the page inverts to ink, polaroid pile (the loud beat)
     04        claim over a four-photo mosaic         (the widest beat)
     CLOSE     the serif line, one CTA, seven ways in

   Type follows the rest of the site exactly: Fraunces (font-display)
   for every heading, the body sans for prose, JetBrains for labels.
   Orange is used for marks and numerals only; text that has to be read
   in orange uses tiger-text, which clears AA on cream.
   --------------------------------------------------------------------- */

const EASE = [0.22, 1, 0.36, 1] as const;

const MARK = "font-mono text-[11px] tracking-wideish uppercase";
const BODY = "text-sm md:text-base text-ink/70 leading-relaxed";
/* Same scale as the rest of the site: page titles are font-display at
   text-4xl / md:text-6xl (see /experiences and /work-with-us), so the
   claims sit one step under that and nothing here is bigger than a title
   elsewhere. The numerals are the one oversized element, and even they
   stay in the same face. */
const TITLE = "font-display text-4xl md:text-6xl text-ink leading-tight";
const CLAIM = "font-display leading-tight text-3xl md:text-5xl";
const NUMERAL = "font-display leading-none select-none text-6xl md:text-8xl";

function Rise({
  children,
  delay = 0,
  y = 18,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* A photo with a mono caption underneath. `aspect` is a Tailwind aspect
   class so each placement can crop to what the composition needs. */
function Photo({
  src,
  alt,
  caption,
  aspect,
  sizes,
  className = "",
  priority = false,
  captionClass = "text-ink/50",
}: {
  src: string;
  alt: string;
  caption?: string;
  aspect: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  captionClass?: string;
}) {
  return (
    <figure className={className}>
      <div className={`relative overflow-hidden bg-paper-dim ${aspect}`}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
      {caption && (
        <figcaption className={`${MARK} mt-2.5 text-[10px] ${captionClass}`}>{caption}</figcaption>
      )}
    </figure>
  );
}

/* A small parallax drift for anything that should feel layered. */
function Drift({
  children,
  amount = 30,
  className = "",
}: {
  children: React.ReactNode;
  amount?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

const MEDIUMS = [
  ["Eat", "eat"],
  ["Move", "move"],
  ["Create", "create"],
  ["Play", "play"],
  ["Learn", "learn"],
  ["Explore", "explore"],
  ["Serve", "serve"],
] as const;

export default function AboutClient() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="overflow-x-hidden">
        {/* ================= OPENING ================= */}
        <section className="mx-auto max-w-content px-6 pb-16 pt-28 md:px-10 md:pb-24 md:pt-36">
          <Rise>
            <h1 className={TITLE}>why Tiger Club?</h1>
          </Rise>

          <div className="mt-8 grid gap-10 md:mt-10 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-5 md:pt-1">
              <Rise delay={0.12}>
                <p className="font-display text-xl leading-snug text-ink md:text-3xl">
                  Adulthood quietly removes the social infrastructure that used to make connection{" "}
                  <em className="text-tiger-text">automatic.</em>
                </p>
              </Rise>
              <Rise delay={0.2}>
                <div className="mt-7 flex gap-5 md:mt-9">
                  <span aria-hidden="true" className="mt-2.5 h-px w-10 shrink-0 bg-tiger" />
                  <p className={BODY}>
                    Getting out, trying things and meeting people doesn&rsquo;t happen by
                    accident once you&rsquo;re an adult. So we make experiences that give
                    people a reason to.
                  </p>
                </div>
              </Rise>
              <Rise delay={0.28}>
                <a
                  href="#principles"
                  className={`${MARK} organic-underline mt-8 inline-block text-ink transition-colors hover:text-tiger-text md:mt-10`}
                >
                  How we do it ↓
                </a>
              </Rise>
            </div>

            <Rise delay={0.15} className="md:col-span-7">
              <Photo
                src="/images/bite-club-01.jpeg"
                alt="A long table of Tiger Club members sharing dinner at Bite of Korea"
                caption="Bite Club — the first one, at Bite of Korea"
                aspect="aspect-[4/3] md:aspect-[3/2]"
                sizes="(min-width: 1400px) 780px, (min-width: 768px) 56vw, 100vw"
                priority
              />
            </Rise>
          </div>
        </section>

        {/* ================= PRINCIPLES INTRO ================= */}
        <section id="principles" className="scroll-mt-20 border-t border-ink/15">
          <div className="mx-auto grid max-w-content items-end gap-3 px-6 pb-2 pt-10 md:grid-cols-12 md:gap-10 md:px-10 md:pt-14">
            <Rise className="md:col-span-3">
              <p className={`${MARK} text-tiger-text`}>Four principles</p>
            </Rise>
            <Rise delay={0.08} className="md:col-span-9">
              <h2 className="font-display leading-tight text-ink text-2xl md:text-4xl">
                We don&rsquo;t just put people in the same room.
              </h2>
            </Rise>
          </div>
        </section>

        {/* ================= 01 — NO SPECTATORS ================= */}
        <section className="mx-auto max-w-content px-6 pb-16 pt-12 md:px-10 md:pb-24 md:pt-16">
          <div className="grid items-center gap-12 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-5">
              <Rise>
                <span aria-hidden="true" className={`${NUMERAL} block text-tiger`}>
                  01
                </span>
              </Rise>
              <Rise delay={0.08}>
                <p className={`${MARK} mt-6 text-ink/50`}>No spectators</p>
                <h3 className={`${CLAIM} mt-2 text-ink`}>Take part.</h3>
                <p className={`${BODY} mt-5 max-w-sm`}>
                  Everything is built to be done, not watched. You paddle the boat, you
                  plant the tree, you get your hands dirty.
                </p>
              </Rise>
            </div>

            <div className="md:col-span-7 md:pl-6">
              <Rise delay={0.1}>
                <Photo
                  src="/images/dragon-boat.jpg"
                  alt="A dragon boat crew paddling in unison"
                  caption="Dragon boat festival"
                  aspect="aspect-[3/2]"
                  sizes="(min-width: 768px) 52vw, 100vw"
                />
              </Rise>
            </div>
          </div>
        </section>

        {/* ================= 02 — CONNECTION BY DESIGN ================= */}
        <section className="border-t border-ink/10">
          <div className="mx-auto max-w-content px-6 pb-16 pt-16 md:px-10 md:pb-24 md:pt-24">
            <div className="grid items-center gap-10 md:grid-cols-12 md:gap-10">
              <Rise className="order-2 md:order-1 md:col-span-6">
                <Photo
                  src="/images/creative-cafe-recuerdos.jpg"
                  alt="People who just met talking over coffee at a Creative Café Social"
                  caption="Creative Café Social at Recuerdos"
                  aspect="aspect-[5/4]"
                  sizes="(min-width: 768px) 46vw, 100vw"
                />
              </Rise>

              <div className="order-1 md:order-2 md:col-span-5 md:col-start-8">
                <Rise>
                  <span
                    aria-hidden="true"
                    className={`${NUMERAL} block text-tiger`}
                  >
                    02
                  </span>
                </Rise>
                <Rise delay={0.08}>
                  <p className={`${MARK} mt-6 text-ink/50`}>Strangers don&rsquo;t leave as strangers</p>
                  <h3 className={`${CLAIM} mt-2 text-ink`}>Connection by design.</h3>
                  <p className={`${BODY} mt-5 max-w-sm`}>
                    Small groups, a shared task and a reason to talk. The format does the
                    icebreaking, so you don&rsquo;t have to.
                  </p>
                </Rise>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 03 — BREAK THE SCRIPT (inverted) ================= */}
        <section className="relative overflow-hidden bg-ink text-paper">
          <div className="relative mx-auto max-w-content px-6 py-16 md:px-10 md:py-24">
            <div className="grid items-center gap-14 md:grid-cols-12 md:gap-10">
              <div className="md:col-span-5">
                <Rise>
                  <span aria-hidden="true" className={`${NUMERAL} block text-tiger`}>
                    03
                  </span>
                </Rise>
                <Rise delay={0.08}>
                  <p className={`${MARK} mt-6 text-paper/55`}>
                    Break the{" "}
                    <span className="line-through decoration-tiger decoration-[1.5px]">script</span>
                  </p>
                  <h3 className={`${CLAIM} mt-2 text-paper`}>
                    Expect something{" "}
                    <span className="italic text-tiger-soft">
                      unexpected.
                    </span>
                  </h3>
                  <p className={`${BODY} mt-5 max-w-sm !text-paper/65`}>
                    Lantern parades, dragon boats, a board-game convention. The kind of plans
                    you wouldn&rsquo;t have made on your own.
                  </p>
                </Rise>
              </div>

              {/* a small pile of prints, each at its own angle */}
              <div className="relative md:col-span-7">
                <div className="relative mx-auto aspect-[6/5] w-full max-w-[680px]">
                  <Drift amount={18} className="absolute left-0 top-0 w-[74%]">
                    <motion.div
                      initial={{ opacity: 0, rotate: 0, y: 30 }}
                      whileInView={{ opacity: 1, rotate: -2, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.9, ease: EASE }}
                      className="bg-paper p-2 pb-8 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.7)] md:p-2.5 md:pb-10"
                    >
                      <div className="relative aspect-[3/2] overflow-hidden">
                        <Image
                          src="/images/lantern-parade.jpg"
                          alt="Glowing handmade lanterns at a night parade"
                          fill
                          sizes="(min-width: 768px) 38vw, 74vw"
                          className="object-cover"
                        />
                      </div>
                      <p className="absolute bottom-2 left-3 font-hand text-lg text-ink/70 md:bottom-2.5 md:text-xl">
                        lantern parade
                      </p>
                    </motion.div>
                  </Drift>
                  <Drift amount={-26} className="absolute bottom-0 right-0 w-[56%]">
                    <motion.div
                      initial={{ opacity: 0, rotate: 0, y: 40 }}
                      whileInView={{ opacity: 1, rotate: 2.5, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
                      className="bg-paper p-2 pb-8 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.7)] md:p-2.5 md:pb-10"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src="/images/dragon-boat-dance.jpg"
                          alt="Wushu performers at the dragon boat festival"
                          fill
                          sizes="(min-width: 768px) 28vw, 56vw"
                          className="object-cover"
                        />
                      </div>
                      <p className="absolute bottom-2 left-3 font-hand text-lg text-ink/70 md:bottom-2.5 md:text-xl">
                        dragon boat festival
                      </p>
                    </motion.div>
                  </Drift>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 04 — DISCOVERY BY DESIGN ================= */}
        <section className="mx-auto max-w-content px-6 pb-16 pt-16 md:px-10 md:pb-24 md:pt-24">
          <div className="grid items-end gap-6 md:grid-cols-12 md:gap-10">
            <div className="flex items-end gap-5 md:col-span-7 md:gap-8">
              <Rise>
                <span aria-hidden="true" className={`${NUMERAL} block text-tiger`}>
                  04
                </span>
              </Rise>
              <Rise delay={0.08} className="pb-1 md:pb-2">
                <p className={`${MARK} text-ink/50`}>Discovery by design</p>
                <h3 className={`${CLAIM} mt-2 text-ink`}>Leave with something new.</h3>
              </Rise>
            </div>
            <Rise delay={0.14} className="md:col-span-4 md:col-start-9 md:pb-3">
              <p className={BODY}>
                A skill, a place, a food, a friend. Every experience sends you home with
                something you didn&rsquo;t arrive with.
              </p>
            </Rise>
          </div>

          <div className="mt-10 md:mt-14">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:grid-rows-2 md:gap-3">
              {[
                {
                  src: "/images/japanfest.jpg",
                  alt: "Crowds arriving at JapanFest",
                  cap: "JapanFest",
                  cls: "col-span-2 aspect-[4/3] md:row-span-2 md:aspect-auto",
                  sizes: "(min-width: 768px) 50vw, 100vw",
                },
                {
                  src: "/images/create-mural.jpg",
                  alt: "Members painting flowers on a community mural",
                  cap: "Mural day",
                  cls: "aspect-square md:aspect-[4/3]",
                  sizes: "(min-width: 768px) 25vw, 50vw",
                },
                {
                  src: "/images/doghead-farm.jpg",
                  alt: "A group holding fresh harvest at Doghead Farm",
                  cap: "Doghead Farm",
                  cls: "aspect-square md:aspect-[4/3]",
                  sizes: "(min-width: 768px) 25vw, 50vw",
                },
                {
                  src: "/images/indonesia.jpg",
                  alt: "Dancers and food at an Indonesian cultural festival",
                  cap: "Indonesian festival",
                  cls: "col-span-2 aspect-[2/1] md:aspect-auto",
                  sizes: "(min-width: 768px) 50vw, 100vw",
                },
              ].map((p, i) => (
                <motion.figure
                  key={p.src}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
                  className={`group relative overflow-hidden bg-paper-dim ${p.cls}`}
                >
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes={p.sizes}
                    className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
                  />
                  <figcaption
                    className={`${MARK} absolute bottom-2 left-2 bg-paper px-2 py-1 text-[10px] text-ink md:bottom-3 md:left-3`}
                  >
                    {p.cap}
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </section>

        {/* ================= CLOSE ================= */}
        <section className="border-t border-ink/15">
          <div className="mx-auto max-w-content px-6 pb-14 pt-14 md:px-10 md:pb-20 md:pt-20">
            <div className="grid items-end gap-8 md:grid-cols-12 md:gap-10">
              <Rise className="md:col-span-8">
                <p className={`${TITLE} italic`}>
                  Events are just the{" "}
                  <span className="relative inline-block">
                    start.
                    <motion.svg
                      aria-hidden="true"
                      viewBox="0 0 200 16"
                      preserveAspectRatio="none"
                      className="absolute -bottom-[0.06em] left-0 h-[0.14em] w-full"
                    >
                      <motion.path
                        d="M2,9 C20,4 34,13 52,7 C68,2 82,12 100,8 C116,4 132,12 148,7 C164,3 180,11 198,8"
                        fill="none"
                        stroke="#e0521c"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
                      />
                    </motion.svg>
                  </span>
                </p>
              </Rise>
              <Rise delay={0.1} className="md:col-span-4 md:pb-3">
                <p className={BODY}>
                  We&rsquo;re building the social infrastructure for a more connected city.
                </p>
                <Link
                  href="/experiences"
                  className={`${MARK} mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-paper transition-colors duration-300 hover:bg-tiger-fill`}
                >
                  See what&rsquo;s happening <span aria-hidden="true">→</span>
                </Link>
              </Rise>
            </div>

            {/* seven ways in: the mediums, each one a door */}
            <div className="mt-12 border-t border-ink/15 pt-6 md:mt-16">
              <div className="flex items-baseline justify-between">
                <p className={`${MARK} text-tiger-text`}>Seven ways in</p>
                <p className={`${MARK} hidden text-ink/45 md:block`}>Pick one. Show up.</p>
              </div>
              <ul className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-2 md:gap-x-10">
                {MEDIUMS.map(([name, key]) => (
                  <li key={key}>
                    <Link
                      href={`/experiences?medium=${name}`}
                      className="organic-underline font-display text-xl text-ink transition-colors hover:text-tiger-text md:text-2xl"
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </MotionConfig>
  );
}
