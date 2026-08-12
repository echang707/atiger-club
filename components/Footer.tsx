import Link from "next/link";
import TigerWordmark from "./TigerWordmark";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-paper">
      <div className="max-w-content mx-auto px-6 md:px-10 py-12 md:py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div className="flex items-center text-ink">
          <TigerWordmark className="text-lg" />
        </div>

        <p className="annotation text-xl order-3 md:order-2">go do something.</p>

        <div className="flex items-center gap-6 text-sm text-ink/80 order-2 md:order-3">
          <Link href="/events" className="organic-underline hover:text-ink transition-colors">Experiences</Link>
          <Link href="/work-with-us" className="organic-underline hover:text-ink transition-colors">Work With Us</Link>
          <Link href="/about" className="hover:text-tiger-text transition-colors">About</Link>
          <a href="mailto:hello@atigercub.com" className="organic-underline hover:text-ink transition-colors">Contact</a>
          <a
            href="https://discord.gg/6u83g4P8Cb"
            target="_blank"
            rel="noopener noreferrer"
            className="organic-underline hover:text-tiger-text transition-colors"
          >
            Discord
          </a>
        </div>
      </div>
      <div className="max-w-content mx-auto px-6 md:px-10 pb-8 text-xs text-ink/60">
        © {new Date().getFullYear()} Tiger Club LLC, Atlanta.
      </div>
    </footer>
  );
}
