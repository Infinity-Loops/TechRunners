import type { Metadata } from "next";
import Link from "next/link";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero, SectionHeading, Stat } from "@/components/marketing";
import { PixelLinkButton, PixelPanel } from "@/components/ui";
import { SocialLinks } from "@/components/SocialLinks";
import { STATS } from "@/lib/content";
import { DEVELOPER } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "TechRunners is a fast-paced mobile MMO set in a futuristic world — real-time action, guild battles and a thriving global community.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <SiteLayout active="/about">
      <PageHero
        eyebrow="About TechRunners"
        title="A new era of mobile MMO gaming"
        subtitle="An electrifying real-time action experience — guild battles, tech upgrades, and a global community, all in your pocket."
      >
        <PixelLinkButton href="/community" variant="primary" size="lg">
          Join the Community
        </PixelLinkButton>
        <PixelLinkButton href="/#download" variant="magenta" size="lg">
          ▶ Get the Game
        </PixelLinkButton>
      </PageHero>

      {/* mission */}
      <section className="mx-auto max-w-3xl">
        <PixelPanel>
          <div className="flex flex-col gap-4 text-lg leading-relaxed text-text/90">
            <p>
              TechRunners is a fast-paced mobile MMO where players compete in a
              futuristic world. Our mission is to deliver an electrifying
              real-time action experience — complete with guild battles,
              advanced tech upgrades, and a thriving global community.
            </p>
            <p>
              Whether you&apos;re a competitive player chasing the top of the
              leaderboard or a social explorer looking for a crew, TechRunners is
              built to bring people together for unforgettable runs through
              Haven.
            </p>
          </div>
        </PixelPanel>
      </section>

      {/* why choose + stats */}
      <section className="mt-16">
        <SectionHeading
          eyebrow="Why choose TechRunners"
          title="Unique features, global community"
          subtitle="Real-time PvP, a deep tech-upgrade system, and a welcoming community. TechRunners is more than a game — it's a movement."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {STATS.map((s) => (
            <Stat key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
      </section>

      {/* team */}
      <section className="mt-16">
        <div className="grid items-center gap-6 md:grid-cols-2">
          <PixelPanel tone="magenta">
            <h2 className="font-pixel text-sm neon-magenta">
              The team behind the game
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-text/90">
              Our crew is made up of MMO fans, tech enthusiasts, and creative
              minds. Together we blend expertise and imagination to craft a game
              that stands out in mobile multiplayer.
            </p>
          </PixelPanel>
          <PixelPanel>
            <h2 className="font-pixel text-sm neon">Built by {DEVELOPER.name}</h2>
            <p className="mt-4 text-lg leading-relaxed text-text/90">
              TechRunners is created and published by {DEVELOPER.name}, based in{" "}
              {DEVELOPER.location}. We&apos;re committed to transparency and
              compliance for every player and partner.
            </p>
            <Link
              href="/developer-identity"
              className="mt-4 inline-block text-base text-neon hover:underline"
            >
              Developer identity →
            </Link>
          </PixelPanel>
        </div>
        <div className="mt-8 flex justify-center">
          <SocialLinks />
        </div>
      </section>
    </SiteLayout>
  );
}
