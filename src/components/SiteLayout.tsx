import type { ReactNode } from "react";
import { CityBackground } from "./CityBackground";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { cn } from "./ui";

/** Standard marketing-page shell: background, header, main, footer. */
export function SiteLayout({
  children,
  active,
  className,
  width = "default",
  hero,
}: {
  children: ReactNode;
  active?: string;
  className?: string;
  width?: "default" | "narrow";
  /** Full-bleed content rendered edge-to-edge between the header and main. */
  hero?: ReactNode;
}) {
  return (
    <>
      <CityBackground />
      <SiteHeader active={active} />
      {/* spacer for the fixed header */}
      <div className="h-14 flex-none" aria-hidden />
      {hero && <div className="w-full flex-none overflow-hidden">{hero}</div>}
      <main
        className={cn(
          "mx-auto w-full flex-1 px-4 pb-20",
          width === "narrow" ? "max-w-3xl" : "max-w-6xl",
          className
        )}
      >
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
