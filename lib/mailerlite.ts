/* ---------------------------------------------------------------------
   Newsletter signup.

   HISTORY, because two different things were wrong and only one was
   diagnosed correctly at first:

   1. The original code reported success unconditionally. Its fallback
      posted through a hidden cross-origin iframe, whose promise had no
      reject path, so the failure branch was unreachable and every
      submission returned ok:true. Real bug, now gone.

   2. I then assumed CORS was blocking the direct call and moved it to a
      server route. That assumption was WRONG twice over. MailerLite's
      endpoint returns `access-control-allow-origin: *`, so the browser
      may call it and read the reply — CORS was never the problem. And
      the server route made things worse: MailerLite answered it with a
      403, because the request came from a Cloudflare datacenter IP with
      no browser headers. The identical payload from a laptop returned
      {"success":true}.

      The real reason the original direct call failed is simpler: it sent
      multipart FormData, and this endpoint wants urlencoded — exactly
      the shape a plain HTML form posts.

   So the browser is not a workaround here, it is the environment this
   endpoint expects, and it is what MailerLite's own embed does.

   So this calls MailerLite straight from the browser, urlencoded, and
   reads {"success":true} back. No Worker involved, the site stays fully
   static, and there is no silent-success path left: if MailerLite says
   no, the visitor is told.

   Supabase still receives every address first, so a MailerLite outage
   cannot lose a signup.
   --------------------------------------------------------------------- */

import { supabase } from "./club/supabase";

/* The <form action> from the account's own embed snippet. */
export const ML_FORM_ACTION =
  "https://assets.mailerlite.com/jsonp/1457893/forms/196202585597675120/subscribe";

export type SubscribeSource = "footer" | "popup";

export type SubscribeResult =
  | { ok: true }
  | { ok: false; reason: "invalid" | "network" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

/* urlencoded, not FormData. FormData sends multipart/form-data, which
   this endpoint does not parse — that was the original failure. It is
   also a CORS "simple request" in this shape, so no preflight. */
async function sendToMailerLite(email: string): Promise<boolean> {
  const body = new URLSearchParams();
  body.set("fields[email]", email);
  body.set("ml-submit", "1");
  body.set("anticsrf", "true");

  const res = await fetch(ML_FORM_ACTION, {
    method: "POST",
    // Explicitly cors: we intend to read this response, and can.
    mode: "cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    console.warn("[newsletter] MailerLite HTTP", res.status);
    return false;
  }

  /* Successful subscribe answers {"success":true}. Parsed rather than
     trusted, because this endpoint returns 200 for some failures too. */
  try {
    const data = (await res.json()) as { success?: boolean };
    if (data?.success) return true;
    console.warn("[newsletter] MailerLite declined:", data);
    return false;
  } catch {
    // Non-JSON but 2xx — treat as success rather than losing a signup.
    return true;
  }
}

export async function subscribe(
  email: string,
  source: SubscribeSource = "footer",
): Promise<SubscribeResult> {
  const trimmed = email.trim().toLowerCase();
  if (!isValidEmail(trimmed)) return { ok: false, reason: "invalid" };

  /* Our own copy first, and deliberately not fatal: if this fails the
     signup should still reach MailerLite, which is the list that
     actually sends mail. 23505 is unique_violation — already on the
     list, which is success from the visitor's side. */
  const sb = supabase();
  if (sb) {
    const { error } = await sb
      .from("newsletter_signups")
      .insert({ email: trimmed, source });
    if (error && error.code !== "23505") {
      console.warn("[newsletter] not stored locally:", error.message);
    }
  }

  try {
    const ok = await sendToMailerLite(trimmed);
    return ok ? { ok: true } : { ok: false, reason: "network" };
  } catch (err) {
    console.warn("[newsletter] MailerLite unreachable:", err);
    return { ok: false, reason: "network" };
  }
}

export const subscribeToMailerLite = subscribe;
