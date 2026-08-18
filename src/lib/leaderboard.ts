import "server-only";

/**
 * Reads Unity Gaming Services leaderboards the same way the game client does:
 * anonymous player auth (public project id, no secrets) + the Leaderboards API.
 * Everything here runs server-side; the page renders the results (SSR).
 *
 * The UGS project id must be provided via UGS_PROJECT_ID — it is never hardcoded.
 */

const AUTH_BASE = "https://player-auth.services.api.unity.com/v1/authentication";
const LEADERBOARDS_BASE = "https://leaderboards.services.api.unity.com/v1";

function getProjectId(): string | null {
  return process.env.UGS_PROJECT_ID || null;
}

// UGS environment the game's leaderboards live in (this game uses "playtest").
function getEnvironmentName(): string {
  return process.env.UGS_ENVIRONMENT_NAME || "production";
}

export function isLeaderboardConfigured(): boolean {
  return Boolean(getProjectId());
}

/** UI catalog — categories and timeframes shown as tabs. */
export const LB_CATEGORIES = [
  { key: "kills", label: "Kills", scoreLabel: "Kills" },
  { key: "duelwins-1v1", label: "Duels 1v1", scoreLabel: "Wins" },
  { key: "duelwins-2v2", label: "Duels 2v2", scoreLabel: "Wins" },
  { key: "basing", label: "Crews", scoreLabel: "Time held" },
] as const;

export const LB_TIMEFRAMES = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "total", label: "All-time" },
] as const;

export type CategoryKey = (typeof LB_CATEGORIES)[number]["key"];
export type TimeframeKey = (typeof LB_TIMEFRAMES)[number]["key"];

// Whitelist — must match Assets/_Scripts/Leaderboard/LeaderboardIds.cs in the game.
const PLAYER_BOARDS = [
  "kills-daily", "kills-weekly", "kills-monthly", "kills-total",
  "duelwins-1v1-daily", "duelwins-1v1-weekly", "duelwins-1v1-monthly", "duelwins-1v1-total",
  "duelwins-2v2-daily", "duelwins-2v2-weekly", "duelwins-2v2-monthly", "duelwins-2v2-total",
];
const CREW_BOARDS = [
  "basing-daily", "basing-weekly", "basing-monthly", "basing-total",
];
const ALL_BOARDS = new Set<string>([...PLAYER_BOARDS, ...CREW_BOARDS]);

export function isValidCategory(v: unknown): v is CategoryKey {
  return LB_CATEGORIES.some((c) => c.key === v);
}
export function isValidTimeframe(v: unknown): v is TimeframeKey {
  return LB_TIMEFRAMES.some((t) => t.key === v);
}

type UgsSession = { idToken: string; sessionToken: string; expiresAt: number };
let cachedSession: UgsSession | null = null;

async function authRequest(
  path: string,
  body: unknown
): Promise<UgsSession | null> {
  const projectId = getProjectId();
  if (!projectId) return null;
  const res = await fetch(`${AUTH_BASE}/${path}`, {
    method: "POST",
    headers: {
      ProjectId: projectId,
      UnityEnvironment: getEnvironmentName(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data?.idToken) return null;
  const expiresInSec = typeof data.expiresIn === "number" ? data.expiresIn : 3600;
  return {
    idToken: data.idToken,
    sessionToken: data.sessionToken ?? "",
    expiresAt: Date.now() + Math.max(60, expiresInSec - 300) * 1000,
  };
}

async function getIdToken(forceNew = false): Promise<string> {
  if (!forceNew && cachedSession && Date.now() < cachedSession.expiresAt) {
    return cachedSession.idToken;
  }
  if (cachedSession?.sessionToken) {
    const refreshed = await authRequest("session-token", {
      sessionToken: cachedSession.sessionToken,
    });
    if (refreshed) {
      cachedSession = {
        ...refreshed,
        sessionToken: refreshed.sessionToken || cachedSession.sessionToken,
      };
      return cachedSession.idToken;
    }
  }
  const fresh = await authRequest("anonymous", {});
  if (!fresh) throw new Error("UGS anonymous sign-in failed");
  cachedSession = fresh;
  return cachedSession.idToken;
}

function parseMetadata(raw: unknown): Record<string, string> {
  if (!raw) return {};
  try {
    return typeof raw === "string"
      ? JSON.parse(raw)
      : (raw as Record<string, string>);
  } catch {
    return {};
  }
}

// Basing scores are minutes-held; the game shows "2h 15m".
function formatDuration(minutes: number): string {
  const total = Math.max(0, Math.round(minutes));
  const days = Math.floor(total / 1440);
  const hours = Math.floor((total % 1440) / 60);
  const mins = total % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

export type LeaderboardEntry = {
  rank: number;
  name: string;
  score: number;
  scoreDisplay: string;
};

export async function fetchLeaderboard(
  boardId: string
): Promise<LeaderboardEntry[]> {
  const projectId = getProjectId();
  if (!projectId) throw new Error("UGS_PROJECT_ID is not configured.");
  if (!ALL_BOARDS.has(boardId)) throw new Error("Unknown leaderboard");

  const isCrewBoard = boardId.startsWith("basing-");
  const url =
    `${LEADERBOARDS_BASE}/projects/${projectId}/leaderboards/` +
    `${encodeURIComponent(boardId)}/scores?offset=0&limit=50&includeMetadata=true`;

  let token = await getIdToken();
  let res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 60 },
  });
  if (res.status === 401) {
    token = await getIdToken(true);
    res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
  }
  if (!res.ok) throw new Error(`Leaderboard fetch failed (${res.status})`);

  const data = await res.json();
  const results: unknown[] = Array.isArray(data?.results) ? data.results : [];

  return results
    .map((raw) => raw as Record<string, unknown>)
    .filter((e) => Number(e?.score ?? 0) > 0) // hide 0-score rows, matching the game
    .map((e) => {
      const meta = parseMetadata(e.metadata);
      const score = Number(e.score ?? 0);
      return {
        rank: Number(e.rank ?? 0) + 1, // UGS ranks are 0-based
        name: isCrewBoard
          ? meta.crewName || (e.playerName as string) || "Unknown crew"
          : meta.nickname || (e.playerName as string) || "Unknown",
        score,
        scoreDisplay: isCrewBoard ? formatDuration(score) : String(score),
      };
    });
}
