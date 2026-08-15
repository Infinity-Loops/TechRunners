"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin } from "@/lib/session";
import { deleteReport, updateReport } from "@/lib/reports";
import { STATUS_VALUES } from "@/lib/constants";

export async function updateStatusAction(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !(STATUS_VALUES as readonly string[]).includes(status)) return;
  await updateReport(id, { status });
  revalidatePath("/admin");
  revalidatePath(`/admin/${id}`);
}

export async function saveNotesAction(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  const notes = String(formData.get("admin_notes") ?? "").slice(0, 5000);
  if (!id) return;
  await updateReport(id, { admin_notes: notes || null });
  revalidatePath(`/admin/${id}`);
}

export async function deleteReportAction(formData: FormData) {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await deleteReport(id);
  revalidatePath("/admin");
  redirect("/admin");
}
