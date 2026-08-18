import type { Metadata } from "next";
import Link from "next/link";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero } from "@/components/marketing";
import { cn } from "@/components/ui";
import {
  LB_CATEGORIES,
  LB_TIMEFRAMES,
  fetchLeaderboard,
  isLeaderboardConfigured,
  isValidCategory,
  isValidTimeframe,
  type LeaderboardEntry,
} from "@/lib/leaderboard";

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "Live TechRunners global rankings — kills, 1v1 and 2v2 duel wins, and crew dominance, updated daily, weekly, monthly and all-time.",
  alternates: { canonical: "/leaderboard" },
};

// Rendered on demand; the UGS fetch is cached ~60s so scores stay fresh.
export const dynamic = "force-dynamic";

function rankTone(rank: number) {
  if (rank === 1) return "border-warn text-warn";
  if (rank === 2) return "border-neon text-neon";
  if (rank === 3) return "border-magenta text-magenta";
  return "border-line text-muted";
}

export default async function LeaderboardPage({
  searchParams,
}: PageProps<"/leaderboard">) {
  const sp = await searchParams;
  const category = isValidCategory(sp.category) ? sp.category : "kills";
  const timeframe = isValidTimeframe(sp.timeframe) ? sp.timeframe : "total";

  const configured = isLeaderboardConfigured();
  let entries: LeaderboardEntry[] = [];
  let loadError: string | null = null;
  // resolved after we know which boards actually have data
  let activeCategory: string = category;
  let activeTimeframe: string = timeframe;
  let availableCategories = [...LB_CATEGORIES];
  let availableTimeframes = [...LB_TIMEFRAMES];

  if (configured) {
    try {
      // Hide categories with no data at all (check their all-time board).
      const catCounts = await Promise.all(
        LB_CATEGORIES.map((c) =>
          fetchLeaderboard(`${c.key}-total`)
            .then((e) => e.length)
            .catch(() => 0)
        )
      );
      const cats = LB_CATEGORIES.filter((_, i) => catCounts[i] > 0);
      availableCategories = cats.length ? cats : [...LB_CATEGORIES];
      if (!availableCategories.some((c) => c.key === activeCategory)) {
        activeCategory = availableCategories[0].key;
      }

      // For the active category, hide timeframes with no scores yet.
      const tfLists = await Promise.all(
        LB_TIMEFRAMES.map((t) =>
          fetchLeaderboard(`${activeCategory}-${t.key}`).catch(
            () => [] as LeaderboardEntry[]
          )
        )
      );
      const byTimeframe = new Map<string, LeaderboardEntry[]>(
        LB_TIMEFRAMES.map((t, i) => [t.key, tfLists[i]])
      );
      const tfs = LB_TIMEFRAMES.filter(
        (t) => (byTimeframe.get(t.key)?.length ?? 0) > 0
      );
      availableTimeframes = tfs.length ? tfs : [...LB_TIMEFRAMES];

      // Land on a populated board: keep the request if it has data, else
      // prefer all-time, then the first available.
      if (!availableTimeframes.some((t) => t.key === activeTimeframe)) {
        activeTimeframe =
          availableTimeframes.find((t) => t.key === "total")?.key ??
          availableTimeframes[0].key;
      }
      entries = byTimeframe.get(activeTimeframe) ?? [];
    } catch (err) {
      loadError = err instanceof Error ? err.message : "Failed to load rankings.";
    }
  }

  const isCrewActive = activeCategory === "basing";
  const activeScoreLabel =
    LB_CATEGORIES.find((c) => c.key === activeCategory)?.scoreLabel ?? "Score";

  const href = (c: string, t: string) =>
    `/leaderboard?category=${c}&timeframe=${t}`;

  return (
    <SiteLayout active="/leaderboard" width="narrow">
      <PageHero
        eyebrow="Leaderboard"
        title="Global rankings"
        subtitle="See who runs Haven. Live standings straight from the game."
      />

      {/* category tabs — only categories with data */}
      <div className="flex flex-wrap justify-center gap-2">
        {availableCategories.map((c) => (
          <Link
            key={c.key}
            href={href(c.key, activeTimeframe)}
            aria-current={activeCategory === c.key ? "page" : undefined}
            className={cn(
              "font-pixel border-2 px-4 py-2 text-[11px] uppercase tracking-wider transition-colors",
              activeCategory === c.key
                ? "border-neon bg-neon/10 text-neon"
                : "border-line text-text hover:border-neon/60 hover:text-neon"
            )}
          >
            {c.label}
          </Link>
        ))}
      </div>

      {/* timeframe tabs — only periods with scores */}
      {availableTimeframes.length > 1 && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {availableTimeframes.map((t) => (
            <Link
              key={t.key}
              href={href(activeCategory, t.key)}
              aria-current={activeTimeframe === t.key ? "page" : undefined}
              className={cn(
                "font-pixel border-2 px-3 py-2 text-[10px] uppercase tracking-wider transition-colors",
                activeTimeframe === t.key
                  ? "border-magenta bg-magenta/10 text-magenta"
                  : "border-line text-muted hover:border-magenta/60 hover:text-magenta"
              )}
            >
              {t.label}
            </Link>
          ))}
        </div>
      )}

      {/* board */}
      <div className="mt-8">
        {!configured ? (
          <div className="pixel-frame-magenta pixel-frame p-6 text-center">
            <p className="font-pixel text-[11px] text-magenta">! Not configured</p>
            <p className="mt-2 text-base text-text/90">
              Set <code className="text-neon">UGS_PROJECT_ID</code> in the
              environment to show live rankings from Unity Gaming Services.
            </p>
          </div>
        ) : loadError ? (
          <div className="pixel-frame-magenta pixel-frame p-6 text-center">
            <p className="font-pixel text-[11px] text-magenta">
              ! Couldn&apos;t load the leaderboard
            </p>
            <p className="mt-2 text-base text-muted">{loadError}</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="pixel-frame p-10 text-center text-muted">
            <p className="font-pixel text-2xl neon">[ ]</p>
            <p className="font-pixel mt-4 text-[11px] uppercase tracking-wider">
              No scores yet
            </p>
            <p className="mt-2 text-base">Be the first to top this board in-game.</p>
          </div>
        ) : (
          <div className="pixel-frame p-3 sm:p-4">
            {/* header row */}
            <div className="flex items-center gap-3 border-b border-line/60 px-2 pb-2 text-[10px] uppercase tracking-wider text-muted">
              <span className="font-pixel w-10 shrink-0 text-center">#</span>
              <span className="font-pixel flex-1">{isCrewActive ? "Crew" : "Player"}</span>
              <span className="font-pixel shrink-0">{activeScoreLabel}</span>
            </div>

            <ol className="flex flex-col">
              {entries.map((e) => (
                <li
                  key={`${e.rank}-${e.name}`}
                  className="flex items-center gap-3 border-b border-line/30 px-2 py-3 last:border-0"
                >
                  <span
                    className={cn(
                      "font-pixel flex h-8 w-10 shrink-0 items-center justify-center border-2 text-[11px]",
                      rankTone(e.rank)
                    )}
                  >
                    {e.rank}
                  </span>
                  <span className="flex-1 truncate text-lg text-text" title={e.name}>
                    {e.name}
                  </span>
                  <span className="font-pixel shrink-0 text-[13px] neon">
                    {e.scoreDisplay}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}

        <p className="mt-4 text-center text-sm text-muted">
          Rankings update roughly every minute · top 50 shown
        </p>
      </div>
    </SiteLayout>
  );
}
