"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { NAV } from "@/lib/site";
import { cn } from "./ui";

export function MobileNav({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);

  // lock scroll while the menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="font-pixel flex h-9 w-9 items-center justify-center border-2 border-neon text-neon"
      >
        {open ? "✕" : "≡"}
      </button>

      {open && (
        <div className="fixed inset-0 top-[57px] z-50 flex flex-col gap-1 border-t-2 border-line bg-ink/97 px-4 py-6 backdrop-blur">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "font-pixel border-2 px-4 py-4 text-xs uppercase tracking-wider",
                active === item.href
                  ? "border-neon text-neon"
                  : "border-line text-text"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/#download"
            onClick={() => setOpen(false)}
            className="font-pixel mt-2 border-2 border-magenta bg-magenta/10 px-4 py-4 text-center text-xs uppercase tracking-wider text-magenta"
          >
            ▶ Get the Game
          </Link>
        </div>
      )}
    </div>
  );
}
