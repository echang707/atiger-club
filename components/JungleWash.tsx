// A transitional band of very faint jungle texture, used to soften the
// jump between the loud hero and the quiet cream body (and again before
// the finale). Purely decorative: no children, aria-hidden, no pointer
// events. Deliberately only used twice on the homepage.
export default function JungleWash({ late = false }: { late?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden pointer-events-none ${
        late ? "h-[110px] md:h-[150px]" : "h-[170px] md:h-[250px]"
      }`}
    >
      <div className={`jungle-wash ${late ? "jungle-wash-late" : ""}`} />
    </div>
  );
}
