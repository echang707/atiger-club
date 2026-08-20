"use client";

import { useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { subscribeToMailerLite } from "@/lib/mailerlite";
import { markSubscribed } from "@/lib/newsletterStorage";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterForm({
  variant,
  note,
  onSuccess,
}: {
  variant: "popup" | "footer";
  note?: string;
  onSuccess?: () => void;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputId = useId();
  const statusId = useId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Guards duplicate submissions — a second Enter/click while a
    // request is already in flight, or after success, is a no-op.
    if (status === "loading" || status === "success") return;

    setStatus("loading");
    setErrorMsg("");

    const result = await subscribeToMailerLite(email);

    if (result.ok) {
      setStatus("success");
      markSubscribed();
      onSuccess?.();
    } else {
      setStatus("error");
      setErrorMsg(
        result.reason === "invalid"
          ? "That email doesn't look right — mind double-checking it?"
          : "Something went wrong on our end. Mind trying again?"
      );
    }
  };

  const isPopup = variant === "popup";

  return (
    <div className={isPopup ? "" : "w-full"}>
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.p
            key="success"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            role="status"
            className={
              isPopup
                ? "text-ink text-base"
                : "text-ink/80 text-sm"
            }
          >
            You&rsquo;re in. Watch your inbox.
          </motion.p>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            noValidate
            className={isPopup ? "grid gap-3" : "flex flex-col sm:flex-row gap-3 sm:items-center"}
          >
            <label htmlFor={inputId} className="sr-only">
              Email address
            </label>
            <div className={isPopup ? "flex gap-2" : "flex gap-2 flex-1 sm:max-w-xs"}>
              <input
                id={inputId}
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={status === "error"}
                aria-describedby={status === "error" ? statusId : undefined}
                disabled={status === "loading"}
                className="flex-1 min-w-0 rounded-full border border-ink/15 bg-paper/80 px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 outline-none transition-colors focus:border-tiger disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-ink px-4 sm:px-5 py-2.5 text-sm font-medium text-paper transition-colors duration-300 hover:bg-tiger-fill disabled:opacity-60 disabled:hover:bg-ink"
              >
                {status === "loading" ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="h-3.5 w-3.5 rounded-full border-2 border-paper/40 border-t-paper animate-spin"
                    />
                    <span className="sr-only">Joining…</span>
                  </>
                ) : (
                  <>
                    JOIN <span aria-hidden="true">→</span>
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {status === "error" && (
        <p id={statusId} role="alert" className="mt-2 text-xs text-tiger-text">
          {errorMsg}
        </p>
      )}

      {note && status !== "success" && (
        <p className="mt-2.5 text-xs text-ink/50">{note}</p>
      )}
    </div>
  );
}
