/**
 * Shared option catalogs for the playtest bug-report system.
 * Everything the form offers and everything the admin filters on lives here,
 * so the UI, validation and DB stay in sync from one source.
 */

export type Option<T extends string = string> = {
  value: T;
  label: string;
  /** short hint shown under some pickers */
  hint?: string;
  /** semantic tone used by <Badge /> */
  tone?: "neon" | "magenta" | "purple" | "lime" | "warn" | "danger" | "muted";
  icon?: string;
};

export const PLATFORMS = [
  { value: "android", label: "Android", tone: "lime" },
  { value: "ios", label: "iOS", tone: "neon" },
  { value: "steam", label: "Steam / PC", tone: "purple" },
  { value: "other", label: "Other", tone: "muted" },
] as const satisfies readonly Option[];

export const PROBLEM_AREAS = [
  { value: "auth", label: "Login / Auth", tone: "neon" },
  { value: "social", label: "Social / Friends", tone: "magenta" },
  { value: "network", label: "Network / Connection", tone: "purple" },
  { value: "gameplay", label: "Gameplay / Mechanics", tone: "lime" },
  { value: "matchmaking", label: "Matchmaking / Lobby", tone: "neon" },
  { value: "performance", label: "Performance / FPS", tone: "warn" },
  { value: "crash", label: "Crash / Freeze", tone: "danger" },
  { value: "ui", label: "UI / HUD", tone: "magenta" },
  { value: "audio", label: "Audio / Music", tone: "purple" },
  { value: "store", label: "Store / Purchases", tone: "warn" },
  { value: "progression", label: "Progression / Rewards", tone: "lime" },
  { value: "tutorial", label: "Tutorial / Onboarding", tone: "neon" },
  { value: "graphics", label: "Graphics / Visual Glitch", tone: "magenta" },
  { value: "other", label: "Something else", tone: "muted" },
] as const satisfies readonly Option[];

export const SEVERITIES = [
  { value: "low", label: "Low — minor annoyance", tone: "muted" },
  { value: "medium", label: "Medium — noticeable", tone: "warn" },
  { value: "high", label: "High — hard to play", tone: "magenta" },
  { value: "critical", label: "Critical — blocks progress", tone: "danger" },
] as const satisfies readonly Option[];

export const FREQUENCIES = [
  { value: "always", label: "Always (100%)" },
  { value: "often", label: "Often" },
  { value: "sometimes", label: "Sometimes" },
  { value: "rarely", label: "Rarely" },
  { value: "once", label: "Happened once" },
] as const satisfies readonly Option[];

export const NETWORK_TYPES = [
  { value: "wifi", label: "Wi-Fi" },
  { value: "cellular", label: "Mobile data (4G/5G)" },
  { value: "ethernet", label: "Ethernet" },
  { value: "unknown", label: "Not sure" },
] as const satisfies readonly Option[];

/** Admin-side lifecycle statuses for a report. */
export const STATUSES = [
  { value: "new", label: "New", tone: "neon" },
  { value: "triaged", label: "Triaged", tone: "purple" },
  { value: "in_progress", label: "In Progress", tone: "warn" },
  { value: "resolved", label: "Resolved", tone: "lime" },
  { value: "wont_fix", label: "Won't Fix", tone: "muted" },
  { value: "duplicate", label: "Duplicate", tone: "muted" },
] as const satisfies readonly Option[];

export const CONTACT_CATEGORIES = [
  { value: "general", label: "General question", tone: "neon" },
  { value: "support", label: "Support / account", tone: "purple" },
  { value: "bug", label: "Bug / technical", tone: "danger" },
  { value: "business", label: "Business / press", tone: "warn" },
  { value: "feedback", label: "Feedback / idea", tone: "lime" },
] as const satisfies readonly Option[];

export const CONTACT_STATUSES = [
  { value: "new", label: "New", tone: "neon" },
  { value: "read", label: "Read", tone: "purple" },
  { value: "replied", label: "Replied", tone: "lime" },
  { value: "archived", label: "Archived", tone: "muted" },
] as const satisfies readonly Option[];

export const CONTACT_CATEGORY_VALUES = CONTACT_CATEGORIES.map((o) => o.value);
export const CONTACT_STATUS_VALUES = CONTACT_STATUSES.map((o) => o.value);

// Convenience value unions
export const PLATFORM_VALUES = PLATFORMS.map((o) => o.value);
export const PROBLEM_AREA_VALUES = PROBLEM_AREAS.map((o) => o.value);
export const SEVERITY_VALUES = SEVERITIES.map((o) => o.value);
export const FREQUENCY_VALUES = FREQUENCIES.map((o) => o.value);
export const NETWORK_VALUES = NETWORK_TYPES.map((o) => o.value);
export const STATUS_VALUES = STATUSES.map((o) => o.value);

export function labelFor(list: readonly Option[], value?: string | null) {
  if (!value) return "—";
  return list.find((o) => o.value === value)?.label ?? value;
}

export function optionFor(list: readonly Option[], value?: string | null) {
  if (!value) return undefined;
  return list.find((o) => o.value === value);
}

// Upload limits (kept in one place; API + client both read these)
export const MAX_FILES = 6;
export const MAX_FILE_MB = 50; // per file
export const MAX_TOTAL_MB = 120; // whole submission
export const ACCEPTED_MIME = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/quicktime",
  "video/webm",
];

export const STORAGE_BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET || "report-media";
