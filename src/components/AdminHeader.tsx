import Link from "next/link";
import { LogoutButton } from "./LogoutButton";
import { Emblem } from "./GameIcon";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-ink/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:px-4">
        <Link href="/admin" className="flex min-w-0 items-center gap-2">
          <Emblem size={34} />
          <span className="font-pixel hidden text-xs neon min-[420px]:inline sm:text-sm">
            ADMIN<span className="text-muted"> · </span>
            <span className="neon-magenta">CONSOLE</span>
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className="font-pixel px-2 py-2 text-[10px] uppercase tracking-wider text-muted transition-colors hover:text-neon sm:px-3"
          >
            View site
          </Link>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
