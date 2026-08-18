"use client";

import { useState } from "react";
import { CONTACT_CATEGORIES } from "@/lib/constants";
import { Field, Select, TextArea, TextInput } from "@/components/form";
import { pixelButtonClass } from "@/components/ui";

type Errors = Record<string, string>;

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setErrors({});
    setFormError(null);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setDone(true);
        return;
      }
      if (data.fieldErrors) setErrors(data.fieldErrors);
      setFormError(data.error || "Something went wrong.");
    } catch {
      setFormError("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="pixel-frame p-8 text-center">
        <p className="font-pixel text-2xl neon">GG</p>
        <h2 className="font-pixel mt-4 text-sm text-text">Message sent!</h2>
        <p className="mt-3 text-lg text-muted">
          Thanks for reaching out — our team will get back to you by email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="pixel-frame flex flex-col gap-4 p-5 sm:p-6" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" htmlFor="name" error={errors.name}>
          <TextInput id="name" name="name" placeholder="Runner tag or name" />
        </Field>
        <Field label="Email" htmlFor="email" required error={errors.email}>
          <TextInput id="email" name="email" type="email" placeholder="you@example.com" aria-invalid={!!errors.email} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Topic" htmlFor="category" error={errors.category}>
          <Select id="category" name="category" options={CONTACT_CATEGORIES} placeholder="Choose…" />
        </Field>
        <Field label="Subject" htmlFor="subject" error={errors.subject}>
          <TextInput id="subject" name="subject" placeholder="What's it about?" />
        </Field>
      </div>

      <Field label="Message" htmlFor="message" required error={errors.message}>
        <TextArea id="message" name="message" rows={6} placeholder="Tell us what's on your mind…" aria-invalid={!!errors.message} />
      </Field>

      {formError && <p className="font-pixel text-[11px] text-danger">! {formError}</p>}

      <button type="submit" disabled={submitting} className={pixelButtonClass("primary", "lg")}>
        {submitting ? "Sending…" : "▶ Send Message"}
      </button>
    </form>
  );
}
