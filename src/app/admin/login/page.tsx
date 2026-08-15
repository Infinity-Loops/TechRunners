import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CityBackground } from "@/components/CityBackground";
import { isAdmin } from "@/lib/session";
import { Emblem } from "@/components/GameIcon";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin — TechRunners",
  robots: { index: false },
};

export default async function AdminLoginPage({
  searchParams,
}: PageProps<"/admin/login">) {
  // Already signed in? Skip straight through.
  if (await isAdmin()) redirect("/admin");

  const { next } = await searchParams;
  const target = typeof next === "string" && next.startsWith("/admin") ? next : "/admin";

  return (
    <>
      <CityBackground />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-6 text-center">
            <Emblem size={64} className="mx-auto" />
            <h1 className="font-pixel mt-4 text-sm neon sm:text-base">
              TECHRUNNERS
            </h1>
            <p className="font-pixel mt-2 text-[10px] uppercase tracking-widest text-muted">
              Admin Access
            </p>
          </div>

          <div className="pixel-frame p-6">
            <LoginForm next={target} />
          </div>

          <p className="mt-6 text-center text-sm text-muted">
            Playtesters — you probably want the{" "}
            <a href="/report" className="text-neon hover:underline">
              feedback form
            </a>
            .
          </p>
        </div>
      </main>
    </>
  );
}
