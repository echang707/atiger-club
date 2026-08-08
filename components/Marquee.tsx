import { categories } from "@/lib/events";

export default function Marquee() {
  const words = categories.map((c) => c.name);
  const loop = [...words, ...words];

  return (
    <div className="relative w-full overflow-hidden border-y border-stone-dark py-6 md:py-8 bg-ivory">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((set) => (
          <div key={set} className="flex items-center shrink-0">
            {loop.map((word, i) => (
              <span
                key={`${set}-${i}`}
                className="font-display italic text-3xl md:text-5xl text-ink/15 px-6 md:px-10 shrink-0"
              >
                {word}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
