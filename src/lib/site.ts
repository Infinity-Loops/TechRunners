/** Canonical site metadata, shared by layout, sitemap, robots and OG images. */

export const SITE_URL = (
  process.env.SITE_URL || "https://techrunners.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "TechRunners";

export const SITE_TAGLINE = "Playtest & Feedback";

export const SITE_DESCRIPTION =
  "Join the TechRunners playtest on Android, iOS and Steam. Play the build and share your feedback with screenshots and clips to help shape the launch.";

export const SITE_KEYWORDS = [
  "TechRunners",
  "playtest",
  "beta",
  "mobile game",
  "Android game",
  "iOS game",
  "Steam",
  "TestFlight",
  "game feedback",
  "bug report",
  "pixel art",
  "Haven",
];
