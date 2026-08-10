// A full paw print — one main pad plus four toes — as opposed to
// ClawMark's three bare talons. This is what stamps down when the claw
// mark is clicked: the claw hints at the tiger, the paw confirms it.
export default function PawPrint({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <g fill="currentColor">
        <ellipse cx="32" cy="42" rx="16" ry="14" />
        <ellipse cx="13" cy="24" rx="7.2" ry="9" transform="rotate(-18 13 24)" />
        <ellipse cx="27" cy="14" rx="7.6" ry="9.6" transform="rotate(-6 27 14)" />
        <ellipse cx="42" cy="14" rx="7.6" ry="9.6" transform="rotate(6 42 14)" />
        <ellipse cx="55" cy="24" rx="7.2" ry="9" transform="rotate(18 55 24)" />
      </g>
    </svg>
  );
}
