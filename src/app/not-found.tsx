import { CityBackground } from "@/components/CityBackground";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PixelLinkButton } from "@/components/ui";
import { Emblem } from "@/components/GameIcon";

export default function NotFound() {
  return (
    <>
      <CityBackground />
      <SiteHeader />
      <div className="h-[var(--header-h)] flex-none" aria-hidden />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <Emblem size={72} className="float-slow" />

        <h1 className="font-pixel mt-8 text-5xl neon flicker sm:text-7xl">404</h1>

        <p className="font-pixel mt-4 text-sm neon-magenta uppercase tracking-widest">
          You ran off the map
        </p>

        <p className="mt-5 max-w-md text-xl text-text/90">
          This block isn&apos;t on the Haven grid. The page you&apos;re after
          moved, or never existed in this build.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <PixelLinkButton href="/" variant="primary" size="lg">
            ← Back to base
          </PixelLinkButton>
          <PixelLinkButton href="/report" variant="magenta" size="lg">
            Send Feedback
          </PixelLinkButton>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
