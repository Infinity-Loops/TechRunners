import type { Metadata } from "next";
import Link from "next/link";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero, SectionHeading } from "@/components/marketing";
import { PixelLinkButton, PixelPanel } from "@/components/ui";
import { FAQ } from "@/lib/content";
import { SUPPORT_EMAIL, LINKS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Need help with TechRunners? Browse the FAQ, email support, or reach the team and community.",
  alternates: { canonical: "/support" },
};

export default function SupportPage() {
  return (
    <SiteLayout active="/support" width="narrow">
      <PageHero
        eyebrow="Need help?"
        title="TechRunners support"
        subtitle="Answers to common questions, plus direct ways to reach the team."
      >
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="font-pixel inline-flex items-center gap-2 border-2 border-neon bg-neon/10 px-6 py-4 text-[13px] uppercase tracking-wider text-neon transition-all hover:bg-neon hover:text-ink"
        >
          Email Support
        </a>
        <PixelLinkButton href="/contact" variant="magenta" size="lg">
          Contact Form
        </PixelLinkButton>
      </PageHero>

      {/* FAQ */}
      <section>
        <SectionHeading eyebrow="FAQ" title="Frequently asked" />
        <div className="flex flex-col gap-3">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group pixel-frame p-5 [&_summary]:cursor-pointer"
            >
              <summary className="font-pixel flex items-center justify-between gap-3 text-[12px] text-text marker:content-['']">
                <span>{item.q}</span>
                <span className="text-neon transition-transform group-open:rotate-90">
                  ▸
                </span>
              </summary>
              <p className="mt-3 text-lg leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* direct help */}
      <section className="mt-12">
        <PixelPanel tone="magenta" className="text-center">
          <h2 className="font-pixel text-sm neon-magenta">Still need help?</h2>
          <p className="mx-auto mt-3 max-w-lg text-lg text-text/90">
            Email us at{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-neon hover:underline">
              {SUPPORT_EMAIL}
            </a>
            {LINKS.discord ? " or ask the community on Discord." : "."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {LINKS.discord && (
              <a
                href={LINKS.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="font-pixel inline-flex items-center gap-2 border-2 border-purple bg-purple/10 px-6 py-3 text-[12px] uppercase tracking-wider text-purple transition-all hover:bg-purple hover:text-ink"
              >
                Join our Discord
              </a>
            )}
            <Link
              href="/report"
              className="font-pixel inline-flex items-center gap-2 border-2 border-line px-6 py-3 text-[12px] uppercase tracking-wider text-text transition-all hover:border-neon hover:text-neon"
            >
              Report a Bug
            </Link>
          </div>
        </PixelPanel>
      </section>
    </SiteLayout>
  );
}
