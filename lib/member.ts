/* ---------------------------------------------------------------------
   The member-side data model: who someone is, and what they have signed
   up for. These types are the contract between the database and the UI,
   so they are deliberately storage-agnostic — no vendor types leak in.
   --------------------------------------------------------------------- */

import type { MemberStatus } from "./membership";

/* A Member is the Tiger Club record. It is kept SEPARATE from the auth
   user on purpose: the auth provider owns credentials, email
   verification and password resets, and we own club identity. If we
   ever change auth provider, this table survives and only `authUserId`
   is rewritten. */
export type Member = {
  id: string;
  /* Foreign key into whatever auth provider we land on. */
  authUserId: string;
  firstName: string;
  lastName: string;
  email: string;
  status: MemberStatus;
  /* "Member since" on the dashboard. ISO 8601, UTC. */
  joinedAt: string;
  /* Reserved for referrals — issued at signup so the infrastructure is
     there, but nothing reads it yet. */
  referralCode?: string | null;
  referredByMemberId?: string | null;

  /* ---- Profile. All optional: the club asks for four things at signup
     and everything below is volunteered later, so every one of these
     must render fine as empty. ---- */
  avatarUrl?: string | null;
  phone?: string | null;
  /* YYYY-MM-DD. Stored as a date, not a timestamp — a birthday has no
     time zone, and treating it as one is how people end up being wished
     happy birthday a day early. Feeds the birthday benefits already on
     the roadmap. */
  birthday?: string | null;
  city?: string | null;
  /* Tiger Club runs a lot of dinners. Worth asking once rather than in
     every event thread. */
  dietaryNotes?: string | null;
  instagram?: string | null;
};

/* The fields a member may edit. Email is deliberately excluded: it is
   owned by the auth provider, and changing it needs a verification
   round-trip rather than a text input. */
export type EditableProfile = Pick<
  Member,
  | "firstName"
  | "lastName"
  | "phone"
  | "birthday"
  | "city"
  | "dietaryNotes"
  | "instagram"
>;

export function memberInitials(m: Pick<Member, "firstName" | "lastName">) {
  const a = m.firstName.trim().charAt(0);
  const b = m.lastName.trim().charAt(0);
  return ((a + b).toUpperCase() || "T").slice(0, 2);
}

export function memberDisplayName(m: Pick<Member, "firstName">) {
  return m.firstName.trim();
}

export function memberSince(m: Pick<Member, "joinedAt">) {
  const d = new Date(m.joinedAt);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/* ---------------------------------------------------------------------
   Registration — created now, checkout later.

   Most fields are optional because external events genuinely do not
   supply them: when someone registers through Partiful we may know only
   that they intended to go. The brief is explicit — don't force
   unavailable fields, and don't fake history. A Registration with a null
   paymentStatus is a legitimate record of an external signup, not a
   broken row.
   --------------------------------------------------------------------- */

export const ATTENDANCE_STATUSES = [
  "REGISTERED",
  "ATTENDED",
  "NO_SHOW",
  "CANCELLED",
] as const;
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "FREE",
  "PENDING",
  "PAID",
  "REFUNDED",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export type Registration = {
  id: string;
  memberId: string;
  eventId: string;
  /* Free text for now ("General"). Becomes a real ticket-type reference
     when native ticketing lands. */
  ticketType?: string | null;
  quantity: number;
  /* All money in integer cents, matching lib/pricing.ts. Null for
     external events where we never handled the money. */
  originalPriceCents?: number | null;
  discountCents?: number | null;
  finalPriceCents?: number | null;
  registeredAt: string;
  paymentStatus?: PaymentStatus | null;
  attendanceStatus: AttendanceStatus;
  /* The code on a future QR ticket. Unused today. */
  confirmationCode?: string | null;
};

/* Dashboard buckets. Derived from data we hold rather than stored, so a
   registration cannot drift out of sync with the calendar. */
export type HistoryBucket = "upcoming" | "past" | "cancelled";

export function bucketFor(
  reg: Pick<Registration, "attendanceStatus">,
  eventStart: Date | null,
  now: Date = new Date(),
): HistoryBucket {
  if (reg.attendanceStatus === "CANCELLED") return "cancelled";
  if (!eventStart) return "upcoming";
  return eventStart.getTime() >= now.getTime() ? "upcoming" : "past";
}

/* "You've been to 7 Tiger Club experiences." Counts only what we can
   actually stand behind: attendance we recorded, or a past event the
   member was registered for. Never counts upcoming or cancelled. */
export function attendedCount(
  rows: { attendanceStatus: AttendanceStatus; bucket: HistoryBucket }[],
) {
  return rows.filter(
    (r) =>
      r.attendanceStatus === "ATTENDED" ||
      (r.bucket === "past" && r.attendanceStatus === "REGISTERED"),
  ).length;
}
