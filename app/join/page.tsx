import type { Metadata } from "next";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Join Tiger Club",
  description:
    "Join our Discord community and be first to hear about Atlanta experiences.",
};

/* TODO: Replace with your real Discord invite link */
const DISCORD_INVITE = "https://discord.gg/6u83g4P8Cb";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 pt-32 pb-24">

      {/* Heading */}
      <div className="text-center max-w-md mx-auto">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink mb-4 leading-tight">
          Join Tiger Club
        </h1>
        <p className="text-ink/65 text-base sm:text-lg leading-relaxed">
          Atlanta's social club. Get in the Discord to stay in the loop with
          the crew, or drop your email and we'll let you know when new
          experiences drop.
        </p>
      </div>

      {/* Discord — primary CTA */}
      <div className="mt-10 w-full max-w-sm">
        <a
          href={DISCORD_INVITE}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full rounded-full bg-[#5865F2] hover:bg-[#4752C4] active:bg-[#3C45A5] transition-colors px-8 py-4 text-white font-semibold text-[17px]"
        >
          <DiscordLogo aria-hidden={true} />
          Join the Discord
        </a>
      </div>

      {/* Divider */}
      <div className="mt-10 mb-8 flex items-center gap-4 w-full max-w-sm">
        <div className="flex-1 h-px bg-ink/10" />
        <span className="text-ink/40 text-sm font-medium tracking-wide">or</span>
        <div className="flex-1 h-px bg-ink/10" />
      </div>

      {/* Email list — secondary */}
      <div className="w-full max-w-sm">
        <p className="text-center text-sm text-ink/55 mb-4">
          Get notified when new events drop — no spam, just the good stuff.
        </p>
        <NewsletterForm variant="footer" />
      </div>

    </main>
  );
}

function DiscordLogo({ "aria-hidden": ariaHidden }: { "aria-hidden"?: true }) {
  return (
    <svg
      width="22"
      height="16"
      viewBox="0 0 24 18"
      fill="currentColor"
      aria-hidden={ariaHidden}
    >
      <path d="M20.317 1.492A19.825 19.825 0 0 0 15.985.236a.074.074 0 0 0-.079.037c-.174.31-.368.715-.503 1.033a18.3 18.3 0 0 0-5.403 0 10.492 10.492 0 0 0-.51-1.033.077.077 0 0 0-.079-.037A19.737 19.737 0 0 0 3.677 1.492a.07.07 0 0 0-.032.027C.533 6.093-.32 10.555.099 14.961a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.195 14.195 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 12.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}
