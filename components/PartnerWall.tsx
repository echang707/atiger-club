import { partners } from "@/lib/partners";

/* Two rows of partner logos drifting in opposite directions.
   Each row is rendered twice so the loop is seamless. With reduced
   motion, the CSS turns this into a plain wrapping grid. */
export default function PartnerWall() {
  const half = Math.ceil(partners.length / 2);
  const rows = [partners.slice(0, half), partners.slice(half)];

  return (
    <section aria-labelledby="partners-title" className="pw mb-16 md:mb-20">
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

      <div className="pw-wall">
        {rows.map((row, i) => (
          <ul key={i} className={`pw-row ${i % 2 ? "pw-row--rev" : ""}`} role="list">
            {[0, 1].map((copy) => (
              <li key={copy} className="pw-set" aria-hidden={copy === 1 || undefined}>
                {row.map((p) => {
                  const img = (
                    <img
                      src={`/partners/${p.slug}.webp`}
                      alt={copy === 0 ? p.name : ""}
                      width={480}
                      height={480}
                      loading="lazy"
                      decoding="async"
                    />
                  );
                  return p.url ? (
                    <a
                      key={p.slug}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pw-tile"
                      title={p.name}
                      aria-label={copy === 0 ? `${p.name} (opens in a new tab)` : undefined}
                      tabIndex={copy === 1 ? -1 : undefined}
                    >
                      {img}
                    </a>
                  ) : (
                    <span key={p.slug} className="pw-tile" title={p.name}>
                      {img}
                    </span>
                  );
                })}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
