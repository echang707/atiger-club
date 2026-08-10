// Three tapered talon shapes fanned from a shared pivot, like a light
// claw-rake — used as the small mark beside the wordmark instead of a
// generic bar or dot. Subtle by design: it should read as "a small
// mark" first and "a claw" only on a second look.
export default function ClawMark({ className = "h-6 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 30"
      className={className}
      aria-hidden="true"
    >
      <g fill="currentColor">
        <path
          d="M8,1 C10.2,0.6 11.6,2.4 11,5.2 C9.8,12.4 7.6,19.8 4.4,26.6 C4,27.4 2.9,27.2 3,26.3 C4.6,19 6.2,11.6 6.6,4.6 C6.7,2.6 6.6,1.3 8,1 Z"
          opacity="0.95"
          transform="rotate(-11 8 14)"
        />
        <path
          d="M8,1 C10.2,0.6 11.6,2.4 11,5.2 C9.8,12.4 7.6,19.8 4.4,26.6 C4,27.4 2.9,27.2 3,26.3 C4.6,19 6.2,11.6 6.6,4.6 C6.7,2.6 6.6,1.3 8,1 Z"
          opacity="0.72"
          transform="translate(11 1) rotate(-2 8 14) scale(0.88)"
        />
        <path
          d="M8,1 C10.2,0.6 11.6,2.4 11,5.2 C9.8,12.4 7.6,19.8 4.4,26.6 C4,27.4 2.9,27.2 3,26.3 C4.6,19 6.2,11.6 6.6,4.6 C6.7,2.6 6.6,1.3 8,1 Z"
          opacity="0.48"
          transform="translate(22 3) rotate(7 8 14) scale(0.72)"
        />
      </g>
    </svg>
  );
}
