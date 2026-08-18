"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { NAV } from "@/lib/site";
import { cn } from "./ui";

export function MobileNav({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

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

      {/* Portaled to <body> so the fixed overlay escapes the header's
          backdrop-filter containing block and covers the whole viewport. */}
      {open &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-x-0 bottom-0 top-[57px] z-[70] flex flex-col gap-2 overflow-y-auto border-t-2 border-line px-4 py-6"
            style={{ backgroundColor: "var(--color-ink)" }}
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "font-pixel border-2 px-4 py-4 text-xs uppercase tracking-wider transition-colors",
                  active === item.href
                    ? "border-neon bg-neon/10 text-neon"
                    : "border-line text-text hover:border-neon/60"
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
          </div>,
          document.body
        )}
    </div>
  );
}
