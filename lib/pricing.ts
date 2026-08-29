/* ---------------------------------------------------------------------
   Pricing. One module, one calculation.

   The brief's rule — "do not scatter pricing logic through UI
   components" — is enforced by shape here: components receive a
   PriceDisplay from `priceFor()` and render its fields. They never see a
   discount percentage and never do arithmetic.

   Money is handled in integer CENTS everywhere. Floating point dollars
   accumulate rounding error the moment a percentage is applied
   ($50 * 0.9 is 45.000000000000004), and a ticketing system that will
   eventually reconcile against Stripe cannot afford that. Formatting to
   "$45" happens at the very end, once.
   --------------------------------------------------------------------- */

import {
  hasMemberBenefits,
  memberDiscountPercentageFor,
  membershipConfig,
  type MemberStatus,
} from "./membership";

export type PriceInput = {
  /* Standard price in cents. 0 means free; null/undefined means the
     event has no structured price yet (most legacy events), in which
     case no pricing UI should render at all. */
  priceCents?: number | null;
  /* Per-event override of the global member discount. */
  memberDiscountPercentage?: number | null;
  /* An explicit member price in cents, when an event is priced by hand
     rather than by percentage — e.g. a partner set "$50 / $40". Takes
     precedence over any percentage. */
  memberPriceCents?: number | null;
};

export type PriceDisplay = {
  /* False for events with no structured price — render nothing. */
  hasPrice: boolean;
  isFree: boolean;
  standardCents: number;
  memberCents: number;
  savingCents: number;
  /* Whether a member price is actually different from standard. A 0%
     discount or a free event should not show a struck-through price. */
  showsMemberPrice: boolean;
  /* What THIS viewer pays, given their status. */
  viewerPaysCents: number;
  viewerIsMember: boolean;
  /* Preformatted strings, so components never call a formatter either. */
  standard: string;
  member: string;
  saving: string;
  viewerPays: string;
};

export function formatMoney(cents: number): string {
  const dollars = cents / 100;
  // Whole dollars read better in this brand's voice ("$45", not
  // "$45.00"), but cents must still show when they exist.
  const hasCents = cents % 100 !== 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  }).format(dollars);
}

/* Round half up on the DISCOUNT, not the price, so the member always
   gets at least the advertised percentage off rather than losing a cent
   to rounding. At 10% off $50 both routes agree; at 10% off $45.55 they
   do not, and erring toward the member is the right default for a club. */
function applyPercentage(cents: number, pct: number): number {
  const discount = Math.ceil((cents * pct) / 100);
  return Math.max(0, cents - discount);
}

export function priceFor(
  input: PriceInput,
  viewerStatus: MemberStatus | null | undefined,
): PriceDisplay {
  const standardCents = input.priceCents ?? 0;
  const hasPrice =
    input.priceCents !== null && typeof input.priceCents !== "undefined";
  const isFree = hasPrice && standardCents === 0;

  const memberCents =
    typeof input.memberPriceCents === "number"
      ? Math.min(input.memberPriceCents, standardCents)
      : applyPercentage(
          standardCents,
          memberDiscountPercentageFor(input.memberDiscountPercentage),
        );

  const savingCents = Math.max(0, standardCents - memberCents);
  const viewerIsMember = hasMemberBenefits(viewerStatus);
  const viewerPaysCents = viewerIsMember ? memberCents : standardCents;

  return {
    hasPrice,
    isFree,
    standardCents,
    memberCents,
    savingCents,
    showsMemberPrice: hasPrice && !isFree && savingCents > 0,
    viewerPaysCents,
    viewerIsMember,
    standard: formatMoney(standardCents),
    member: formatMoney(memberCents),
    saving: formatMoney(savingCents),
    viewerPays: formatMoney(viewerPaysCents),
  };
}

/* The one-line copy the brief specifies, assembled here rather than in
   JSX so the wording for logged-out vs member states stays consistent
   wherever prices appear. Returns null when there is nothing to say. */
export function priceCopy(p: PriceDisplay): {
  primary: string;
  secondary: string | null;
  showJoinCta: boolean;
} | null {
  if (!p.hasPrice) return null;
  if (p.isFree) return { primary: "Free", secondary: null, showJoinCta: false };

  if (p.viewerIsMember) {
    return {
      primary: p.member,
      secondary: p.showsMemberPrice ? `${p.standard} standard` : null,
      showJoinCta: false,
    };
  }

  return {
    primary: p.standard,
    secondary: p.showsMemberPrice
      ? `${p.member} for Tiger Club members`
      : null,
    showJoinCta: p.showsMemberPrice,
  };
}

export const joinCtaLabel = membershipConfig.joinCtaLabel;
