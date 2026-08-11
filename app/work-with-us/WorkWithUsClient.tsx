"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cities } from "@/lib/events";

const CONTACT_EMAIL = "eric@atigercub.com";

export default function WorkWithUsClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState(cities[0]);
  const [idea, setIdea] = useState("");
  const [details, setDetails] = useState("");
  const [sent, setSent] = useState(false);

  const canSubmit = name.trim() && email.trim() && idea.trim() && details.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const subject = `Event idea: ${idea}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `City: ${city}`,
      "",
      "The idea:",
      details,
    ].join("\n");

    // No backend to wire up yet, so this hands the submission straight
    // to the visitor's own email client, addressed to Eric — the message
    // arrives pre-filled, they just hit send. If Tiger Club later wants
    // this to submit silently in the background instead, swap this for
    // a POST to a serverless function backed by an email API (e.g.
    // Resend) — the form fields above stay the same either way.
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <main className="pt-28 md:pt-36 pb-24">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mb-12 md:mb-16"
        >
          <p className="font-mono text-xs tracking-wideish uppercase text-tiger-text mb-3">
            work with us
          </p>
          <h1 className="font-display text-4xl md:text-6xl text-ink leading-tight">
            we turn your ideas into real experiences.
          </h1>
          <p className="text-ink/70 mt-4 text-sm md:text-base max-w-xl">
            Got something you&rsquo;ve wanted to see happen in Atlanta — a
            dinner, a workshop, a cleanup, a wild idea with no category yet?
            Tell us about it. We&rsquo;ll work with you to plan it, host it,
            and get people in the room.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl grid gap-5"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <label className="grid gap-1.5 text-sm">
              <span className="text-ink/75">Your name</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border border-ink/15 bg-paper-dim/60 px-4 py-3 text-ink outline-none transition-colors focus:border-tiger"
                placeholder="Jamie Lee"
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="text-ink/75">Email</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border border-ink/15 bg-paper-dim/60 px-4 py-3 text-ink outline-none transition-colors focus:border-tiger"
                placeholder="jamie@email.com"
              />
            </label>
          </div>

          <label className="grid gap-1.5 text-sm">
            <span className="text-ink/75">City</span>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-xl border border-ink/15 bg-paper-dim/60 px-4 py-3 text-ink outline-none transition-colors focus:border-tiger"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1.5 text-sm">
            <span className="text-ink/75">What&rsquo;s the idea, in a few words?</span>
            <input
              required
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className="rounded-xl border border-ink/15 bg-paper-dim/60 px-4 py-3 text-ink outline-none transition-colors focus:border-tiger"
              placeholder="A rooftop dinner for people new to the city"
            />
          </label>

          <label className="grid gap-1.5 text-sm">
            <span className="text-ink/75">Tell us more</span>
            <textarea
              required
              rows={5}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="rounded-xl border border-ink/15 bg-paper-dim/60 px-4 py-3 text-ink outline-none transition-colors focus:border-tiger resize-none"
              placeholder="Who is it for, roughly when, and what would make it feel meaningful?"
            />
          </label>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={!canSubmit}
              className="px-6 py-3 rounded-full text-sm font-medium bg-ink text-paper hover:bg-tiger-fill transition-colors duration-300 disabled:opacity-40 disabled:hover:bg-ink"
            >
              Send it our way
            </button>
            {sent && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-ink/70"
              >
                Opening your email — just hit send.
              </motion.span>
            )}
          </div>
          <p className="text-xs text-ink/60 -mt-1">
            This opens an email to {CONTACT_EMAIL}, pre-filled with what you enter above.
          </p>
        </motion.form>
      </div>
    </main>
  );
}
