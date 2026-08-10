export default function TigerWordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`tiger-wordmark inline-flex items-baseline font-wordmark font-extrabold tracking-tight ${className}`}
      aria-label="Tiger Club"
    >
      <span>TI</span>
      <span className="tiger-wordmark-g" aria-hidden="true">G</span>
      <span>ER&nbsp;&nbsp;CLUB</span>
    </span>
  );
}
