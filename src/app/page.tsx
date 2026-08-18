import type { Metadata } from "next";
import { SiteLayout } from "@/components/SiteLayout";
import { StoreButtons } from "@/components/StoreButtons";
import { FeatureCard, SectionHeading, Stat } from "@/components/marketing";
import { PixelLinkButton } from "@/components/ui";
import { FEATURES, STATS } from "@/lib/content";
import { LINKS } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  // Full-bleed banner sitting flush under the navbar, edge to edge.
  const hero = (
    <div className="relative w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/banner.webp"
        alt="TechRunners"
        width={920}
        height={430}
        className="pixelated block h-auto w-full"
      />
      {/* fade the bottom of the banner into the page background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(5,7,15,0.6) 55%, var(--color-ink) 78%)",
        }}
      />
    </div>
  );

  return (
    <SiteLayout active="/" hero={hero}>
      {/* ------------------------------------------------------------ Hero copy */}
      <section className="flex flex-col items-center pt-8 text-center">
        <span className="font-pixel mb-5 inline-flex items-center gap-2 border-2 border-magenta bg-magenta/10 px-3 py-2 text-[10px] uppercase tracking-widest text-magenta">
          <span className="h-2 w-2 bg-magenta blink" /> Futuristic Mobile MMO
        </span>
        <p className="max-w-2xl text-xl text-text/90 sm:text-2xl">
          Real-time action, guild battles, and global competition in a neon
          city. Team up, run Haven, and rise to the top.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <PixelLinkButton href="#download" variant="magenta" size="lg">
            ▶ Get the Game
          </PixelLinkButton>
          {LINKS.discord ? (
            <a
              href={LINKS.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="font-pixel inline-flex items-center justify-center gap-2 border-2 border-purple bg-ink-2/80 px-6 py-4 text-[13px] uppercase tracking-wider text-purple transition-all hover:bg-purple hover:text-ink"
            >
              Join Community
            </a>
          ) : (
            <PixelLinkButton href="/community" variant="ghost" size="lg">
              Join Community
            </PixelLinkButton>
          )}
        </div>
      </section>

      {/* -------------------------------------------------------- Features */}
      <section className="mt-20">
        <SectionHeading
          eyebrow="Game features"
          title="What sets TechRunners apart"
          subtitle="A living MMO built for fast fingers and tight crews."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <FeatureCard
              key={f.key}
              icon={f.icon}
              title={f.title}
              blurb={f.blurb}
              tone={f.tone}
            />
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------------- Stats */}
      <section className="mt-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {STATS.map((s) => (
            <Stat key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------- Download */}
      <section id="download" className="mt-20 scroll-mt-20">
        <SectionHeading
          eyebrow="Play free"
          title="Download TechRunners"
          subtitle="Available on Android, iOS and Steam. Jump in and take your first run."
        />
        <StoreButtons className="mt-2" />
      </section>
    </SiteLayout>
  );
}
