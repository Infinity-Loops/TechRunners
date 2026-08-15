import { z } from "zod";
import {
  PLATFORM_VALUES,
  PROBLEM_AREA_VALUES,
  SEVERITY_VALUES,
  FREQUENCY_VALUES,
  NETWORK_VALUES,
} from "./constants";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null));

/** Server-side schema for the incoming bug report (files validated separately). */
export const reportSchema = z.object({
  // reporter (optional)
  contact_email: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null))
    .refine((v) => v === null || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: "Enter a valid email or leave it blank.",
    }),
  player_name: optionalText(80),

  // device / platform
  platform: z.enum(PLATFORM_VALUES as [string, ...string[]]),
  device_model: optionalText(120),
  os_version: optionalText(60),
  app_version: optionalText(60),
  network_type: z
    .enum(NETWORK_VALUES as [string, ...string[]])
    .optional()
    .or(z.literal("").transform(() => undefined)),
  region: optionalText(80),

  // the problem
  problem_area: z.enum(PROBLEM_AREA_VALUES as [string, ...string[]]),
  severity: z.enum(SEVERITY_VALUES as [string, ...string[]]),
  frequency: z
    .enum(FREQUENCY_VALUES as [string, ...string[]])
    .optional()
    .or(z.literal("").transform(() => undefined)),
  title: z.string().trim().min(4, "Give it a short title (min 4 chars).").max(140),
  description: z
    .string()
    .trim()
    .min(10, "Please describe what happened (min 10 chars).")
    .max(5000),
  steps: optionalText(4000),
  expected: optionalText(2000),
  actual_result: optionalText(2000),
});

export type ReportInput = z.infer<typeof reportSchema>;
