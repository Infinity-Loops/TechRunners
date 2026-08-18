import Link from "next/link";
import { LogoutButton } from "./LogoutButton";
import { Emblem } from "./GameIcon";
import { cn } from "./ui";

const ADMIN_NAV = [
  { href: "/admin", label: "Reports" },
  { href: "/admin/messages", label: "Messages" },
];

export function AdminHeader({ active }: { active?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-ink/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:px-4">
        <Link href="/admin" className="flex min-w-0 items-center gap-2">
          <Emblem size={34} />
          <span className="font-pixel hidden text-xs neon min-[420px]:inline sm:text-sm">
            ADMIN
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "font-pixel px-2 py-2 text-[10px] uppercase tracking-wider transition-colors sm:px-3 sm:text-[11px]",
                active === item.href ? "text-neon" : "text-text hover:text-neon"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className="font-pixel hidden px-3 py-2 text-[10px] uppercase tracking-wider text-muted transition-colors hover:text-neon sm:inline"
          >
            View site
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
