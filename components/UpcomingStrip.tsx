"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { events } from "@/lib/events";

export default function UpcomingStrip() {
  const preview = events.slice(0, 4);

  return (
    <section id="about" className="max-w-content mx-auto px-6 md:px-10 py-24 md:py-32">
      <div className="flex items-end justify-between mb-10 md:mb-14">
        <div>
          <span className="stripe-mark text-amber-deep mb-4">
            <span></span><span></span><span></span>
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-ink mt-3">
            What&rsquo;s coming up
          </h2>
        </div>
        <Link href="/events" className="hidden md:block text-sm font-medium underline-stripe text-ink/70 hover:text-ink">
          See all experiences
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {preview.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="group"
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone">
              <Image
                src={event.image}
                alt={event.title}
                fill
                sizes="(max-width: 768px) 45vw, 22vw"
                className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
              />
            </div>
            <p className="mt-3 text-sm text-ink/50">{event.date}</p>
            <p className="font-display text-base text-ink leading-snug">{event.title}</p>
          </motion.div>
        ))}
      </div>

      <Link href="/events" className="md:hidden mt-8 inline-block text-sm font-medium underline-stripe text-ink/70">
        See all experiences
      </Link>
    </section>
  );
}
