import type { Metadata } from "next";
import { CityBackground } from "@/components/CityBackground";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { isSupabaseConfigured } from "@/lib/supabase";
import { ReportForm } from "./ReportForm";

export const metadata: Metadata = {
  title: "Playtest Feedback",
  description: "Tell us how your run went. Attach screenshots and clips.",
  alternates: { canonical: "/report" },
};

export default function ReportPage() {
  const configured = isSupabaseConfigured();

  return (
    <>
      <CityBackground />
      <SiteHeader active="report" />
      <div className="h-[var(--header-h)] flex-none" aria-hidden />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16">
        <div className="py-8 text-center">
          <span className="font-pixel inline-flex items-center gap-2 border-2 border-neon bg-neon/10 px-3 py-2 text-[10px] uppercase tracking-widest text-neon">
            Playtest Feedback
          </span>
          <h1 className="font-pixel mt-5 text-lg neon sm:text-2xl">
            Tell us how it played
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-text/90">
            Anything from your run — what clicked, what didn&apos;t, or an idea
            to make it better. Only the title, area and description are required;
            the rest just helps us.
          </p>
        </div>

        {!configured && (
          <div className="pixel-frame-magenta pixel-frame mb-6 p-4">
            <p className="font-pixel text-[11px] text-magenta">
              ! Backend not configured
            </p>
            <p className="mt-2 text-base text-text/90">
              Reports can&apos;t be saved until Supabase keys are added to the
              environment. You can still explore the form. See the project
              README for setup.
            </p>
          </div>
        )}

        <ReportForm />
      </main>

      <SiteFooter />
    </>
  );
}
