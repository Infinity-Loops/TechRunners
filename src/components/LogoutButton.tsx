"use client";

import { useState } from "react";
import { pixelButtonClass } from "./ui";

export function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    // Full-page navigation so the cleared cookie takes effect on a fresh render.
    window.location.assign("/admin/login");
  }

  return (
    <button
      onClick={logout}
      disabled={loading}
      className={pixelButtonClass("ghost", "md")}
    >
      {loading ? "…" : "Log out"}
    </button>
  );
}
