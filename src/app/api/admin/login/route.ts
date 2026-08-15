import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  checkPassword,
  createSessionToken,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { ok: false, error: "Admin login isn't configured (ADMIN_PASSWORD missing)." },
      { status: 503 }
    );
  }

  let password = "";
  let next = "/admin";
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const body = await request.json().catch(() => ({}));
    password = String(body.password ?? "");
    if (body.next) next = String(body.next);
  } else {
    const form = await request.formData();
    password = String(form.get("password") ?? "");
    if (form.get("next")) next = String(form.get("next"));
  }

  if (!password || !checkPassword(password)) {
    return NextResponse.json(
      { ok: false, error: "Wrong password." },
      { status: 401 }
    );
  }

  // only allow same-site relative redirect targets
  if (!next.startsWith("/admin")) next = "/admin";

  const res = NextResponse.json({ ok: true, next });
  res.cookies.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
