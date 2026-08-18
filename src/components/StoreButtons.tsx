import { LINKS } from "@/lib/site";
import { cn } from "./ui";

type Store = { key: string; label: string; sub: string; href: string; accent: string };

function stores(): Store[] {
  return [
    { key: "android", label: "Google Play", sub: "Android", href: LINKS.android, accent: "border-lime text-lime hover:bg-lime" },
    { key: "ios", label: "App Store", sub: "iOS · TestFlight", href: LINKS.ios, accent: "border-neon text-neon hover:bg-neon" },
    { key: "steam", label: "Steam", sub: "PC", href: LINKS.steam, accent: "border-purple text-purple hover:bg-purple" },
  ].filter((s) => s.href);
}

/** Row of store download buttons (only those configured are shown). */
export function StoreButtons({ className }: { className?: string }) {
  const list = stores();
  if (list.length === 0) {
    return (
      <p className={cn("font-pixel text-[11px] uppercase tracking-wider text-muted", className)}>
        Download links coming soon
      </p>
    );
  }
  return (
    <div className={cn("flex flex-wrap items-stretch justify-center gap-3", className)}>
      {list.map((s) => (
        <a
          key={s.key}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "group flex min-w-[150px] flex-col items-center gap-1 border-2 bg-ink-2/80 px-5 py-3 transition-all active:translate-y-0.5 hover:text-ink",
            s.accent
          )}
        >
          <span className="font-pixel text-[12px] uppercase tracking-wider">{s.label}</span>
          <span className="text-sm opacity-80 group-hover:opacity-100">{s.sub}</span>
        </a>
      ))}
    </div>
  );
}
