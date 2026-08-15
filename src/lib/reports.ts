import "server-only";
import { getSupabaseAdmin } from "./supabase";
import { STORAGE_BUCKET } from "./constants";
import type { Attachment, Report, SignedAttachment } from "./types";

const TABLE = "reports";

export type ReportFilters = {
  status?: string;
  platform?: string;
  problem_area?: string;
  severity?: string;
  q?: string;
};

export type NewReport = Omit<Report, "id" | "created_at" | "status"> & {
  id?: string;
  status?: string;
};

export async function createReport(input: NewReport): Promise<Report> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ ...input, status: input.status ?? "new" })
    .select("*")
    .single();
  if (error) throw new Error(`Failed to save report: ${error.message}`);
  return data as Report;
}

export async function listReports(
  filters: ReportFilters = {}
): Promise<Report[]> {
  const supabase = getSupabaseAdmin();
  let query = supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.platform) query = query.eq("platform", filters.platform);
  if (filters.problem_area)
    query = query.eq("problem_area", filters.problem_area);
  if (filters.severity) query = query.eq("severity", filters.severity);
  if (filters.q) {
    const term = filters.q.replace(/[%,]/g, " ").trim();
    if (term)
      query = query.or(
        `title.ilike.%${term}%,description.ilike.%${term}%,device_model.ilike.%${term}%,player_name.ilike.%${term}%`
      );
  }

  const { data, error } = await query;
  if (error) throw new Error(`Failed to load reports: ${error.message}`);
  return (data ?? []) as Report[];
}

export async function getReport(id: string): Promise<Report | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Failed to load report: ${error.message}`);
  return (data as Report) ?? null;
}

export async function updateReport(
  id: string,
  patch: Partial<Pick<Report, "status" | "admin_notes">>
): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from(TABLE).update(patch).eq("id", id);
  if (error) throw new Error(`Failed to update report: ${error.message}`);
}

export async function deleteReport(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const report = await getReport(id);
  if (report?.attachments?.length) {
    const paths = report.attachments.map((a) => a.path);
    await supabase.storage.from(STORAGE_BUCKET).remove(paths);
  }
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw new Error(`Failed to delete report: ${error.message}`);
}

function safeName(name: string) {
  const dot = name.lastIndexOf(".");
  const ext = dot >= 0 ? name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "";
  const base = (dot >= 0 ? name.slice(0, dot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "file";
  return ext ? `${base}.${ext}` : base;
}

/** Upload a report's media files to the private bucket, return attachment metadata. */
export async function uploadReportMedia(
  reportId: string,
  files: File[]
): Promise<Attachment[]> {
  if (!files.length) return [];
  const supabase = getSupabaseAdmin();
  const out: Attachment[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const path = `${reportId}/${i}-${safeName(file.name)}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: true,
      });
    if (error) throw new Error(`Upload failed for ${file.name}: ${error.message}`);
    out.push({
      path,
      name: file.name,
      type: file.type,
      size: file.size,
      kind: file.type.startsWith("video") ? "video" : "image",
    });
  }
  return out;
}

/** Turn stored attachment paths into short-lived signed URLs for admin viewing. */
export async function signAttachments(
  attachments: Attachment[],
  expiresIn = 60 * 60
): Promise<SignedAttachment[]> {
  if (!attachments?.length) return [];
  const supabase = getSupabaseAdmin();
  const results = await Promise.all(
    attachments.map(async (a) => {
      const { data } = await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(a.path, expiresIn);
      return { ...a, url: data?.signedUrl ?? null };
    })
  );
  return results;
}

/** Lightweight counts for the admin dashboard header. */
export async function reportStats() {
  const reports = await listReports();
  const byStatus: Record<string, number> = {};
  const byPlatform: Record<string, number> = {};
  for (const r of reports) {
    byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
    byPlatform[r.platform] = (byPlatform[r.platform] ?? 0) + 1;
  }
  return { total: reports.length, byStatus, byPlatform };
}
