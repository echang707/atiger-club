import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-stone-dark bg-ivory">
      <div className="max-w-content mx-auto px-6 md:px-10 py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div className="flex items-center gap-2.5 text-ink">
          <span className="stripe-mark text-amber-deep">
            <span></span>
            <span></span>
            <span></span>
          </span>
          <span className="font-display text-lg">Tiger Club</span>
        </div>

        <p className="text-sm text-ink/50 max-w-sm order-3 md:order-2">
          A social club creating experiences worth sharing — and people worth knowing.
        </p>

        <div className="flex items-center gap-6 text-sm text-ink/70 order-2 md:order-3">
          <Link href="/events" className="hover:text-ink transition-colors">Experiences</Link>
          <a href="mailto:hello@atigerclub.com" className="hover:text-ink transition-colors">Contact</a>
          <a href="#" className="hover:text-ink transition-colors">Instagram</a>
        </div>
      </div>
      <div className="max-w-content mx-auto px-6 md:px-10 pb-8 text-xs text-ink/40">
        © {new Date().getFullYear()} Tiger Club. Made for the ones who show up.
      </div>
    </footer>
  );
}
