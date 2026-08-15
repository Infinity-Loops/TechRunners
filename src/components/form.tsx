import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import type { Option } from "@/lib/constants";
import { cn } from "./ui";

export function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="font-pixel text-[10px] uppercase tracking-wider text-muted"
      >
        {label}
        {required && <span className="ml-1 text-magenta">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-sm text-muted/80">{hint}</p>}
      {error && <p className="text-sm text-danger">▸ {error}</p>}
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("pixel-input", props.className)} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn("pixel-input resize-y min-h-24", props.className)}
    />
  );
}

export function Select({
  options,
  placeholder,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  options: readonly Option[];
  placeholder?: string;
}) {
  return (
    <select {...props} className={cn("pixel-input", props.className)}>
      {placeholder && (
        <option value="">{placeholder}</option>
      )}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
