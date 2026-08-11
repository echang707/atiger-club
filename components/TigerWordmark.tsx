import Image from "next/image";

// The wordmark is the supplied artwork rather than type plus CSS stripes.
// The G carries real claw marks cut through the counter, which the old
// gradient reconstruction could only approximate, and the orange is the
// file's own #e0521c — untouched, never recoloured by a currentColor
// inherit or a filter.
//
// Sized by height so it drops into the existing call sites unchanged:
// Nav and Footer still pass a text-size class and the mark scales off it
// in `em`. Width comes from the artwork's own ratio (1281 x 167) so
// nothing reflows while the image loads.
const RATIO = 1286 / 609;

export default function TigerWordmark({
  className = "",
  heightEm = 1.9,
}: {
  className?: string;
  heightEm?: number;
}) {
  return (
    <span
      className={`inline-block align-middle ${className}`}
      role="img"
      aria-label="Tiger Club"
      style={{ height: `${heightEm}em`, width: `${heightEm * RATIO}em` }}
    >
      <Image
        src="/images/wordmark.webp"
        alt=""
        width={1286}
        height={609}
        priority
        className="h-full w-full object-contain"
      />
    </span>
  );
}
