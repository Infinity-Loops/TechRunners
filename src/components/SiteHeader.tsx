import Link from "next/link";
import { NAV } from "@/lib/site";
import { cn } from "./ui";
import { Emblem } from "./GameIcon";
import { MobileNav } from "./MobileNav";

export function SiteHeader({ active }: { active?: string }) {
  return (
    <header
      className="fixed inset-x-0 top-0 z-40 border-b border-line/70 bg-ink/85 backdrop-blur-sm"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-3 sm:px-4">
        <Link href="/" className="group flex min-w-0 items-center gap-2">
          <Emblem size={34} className="transition-transform group-hover:scale-110" />
          <span className="font-pixel hidden text-xs neon group-hover:brightness-125 min-[420px]:inline sm:text-sm">
            TECH<span className="neon-magenta">RUNNERS</span>
          </span>
        </Link>

        {/* desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "font-pixel px-3 py-2 text-[11px] uppercase tracking-wider transition-colors",
                active === item.href ? "text-neon" : "text-text hover:text-neon"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#download"
            className="font-pixel hidden border-2 border-magenta bg-magenta/10 px-4 py-2 text-[11px] uppercase tracking-wider text-magenta transition-all hover:bg-magenta hover:text-ink sm:inline-flex"
          >
            ▶ Get the Game
          </Link>
          <MobileNav active={active} />
        </div>
      </div>
    </header>
  );
}
