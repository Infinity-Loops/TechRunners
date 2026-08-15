import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/AdminHeader";
import { DeleteReportForm } from "@/components/DeleteReportForm";
import { Badge } from "@/components/ui";
import {
  FREQUENCIES,
  NETWORK_TYPES,
  PLATFORMS,
  PROBLEM_AREAS,
  SEVERITIES,
  STATUSES,
  labelFor,
  optionFor,
} from "@/lib/constants";
import { getReport, signAttachments } from "@/lib/reports";
import type { SignedAttachment } from "@/lib/types";
import {
  deleteReportAction,
  saveNotesAction,
  updateStatusAction,
} from "../actions";

export const metadata: Metadata = { robots: { index: false } };
export const dynamic = "force-dynamic";

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1 border-b border-line/50 py-2 sm:flex-row sm:gap-4">
      <dt className="font-pixel w-48 shrink-0 text-[10px] uppercase tracking-wider text-muted">
        {label}
      </dt>
      <dd className="whitespace-pre-wrap text-lg text-text">{value}</dd>
    </div>
  );
}

export default async function ReportDetail({ params }: PageProps<"/admin/[id]">) {
  const { id } = await params;
  const report = await getReport(id);
  if (!report) notFound();

  const media: SignedAttachment[] = await signAttachments(report.attachments);
  const created = new Date(report.created_at).toLocaleString();

  return (
    <>
      <AdminHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-16 pt-6">
        <Link
          href="/admin"
          className="font-pixel text-[11px] uppercase tracking-wider text-muted hover:text-neon"
        >
          ← All reports
        </Link>

        {/* header */}
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={optionFor(SEVERITIES, report.severity)?.tone}>
                {labelFor(SEVERITIES, report.severity)}
              </Badge>
              <Badge tone={optionFor(PLATFORMS, report.platform)?.tone}>
                {labelFor(PLATFORMS, report.platform)}
              </Badge>
              <Badge tone={optionFor(PROBLEM_AREAS, report.problem_area)?.tone}>
                {labelFor(PROBLEM_AREAS, report.problem_area)}
              </Badge>
              <Badge tone={optionFor(STATUSES, report.status)?.tone}>
                {labelFor(STATUSES, report.status)}
              </Badge>
            </div>
            <h1 className="font-pixel mt-3 text-base text-text sm:text-lg">
              {report.title}
            </h1>
            <p className="mt-2 text-sm text-muted">
              #{report.id.slice(0, 8).toUpperCase()} · {created}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
          {/* main column */}
          <div className="flex flex-col gap-6">
            <section className="pixel-frame p-5">
              <h2 className="font-pixel mb-3 text-[11px] uppercase tracking-wider text-neon">
                Description
              </h2>
              <p className="whitespace-pre-wrap text-lg text-text">
                {report.description}
              </p>
            </section>

            {(report.steps || report.expected || report.actual_result) && (
              <section className="pixel-frame p-5">
                <dl>
                  <Row label="Steps to reproduce" value={report.steps} />
                  <Row label="Expected" value={report.expected} />
                  <Row label="Actual result" value={report.actual_result} />
                </dl>
              </section>
            )}

            {/* media */}
            {media.length > 0 && (
              <section className="pixel-frame p-5">
                <h2 className="font-pixel mb-3 text-[11px] uppercase tracking-wider text-neon">
                  Attachments ({media.length})
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {media.map((m) => (
                    <figure key={m.path} className="border-2 border-line bg-black">
                      {m.url ? (
                        m.kind === "video" ? (
                          <video src={m.url} controls className="w-full" preload="metadata" />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={m.url} alt={m.name} className="w-full object-contain" />
                        )
                      ) : (
                        <div className="p-6 text-center text-sm text-muted">
                          (couldn&apos;t load {m.name})
                        </div>
                      )}
                      <figcaption className="flex items-center justify-between gap-2 bg-panel px-2 py-1 text-[13px] text-muted">
                        <span className="truncate" title={m.name}>{m.name}</span>
                        {m.url && (
                          <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-neon hover:underline">
                            open ↗
                          </a>
                        )}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            )}

            <section className="pixel-frame p-5">
              <h2 className="font-pixel mb-3 text-[11px] uppercase tracking-wider text-neon">
                Details
              </h2>
              <dl>
                <Row label="Player" value={report.player_name} />
                <Row label="Contact" value={report.contact_email} />
                <Row label="Device" value={report.device_model} />
                <Row label="OS version" value={report.os_version} />
                <Row label="Game build" value={report.app_version} />
                <Row label="Connection" value={labelFor(NETWORK_TYPES, report.network_type) === "—" ? null : labelFor(NETWORK_TYPES, report.network_type)} />
                <Row label="Region" value={report.region} />
                <Row label="Frequency" value={labelFor(FREQUENCIES, report.frequency) === "—" ? null : labelFor(FREQUENCIES, report.frequency)} />
                <Row label="User agent" value={report.user_agent} />
              </dl>
            </section>
          </div>

          {/* sidebar: triage actions */}
          <aside className="flex flex-col gap-4">
            <div className="pixel-frame p-5">
              <h2 className="font-pixel mb-3 text-[11px] uppercase tracking-wider text-neon">
                Status
              </h2>
              <form action={updateStatusAction} className="flex flex-col gap-3">
                <input type="hidden" name="id" value={report.id} />
                <select name="status" defaultValue={report.status} className="pixel-input">
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <button type="submit" className="font-pixel border-2 border-neon bg-neon/10 px-4 py-2 text-[11px] uppercase tracking-wider text-neon hover:bg-neon hover:text-ink">
                  Update status
                </button>
              </form>
            </div>

            <div className="pixel-frame p-5">
              <h2 className="font-pixel mb-3 text-[11px] uppercase tracking-wider text-neon">
                Internal notes
              </h2>
              <form action={saveNotesAction} className="flex flex-col gap-3">
                <input type="hidden" name="id" value={report.id} />
                <textarea
                  name="admin_notes"
                  defaultValue={report.admin_notes ?? ""}
                  rows={5}
                  placeholder="Triage notes, repro status, linked ticket…"
                  className="pixel-input resize-y"
                />
                <button type="submit" className="font-pixel border-2 border-purple bg-purple/10 px-4 py-2 text-[11px] uppercase tracking-wider text-purple hover:bg-purple hover:text-ink">
                  Save notes
                </button>
              </form>
            </div>

            <div className="pixel-frame p-5">
              <h2 className="font-pixel mb-3 text-[11px] uppercase tracking-wider text-danger">
                Danger zone
              </h2>
              <DeleteReportForm action={deleteReportAction} id={report.id} />
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
