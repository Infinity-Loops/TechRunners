import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeader } from "@/components/AdminHeader";
import { Badge } from "@/components/ui";
import { GameIcon } from "@/components/GameIcon";
import {
  PLATFORMS,
  PROBLEM_AREAS,
  SEVERITIES,
  STATUSES,
  labelFor,
  optionFor,
} from "@/lib/constants";
import { listReports, reportStats, type ReportFilters } from "@/lib/reports";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { Report } from "@/lib/types";

export const metadata: Metadata = {
  title: "Reports — TechRunners Admin",
  robots: { index: false },
};

// Always render fresh — this is a live triage view.
export const dynamic = "force-dynamic";

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Stat({ label, value, tone = "neon" }: { label: string; value: number; tone?: string }) {
  return (
    <div className="pixel-frame flex flex-col items-center px-4 py-3">
      <span className={`font-pixel text-xl ${tone === "magenta" ? "neon-magenta" : "neon"}`}>
        {value}
      </span>
      <span className="mt-1 text-center text-[11px] uppercase tracking-wider text-muted">
        {label}
      </span>
    </div>
  );
}

export default async function AdminDashboard({
  searchParams,
}: PageProps<"/admin">) {
  const sp = await searchParams;
  const filters: ReportFilters = {
    status: typeof sp.status === "string" ? sp.status : undefined,
    platform: typeof sp.platform === "string" ? sp.platform : undefined,
    problem_area: typeof sp.area === "string" ? sp.area : undefined,
    severity: typeof sp.severity === "string" ? sp.severity : undefined,
    q: typeof sp.q === "string" ? sp.q : undefined,
  };

  if (!isSupabaseConfigured()) {
    return (
      <>
        <AdminHeader />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16">
          <div className="pixel-frame-magenta pixel-frame p-6 text-center">
            <p className="font-pixel text-sm text-magenta">Backend not configured</p>
            <p className="mt-3 text-lg text-text/90">
              Add <code className="text-neon">SUPABASE_URL</code> and{" "}
              <code className="text-neon">SUPABASE_SERVICE_ROLE_KEY</code> to your
              environment, then run the SQL in{" "}
              <code className="text-neon">supabase/schema.sql</code>. See the README.
            </p>
          </div>
        </main>
      </>
    );
  }

  let reports: Report[] = [];
  let stats = { total: 0, byStatus: {} as Record<string, number> };
  let loadError: string | null = null;
  try {
    [reports, stats] = await Promise.all([listReports(filters), reportStats()]);
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Failed to load reports.";
  }

  return (
    <>
      <AdminHeader active="/admin" />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-6">
        <h1 className="font-pixel flex items-center gap-3 text-base neon sm:text-lg">
          <GameIcon name="chart" size={28} />
          Bug Reports
        </h1>

        {/* stats */}
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
          <Stat label="Total" value={stats.total} />
          <Stat label="New" value={stats.byStatus.new ?? 0} tone="magenta" />
          <Stat label="Triaged" value={stats.byStatus.triaged ?? 0} />
          <Stat label="In progress" value={stats.byStatus.in_progress ?? 0} />
          <Stat label="Resolved" value={stats.byStatus.resolved ?? 0} />
          <Stat label="Won't fix" value={stats.byStatus.wont_fix ?? 0} />
        </div>

        {/* filters (native GET form — fully SSR, no client JS) */}
        <form className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <input
            name="q"
            defaultValue={filters.q ?? ""}
            placeholder="Search title / device…"
            className="pixel-input lg:col-span-2"
          />
          <FilterSelect name="status" label="Status" options={STATUSES} value={filters.status} />
          <FilterSelect name="platform" label="Platform" options={PLATFORMS} value={filters.platform} />
          <FilterSelect name="area" label="Area" options={PROBLEM_AREAS} value={filters.problem_area} />
          <FilterSelect name="severity" label="Severity" options={SEVERITIES} value={filters.severity} />
          <div className="flex gap-2 sm:col-span-2 lg:col-span-6">
            <button type="submit" className="font-pixel border-2 border-neon bg-neon/10 px-4 py-2 text-[11px] uppercase tracking-wider text-neon hover:bg-neon hover:text-ink">
              Apply
            </button>
            <Link href="/admin" className="font-pixel border-2 border-line px-4 py-2 text-[11px] uppercase tracking-wider text-muted hover:border-neon hover:text-neon">
              Reset
            </Link>
          </div>
        </form>

        {loadError && (
          <div className="pixel-frame-magenta pixel-frame mt-6 p-4">
            <p className="font-pixel text-[11px] text-magenta">! {loadError}</p>
          </div>
        )}

        {/* list */}
        <div className="mt-6">
          {reports.length === 0 && !loadError ? (
            <div className="pixel-frame p-10 text-center text-muted">
              <p className="font-pixel text-2xl neon">[ ]</p>
              <p className="font-pixel mt-4 text-[11px] uppercase tracking-wider">
                No reports match
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {reports.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/admin/${r.id}`}
                    className="group grid grid-cols-12 items-center gap-3 border-2 border-line bg-panel/60 px-4 py-3 transition-colors hover:border-neon/70"
                  >
                    <div className="col-span-12 sm:col-span-6">
                      <div className="flex items-center gap-2">
                        <Badge tone={optionFor(SEVERITIES, r.severity)?.tone}>
                          {labelFor(SEVERITIES, r.severity).split(" ")[0]}
                        </Badge>
                        <span className="truncate text-lg text-text group-hover:text-neon">
                          {r.title}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
                        <span>{labelFor(PROBLEM_AREAS, r.problem_area)}</span>
                        {r.device_model && <span>· {r.device_model}</span>}
                        {r.attachments?.length > 0 && (
                          <span className="text-neon">[{r.attachments.length} media]</span>
                        )}
                      </div>
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <Badge tone={optionFor(PLATFORMS, r.platform)?.tone}>
                        {labelFor(PLATFORMS, r.platform)}
                      </Badge>
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <Badge tone={optionFor(STATUSES, r.status)?.tone}>
                        {labelFor(STATUSES, r.status)}
                      </Badge>
                    </div>
                    <div className="col-span-4 text-right text-sm text-muted sm:col-span-2">
                      {fmtDate(r.created_at)}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}

function FilterSelect({
  name,
  label,
  options,
  value,
}: {
  name: string;
  label: string;
  options: readonly { value: string; label: string }[];
  value?: string;
}) {
  return (
    <select name={name} defaultValue={value ?? ""} aria-label={label} className="pixel-input">
      <option value="">{label}: all</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
