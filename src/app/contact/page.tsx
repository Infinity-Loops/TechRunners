import type { Metadata } from "next";
import Link from "next/link";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/marketing";
import { SocialLinks } from "@/components/SocialLinks";
import { isSupabaseConfigured } from "@/lib/supabase";
import { SUPPORT_EMAIL, LINKS } from "@/lib/site";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the TechRunners team — questions, feedback, business, or support. We're here to help.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const configured = isSupabaseConfigured();

  return (
    <SiteLayout active="/support" width="narrow">
      <PageHero
        eyebrow="Get in touch"
        title="Contact TechRunners"
        subtitle="Questions, feedback, or business inquiries — reach out and our team will get back to you."
      />

      {!configured && (
        <div className="pixel-frame-magenta pixel-frame mb-6 p-4">
          <p className="font-pixel text-[11px] text-magenta">! Backend not configured</p>
          <p className="mt-2 text-base text-text/90">
            The contact form needs Supabase keys to save messages. Meanwhile,
            email us at{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-neon hover:underline">
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        </div>
      )}

      <ContactForm />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="pixel-frame p-5">
          <h2 className="font-pixel text-[11px] uppercase tracking-wider text-neon">
            Email us
          </h2>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="mt-3 block text-lg text-text hover:text-neon">
            {SUPPORT_EMAIL}
          </a>
          <p className="mt-2 text-base text-muted">
            For a bug with your device details,{" "}
            <Link href="/report" className="text-neon hover:underline">
              use the feedback form
            </Link>
            .
          </p>
        </div>
        <div className="pixel-frame p-5">
          <h2 className="font-pixel text-[11px] uppercase tracking-wider text-neon">
            Community
          </h2>
          <p className="mt-3 text-base text-muted">
            {LINKS.discord
              ? "The fastest answers come from the community and team on Discord."
              : "Follow along and reach us on social."}
          </p>
          <SocialLinks className="mt-4" />
        </div>
      </div>
    </SiteLayout>
  );
}
