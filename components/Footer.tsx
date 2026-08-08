import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-paper">
      <div className="max-w-content mx-auto px-6 md:px-10 py-12 md:py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div className="flex items-center gap-2.5 text-ink">
          <span className="stripe-mark text-tiger">
            <span></span>
            <span></span>
            <span></span>
          </span>
          <span className="font-display text-lg">TIGER CLUB</span>
        </div>

        <p className="annotation text-xl order-3 md:order-2">go do something.</p>

        <div className="flex items-center gap-6 text-sm text-ink/70 order-2 md:order-3">
          <Link href="/events" className="hover:text-ink transition-colors">Experiences</Link>
          <a href="mailto:hello@atigercub.com" className="hover:text-ink transition-colors">Contact</a>
          <a
            href="https://discord.gg/6u83g4P8Cb"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-tiger transition-colors"
          >
            Discord
          </a>
        </div>
      </div>
      <div className="max-w-content mx-auto px-6 md:px-10 pb-8 text-xs text-ink/40">
        © {new Date().getFullYear()} Tiger Club, Atlanta.
      </div>
    </footer>
  );
}
