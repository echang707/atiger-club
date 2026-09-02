/* ---------------------------------------------------------------------
   MailerLite subscribe — server side.

   WHY THIS RUNS ON THE SERVER
   Not for secrecy alone. The original code posted the embed form
   straight from the browser, and a cross-origin POST cannot read its own
   response — so the site could never tell whether MailerLite accepted
   the address. From here there is no CORS restriction, so we get the
   real status code and body back and can act on it.

   TWO PATHS, in order of preference:

   1. The official API, if MAILERLITE_API_KEY is set. Cleanest: proper
      status codes, group targeting, real error messages. The key is a
      genuine secret (it can read and modify the whole account), so it
      lives only here — note the deliberate absence of a NEXT_PUBLIC_
      prefix, which is what keeps it out of the browser bundle.

   2. The embed form endpoint, which needs no key at all. This is the
      exact action from the account's own embed snippet — same account,
      same form id. Posting it server-side sidesteps the CORS problem
      that made the original unverifiable.

   So this works with zero configuration, and gets better if a key is
   added later.
   --------------------------------------------------------------------- */

// Cloudflare Pages runs this as a Function on the Workers runtime.
export const runtime = "edge";

/* From the MailerLite embed snippet: <form action="..."> */
const ML_FORM_ACTION =
  "https://assets.mailerlite.com/jsonp/1457893/forms/196202585597675120/subscribe";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Outcome = { ok: boolean; via: string; status?: number; detail?: string };

async function viaApi(
  email: string,
  source: string,
  key: string,
  groupId?: string,
): Promise<Outcome> {
  const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      ...(groupId ? { groups: [groupId] } : {}),
      fields: { source },
    }),
  });
  // 201 created, 200 already existed and was updated. Both are a
  // success as far as the visitor is concerned.
  if (res.status === 200 || res.status === 201) return { ok: true, via: "api" };
  return {
    ok: false,
    via: "api",
    status: res.status,
    detail: (await res.text()).slice(0, 400),
  };
}

async function viaEmbed(email: string): Promise<Outcome> {
  /* Same field names the embed's own <form> submits: fields[email],
     ml-submit and anticsrf. Sent as urlencoded because that is what a
     plain HTML form post looks like, which is what this endpoint
     expects. */
  const body = new URLSearchParams();
  body.set("fields[email]", email);
  body.set("ml-submit", "1");
  body.set("anticsrf", "true");

  const res = await fetch(ML_FORM_ACTION, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json, text/javascript, */*",
    },
    body,
  });

  const text = (await res.text()).slice(0, 400);
  /* The endpoint answers 200 for a successful subscribe, including
     re-subscribing an address it already holds. A body mentioning an
     error is treated as a failure even on a 200, since this endpoint is
     not strict about status codes. */
  const looksFailed = /"success"\s*:\s*false|error/i.test(text);
  if (res.ok && !looksFailed) return { ok: true, via: "embed" };
  return { ok: false, via: "embed", status: res.status, detail: text };
}

export async function POST(request: Request) {
  let email = "";
  let source = "footer";
  try {
    const body = (await request.json()) as { email?: string; source?: string };
    email = (body.email ?? "").trim().toLowerCase();
    source = body.source ?? "footer";
  } catch {
    return Response.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return Response.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  const key = process.env.MAILERLITE_API_KEY;
  const groupId = process.env.MAILERLITE_GROUP_ID;

  try {
    const result = key
      ? await viaApi(email, source, key, groupId)
      : await viaEmbed(email);
    // 200 either way: the caller has already stored the address, so a
    // MailerLite problem is reported, not thrown.
    return Response.json(result, { status: 200 });
  } catch {
    return Response.json({ ok: false, via: "none", reason: "network" });
  }
}
