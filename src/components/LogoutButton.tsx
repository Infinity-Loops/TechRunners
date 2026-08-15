"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { pixelButtonClass } from "./ui";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
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
