import type { ReactNode } from "react";
import { GameIcon, type GameIconName } from "./GameIcon";
import { cn } from "./ui";

/** Page hero: eyebrow label, title, subtitle, optional actions. */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
  tone = "neon",
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  tone?: "neon" | "magenta";
}) {
  return (
    <section className="py-12 text-center sm:py-16">
      <span
        className={cn(
          "font-pixel inline-flex items-center gap-2 border-2 px-3 py-2 text-[10px] uppercase tracking-widest",
          tone === "magenta"
            ? "border-magenta bg-magenta/10 text-magenta"
            : "border-neon bg-neon/10 text-neon"
        )}
      >
        {eyebrow}
      </span>
      <h1 className="font-pixel mx-auto mt-6 max-w-3xl text-lg leading-relaxed neon [overflow-wrap:anywhere] sm:text-2xl md:text-3xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mx-auto mt-5 max-w-2xl text-xl text-text/90">{subtitle}</p>
      )}
      {children && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {children}
        </div>
      )}
    </section>
  );
}

const TONE_TEXT: Record<string, string> = {
  neon: "text-neon",
  magenta: "text-magenta",
  purple: "text-purple",
  lime: "text-lime",
  warn: "text-warn",
};

/** Feature card with a game icon. */
export function FeatureCard({
  icon,
  title,
  blurb,
  tone = "neon",
}: {
  icon: GameIconName;
  title: string;
  blurb: string;
  tone?: string;
}) {
  return (
    <div className="pixel-frame flex flex-col p-6 transition-transform hover:-translate-y-1">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center border-2 border-line bg-ink-2">
          <GameIcon name={icon} size={30} />
        </div>
        <h3 className={cn("font-pixel text-sm", TONE_TEXT[tone] ?? "text-neon")}>
          {title}
        </h3>
      </div>
      <p className="mt-4 text-lg leading-relaxed text-muted">{blurb}</p>
    </div>
  );
}

/** Big section heading, centered. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto mb-8 max-w-2xl text-center">
      {eyebrow && (
        <p className="font-pixel text-[10px] uppercase tracking-widest text-magenta">
          {eyebrow}
        </p>
      )}
      <h2 className="font-pixel mt-3 text-base neon [overflow-wrap:anywhere] sm:text-lg md:text-xl">
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-lg text-muted">{subtitle}</p>}
    </div>
  );
}

/** A single stat tile. */
export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="pixel-frame flex flex-col items-center px-5 py-6 text-center">
      <span className="font-pixel text-2xl neon sm:text-3xl">{value}</span>
      <span className="mt-2 text-base uppercase tracking-wider text-muted">
        {label}
      </span>
    </div>
  );
}

/** Long-form content wrapper for legal/text pages. */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-5 text-lg leading-relaxed text-text/90 [&_h2]:font-pixel [&_h2]:mt-6 [&_h2]:text-sm [&_h2]:uppercase [&_h2]:tracking-wider [&_h2]:text-neon [&_a]:text-neon [&_a:hover]:underline [&_strong]:text-text">
      {children}
    </div>
  );
}
