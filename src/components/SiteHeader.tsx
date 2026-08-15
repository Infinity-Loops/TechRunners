import Link from "next/link";
import { cn } from "./ui";
import { Emblem } from "./GameIcon";

export function SiteHeader({ active }: { active?: "home" | "report" }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-ink/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:px-4">
        <Link href="/" className="group flex min-w-0 items-center gap-2">
          <Emblem size={34} className="transition-transform group-hover:scale-110" />
          <span className="font-pixel hidden text-xs neon group-hover:brightness-125 min-[420px]:inline sm:text-sm">
            TECH<span className="neon-magenta">RUNNERS</span>
          </span>
        </Link>

        <nav className="flex shrink-0 items-center gap-0.5 sm:gap-2">
          <NavLink href="/" label="Home" isActive={active === "home"} />
          <NavLink
            href="/report"
            label="Feedback"
            isActive={active === "report"}
          />
          <Link
            href="/admin"
            className="font-pixel px-2 py-2 text-[10px] uppercase tracking-wider text-muted transition-colors hover:text-neon sm:px-3 sm:text-[11px]"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "font-pixel px-2 py-2 text-[10px] uppercase tracking-wider transition-colors sm:px-3 sm:text-[11px]",
        isActive ? "text-neon" : "text-text hover:text-neon"
      )}
    >
      {label}
    </Link>
  );
}
