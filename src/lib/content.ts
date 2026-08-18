import type { GameIconName } from "@/components/GameIcon";

export type Feature = {
  key: string;
  title: string;
  blurb: string;
  icon: GameIconName;
  tone: "neon" | "magenta" | "purple" | "lime" | "warn";
};

/** Core game pillars — surfaced on Home and Features. */
export const FEATURES: Feature[] = [
  {
    key: "pvp",
    title: "Real-Time PvP",
    blurb:
      "Jump into fast, skill-based battles against runners worldwide. No waiting rooms — just live combat and a climb up the ranks.",
    icon: "medal",
    tone: "magenta",
  },
  {
    key: "guilds",
    title: "Guilds & Clan Wars",
    blurb:
      "Form a crew, coordinate, and take the city block by block. Weekly guild battles decide who really runs Haven.",
    icon: "idcard",
    tone: "neon",
  },
  {
    key: "upgrades",
    title: "Tech Upgrades",
    blurb:
      "Unlock and tune futuristic gear to fit your playstyle. Build a loadout that turns close calls into clean wins.",
    icon: "gear",
    tone: "purple",
  },
  {
    key: "leaderboards",
    title: "Global Leaderboards",
    blurb:
      "Every match moves the needle. Chase seasonal ranks, top your region, and prove you belong at the summit.",
    icon: "chart",
    tone: "lime",
  },
  {
    key: "world",
    title: "A Living MMO World",
    blurb:
      "Haven is a persistent neon city shared by players everywhere — explore districts, meet rivals, and find your crew.",
    icon: "map",
    tone: "neon",
  },
  {
    key: "cross",
    title: "Play Anywhere",
    blurb:
      "Run on Android, iOS and Steam. Pick up where you left off and take the fight with you wherever you go.",
    icon: "trophy",
    tone: "warn",
  },
];

/** Marketing stats carried over from the studio's site. */
export const STATS = [
  { value: "24/7", label: "Global play" },
  { value: "10K+", label: "Players connected" },
  { value: "100+", label: "Guild battles hosted" },
];

/** Support FAQ. */
export const FAQ = [
  {
    q: "Which platforms is TechRunners on?",
    a: "TechRunners runs on Android, iOS (TestFlight) and Steam. Grab it from the download buttons at the top of the site.",
  },
  {
    q: "Is the game free to play?",
    a: "Yes — TechRunners is free to download and play, with optional cosmetic and tech upgrades.",
  },
  {
    q: "How do I report a bug or send feedback?",
    a: "Use the in-site feedback form — it captures your device, the issue, and lets you attach screenshots or clips so we can fix it fast.",
  },
  {
    q: "How do I recover or secure my account?",
    a: "Keep your login credentials private and never share your account. If you're locked out, email support and our team will help you recover it.",
  },
  {
    q: "How do guilds and guild wars work?",
    a: "Join or create a guild in-game, then compete in recurring guild battles for ranking, rewards, and city dominance.",
  },
];
