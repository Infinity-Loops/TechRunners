import type { Metadata } from "next";
import { SiteLayout } from "@/components/SiteLayout";
import { Prose } from "@/components/marketing";
import { SITE_NAME, DEVELOPER, SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} and ${DEVELOPER.name} collect, use and protect your data.`,
  alternates: { canonical: "/privacy-policy" },
};

const UPDATED = "August 18, 2026";

export default function PrivacyPolicyPage() {
  return (
    <SiteLayout width="narrow">
      <div className="py-12">
        <p className="font-pixel text-[10px] uppercase tracking-widest text-magenta">
          Legal
        </p>
        <h1 className="font-pixel mt-3 text-lg neon sm:text-2xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-base text-muted">Last updated: {UPDATED}</p>

        <div className="pixel-frame mt-8 p-6">
          <Prose>
            <p>
              This Privacy Policy explains how {DEVELOPER.name}
              (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects, uses, and protects
              information when you use the {SITE_NAME} game and this website.
            </p>

            <h2>1. Information We Collect</h2>
            <p>
              <strong>Information you provide.</strong> When you contact us or
              submit feedback, we collect the details you enter — such as your
              name, email address, message, and any screenshots or clips you
              choose to attach to a bug report.
            </p>
            <p>
              <strong>Game &amp; account data.</strong> If you play {SITE_NAME},
              we may process an account identifier, in-game progress, and
              gameplay activity needed to run the multiplayer experience.
            </p>
            <p>
              <strong>Technical data.</strong> To diagnose issues we may collect
              device model, operating system, app version, and general
              connection information, along with your browser&apos;s user-agent
              when you submit a form.
            </p>

            <h2>2. How We Use Information</h2>
            <p>
              We use the information to operate and improve {SITE_NAME}, respond
              to your questions and support requests, reproduce and fix bugs,
              maintain fair play and security, and communicate important updates.
            </p>

            <h2>3. How Information Is Stored &amp; Shared</h2>
            <p>
              Form submissions and uploaded media are stored securely using our
              infrastructure providers (including Supabase for database and file
              storage, and Vercel for hosting). Uploaded media is kept in a
              private store and is not publicly accessible. We do not sell your
              personal information. We share data only with service providers who
              help us run the game, or when required by law.
            </p>

            <h2>4. Cookies</h2>
            <p>
              The public website does not use tracking or advertising cookies. A
              single secure, session cookie is used only for our internal admin
              area and is never set for regular visitors.
            </p>

            <h2>5. Data Retention</h2>
            <p>
              We keep submissions for as long as needed to resolve your request
              and improve the game, then delete or anonymize them. You can ask us
              to delete your data at any time (see &ldquo;Your Rights&rdquo;).
            </p>

            <h2>6. Children&apos;s Privacy</h2>
            <p>
              {SITE_NAME} is not directed to children under 13, and we do not
              knowingly collect personal information from them. If you believe a
              child has provided us information, contact us and we will remove it.
            </p>

            <h2>7. Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of your
              personal information by emailing{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. Depending
              on your location, you may have additional rights under laws such as
              the GDPR or CCPA.
            </p>

            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Material
              changes will be reflected by the &ldquo;Last updated&rdquo; date
              above.
            </p>

            <h2>9. Contact</h2>
            <p>
              Questions about privacy? Email{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> or{" "}
              <a href={`mailto:${DEVELOPER.email}`}>{DEVELOPER.email}</a>.
              {" "}
              {DEVELOPER.name}, {DEVELOPER.location}.
            </p>
          </Prose>
        </div>
      </div>
    </SiteLayout>
  );
}
