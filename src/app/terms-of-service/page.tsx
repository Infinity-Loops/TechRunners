import type { Metadata } from "next";
import { SiteLayout } from "@/components/SiteLayout";
import { Prose } from "@/components/marketing";
import { SITE_NAME, DEVELOPER, SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The Terms of Service for ${SITE_NAME}.`,
  alternates: { canonical: "/terms-of-service" },
};

const UPDATED = "August 18, 2026";

export default function TermsPage() {
  return (
    <SiteLayout width="narrow">
      <div className="py-12">
        <p className="font-pixel text-[10px] uppercase tracking-widest text-magenta">
          Legal
        </p>
        <h1 className="font-pixel mt-3 text-lg neon sm:text-2xl">
          Terms of Service
        </h1>
        <p className="mt-3 text-base text-muted">Last updated: {UPDATED}</p>

        <div className="pixel-frame mt-8 p-6">
          <Prose>
            <p>
              Welcome to {SITE_NAME}. By accessing or playing {SITE_NAME}, you
              agree to these Terms of Service. Please read them carefully to
              understand your rights and obligations as a player.
            </p>

            <h2>1. Account Registration &amp; Security</h2>
            <p>
              You may need to create an account to access certain features. Keep
              your login credentials secure and do not share your account. You
              are responsible for all activity that occurs under your account.
            </p>

            <h2>2. User Conduct</h2>
            <p>
              Play fair and respect other players. Do not use cheats, hacks, or
              exploit bugs. Harassment, hate speech, and toxic behavior are
              strictly prohibited. We may suspend or ban accounts for violations.
            </p>

            <h2>3. Acceptable &amp; Prohibited Use</h2>
            <p>
              You may not use {SITE_NAME} for unlawful purposes, attempt to
              disrupt the game, reverse-engineer the app, or harm other users.
              Selling, transferring, or trading accounts is not allowed.
            </p>

            <h2>4. Virtual Items &amp; Purchases</h2>
            <p>
              Any in-game currency, cosmetics, or upgrades are licensed, not
              sold, and have no real-world monetary value. Purchases are handled
              by the app store you downloaded from and are subject to their
              refund policies.
            </p>

            <h2>5. Liability &amp; Disclaimers</h2>
            <p>
              {SITE_NAME} is provided &ldquo;as is&rdquo; without warranties of
              any kind. We are not liable for lost progress, third-party actions,
              or damages resulting from gameplay. We may update or change game
              features at any time.
            </p>

            <h2>6. Changes &amp; Contact</h2>
            <p>
              We may update these Terms from time to time. Continued use of{" "}
              {SITE_NAME} after changes means you accept the updated Terms. For
              questions, contact us at{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
            </p>

            <p>
              {SITE_NAME} is published by {DEVELOPER.name}, {DEVELOPER.location}.
            </p>
          </Prose>
        </div>
      </div>
    </SiteLayout>
  );
}
