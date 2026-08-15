import crypto from "node:crypto";

/**
 * Minimal admin session: a password gate backed by a signed, httpOnly cookie.
 *
 * No secret ever reaches the browser — the cookie holds only an expiry plus an
 * HMAC signature. `proxy.ts`, route handlers and server actions all verify it
 * server-side. Upgrade path: swap this file for Clerk/Auth0 without touching
 * the UI.
 */

export const SESSION_COOKIE = "tr_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const secret = process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error(
      "Admin auth is not configured. Set ADMIN_PASSWORD (and ideally SESSION_SECRET) in your environment."
    );
  }
  return secret;
}

function sign(value: string): string {
  return crypto
    .createHmac("sha256", getSecret())
    .update(value)
    .digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/** Verify a submitted admin password against ADMIN_PASSWORD (constant time). */
export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error("ADMIN_PASSWORD is not set.");
  }
  return safeEqual(input, expected);
}

/** Mint a signed session token: `<expiryEpochSeconds>.<signature>`. */
export function createSessionToken(): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = String(exp);
  return `${payload}.${sign(payload)}`;
}

/** Validate a session token from the cookie. */
export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!safeEqual(sig, sign(payload))) return false;
  const exp = Number(payload);
  if (!Number.isFinite(exp)) return false;
  return exp * 1000 > Date.now();
}

export const SESSION_MAX_AGE = SESSION_TTL_SECONDS;
