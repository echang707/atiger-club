/*
 * One slice of the site's tiger-marble backdrop, sized to sit behind a
 * single section. It never paints at one flat strength: a CSS mask
 * fades the pattern from fully visible at the section's own outer
 * edges down to nothing across a "quiet" band the width of that
 * section's text column, so the marble reads as thinning out toward
 * the copy rather than as a rectangle dropped in behind it. Small
 * radial boosts in the four corners keep those spots — and the seams
 * between stacked sections — a little richer than a straight left/right
 * fade would on its own.
 *
 * `contain` is the px width of the content column being protected —
 * pass it the same number as the section's own max-w so the quiet band
 * lines up with where the words actually sit. On a wide window that
 * leaves generous margin for the pattern to show in; on a narrow one
 * there's almost no margin left once `contain` is subtracted, so the
 * visible strip collapses toward nothing by itself — that's what makes
 * the mobile behaviour more aggressive without a separate breakpoint.
 *
 * `rich` skips the masking for spots that are already empty — the gap
 * dividers between sections — so the pattern can sit at full, un-quieted
 * strength there instead.
 */
export default function MarbleField({
  contain = 1200,
  variant = "light",
  rich = false,
  opacity,
  corners = true,
  className = "",
}: {
  contain?: number;
  variant?: "light" | "dark";
  rich?: boolean;
  opacity?: number;
  corners?: boolean;
  className?: string;
}) {
  const patternId = variant === "dark" ? "tiger-marble-invert" : "tiger-marble";
  const baseOpacity = opacity ?? (rich ? 0.62 : 0.4);

  const edgeFade = `linear-gradient(to right,
    white 0,
    transparent calc(50% - ${contain / 2}px),
    transparent calc(50% + ${contain / 2}px),
    white 100%)`;

  const cornerFade = `,
    radial-gradient(150px 130px at 0% 0%, white, transparent 70%),
    radial-gradient(150px 130px at 100% 0%, white, transparent 70%),
    radial-gradient(150px 130px at 0% 100%, white, transparent 70%),
    radial-gradient(150px 130px at 100% 100%, white, transparent 70%)`;

  const maskImage = rich ? undefined : edgeFade + (corners ? cornerFade : "");

  return (
    <div
      aria-hidden="true"
      data-stripe-ignore
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{
        opacity: baseOpacity,
        WebkitMaskImage: maskImage,
        maskImage,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
      }}
    >
      <svg className="h-full w-full" preserveAspectRatio="none">
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}
