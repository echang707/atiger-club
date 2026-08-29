/* ---------------------------------------------------------------------
   Membership: who someone is to Tiger Club, and what that gets them.

   Everything configurable about member benefits lives HERE. No component
   should ever contain a discount number — if you find yourself typing
   "10" or "0.9" in a .tsx file, it belongs in this file instead.
   --------------------------------------------------------------------- */

/* The full set of statuses the data model supports. Only "guest" and
   "member" are reachable today; the rest exist so that adding paid
   membership, hosts or staff later is a data change, not a migration.

   Deliberately a flat status rather than a role array: the MVP has one
   axis (how much of the club are you part of), and inventing a
   permissions system before there is anything to permission would be
   the kind of enterprise complexity the brief rules out. When a member
   genuinely needs to be BOTH a paid member and an event host, that is
   the moment to split this into tier + roles. */
export const MEMBER_STATUSES = [
  "guest",
  "member",
  "paid_member",
  "founding_member",
  "volunteer",
  "event_host",
  "staff",
  "admin",
] as const;

export type MemberStatus = (typeof MEMBER_STATUSES)[number];

/* Statuses that actually exist in the product today. Signup assigns
   "member"; everything else is set by hand until there is a flow that
   creates it. Used to keep the UI honest about what it can render. */
export const LIVE_MEMBER_STATUSES: MemberStatus[] = ["guest", "member"];

/* Which statuses count as "in the club" for benefit purposes. Paid and
   founding members are listed now so that when they become reachable
   they inherit member pricing automatically rather than silently paying
   full price because someone forgot to update a condition. */
const BENEFIT_BEARING: MemberStatus[] = [
  "member",
  "paid_member",
  "founding_member",
  "volunteer",
  "event_host",
  "staff",
  "admin",
];

export function hasMemberBenefits(status: MemberStatus | null | undefined) {
  return status ? BENEFIT_BEARING.includes(status) : false;
}

/* ---------------------------------------------------------------------
   The benefit configuration itself.

   `defaultMemberDiscountPercentage` is the global lever. An individual
   event can override it with its own `memberDiscountPercentage` (see
   lib/events.ts) — for example a partner event where the partner will
   only honour 5%, or a members-go-free night at 100.
   --------------------------------------------------------------------- */
export type MembershipConfig = {
  defaultMemberDiscountPercentage: number;
  /* Shown on the dashboard and on event pages. Copy lives here so it can
     be changed without touching components. */
  benefitHeadline: string;
  benefitLines: string[];
  joinCtaLabel: string;
};

export const membershipConfig: MembershipConfig = {
  defaultMemberDiscountPercentage: 10,
  benefitHeadline: "Members save on Tiger Club experiences.",
  benefitLines: ["Member pricing on Tiger Club experiences."],
  joinCtaLabel: "Join free",
};

/* Resolve the discount that applies to a specific event. Kept as a
   function rather than read inline so the precedence rule — per-event
   override beats global default — exists in exactly one place. */
export function memberDiscountPercentageFor(eventOverride?: number | null) {
  const pct =
    typeof eventOverride === "number"
      ? eventOverride
      : membershipConfig.defaultMemberDiscountPercentage;
  // Guard rails: a bad value in data should not produce a negative price
  // or a discount that quietly does nothing.
  return Math.min(100, Math.max(0, pct));
}
