import { cn } from "@/lib/utils";

// Fixed brand hexes (not CSS vars) so the mark renders identically
// regardless of light/dark theme — a logo shouldn't invert itself.
const PURPLE_DARK = "#3C2A72";
const MAGENTA = "#C3287D";
const PERIWINKLE = "#B9AEE8";

// A cochlea-like inward coil, traced as a polyline of small segments —
// smooth enough at icon sizes without hand-fitting bezier control points.
function spiralPath(
  cx: number,
  cy: number,
  turns: number,
  startRadius: number,
  steps: number
): string {
  const points: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * turns * Math.PI * 2 - Math.PI / 2;
    const radius = startRadius * Math.pow(1 - t, 1.15);
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    points.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return points.join(" ");
}

const COCHLEA_SPIRAL = spiralPath(50, 43, 2, 16, 110);

export function BrandIcon({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      role="img"
      aria-label="Sandra Ardila"
    >
      <defs>
        <clipPath id="squircleClip">
          <rect x="0" y="0" width="100" height="100" rx="22" ry="22" />
        </clipPath>
      </defs>
      <g clipPath="url(#squircleClip)">
        <rect x="0" y="0" width="50" height="50" fill={PURPLE_DARK} />
        <rect x="50" y="0" width="50" height="50" fill={MAGENTA} />
        <rect x="0" y="50" width="50" height="50" fill={PERIWINKLE} />
        <rect x="50" y="50" width="50" height="50" fill={PERIWINKLE} />
      </g>
      <path
        d={COCHLEA_SPIRAL}
        stroke="white"
        strokeWidth={4.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 36 68 Q 50 78 64 68"
        stroke="white"
        strokeWidth={4.2}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// "sandrardila" = "sandra" + "ardila" merged on the shared "a" (index 5).
function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-heading font-bold text-brand-purple-dark", className)}>
      sandr
      <span className="text-brand-magenta">a</span>
      rdila
    </span>
  );
}

export function BrandMark({
  size = 40,
  textClassName,
  tagline,
  className,
}: {
  size?: number;
  textClassName?: string;
  tagline?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <BrandIcon size={size} />
      <span className="flex flex-col leading-tight">
        <Wordmark className={textClassName} />
        {tagline && (
          <span className="text-xs font-medium text-brand-magenta-soft">
            Centro de audición y equilibrio
          </span>
        )}
      </span>
    </span>
  );
}
