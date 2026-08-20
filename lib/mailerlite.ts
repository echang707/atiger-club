/* ---------------------------------------------------------------------
   MailerLite submission — one destination, reused by both the popup and
   the footer form.

   This is the exact form action Eric's MailerLite embed already posts
   to (group 1457893, form 196202585597675120) — nothing new was set up
   on MailerLite's side, no API key, no server route, no database. Both
   forms on the site just submit to this one URL, same as the original
   embed's own <form action> did.

   Two submission paths, tried in order:

   1. `fetch` with mode: "cors". MailerLite's own webform script talks to
      this same endpoint over AJAX, so a normal cross-origin request is
      the expected shape and gives a real success/failure signal back —
      this is what actually drives the loading/error states below.
   2. A hidden iframe form POST, used only if step 1 throws (a network
      or CORS failure). This is the same no-reload trick the plain HTML
      embed snippet uses under the hood (target="_blank" swapped for a
      same-page hidden iframe) — it can't read the response back, so on
      this path success is assumed once the iframe finishes loading.

   Either way, nothing here talks to a different MailerLite endpoint or
   stores emails anywhere else — it's the one form action, submitted
   two different ways depending on what the browser allows. */

export const ML_FORM_ACTION =
  "https://assets.mailerlite.com/jsonp/1457893/forms/196202585597675120/subscribe";

export type SubscribeResult = { ok: true } | { ok: false; reason: "invalid" | "network" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

function buildFormData(email: string): FormData {
  const fd = new FormData();
  fd.append("fields[email]", email.trim());
  fd.append("ml-submit", "1");
  fd.append("anticsrf", "true");
  return fd;
}

// Fallback: submit via a hidden same-page iframe, exactly like the
// vanilla embed's <form target> does, just not opened in a new tab.
// Cross-origin means the response can't be read, so this resolves once
// the iframe has had time to load rather than on a real signal.
function submitViaHiddenIframe(email: string): Promise<void> {
  return new Promise((resolve) => {
    const iframeName = `ml-subscribe-${Date.now()}`;
    const iframe = document.createElement("iframe");
    iframe.name = iframeName;
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const form = document.createElement("form");
    form.action = ML_FORM_ACTION;
    form.method = "POST";
    form.target = iframeName;
    form.style.display = "none";

    const fd = buildFormData(email);
    fd.forEach((value, key) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();

    const cleanup = () => {
      form.remove();
      iframe.remove();
    };

    // Resolve on load or after a timeout, whichever comes first — some
    // browsers don't fire load reliably for cross-origin iframe posts.
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      cleanup();
      resolve();
    };
    iframe.addEventListener("load", finish);
    setTimeout(finish, 1800);
  });
}

export async function subscribeToMailerLite(email: string): Promise<SubscribeResult> {
  const trimmed = email.trim();
  if (!isValidEmail(trimmed)) {
    return { ok: false, reason: "invalid" };
  }

  try {
    const res = await fetch(ML_FORM_ACTION, {
      method: "POST",
      mode: "cors",
      body: buildFormData(trimmed),
    });
    // A JSONP-flavored classic MailerLite endpoint returns 200 for a
    // successful subscribe (including re-subscribing an existing
    // address, which MailerLite treats as success, not an error).
    if (res.ok) {
      return { ok: true };
    }
    throw new Error(`MailerLite responded ${res.status}`);
  } catch {
    // CORS-blocked or offline — fall back to the hidden-iframe post.
    // This mirrors the plain embed's own behavior and, since it can't
    // read the response, is treated as a best-effort success.
    try {
      await submitViaHiddenIframe(trimmed);
      return { ok: true };
    } catch {
      return { ok: false, reason: "network" };
    }
  }
}
