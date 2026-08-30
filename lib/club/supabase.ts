/* ---------------------------------------------------------------------
   The Supabase adapter — the one file that knows which database we use.

   ARCHITECTURE NOTE, because this is the decision worth understanding:

   Auth runs entirely in the BROWSER. There are no API routes, no server
   actions, no middleware and no auth cookies. Two reasons.

   First, this site is 100% static today. Adding server-rendered auth
   would turn every page dynamic on Cloudflare's Workers runtime — a
   large change in deploy behaviour, and the riskiest part of the whole
   feature, bought for a page whose content is already private-by-nature.

   Second, and more importantly: the security boundary is row-level
   security in Postgres, NOT the app. The policies in the setup SQL mean
   a member can only ever read their own row, enforced by the database
   against the anon key. Server-side rendering would not add protection,
   because the browser client is subject to exactly the same policies.
   That is also why the anon key is safe in the client bundle — it is
   designed to be public, and is worthless without a session.

   The trade-off is real and worth stating: /member renders a brief
   loading state instead of arriving pre-rendered, and there is no
   server-side redirect for signed-out visitors. For a member dashboard
   that is the normal, accepted shape.

   If native checkout later needs a trusted server (it will — Stripe
   webhooks and price verification cannot be client-side), that arrives
   as new server routes alongside this, and this file does not change.
   --------------------------------------------------------------------- */

import {
  createClient,
  type SupabaseClient,
  type User,
} from "@supabase/supabase-js";
import type { Member } from "../member";
import type { MemberStatus } from "../membership";
import { MEMBER_STATUSES } from "../membership";
import type { AuthFailure, AuthResult, SignUpInput } from "./store";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

/* Returns null rather than throwing when env vars are missing, so a
   misconfigured deploy degrades to "membership is unavailable" instead
   of a white screen on every page. The provider surfaces that state. */
export function supabase(): SupabaseClient | null {
  if (!URL || !ANON) return null;
  if (client) return client;
  client = createClient(URL, ANON, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      // The session is read back out of the URL fragment after a
      // password-reset link, which is how /reset-password authenticates.
      detectSessionInUrl: true,
    },
  });
  return client;
}

export function isConfigured() {
  return Boolean(URL && ANON);
}

/* Rows come back as untyped JSON. Narrow the status rather than trusting
   it: a value added to the DB but not yet to the enum should degrade to
   a plain member, not crash the dashboard. */
function toMemberStatus(v: unknown): MemberStatus {
  return MEMBER_STATUSES.includes(v as MemberStatus)
    ? (v as MemberStatus)
    : "member";
}

type MemberRow = {
  id: string;
  auth_user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  status: string | null;
  joined_at: string;
  referral_code: string | null;
  referred_by_member_id: string | null;
};

function rowToMember(r: MemberRow): Member {
  return {
    id: r.id,
    authUserId: r.auth_user_id,
    firstName: r.first_name ?? "",
    lastName: r.last_name ?? "",
    email: r.email ?? "",
    status: toMemberStatus(r.status),
    joinedAt: r.joined_at,
    referralCode: r.referral_code,
    referredByMemberId: r.referred_by_member_id,
  };
}

/* The member row is created by a Postgres trigger on auth.users, not by
   this code — see the setup SQL. That matters: it cannot be skipped by a
   client that closes the tab mid-signup, and it cannot be forged.

   The retry loop exists because the trigger and the returning session
   race by a few milliseconds on first signup. Three quick attempts is
   enough in practice and costs nothing on the common path. */
export async function fetchMember(
  sb: SupabaseClient,
  user: User,
  attempts = 3,
): Promise<Member | null> {
  for (let i = 0; i < attempts; i++) {
    const { data, error } = await sb
      .from("members")
      .select("*")
      .eq("auth_user_id", user.id)
      .maybeSingle();
    if (error) break;
    if (data) return rowToMember(data as MemberRow);
    if (i < attempts - 1) await new Promise((r) => setTimeout(r, 250));
  }
  return null;
}

function fail(reason: AuthFailure): AuthResult {
  return { ok: false, reason };
}

/* Supabase reports "user already registered" on signup. We deliberately
   do NOT pass that through: telling an anonymous visitor which email
   addresses are members is account enumeration. Both outcomes look the
   same from outside. */
function mapSignUpError(message: string): AuthFailure {
  const m = message.toLowerCase();
  // Raised when handle_new_user() throws — the auth insert is rolled
  // back with it, so no account was created.
  if (m.includes("database error")) return "member_record_failed";
  if (m.includes("password")) return "weak_password";
  if (m.includes("rate") || m.includes("too many")) return "rate_limited";
  if (m.includes("already")) return "invalid_input";
  return "unavailable";
}

export async function signUp(input: SignUpInput): Promise<AuthResult> {
  const sb = supabase();
  if (!sb) return fail("unavailable");

  const { data, error } = await sb.auth.signUp({
    email: input.email.trim(),
    password: input.password,
    options: {
      // Read by the handle_new_user() trigger to populate the member row.
      data: {
        first_name: input.firstName.trim(),
        last_name: input.lastName.trim(),
      },
    },
  });

  if (error) return fail(mapSignUpError(error.message));
  if (!data.user) return fail("unavailable");

  /* No session means the project has email confirmation switched on.
     The account is created and the trigger has run; we simply cannot
     read the members row yet, because RLS scopes it to auth.uid() and
     there is no authenticated user until they click the link.

     So do not even try to fetch — a failed read here is expected, not an
     error, and reporting it as one is what made a working signup look
     broken. */
  if (!data.session) {
    return { ok: true, member: null, needsConfirmation: true };
  }

  const member = await fetchMember(sb, data.user);
  // We have a session but still no row: the trigger really did fail.
  return member ? { ok: true, member } : fail("member_record_failed");
}

export async function signIn(
  email: string,
  password: string,
): Promise<AuthResult> {
  const sb = supabase();
  if (!sb) return fail("unavailable");

  const { data, error } = await sb.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error || !data.user) {
    const rate = error?.message?.toLowerCase().includes("rate");
    return fail(rate ? "rate_limited" : "invalid_credentials");
  }

  const member = await fetchMember(sb, data.user);
  // Session is good but no members row exists — the trigger never ran
  // for this account. Distinct from a bad password.
  return member ? { ok: true, member } : fail("member_record_failed");
}

export async function signOut() {
  await supabase()?.auth.signOut();
}

/* Always resolves, never reports whether the address exists — same
   reasoning as signup. The UI shows one message regardless. */
export async function requestPasswordReset(email: string) {
  const sb = supabase();
  if (!sb) return;
  const redirectTo =
    typeof window !== "undefined"
      ? `${window.location.origin}/reset-password`
      : undefined;
  try {
    await sb.auth.resetPasswordForEmail(email.trim(), { redirectTo });
  } catch {
    /* swallowed on purpose — see above */
  }
}

export async function updatePassword(password: string) {
  const sb = supabase();
  if (!sb) return { ok: false as const, reason: "unavailable" as AuthFailure };
  const { error } = await sb.auth.updateUser({ password });
  if (error) {
    const weak = error.message.toLowerCase().includes("password");
    return {
      ok: false as const,
      reason: (weak ? "weak_password" : "unavailable") as AuthFailure,
    };
  }
  return { ok: true as const };
}
