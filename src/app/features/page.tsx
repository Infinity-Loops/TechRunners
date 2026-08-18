import type { Metadata } from "next";
import { SiteLayout } from "@/components/SiteLayout";
import { StoreButtons } from "@/components/StoreButtons";
import { FeatureCard, PageHero, SectionHeading } from "@/components/marketing";
import { FEATURES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Explore TechRunners: real-time PvP, guild wars, tech upgrades, global leaderboards and a living neon MMO world.",
  alternates: { canonical: "/features" },
};

export default function FeaturesPage() {
  return (
    <SiteLayout active="/features">
      <PageHero
        eyebrow="Game features"
        title="Unleash the power of TechRunners"
        subtitle="The next generation of mobile MMO — real-time action, advanced tech upgrades, and global guild battles."
      />

      {/* core features */}
      <section>
        <SectionHeading
          eyebrow="Core features"
          title="What you'll master in Haven"
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

      {/* game in action */}
      <section className="mt-20">
        <SectionHeading
          eyebrow="Game in action"
          title="Welcome to Haven"
          subtitle="A vibrant, tech-driven city where every district is a new arena."
        />
        <figure className="pixel-frame overflow-hidden p-2">
          <div className="overflow-x-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/map-bg.webp"
              alt="The Haven city map from TechRunners"
              className="pixelated mx-auto block min-w-[720px] max-w-full"
            />
          </div>
          <figcaption className="mt-2 text-center text-base text-muted">
            Haven — the living world of TechRunners
          </figcaption>
        </figure>
      </section>

      {/* download */}
      <section id="download" className="mt-20 scroll-mt-20">
        <SectionHeading
          eyebrow="Ready to play?"
          title="Start your TechRunners journey"
          subtitle="Upgrade your tech, compete in real-time battles, and rise to the top."
        />
        <StoreButtons />
      </section>
    </SiteLayout>
  );
}
