import type { Metadata } from "next";
import { CityBackground } from "@/components/CityBackground";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PixelLinkButton } from "@/components/ui";
import { GameIcon } from "@/components/GameIcon";

export const metadata: Metadata = {
  title: "Thanks — TechRunners Playtest",
  robots: { index: false },
};

export default async function SuccessPage({
  searchParams,
}: PageProps<"/report/success">) {
  const { id } = await searchParams;
  const ref = typeof id === "string" && id ? id.slice(0, 8).toUpperCase() : null;

  return (
    <>
      <CityBackground />
      <SiteHeader />
      <div className="h-14 flex-none" aria-hidden />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <GameIcon name="trophy" size={72} className="float-slow" alt="Success" />
        <h1 className="font-pixel mt-6 text-lg neon sm:text-2xl">
          Thanks, runner!
        </h1>
        <p className="mt-4 max-w-lg text-xl text-text/90">
          Your feedback is in and the team will take a look. Every note from the
          playtest helps us make TechRunners better.
        </p>

        {ref && (
          <div className="pixel-frame mt-8 px-6 py-4">
            <p className="font-pixel text-[10px] uppercase tracking-wider text-muted">
              Reference
            </p>
            <p className="font-pixel mt-2 text-sm neon">#{ref}</p>
          </div>
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <PixelLinkButton href="/report" variant="magenta" size="lg">
            Send more
          </PixelLinkButton>
          <PixelLinkButton href="/" variant="ghost" size="lg">
            ← Back home
          </PixelLinkButton>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
