import { upcomingEvents, eventSlug } from "./events";

/** The next upcoming event, formatted for the homepage hero ("Nov 14"). */
export type NextUp = { href: string; title: string; date: string } | null;

export function nextUp(): NextUp {
  const e = upcomingEvents()[0];
  if (!e) return null;
  const month = e.month.charAt(0) + e.month.slice(1).toLowerCase();
  return { href: `/experiences/${eventSlug(e)}`, title: e.title, date: `${month} ${e.day}` };
}
