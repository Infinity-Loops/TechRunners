"use client";

import { pixelButtonClass } from "./ui";

/** Generic delete form: server action + client confirm. */
export function ConfirmDeleteForm({
  action,
  id,
  label = "Delete",
  message = "Delete this permanently? This cannot be undone.",
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  label?: string;
  message?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className={pixelButtonClass("danger", "md")}>
        {label}
      </button>
    </form>
  );
}
