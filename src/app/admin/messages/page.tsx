import type { Metadata } from "next";
import { AdminHeader } from "@/components/AdminHeader";
import { Badge } from "@/components/ui";
import { ConfirmDeleteForm } from "@/components/ConfirmDeleteForm";
import { CONTACT_CATEGORIES, CONTACT_STATUSES, labelFor, optionFor } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/supabase";
import { listContactMessages, type ContactMessage } from "@/lib/contacts";
import { deleteMessageAction, updateMessageStatusAction } from "../actions";

export const metadata: Metadata = {
  title: "Messages — TechRunners Admin",
  robots: { index: false },
};
export const dynamic = "force-dynamic";

function fmt(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminMessages({
  searchParams,
}: PageProps<"/admin/messages">) {
  const sp = await searchParams;
  const status = typeof sp.status === "string" ? sp.status : undefined;

  if (!isSupabaseConfigured()) {
    return (
      <>
        <AdminHeader />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16">
          <div className="pixel-frame-magenta pixel-frame p-6 text-center">
            <p className="font-pixel text-sm text-magenta">Backend not configured</p>
          </div>
        </main>
      </>
    );
  }

  let messages: ContactMessage[] = [];
  let loadError: string | null = null;
  try {
    messages = await listContactMessages(status);
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Failed to load messages.";
  }

  return (
    <>
      <AdminHeader active="/admin/messages" />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-16 pt-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-pixel text-base neon sm:text-lg">Messages</h1>
          <form>
            <select name="status" defaultValue={status ?? ""} className="pixel-input">
              <option value="">All statuses</option>
              {CONTACT_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </form>
        </div>

        {loadError && (
          <div className="pixel-frame-magenta pixel-frame mt-6 p-4">
            <p className="font-pixel text-[11px] text-magenta">! {loadError}</p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3">
          {messages.length === 0 && !loadError ? (
            <div className="pixel-frame p-10 text-center text-muted">
              <p className="font-pixel text-2xl neon">[ ]</p>
              <p className="font-pixel mt-4 text-[11px] uppercase tracking-wider">
                No messages
              </p>
            </div>
          ) : (
            messages.map((m) => (
              <article key={m.id} className="pixel-frame p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={optionFor(CONTACT_STATUSES, m.status)?.tone}>
                      {labelFor(CONTACT_STATUSES, m.status)}
                    </Badge>
                    {m.category && (
                      <Badge tone={optionFor(CONTACT_CATEGORIES, m.category)?.tone}>
                        {labelFor(CONTACT_CATEGORIES, m.category)}
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted">{fmt(m.created_at)}</span>
                </div>

                <h2 className="mt-3 text-lg text-text">
                  {m.subject || "(no subject)"}
                </h2>
                <p className="mt-1 text-base text-muted">
                  {m.name ? `${m.name} · ` : ""}
                  <a href={`mailto:${m.email}`} className="text-neon hover:underline">
                    {m.email}
                  </a>
                </p>

                <p className="mt-3 whitespace-pre-wrap text-lg text-text/90">
                  {m.message}
                </p>

                <div className="mt-5 flex flex-wrap items-end gap-3 border-t border-line/50 pt-4">
                  <form action={updateMessageStatusAction} className="flex items-end gap-2">
                    <input type="hidden" name="id" value={m.id} />
                    <select name="status" defaultValue={m.status} className="pixel-input">
                      {CONTACT_STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                    <button type="submit" className="font-pixel border-2 border-neon bg-neon/10 px-4 py-2 text-[11px] uppercase tracking-wider text-neon hover:bg-neon hover:text-ink">
                      Update
                    </button>
                  </form>
                  <a
                    href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || "Your message to TechRunners")}`}
                    className="font-pixel border-2 border-purple bg-purple/10 px-4 py-2 text-[11px] uppercase tracking-wider text-purple hover:bg-purple hover:text-ink"
                  >
                    Reply
                  </a>
                  <div className="ml-auto">
                    <ConfirmDeleteForm
                      action={deleteMessageAction}
                      id={m.id}
                      label="Delete"
                      message="Delete this message permanently?"
                    />
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
    </>
  );
}
