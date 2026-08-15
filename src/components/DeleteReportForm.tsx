"use client";

import { pixelButtonClass } from "./ui";

/** Delete form; a server action is passed in and guarded by a client confirm. */
export function DeleteReportForm({
  action,
  id,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm("Delete this report and its attachments? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className={pixelButtonClass("danger", "md")}>
        Delete report
      </button>
    </form>
  );
}
