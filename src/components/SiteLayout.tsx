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
}: {
  children: ReactNode;
  active?: string;
  className?: string;
  width?: "default" | "narrow";
}) {
  return (
    <>
      <CityBackground />
      <SiteHeader active={active} />
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
