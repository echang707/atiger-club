/* ---------------------------------------------------------------------
   Newsletter signup.

   WHAT WAS WRONG
   The previous version could only ever report success. Its fallback
   posted the form through a hidden cross-origin iframe, which by
   definition cannot read a response, and the promise wrapping it had no
   reject path — so the "network failure" branch was unreachable code and
   every submission returned ok:true. The form said "you're in" whether
   MailerLite accepted the address, rejected it, or was never reached at
   all. That is exactly the reported symptom: a confirmation on screen,
   nothing in the account.

   WHAT THIS DOES INSTEAD
   The address is written to our own `newsletter_signups` table first.
   That gives a real success/failure signal, and means a signup is never
   lost to a third party being down or a form ID going stale — the list
   is ours and can be read in the Supabase table editor.

   MailerLite is then attempted as a best-effort side channel so the
   existing marketing flow keeps working if the embed is still valid.
   Its outcome deliberately does NOT affect what the visitor is told,
   because we still cannot observe it. If MailerLite silently fails, the
   address is already safely stored.
   --------------------------------------------------------------------- */

import { supabase } from "./club/supabase";

export type SubscribeSource = "footer" | "popup";

export type SubscribeResult =
  | { ok: true }
  | { ok: false; reason: "invalid" | "network" | "unavailable" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

/* Hands the address to /api/subscribe, which talks to MailerLite's API
   with the secret key server-side. Unlike the old embed post, this comes
   back with a real result — so a bad key or a wrong group id shows up in
   the console instead of failing silently forever.

   Awaited but non-fatal: the address is already in our own table by the
   time this runs, so a MailerLite outage must not make the visitor think
   their signup failed. */
async function sendToMailerLite(
  email: string,
  source: SubscribeSource,
): Promise<void> {
  try {
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source }),
    });
    const data = (await res.json()) as { ok: boolean; reason?: string };
    if (!data.ok) {
      // Visible in the browser console, which is where you look when
      // the table has rows but MailerLite does not.
      console.warn("[newsletter] stored, but MailerLite declined:", data);
    }
  } catch {
    console.warn("[newsletter] stored, but MailerLite could not be reached");
  }
}

export async function subscribe(
  email: string,
  source: SubscribeSource = "footer",
): Promise<SubscribeResult> {
  const trimmed = email.trim().toLowerCase();
  if (!isValidEmail(trimmed)) return { ok: false, reason: "invalid" };

  const sb = supabase();
  if (!sb) {
    // No database configured. Still try MailerLite, but say plainly that
    // it could not be confirmed rather than inventing a success.
    void sendToMailerLite(trimmed, source);
    return { ok: false, reason: "unavailable" };
  }

  const { error } = await sb
    .from("newsletter_signups")
    .insert({ email: trimmed, source });

  // 23505 is unique_violation: already on the list, which from the
  // visitor's point of view is success, not an error.
  if (error && error.code !== "23505") {
    return { ok: false, reason: "network" };
  }

  void sendToMailerLite(trimmed, source);
  return { ok: true };
}

/* Kept so existing imports keep working. */
export const subscribeToMailerLite = subscribe;
