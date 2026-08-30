"use client";

/* Discord lives here rather than in the nav bar for two reasons: it was
   the widest thing in the right-hand cluster, which is what pushed the
   centre links off the page's true centre; and it is an ongoing
   invitation rather than a navigation item, so it reads better as a
   persistent affordance than as a peer of "About".

   Bottom-LEFT on purpose. Bottom-right is where support widgets and
   cookie banners live, and it is also where a thumb rests on mobile —
   an accidental tap sending someone to Discord mid-scroll would be
   worse than the slightly unusual placement. */

import { useEffect, useState } from "react";

const DISCORD_URL = "https://discord.gg/6u83g4P8Cb";

export default function DiscordFab() {
  const [shown, setShown] = useState(false);

  // Hold it back until the hero has had its moment. Appearing instantly
  // on load competes with the headline animation.
  useEffect(() => {
    const t = setTimeout(() => setShown(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <a
      href={DISCORD_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Join our Discord"
      className={`fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full border-2 border-tiger-fill bg-tiger-fill py-2.5 pl-3 pr-4 text-[13px] font-semibold leading-none text-white shadow-sm transition-all duration-500 hover:border-tiger-deep hover:bg-tiger-deep md:bottom-6 md:left-6 md:text-[14px] ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px] shrink-0"
        fill="currentColor"
      >
        <path d="M20.317 4.369A19.79 19.79 0 0 0 15.432 3c-.21.375-.455.88-.623 1.283a18.27 18.27 0 0 0-5.618 0A12.6 12.6 0 0 0 8.56 3a19.74 19.74 0 0 0-4.886 1.372C.567 8.98-.278 13.475.145 17.9a19.9 19.9 0 0 0 6.073 3.077c.49-.67.927-1.383 1.302-2.13a12.9 12.9 0 0 1-2.05-.99c.172-.126.34-.258.502-.394a14.2 14.2 0 0 0 12.056 0c.164.14.332.272.502.394-.654.388-1.34.72-2.053.992.375.745.81 1.458 1.301 2.128a19.86 19.86 0 0 0 6.076-3.076c.5-5.163-.838-9.617-3.537-13.532ZM8.02 15.278c-1.182 0-2.156-1.086-2.156-2.42 0-1.332.955-2.42 2.156-2.42 1.21 0 2.176 1.096 2.156 2.42 0 1.334-.955 2.42-2.156 2.42Zm7.975 0c-1.183 0-2.157-1.086-2.157-2.42 0-1.332.955-2.42 2.157-2.42 1.21 0 2.176 1.096 2.156 2.42 0 1.334-.946 2.42-2.156 2.42Z" />
      </svg>
      <span>Join our Discord</span>
    </a>
  );
}
