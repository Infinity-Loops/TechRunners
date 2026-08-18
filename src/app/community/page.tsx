import type { Metadata } from "next";
import { SiteLayout } from "@/components/SiteLayout";
import { FeatureCard, PageHero, SectionHeading } from "@/components/marketing";
import { SocialLinks } from "@/components/SocialLinks";
import { PixelLinkButton } from "@/components/ui";
import { LINKS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Join the TechRunners community — meet runners worldwide, form guilds, and compete in live events. Our Discord is the heart of it all.",
  alternates: { canonical: "/community" },
};

export default function CommunityPage() {
  return (
    <SiteLayout active="/community">
      <PageHero
        eyebrow="Join the community"
        title="Connect. Compete. Collaborate."
        subtitle="Meet fellow runners from around the world, join guilds, and take part in real-time events. Our community runs on teamwork, competition, and futuristic fun."
        tone="magenta"
      >
        {LINKS.discord ? (
          <a
            href={LINKS.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="font-pixel inline-flex items-center gap-2 border-2 border-purple bg-purple/10 px-6 py-4 text-[13px] uppercase tracking-wider text-purple transition-all hover:bg-purple hover:text-ink"
          >
            Join our Discord
          </a>
        ) : (
          <PixelLinkButton href="#download" variant="magenta" size="lg">
            ▶ Get the Game
          </PixelLinkButton>
        )}
      </PageHero>

      <section>
        <div className="grid gap-5 sm:grid-cols-3">
          <FeatureCard
            icon="chat"
            title="Connect"
            blurb="Find friends and rivals across the globe. Chat, team up, and swap strategies with runners who play like you."
            tone="neon"
          />
          <FeatureCard
            icon="medal"
            title="Compete"
            blurb="Enter live events and guild battles. Climb the leaderboards and earn bragging rights across every season."
            tone="magenta"
          />
          <FeatureCard
            icon="idcard"
            title="Collaborate"
            blurb="Build a guild, coordinate raids, and grow together. The best runs happen when a crew moves as one."
            tone="purple"
          />
        </div>
      </section>

      <section className="mt-16">
        <SectionHeading
          eyebrow="Community highlights"
          title="Where the runners gather"
          subtitle="Guild victories, epic PvP moments, and creative fan content — the Discord is the beating heart of TechRunners."
        />
        <div className="flex flex-col items-center gap-6">
          <SocialLinks />
        </div>
      </section>
    </SiteLayout>
  );
}
