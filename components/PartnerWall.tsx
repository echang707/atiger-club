import { partners, type Partner } from "@/lib/partners";

/* Partner logos. On phones and tablets they drift as one row; on wide
   screens they sit as a static grid beside the form. Every logo appears
   exactly once in each layout. */

function Tile({ p, fluid, hidden, label }: { p: Partner; fluid?: boolean; hidden?: boolean; label?: boolean }) {
  const cls = `pw-tile${fluid ? " pw-tile--fluid" : ""}`;
  const img = (
    <img
      src={`/partners/${p.slug}.webp`}
      alt={label ? p.name : ""}
      width={480}
      height={480}
      loading="lazy"
      decoding="async"
    />
  );
  if (!p.url) {
    return (
      <span className={cls} title={p.name}>
        {img}
      </span>
    );
  }
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cls}
      title={p.name}
      aria-label={label ? `${p.name} (opens in a new tab)` : undefined}
      tabIndex={hidden ? -1 : undefined}
    >
      {img}
    </a>
  );
}

export default function PartnerWall() {
  return (
    <section aria-labelledby="partners-title" className="pw mb-16 md:mb-20 lg:mb-0 lg:flex lg:flex-col">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <p className="font-mono text-xs tracking-wideish uppercase text-tiger-text mb-2">
            our partners
          </p>
          <h2 id="partners-title" className="font-display text-2xl md:text-3xl text-ink leading-tight">
            built with the crews around Atlanta.
          </h2>
        </div>
        <p className="text-sm text-ink/60 max-w-xs">
          Hosts, makers and neighbors we&rsquo;ve shared a table with.
        </p>
      </div>

      {/* Phones and tablets: one drifting row */}
      <div className="pw-wall lg:hidden">
        <ul className="pw-row" role="list">
          {[0, 1].map((copy) => (
            <li key={copy} className="pw-set" aria-hidden={copy === 1 || undefined}>
              {partners.map((p) => (
                <Tile key={p.slug} p={p} hidden={copy === 1} label={copy === 0} />
              ))}
            </li>
          ))}
        </ul>
      </div>

      {/* Wide screens: every logo once, in a static grid */}
      <ul className="pw-grid hidden lg:flex" role="list">
        {partners.map((p) => (
          <li key={p.slug} className="pw-grid-item">
            <Tile p={p} fluid label />
          </li>
        ))}
      </ul>
    </section>
  );
}
