"use client";

/* The single place a price appears on screen. It does no arithmetic —
   lib/pricing.ts hands it finished strings and it renders them. That is
   what keeps the discount out of the components, per the brief.

   Renders nothing at all for events with no structured price, which is
   every event today. Nothing about the current site changes until a
   priceCents is added to an event. */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMember } from "./MemberProvider";
import { priceCopy, priceFor } from "@/lib/pricing";
import { joinCtaLabel } from "@/lib/pricing";
import type { TigerEvent } from "@/lib/events";

export default function MemberPrice({
  event,
  className = "",
}: {
  event: Pick<
    TigerEvent,
    "priceCents" | "memberDiscountPercentage" | "memberPriceCents"
  >;
  className?: string;
}) {
  const { status, loading } = useMember();
  const pathname = usePathname();

  const copy = priceCopy(
    priceFor(
      {
        priceCents: event.priceCents,
        memberDiscountPercentage: event.memberDiscountPercentage,
        memberPriceCents: event.memberPriceCents,
      },
      status,
    ),
  );

  if (!copy) return null;

  // While the session is resolving, show the standard price only. The
  // alternative — rendering "Join free" and then yanking it away a
  // moment later for a signed-in member — reads as a glitch.
  const settled = !loading;

  return (
    <div className={className}>
      <span className="text-[15px] font-semibold text-ink">{copy.primary}</span>
      {settled && copy.secondary ? (
        <span className="ml-2 text-[14px] text-ink/60">{copy.secondary}</span>
      ) : null}
      {settled && copy.showJoinCta ? (
        <Link
          href={`/join?next=${encodeURIComponent(pathname || "/events")}`}
          className="organic-underline ml-2 text-[14px] font-semibold text-tiger-text"
        >
          {joinCtaLabel}
        </Link>
      ) : null}
    </div>
  );
}
