import Link from "next/link";
import { NAV, LEGAL_NAV, DEVELOPER, SUPPORT_EMAIL } from "@/lib/site";
import { Emblem } from "./GameIcon";
import { SocialLinks } from "./SocialLinks";

export function SiteFooter() {
  const year = 2026;
  return (
    <footer className="mt-auto border-t border-line/70 bg-ink/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* brand */}
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-3">
            <Emblem size={36} />
            <span className="font-pixel text-sm neon">
              TECH<span className="neon-magenta">RUNNERS</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-lg text-muted">
            A futuristic mobile MMO — real-time PvP, guild wars, and a neon city
            to conquer. Be a runner. Stay a runner. Never stop running.
          </p>
          <SocialLinks className="mt-5" />
        </div>

        {/* explore */}
        <div>
          <h3 className="font-pixel text-[10px] uppercase tracking-wider text-neon">
            Explore
          </h3>
          <ul className="mt-4 flex flex-col gap-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-base text-muted hover:text-neon">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/report" className="text-base text-muted hover:text-neon">
                Report a Bug
              </Link>
            </li>
          </ul>
        </div>

        {/* legal + contact */}
        <div>
          <h3 className="font-pixel text-[10px] uppercase tracking-wider text-neon">
            Legal &amp; Contact
          </h3>
          <ul className="mt-4 flex flex-col gap-2">
            {LEGAL_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-base text-muted hover:text-neon">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className="text-base text-muted hover:text-neon">
                Contact
              </Link>
            </li>
            <li>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-base text-muted hover:text-neon">
                {SUPPORT_EMAIL}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line/50">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-center text-sm text-muted sm:flex-row sm:text-left">
          <p className="font-pixel text-[10px]">
            © {year} {DEVELOPER.name}
          </p>
          <p>{DEVELOPER.location} · Published by {DEVELOPER.name}</p>
        </div>
      </div>
    </footer>
  );
}
