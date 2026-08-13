import Link from "next/link";
import TigerWordmark from "./TigerWordmark";

/* The five links were laid out as one flex row, which on a phone forced
   "Work With Us" to wrap onto three lines and pushed Discord past the
   edge. Mobile now gets its own structure — logo, then a two-column
   grid of links, then the sign-off and the copyright — while md and up
   keeps the original single row exactly as it was. */

const LINKS = [
  { label: "Experiences", href: "/events" },
  { label: "Work With Us", href: "/work-with-us" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "mailto:hello@atigercub.com", external: true },
  { label: "Discord", href: "https://discord.gg/6u83g4P8Cb", blank: true },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-paper">
      <div className="max-w-content mx-auto px-5 sm:px-6 md:px-10 py-10 md:py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div className="flex items-center text-ink">
          <TigerWordmark className="text-lg" />
        </div>

        <p className="annotation text-xl order-3 md:order-2">go do something.</p>

        {/* two columns on mobile, the original row from md up */}
        <div className="order-2 md:order-3 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-ink/80 md:flex md:items-center md:gap-6">
          {LINKS.map((l) =>
            l.blank ? (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="organic-underline whitespace-nowrap hover:text-tiger-text transition-colors"
              >
                {l.label}
              </a>
            ) : l.external ? (
              <a
                key={l.label}
                href={l.href}
                className="organic-underline whitespace-nowrap hover:text-ink transition-colors"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.label}
                href={l.href}
                className="organic-underline whitespace-nowrap hover:text-ink transition-colors"
              >
                {l.label}
              </Link>
            )
          )}
        </div>
      </div>
      <div className="max-w-content mx-auto px-5 sm:px-6 md:px-10 pb-8 text-xs text-ink/60">
        © {new Date().getFullYear()} Tiger Club LLC, Atlanta.
      </div>
    </footer>
  );
}
