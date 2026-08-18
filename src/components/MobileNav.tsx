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

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center border-2 border-neon text-neon"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          {open ? (
            <>
              <line x1="3" y1="3" x2="13" y2="13" />
              <line x1="13" y1="3" x2="3" y2="13" />
            </>
          ) : (
            <>
              <line x1="2" y1="4" x2="14" y2="4" />
              <line x1="2" y1="8" x2="14" y2="8" />
              <line x1="2" y1="12" x2="14" y2="12" />
            </>
          )}
        </svg>
      </button>

      {/* Portaled to <body> so the fixed overlay escapes the header's
          backdrop-filter containing block and covers the whole viewport. */}
      {open &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-x-0 bottom-0 top-14 z-[70] flex flex-col gap-2 overflow-y-auto border-t-2 border-line px-4 py-6"
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
