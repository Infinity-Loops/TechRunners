import Link from "next/link";
import { CityBackground } from "@/components/CityBackground";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { GameIcon, type GameIconName } from "@/components/GameIcon";
import { PixelLinkButton, PixelPanel, cn } from "@/components/ui";

/**
 * Landing / playtest page. Server-rendered: download links come from
 * server-side env vars, so nothing about distribution is baked into the client
 * bundle beyond the final href.
 */

type Platform = {
  key: string;
  name: string;
  tagline: string;
  tag: string;
  href?: string;
  accent: "lime" | "primary" | "purple";
  cta: string;
};

function getPlatforms(): Platform[] {
  return [
    {
      key: "android",
      name: "Android",
      tagline: "Google Play / APK",
      tag: "AND",
      href: process.env.PLAYTEST_ANDROID_URL,
      accent: "lime",
      cta: "Start on Android",
    },
    {
      key: "ios",
      name: "iOS",
      tagline: "TestFlight",
      tag: "iOS",
      href: process.env.PLAYTEST_IOS_URL,
      accent: "primary",
      cta: "Start on iOS",
    },
    {
      key: "steam",
      name: "Steam / PC",
      tagline: "Playtest key",
      tag: "PC",
      href: process.env.PLAYTEST_STEAM_URL,
      accent: "purple",
      cta: "Play on Steam",
    },
  ];
}

const TAG_ACCENT: Record<Platform["accent"], string> = {
  lime: "text-lime border-lime",
  primary: "text-neon border-neon",
  purple: "text-purple border-purple",
};

const ACCENT_RING: Record<Platform["accent"], string> = {
  lime: "hover:border-lime/80 hover:shadow-[0_0_28px_rgba(157,255,91,0.18)]",
  primary: "hover:border-neon/80 hover:shadow-[0_0_28px_rgba(52,226,232,0.18)]",
  purple: "hover:border-purple/80 hover:shadow-[0_0_28px_rgba(139,108,255,0.18)]",
};

export default function HomePage() {
  const platforms = getPlatforms();

  return (
    <>
      <CityBackground />
      <SiteHeader active="home" />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16">
        {/* ---------------------------------------------------------- Hero */}
        <section className="flex flex-col items-center pt-10 text-center sm:pt-16">
          <span className="font-pixel mb-6 inline-flex items-center gap-2 border-2 border-magenta bg-magenta/10 px-3 py-2 text-[10px] uppercase tracking-widest text-magenta">
            <span className="h-2 w-2 bg-magenta blink" /> Playtest is LIVE
          </span>

          <div className="float-slow relative w-full max-w-3xl">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 blur-2xl"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(52,226,232,0.35), transparent)",
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/banner.webp"
              alt="TechRunners"
              width={920}
              height={430}
              className="pixelated mx-auto w-full drop-shadow-[0_0_25px_rgba(52,226,232,0.25)]"
            />
          </div>

          <p className="mt-6 max-w-2xl text-xl text-text/90 sm:text-2xl">
            You&apos;re one of the first to hit the streets of Haven. Jump in,
            play the build, and tell us how it feels — your feedback shapes the
            launch.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <PixelLinkButton href="#playtest" variant="primary" size="lg">
              ▶ Join the Playtest
            </PixelLinkButton>
            <PixelLinkButton href="/report" variant="magenta" size="lg">
              Share Feedback
            </PixelLinkButton>
          </div>
        </section>

        {/* ---------------------------------------------------- Playtest CTAs */}
        <section id="playtest" className="mt-16 scroll-mt-20">
          <div className="mb-6 text-center">
            <h2 className="font-pixel text-lg neon sm:text-xl">
              Pick your platform
            </h2>
            <p className="mt-2 text-lg text-muted">
              Grab the build, then come back and tell us how your run went.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {platforms.map((p) => (
              <div
                key={p.key}
                className={cn(
                  "pixel-frame flex flex-col items-center gap-4 p-6 text-center transition-all",
                  ACCENT_RING[p.accent]
                )}
              >
                <div
                  className={cn(
                    "font-pixel flex h-14 w-14 items-center justify-center border-2 text-xs",
                    TAG_ACCENT[p.accent]
                  )}
                >
                  {p.tag}
                </div>
                <div>
                  <h3 className="font-pixel text-sm text-text">{p.name}</h3>
                  <p className="mt-1 text-base text-muted">{p.tagline}</p>
                </div>
                {p.href ? (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "font-pixel mt-auto inline-flex w-full items-center justify-center border-2 bg-ink-2/80 px-4 py-3 text-[11px] uppercase tracking-wider transition-all active:translate-y-0.5",
                      p.accent === "lime" &&
                        "border-lime text-lime hover:bg-lime hover:text-ink",
                      p.accent === "primary" &&
                        "border-neon text-neon hover:bg-neon hover:text-ink",
                      p.accent === "purple" &&
                        "border-purple text-purple hover:bg-purple hover:text-ink"
                    )}
                  >
                    {p.cta}
                  </a>
                ) : (
                  <span className="font-pixel mt-auto inline-flex w-full items-center justify-center border-2 border-line bg-white/5 px-4 py-3 text-[10px] uppercase tracking-wider text-muted">
                    Coming soon
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------- What to test */}
        <section className="mt-16">
          <div className="grid gap-5 md:grid-cols-3">
            <InfoCard
              step="01"
              icon="map"
              title="Play a run"
              body="Boot the build, jump into Haven, and just play. Explore the modes, the store, matchmaking — take it all in."
            />
            <InfoCard
              step="02"
              icon="chat"
              title="Notice something"
              body="Loved a moment, or something felt off? Got an idea to make it better? Grab a screenshot or clip while it's fresh."
            />
            <InfoCard
              step="03"
              icon="trophy"
              title="Send it over"
              body="Add your device and what you saw, attach the media, and send. We read every piece of feedback."
            />
          </div>
        </section>

        {/* ------------------------------------------------- Big report CTA */}
        <section className="mt-16">
          <PixelPanel tone="magenta" className="text-center">
            <h2 className="font-pixel text-base neon-magenta sm:text-lg">
              Got feedback from your run?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-lg text-text/90">
              Praise, ideas, or something that tripped you up — every note makes
              the next build better. It takes about two minutes.
            </p>
            <div className="mt-6 flex justify-center">
              <PixelLinkButton href="/report" variant="magenta" size="lg">
                Share Your Feedback
              </PixelLinkButton>
            </div>
            <p className="mt-4 text-sm text-muted">
              Are you a dev on the team?{" "}
              <Link href="/admin" className="text-neon hover:underline">
                Open the admin panel →
              </Link>
            </p>
          </PixelPanel>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

function InfoCard({
  step,
  icon,
  title,
  body,
}: {
  step: string;
  icon: GameIconName;
  title: string;
  body: string;
}) {
  return (
    <div className="pixel-frame p-5">
      <div className="flex items-center justify-between">
        <span className="font-pixel text-2xl neon">{step}</span>
        <GameIcon name={icon} size={40} />
      </div>
      <h3 className="font-pixel mt-3 text-sm text-text">{title}</h3>
      <p className="mt-2 text-lg leading-relaxed text-muted">{body}</p>
    </div>
  );
}
