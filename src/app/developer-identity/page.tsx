import type { Metadata } from "next";
import { SiteLayout } from "@/components/SiteLayout";
import { Prose } from "@/components/marketing";
import { DEVELOPER, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Developer Identity",
  description: `${SITE_NAME} is created and published by ${DEVELOPER.name}.`,
  alternates: { canonical: "/developer-identity" },
};

export default function DeveloperIdentityPage() {
  return (
    <SiteLayout width="narrow">
      <div className="py-12">
        <p className="font-pixel text-[10px] uppercase tracking-widest text-magenta">
          Developer Identity
        </p>
        <h1 className="font-pixel mt-3 text-lg neon sm:text-2xl">
          {DEVELOPER.name}
        </h1>

        <div className="pixel-frame mt-8 p-6">
          <Prose>
            <p>
              <strong>Contact email:</strong>{" "}
              <a href={`mailto:${DEVELOPER.email}`}>{DEVELOPER.email}</a>
            </p>
            <p>
              <strong>Location:</strong> {DEVELOPER.location}
            </p>
            <p>
              {DEVELOPER.name} is the creator and publisher of {SITE_NAME}. We
              are committed to transparency and compliance for all players and
              partners. For legal or business inquiries, please use the contact
              email above.
            </p>
          </Prose>
        </div>
      </div>
    </SiteLayout>
  );
}
