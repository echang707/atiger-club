// A fragment of the tiger-marble entering from one outer edge of the page.
//
// This is the "accent" beat in the page's rhythm — the pattern reappearing
// briefly between two quiet cream sections so the eye is reminded of the
// hero without any section having to carry the full material again.
//
// Deliberately dumb: no copy, no children, no interactivity, aria-hidden,
// pointer-events none. It cuts on a diagonal and is masked so it dissolves
// long before it reaches the centre of the page, which is the rule that
// keeps busy markings away from anything anyone needs to read.
export default function MarbleWedge({
  side,
  className = "",
}: {
  side: "left" | "right";
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`relative w-full overflow-hidden h-[120px] md:h-[180px] lg:h-[216px] ${className}`}
    >
      <div className={`marble-wedge marble-wedge-${side}`} />
    </div>
  );
}
