/** Canonical site metadata + config, shared across the app. */

export const SITE_URL = (
  process.env.SITE_URL || "https://techrunners.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "TechRunners";
export const SITE_TAGLINE = "Futuristic Mobile MMO";

export const SITE_DESCRIPTION =
  "TechRunners is a fast-paced mobile MMO set in a neon future — real-time PvP, guild battles, tech upgrades and global leaderboards. Team up, run the city, and rise to the top.";

export const SITE_KEYWORDS = [
  "TechRunners",
  "mobile MMO",
  "real-time PvP",
  "guild battles",
  "clan wars",
  "leaderboards",
  "tech upgrades",
  "Android game",
  "iOS game",
  "Steam",
  "multiplayer",
  "cyberpunk",
  "Soulvale Studios",
];

/** The studio behind the game (from the store listing / developer identity). */
export const DEVELOPER = {
  name: "Soulvale Studios LLC",
  email: "info@soulvalestudios.com",
  location: "Nassau County, New York",
};

export const SUPPORT_EMAIL = "support@playtechrunners.com";

/**
 * External links. Store links reuse the existing playtest env vars; community
 * and social links are configurable (leave unset to hide the link/button).
 */
export const LINKS = {
  android: process.env.PLAYTEST_ANDROID_URL || "",
  ios: process.env.PLAYTEST_IOS_URL || "",
  steam: process.env.PLAYTEST_STEAM_URL || "",
  discord: process.env.DISCORD_URL || "",
  facebook: process.env.SOCIAL_FACEBOOK_URL || "",
  x: process.env.SOCIAL_X_URL || "",
  instagram: process.env.SOCIAL_INSTAGRAM_URL || "",
  linkedin: process.env.SOCIAL_LINKEDIN_URL || "",
} as const;

/** Primary nav (used by header + footer). */
export const NAV = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
  { href: "/community", label: "Community" },
  { href: "/support", label: "Support" },
] as const;

export const LEGAL_NAV = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/developer-identity", label: "Developer Identity" },
] as const;
