import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { Option } from "@/lib/constants";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------ Badge */

const TONE_CLASSES: Record<NonNullable<Option["tone"]>, string> = {
  neon: "text-neon border-neon/70 bg-neon/10",
  magenta: "text-magenta border-magenta/70 bg-magenta/10",
  purple: "text-purple border-purple/70 bg-purple/10",
  lime: "text-lime border-lime/70 bg-lime/10",
  warn: "text-warn border-warn/70 bg-warn/10",
  danger: "text-danger border-danger/70 bg-danger/10",
  muted: "text-muted border-line bg-white/5",
};

export function Badge({
  children,
  tone = "muted",
  className,
}: {
  children: ReactNode;
  tone?: Option["tone"];
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-pixel inline-flex items-center gap-1 border px-2 py-1 text-[10px] uppercase tracking-wider",
        TONE_CLASSES[tone ?? "muted"],
        className
      )}
    >
      {children}
    </span>
  );
}

/* ----------------------------------------------------------- PixelButton */

type Variant = "primary" | "magenta" | "ghost" | "danger" | "lime";
type Size = "md" | "lg";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "text-neon border-neon shadow-[0_0_0_2px_#05070f,0_0_18px_rgba(52,226,232,0.35)] hover:bg-neon hover:text-ink",
  magenta:
    "text-magenta border-magenta shadow-[0_0_0_2px_#05070f,0_0_18px_rgba(255,63,164,0.35)] hover:bg-magenta hover:text-ink",
  lime: "text-lime border-lime shadow-[0_0_0_2px_#05070f,0_0_18px_rgba(157,255,91,0.3)] hover:bg-lime hover:text-ink",
  danger:
    "text-danger border-danger shadow-[0_0_0_2px_#05070f,0_0_18px_rgba(255,84,112,0.3)] hover:bg-danger hover:text-ink",
  ghost: "text-text border-line hover:border-neon hover:text-neon",
};

const SIZE_CLASSES: Record<Size, string> = {
  md: "px-4 py-2 text-[11px]",
  lg: "px-6 py-4 text-[13px]",
};

export function pixelButtonClass(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string
) {
  return cn(
    "font-pixel inline-flex items-center justify-center gap-2 border-2 bg-ink-2/80 uppercase tracking-wider leading-none",
    "transition-all duration-100 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-ink-2/80 disabled:hover:text-inherit cursor-pointer select-none",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className
  );
}

type LinkButtonProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
};

/** A neon pixel CTA rendered as a Next <Link>. */
export function PixelLinkButton({
  variant = "primary",
  size = "md",
  className,
  ...props
}: LinkButtonProps) {
  return <Link className={pixelButtonClass(variant, size, className)} {...props} />;
}

/* ------------------------------------------------------------- PixelPanel */

export function PixelPanel({
  children,
  className,
  tone = "neon",
}: {
  children: ReactNode;
  className?: string;
  tone?: "neon" | "magenta";
}) {
  return (
    <div
      className={cn(
        "pixel-frame p-5 sm:p-6",
        tone === "magenta" && "pixel-frame-magenta",
        className
      )}
    >
      {children}
    </div>
  );
}

/** Section heading with a pixel accent bar and optional game icon. */
export function SectionTitle({
  children,
  hint,
  icon,
}: {
  children: ReactNode;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      {icon ? (
        icon
      ) : (
        <span className="h-4 w-2 bg-neon shadow-[0_0_10px_var(--color-neon)]" />
      )}
      <h2 className="font-pixel text-sm text-text uppercase tracking-wider">
        {children}
      </h2>
      {hint && <span className="text-muted text-base">{hint}</span>}
    </div>
  );
}
