import { NextResponse, type NextRequest } from "next/server";
import crypto from "node:crypto";
import { reportSchema } from "@/lib/validation";
import { createReport, uploadReportMedia } from "@/lib/reports";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  ACCEPTED_MIME,
  MAX_FILES,
  MAX_FILE_MB,
  MAX_TOTAL_MB,
} from "@/lib/constants";

// Uploads can be large-ish; keep this on the Node runtime with room to run.
export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "The report backend isn't configured yet. Add your Supabase keys to the environment (see README).",
      },
      { status: 503 }
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not read the submitted form." },
      { status: 400 }
    );
  }

  // ---- validate text fields ----
  const fields = Object.fromEntries(
    [
      "contact_email",
      "player_name",
      "platform",
      "device_model",
      "os_version",
      "app_version",
      "network_type",
      "region",
      "problem_area",
      "severity",
      "frequency",
      "title",
      "description",
      "steps",
      "expected",
      "actual_result",
    ].map((k) => [k, (form.get(k) as string | null) ?? ""])
  );

  const parsed = reportSchema.safeParse(fields);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json(
      { ok: false, error: "Please fix the highlighted fields.", fieldErrors },
      { status: 422 }
    );
  }

  // ---- validate files ----
  const files = form
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { ok: false, error: `You can attach at most ${MAX_FILES} files.` },
      { status: 422 }
    );
  }

  let total = 0;
  for (const file of files) {
    total += file.size;
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      return NextResponse.json(
        {
          ok: false,
          error: `"${file.name}" is over the ${MAX_FILE_MB}MB per-file limit.`,
        },
        { status: 422 }
      );
    }
    if (file.type && !ACCEPTED_MIME.includes(file.type)) {
      return NextResponse.json(
        { ok: false, error: `"${file.name}" is not a supported file type.` },
        { status: 422 }
      );
    }
  }
  if (total > MAX_TOTAL_MB * 1024 * 1024) {
    return NextResponse.json(
      { ok: false, error: `Total attachments exceed ${MAX_TOTAL_MB}MB.` },
      { status: 422 }
    );
  }

  // ---- persist ----
  const id = crypto.randomUUID();
  const userAgent = request.headers.get("user-agent");

  try {
    const attachments = await uploadReportMedia(id, files);
    const report = await createReport({
      id,
      ...parsed.data,
      // optional enum fields resolve to undefined when blank — the DB wants null
      network_type: parsed.data.network_type ?? null,
      frequency: parsed.data.frequency ?? null,
      attachments,
      user_agent: userAgent,
      admin_notes: null,
    });
    return NextResponse.json({ ok: true, id: report.id });
  } catch (err) {
    console.error("[reports] submission failed:", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Something went wrong saving your report. Please try again in a moment.",
      },
      { status: 500 }
    );
  }
}
