"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cities } from "@/lib/events";
import { supabase } from "@/lib/club/supabase";

const CONTACT_EMAIL = "eric@atigercub.com";
// Supabase table that stores submissions — see run-this-in-supabase.sql.
const IDEAS_TABLE = "work_with_us_submissions";

export default function WorkWithUsClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState(cities[0]);
  const [idea, setIdea] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const canSubmit =
    name.trim() && email.trim() && idea.trim() && details.trim();

  // Fallback only: a pre-filled email to Eric, offered if the save fails.
  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `Event idea: ${idea}`
  )}&body=${encodeURIComponent(
    [`Name: ${name}`, `Email: ${email}`, `City: ${city}`, "", "The idea:", details].join("\n")
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || status === "sending") return;
    setStatus("sending");

    /* Saved straight to Supabase from the browser, same as the
       newsletter. The table allows anonymous INSERT only (see
       run-this-in-supabase.sql), so no .select() afterwards — reading
       the row back would be refused by RLS and look like a failure. */
    const sb = supabase();
    if (!sb) {
      console.error("[work-with-us] Supabase env vars are missing");
      setStatus("error");
      return;
    }

    try {
      const { error } = await sb.from(IDEAS_TABLE).insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        city,
        idea: idea.trim(),
        details: details.trim(),
      });
      if (error) {
        console.error("[work-with-us] insert failed:", error.code, error.message);
        setStatus("error");
        return;
      }
    } catch (err) {
      console.error("[work-with-us] Supabase unreachable:", err);
      setStatus("error");
      return;
    }

    setStatus("sent");
    setName("");
    setEmail("");
    setIdea("");
    setDetails("");
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
              disabled={!canSubmit || status === "sending"}
              className="px-6 py-3 rounded-full text-sm font-medium bg-ink text-paper hover:bg-tiger-fill transition-colors duration-300 disabled:opacity-40 disabled:hover:bg-ink"
            >
              {status === "sending" ? "Sending…" : "Send it our way"}
            </button>
            {status === "sent" && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-ink/70"
              >
                Got it — we&rsquo;ll be in touch.
              </motion.span>
            )}
            {status === "error" && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                role="alert"
                className="text-sm text-ink/70"
              >
                That didn&rsquo;t go through.{" "}
                <a href={mailtoHref} className="underline text-tiger-text">
                  Email it to us instead
                </a>
                .
              </motion.span>
            )}
          </div>
        </motion.form>
      </div>
    </main>
  );
}
