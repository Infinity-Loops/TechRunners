import "server-only";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "./auth";

/** Read the admin session cookie (async in Next 16) and validate it. */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/** Defense-in-depth guard for server actions. Throws if not authenticated. */
export async function assertAdmin(): Promise<void> {
  if (!(await isAdmin())) {
    throw new Error("Not authorized.");
  }
}
