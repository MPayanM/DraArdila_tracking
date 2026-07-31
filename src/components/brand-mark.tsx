import { cn } from "@/lib/utils";

// Original vector mark — an abstract soundwave, fitting for a speech and
// swallowing therapy practice. Replaces the low-resolution raster logo,
// which was also being squished into square boxes across the app.
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
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      role="img"
      aria-label="Sandra Ardila"
    >
      <defs>
        <linearGradient id="brandMarkGradient" x1="2" y1="2" x2="38" y2="38">
          <stop offset="0%" stopColor="var(--brand-magenta)" />
          <stop offset="100%" stopColor="var(--brand-purple)" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#brandMarkGradient)" />
      <rect x="10" y="17" width="3.4" height="6" rx="1.7" fill="white" fillOpacity="0.9" />
      <rect x="16" y="12" width="3.4" height="16" rx="1.7" fill="white" />
      <rect x="22" y="8" width="3.4" height="24" rx="1.7" fill="white" />
      <rect x="28" y="14" width="3.4" height="12" rx="1.7" fill="white" fillOpacity="0.9" />
    </svg>
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
        <span className={cn("font-heading font-bold text-brand-purple-dark", textClassName)}>
          Sandra Ardila
        </span>
        {tagline && (
          <span className="text-xs font-medium text-ink-soft">Fonoaudióloga</span>
        )}
      </span>
    </span>
  );
}
