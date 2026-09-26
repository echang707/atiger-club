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

     OPENING   masthead rule, the big question, a serif lede and one photo
     01        number + claim, photo pair            (cream, simple)
     02        photo, the DNA tail, claim — mirrored (cream, one detail)
     03        the page inverts to ink, polaroid pile (the loud beat)
     04        claim over a four-photo mosaic         (the widest beat)
     CLOSE     the serif line, one CTA, seven ways in (mascots)

   Type is still three families and a short list of sizes:
     Bricolage   — the title, the claims, the big numerals
     Instrument  — the lede, the section intro, the closing line
     JetBrains   — every label and caption
   Orange is used for marks and large numerals only; text that has to be
   read in orange uses tiger-text, which clears AA on cream.
   --------------------------------------------------------------------- */

const EASE = [0.22, 1, 0.36, 1] as const;

const MARK = "font-mono text-[11px] tracking-wideish uppercase";
const BODY = "text-base md:text-[17px] text-ink/70 leading-relaxed";
const CLAIM =
  "font-wordmark font-extrabold tracking-tight leading-[0.98] text-[clamp(2.3rem,4.6vw,4.4rem)]";
const NUMERAL =
  "font-wordmark font-extrabold leading-[0.8] tracking-[-0.06em] select-none text-[clamp(5.5rem,12vw,11.5rem)]";

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

function Mascot({ src, className = "", rotate = 0 }: { src: string; className?: string; rotate?: number }) {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.7, rotate: rotate - 10 }}
      whileInView={{ opacity: 1, scale: 1, rotate }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
      className={`pointer-events-none absolute ${className}`}
    >
      <div className="relative h-full w-full">
        <Image src={src} alt="" fill sizes="120px" className="object-contain" />
      </div>
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
        <section className="mx-auto max-w-content px-5 pb-16 pt-6 md:px-10 md:pb-24 md:pt-10">
          {/* masthead rule: gives the title a page to sit on */}
          <Rise y={8}>
            <div className={`${MARK} flex items-center justify-between border-b border-ink pb-2.5 text-ink`}>
              <span>About</span>
              <span className="hidden text-ink/50 md:inline">Four principles, one idea</span>
              <span>Atlanta, GA</span>
            </div>
          </Rise>

          <Rise delay={0.05}>
            <h1 className="mt-6 font-wordmark font-extrabold leading-[0.86] tracking-[-0.04em] text-ink text-[12.6vw] md:mt-8 md:text-[clamp(4rem,12.4vw,11.5rem)]">
              <span className="mr-[0.12em] font-tagline font-normal italic tracking-[-0.02em] text-tiger-text">
                Why
              </span>
              Tiger&nbsp;Club?
            </h1>
          </Rise>

          <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-5 md:pt-1">
              <Rise delay={0.12}>
                <p className="font-tagline text-[clamp(1.7rem,2.7vw,2.5rem)] leading-[1.1] tracking-[-0.01em] text-ink">
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
          <div className="mx-auto grid max-w-content items-end gap-3 px-5 pb-2 pt-10 md:grid-cols-12 md:gap-10 md:px-10 md:pt-14">
            <Rise className="md:col-span-3">
              <p className={`${MARK} text-tiger-text`}>Four principles</p>
            </Rise>
            <Rise delay={0.08} className="md:col-span-9">
              <h2 className="font-tagline italic leading-[1.02] tracking-[-0.01em] text-ink text-[clamp(2rem,4.2vw,3.9rem)]">
                We don&rsquo;t just put people in the same room.
              </h2>
            </Rise>
          </div>
        </section>

        {/* ================= 01 — NO SPECTATORS ================= */}
        <section className="mx-auto max-w-content px-5 pb-16 pt-12 md:px-10 md:pb-24 md:pt-16">
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

            <div className="relative md:col-span-7 md:pl-6">
              <Rise delay={0.1}>
                <Photo
                  src="/images/dragon-boat.jpg"
                  alt="A dragon boat crew paddling in unison"
                  caption="Dragon boat festival"
                  aspect="aspect-[3/2]"
                  sizes="(min-width: 768px) 52vw, 100vw"
                />
              </Rise>
              <Drift amount={24} className="absolute -bottom-12 right-3 w-[34%] md:-bottom-14 md:-left-10 md:right-auto md:w-[30%]">
                <div className="bg-paper p-1.5 shadow-[0_18px_40px_-20px_rgba(21,19,14,0.45)] md:p-2">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src="/images/serve-treeplanting.jpg"
                      alt="Volunteers planting trees in a wooded park"
                      fill
                      sizes="(min-width: 768px) 20vw, 42vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </Drift>
              <Mascot src="/images/icons/move.png" rotate={6} className="-top-10 right-2 h-20 w-24 md:-top-14 md:h-28 md:w-32" />
            </div>
          </div>
        </section>

        {/* ================= 02 — CONNECTION BY DESIGN ================= */}
        <section className="border-t border-ink/10">
          <div className="mx-auto max-w-content px-5 pb-16 pt-16 md:px-10 md:pb-24 md:pt-24">
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

              {/* The DNA tail from the old page, now doing a job: it is the
                  "connection" drawn between the photo and the claim. */}
              <motion.div
                aria-hidden="true"
                initial={{ clipPath: "inset(0 0 100% 0)" }}
                whileInView={{ clipPath: "inset(0 0 0% 0)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.8, ease: EASE }}
                className="relative order-3 hidden h-[26rem] md:order-2 md:col-span-1 md:block"
              >
                <Image src="/images/tiger-tail-strand.webp" alt="" fill sizes="80px" className="object-contain" />
              </motion.div>

              <div className="relative order-1 md:order-3 md:col-span-5 md:pl-4">
                <Rise>
                  <span
                    aria-hidden="true"
                    className={`${NUMERAL} block text-transparent [-webkit-text-stroke:2px_#e0521c]`}
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
                <Mascot src="/images/icons/eat.png" rotate={-5} className="-top-4 right-0 h-20 w-24 md:right-6 md:top-2 md:h-24 md:w-28" />
              </div>
            </div>
          </div>
        </section>

        {/* ================= 03 — BREAK THE SCRIPT (inverted) ================= */}
        <section className="relative overflow-hidden bg-ink text-paper">
          {/* one oversized numeral as texture, bleeding off the edge */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-[4vw] -top-[6vw] select-none font-wordmark font-extrabold leading-none tracking-[-0.06em] text-paper/[0.04] text-[48vw] md:text-[34vw]"
          >
            03
          </span>

          <div className="relative mx-auto max-w-content px-5 py-16 md:px-10 md:py-24">
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
                    <span className="font-tagline font-normal italic tracking-[-0.01em] text-tiger-soft">
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
                      whileInView={{ opacity: 1, rotate: -3, y: 0 }}
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
                      whileInView={{ opacity: 1, rotate: 4, y: 0 }}
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
                  <Mascot src="/images/icons/play.png" rotate={-8} className="-bottom-6 left-[6%] h-24 w-24 md:-bottom-4 md:h-32 md:w-32" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 04 — DISCOVERY BY DESIGN ================= */}
        <section className="mx-auto max-w-content px-5 pb-16 pt-16 md:px-10 md:pb-24 md:pt-24">
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

          <div className="relative mt-10 md:mt-14">
            <Mascot
              src="/images/icons/learn.png"
              rotate={4}
              className="-top-14 right-3 z-10 h-20 w-16 md:-top-20 md:right-8 md:h-28 md:w-24"
            />
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
          <div className="mx-auto max-w-content px-5 pb-14 pt-14 md:px-10 md:pb-20 md:pt-20">
            <div className="grid items-end gap-8 md:grid-cols-12 md:gap-10">
              <Rise className="md:col-span-8">
                <p className="font-tagline italic leading-[0.95] tracking-[-0.02em] text-ink text-[clamp(3rem,7.6vw,7.25rem)]">
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
                  className={`${MARK} mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-paper transition-colors duration-300 hover:bg-tiger-fill`}
                >
                  See what&rsquo;s happening <span aria-hidden="true">→</span>
                </Link>
              </Rise>
            </div>

            {/* seven ways in: the mediums, each one a door */}
            <div className="mt-14 border-t border-ink/15 pt-6 md:mt-20">
              <div className="flex items-baseline justify-between">
                <p className={`${MARK} text-tiger-text`}>Seven ways in</p>
                <p className={`${MARK} hidden text-ink/45 md:block`}>Pick one. Show up.</p>
              </div>
              <ul className="mt-6 grid grid-cols-4 gap-x-2 gap-y-6 md:grid-cols-7 md:gap-4">
                {MEDIUMS.map(([name, key], i) => (
                  <motion.li
                    key={key}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
                  >
                    <Link
                      href={`/experiences?medium=${name}`}
                      className="group flex flex-col items-center gap-2 rounded-lg py-2 transition-colors hover:bg-ink/[0.04]"
                    >
                      <span className="relative h-14 w-14 transition-transform duration-300 ease-snap group-hover:-translate-y-1 group-hover:-rotate-6 md:h-20 md:w-20">
                        <Image src={`/images/icons/${key}.png`} alt="" fill sizes="80px" className="object-contain" />
                      </span>
                      <span className="font-wordmark text-sm font-bold text-ink transition-colors group-hover:text-tiger-text md:text-base">
                        {name}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </MotionConfig>
  );
}
