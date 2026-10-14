import type { Metadata } from "next";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Join Tiger Club",
  description:
    "Join Atlanta's social club. Get in the Discord to stay in the loop with the crew.",
};

const DISCORD_INVITE = "https://discord.gg/6u83g4P8Cb";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 pt-28 pb-24">

      {/* Eyebrow */}
      <div className="flex items-center gap-3 mb-8">
        <span className="block h-px w-8 bg-tiger" aria-hidden="true" />
        <span className="font-sans text-[11px] font-medium tracking-[0.18em] uppercase text-tiger">
          Atlanta's social club
        </span>
        <span className="block h-px w-8 bg-tiger" aria-hidden="true" />
      </div>

      {/* Heading */}
      <h1
        className="font-instrument italic font-normal text-center text-ink leading-[1.05] tracking-tight mb-5"
        style={{ fontSize: "clamp(2.8rem, 9vw, 5.5rem)" }}
      >
        Get in the club.
      </h1>

      {/* Sub */}
      <p className="max-w-[22rem] text-center text-ink/60 text-base leading-relaxed mb-14">
        The Discord is where the crew lives — group chats, event invites, and everything in between.
      </p>

      {/* Actions */}
      <div className="w-full max-w-md flex flex-col gap-3">

        {/* Discord — primary */}
        <a
          href={DISCORD_INVITE}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative overflow-hidden flex items-center gap-4 w-full rounded-2xl px-7 py-5 bg-ink text-paper transition-transform duration-200 hover:-translate-y-[2px] active:translate-y-0"
        >
          {/* orange fill slides up on hover */}
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-tiger-fill translate-y-full transition-transform duration-[340ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"
          />
          <DiscordLogo className="relative z-10 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
          <span className="relative z-10 flex flex-col">
            <span className="font-sans font-semibold text-[16px] leading-snug">Join the Discord</span>
            <span className="font-sans text-[13px] text-paper/50 group-hover:text-paper/70 transition-colors mt-0.5">Where the crew is</span>
          </span>
          <span
            aria-hidden="true"
            className="relative z-10 ml-auto font-sans text-lg text-paper/30 transition-all duration-200 group-hover:text-paper group-hover:translate-x-1"
          >
            →
          </span>
        </a>

        {/* Divider */}
        <div className="flex items-center gap-4 px-1 py-1">
          <div className="flex-1 h-px bg-ink/10" />
          <span className="font-sans text-[11px] tracking-[0.16em] uppercase text-ink/35">or</span>
          <div className="flex-1 h-px bg-ink/10" />
        </div>

        {/* Email */}
        <div className="rounded-2xl border border-ink/12 px-6 py-6">
          <p className="font-sans text-[13px] text-ink/45 mb-3">
            Get notified when new events drop — no spam, just the good stuff.
          </p>
          <NewsletterForm variant="footer" />
        </div>

      </div>
    </main>
  );
}

function DiscordLogo({ className }: { className?: string }) {
  return (
    <svg
      width="22"
      height="16"
      viewBox="0 0 24 18"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.317 1.492A19.825 19.825 0 0 0 15.985.236a.074.074 0 0 0-.079.037c-.174.31-.368.715-.503 1.033a18.3 18.3 0 0 0-5.403 0 10.492 10.492 0 0 0-.51-1.033.077.077 0 0 0-.079-.037A19.737 19.737 0 0 0 3.677 1.492a.07.07 0 0 0-.032.027C.533 6.093-.32 10.555.099 14.961a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.195 14.195 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 12.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}
