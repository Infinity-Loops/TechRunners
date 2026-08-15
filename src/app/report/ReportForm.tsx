"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PLATFORMS,
  PROBLEM_AREAS,
  SEVERITIES,
  FREQUENCIES,
  NETWORK_TYPES,
  MAX_FILES,
  MAX_FILE_MB,
  ACCEPTED_MIME,
} from "@/lib/constants";
import { Field, Select, TextArea, TextInput } from "@/components/form";
import { SectionTitle, pixelButtonClass, cn } from "@/components/ui";
import { GameIcon } from "@/components/GameIcon";

type Errors = Record<string, string>;

function humanSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function ReportForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      setFormError(null);
      setFiles((prev) => {
        const next = [...prev];
        for (const f of Array.from(incoming)) {
          if (f.type && !ACCEPTED_MIME.includes(f.type)) {
            setFormError(`"${f.name}" isn't a supported file type.`);
            continue;
          }
          if (f.size > MAX_FILE_MB * 1024 * 1024) {
            setFormError(`"${f.name}" is over the ${MAX_FILE_MB}MB limit.`);
            continue;
          }
          if (next.some((p) => p.name === f.name && p.size === f.size)) continue;
          if (next.length >= MAX_FILES) {
            setFormError(`You can attach up to ${MAX_FILES} files.`);
            break;
          }
          next.push(f);
        }
        return next;
      });
    },
    []
  );

  const removeFile = (idx: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== idx));

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting || !formRef.current) return;

    setSubmitting(true);
    setErrors({});
    setFormError(null);
    setProgress(0);

    const fd = new FormData(formRef.current);
    fd.delete("files"); // replace the raw input with our managed list
    for (const f of files) fd.append("files", f);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/reports");

    xhr.upload.onprogress = (evt) => {
      if (evt.lengthComputable)
        setProgress(Math.round((evt.loaded / evt.total) * 100));
    };

    xhr.onload = () => {
      setSubmitting(false);
      let data: { ok?: boolean; error?: string; fieldErrors?: Errors; id?: string } = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        /* ignore */
      }
      if (xhr.status >= 200 && xhr.status < 300 && data.ok) {
        router.push(`/report/success?id=${data.id ?? ""}`);
        return;
      }
      if (data.fieldErrors) {
        setErrors(data.fieldErrors);
        // scroll to first error
        const first = Object.keys(data.fieldErrors)[0];
        const el = formRef.current?.querySelector(`[name="${first}"]`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      setFormError(data.error ?? "Submission failed. Please try again.");
    };

    xhr.onerror = () => {
      setSubmitting(false);
      setFormError("Network error — check your connection and try again.");
    };

    xhr.send(fd);
  };

  return (
    <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      {/* ---------------------------------------------- The problem (main) */}
      <div className="pixel-frame p-5 sm:p-6">
        <SectionTitle hint="the main thing" icon={<GameIcon name="medal" size={26} />}>
          Your feedback
        </SectionTitle>
        <div className="grid gap-4">
          <Field
            label="Short title"
            htmlFor="title"
            required
            error={errors.title}
            hint="e.g. “Game freezes when opening the map in a match”"
          >
            <TextInput
              id="title"
              name="title"
              maxLength={140}
              placeholder="Sum it up in one line"
              aria-invalid={!!errors.title}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Problem area" htmlFor="problem_area" required error={errors.problem_area}>
              <Select
                id="problem_area"
                name="problem_area"
                options={PROBLEM_AREAS}
                placeholder="Choose…"
                aria-invalid={!!errors.problem_area}
              />
            </Field>
            <Field label="Severity" htmlFor="severity" required error={errors.severity}>
              <Select id="severity" name="severity" options={SEVERITIES} defaultValue="medium" />
            </Field>
            <Field label="How often?" htmlFor="frequency" error={errors.frequency}>
              <Select id="frequency" name="frequency" options={FREQUENCIES} placeholder="Choose…" />
            </Field>
          </div>

          <Field
            label="What happened?"
            htmlFor="description"
            required
            error={errors.description}
            hint="Describe the bug in your own words."
          >
            <TextArea
              id="description"
              name="description"
              rows={4}
              maxLength={5000}
              placeholder="I was in a 2v2 match and when I tapped the map button the whole screen froze for ~5 seconds…"
              aria-invalid={!!errors.description}
            />
          </Field>

          <Field
            label="Steps to reproduce"
            htmlFor="steps"
            error={errors.steps}
            hint="Numbered steps help us hit the same bug."
          >
            <TextArea
              id="steps"
              name="steps"
              rows={3}
              placeholder={"1. Start a match\n2. Open the map\n3. Tap a teammate ping"}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Expected result" htmlFor="expected" error={errors.expected}>
              <TextArea id="expected" name="expected" rows={2} placeholder="The map opens instantly" />
            </Field>
            <Field label="Actual result" htmlFor="actual_result" error={errors.actual_result}>
              <TextArea
                id="actual_result"
                name="actual_result"
                rows={2}
                placeholder="The game froze, then dropped to 5 FPS"
              />
            </Field>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------- Attachments */}
      <div className="pixel-frame p-5 sm:p-6">
        <SectionTitle hint="a clip says a thousand words" icon={<GameIcon name="chat" size={26} />}>
          Screenshots &amp; clips
        </SectionTitle>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed p-8 text-center transition-colors",
            dragging ? "border-neon bg-neon/10" : "border-line hover:border-neon/60"
          )}
        >
          <div className="font-pixel border-2 border-neon px-3 py-2 text-[11px] text-neon">
            [ + ]
          </div>
          <p className="font-pixel text-[11px] uppercase tracking-wider text-text">
            Drop files or click to browse
          </p>
          <p className="text-sm text-muted">
            PNG · JPG · GIF · MP4 · MOV · WEBM — up to {MAX_FILES} files, {MAX_FILE_MB}MB each
          </p>
          <input
            ref={fileInputRef}
            type="file"
            name="files"
            multiple
            accept={ACCEPTED_MIME.join(",")}
            className="hidden"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        {files.length > 0 && (
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {files.map((f, i) => (
              <FilePreview key={`${f.name}-${f.size}-${i}`} file={f} onRemove={() => removeFile(i)} />
            ))}
          </ul>
        )}
      </div>

      {/* -------------------------------------------------- Device details */}
      <div className="pixel-frame p-5 sm:p-6">
        <SectionTitle hint="helps us reproduce on the right hardware">Your device</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Platform" htmlFor="platform" required error={errors.platform}>
            <Select
              id="platform"
              name="platform"
              options={PLATFORMS}
              placeholder="Choose…"
              aria-invalid={!!errors.platform}
            />
          </Field>
          <Field label="Device model" htmlFor="device_model" error={errors.device_model} hint="e.g. iPhone 14 Pro, Galaxy S23, PC">
            <TextInput id="device_model" name="device_model" placeholder="Make &amp; model" />
          </Field>
          <Field label="OS version" htmlFor="os_version" hint="e.g. iOS 17.4, Android 14, Windows 11">
            <TextInput id="os_version" name="os_version" placeholder="Operating system version" />
          </Field>
          <Field label="Game / build version" htmlFor="app_version" hint="Shown on the title screen">
            <TextInput id="app_version" name="app_version" placeholder="e.g. 0.9.2 (build 431)" />
          </Field>
          <Field label="Connection" htmlFor="network_type">
            <Select id="network_type" name="network_type" options={NETWORK_TYPES} placeholder="Choose…" />
          </Field>
          <Field label="Region / server" htmlFor="region" hint="Roughly where you played">
            <TextInput id="region" name="region" placeholder="e.g. EU West, NA East" />
          </Field>
        </div>
      </div>

      {/* ----------------------------------------------------- About you */}
      <div className="pixel-frame p-5 sm:p-6">
        <SectionTitle hint="optional — so we can follow up">About you</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="In-game name / Player ID" htmlFor="player_name" error={errors.player_name}>
            <TextInput id="player_name" name="player_name" placeholder="Your runner tag" />
          </Field>
          <Field label="Contact email" htmlFor="contact_email" error={errors.contact_email} hint="Only if you're okay being contacted">
            <TextInput id="contact_email" name="contact_email" type="email" placeholder="you@example.com" />
          </Field>
        </div>
      </div>

      {/* ------------------------------------------------------- Submit bar */}
      {formError && (
        <div className="pixel-frame-magenta pixel-frame p-4 text-magenta">
          <p className="font-pixel text-[11px]">! {formError}</p>
        </div>
      )}

      <div className="flex flex-col items-center gap-3">
        {submitting && progress > 0 && (
          <div className="w-full">
            <div className="h-3 w-full border-2 border-neon bg-ink-2">
              <div
                className="h-full bg-neon transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1 text-center text-sm text-muted">
              Uploading… {progress}%
            </p>
          </div>
        )}
        <button
          type="submit"
          disabled={submitting}
          className={pixelButtonClass("primary", "lg", "w-full sm:w-auto")}
        >
          {submitting ? "Sending…" : "▶ Send Feedback"}
        </button>
        <p className="text-center text-sm text-muted">
          Fields marked <span className="text-magenta">*</span> are required.
        </p>
      </div>
    </form>
  );
}

function FilePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const isVideo = file.type.startsWith("video");
  const url = typeof URL !== "undefined" ? URL.createObjectURL(file) : "";
  return (
    <li className="group relative border-2 border-line bg-ink-2 p-1">
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${file.name}`}
        className="font-pixel absolute right-1 top-1 z-10 h-6 w-6 border border-danger bg-ink/80 text-[10px] text-danger hover:bg-danger hover:text-ink"
      >
        ✕
      </button>
      <div className="flex aspect-video items-center justify-center overflow-hidden bg-black">
        {isVideo ? (
          <div className="flex flex-col items-center gap-1 text-neon">
            <span className="font-pixel text-lg">▶</span>
            <span className="font-pixel text-[9px]">VIDEO</span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={file.name} className="h-full w-full object-cover" />
        )}
      </div>
      <p className="mt-1 truncate text-[13px] text-text" title={file.name}>
        {file.name}
      </p>
      <p className="text-[12px] text-muted">{humanSize(file.size)}</p>
    </li>
  );
}
