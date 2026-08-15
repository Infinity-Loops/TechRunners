"use client";

import { useState } from "react";
import { TextInput } from "@/components/form";
import { pixelButtonClass } from "@/components/ui";

export function LoginForm({ next }: { next: string }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password, next }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        // Full-page navigation (not the History API) so the new session cookie
        // is used on a fresh server render — avoids client-router SecurityError
        // in sandboxed/embedded browser contexts.
        window.location.assign(data.next || "/admin");
        return;
      }
      setError(data.error || "Login failed.");
      setLoading(false);
    } catch {
      setError("Network error. Try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <TextInput
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Admin password"
        autoFocus
        autoComplete="current-password"
      />
      {error && <p className="text-sm text-danger">▸ {error}</p>}
      <button
        type="submit"
        disabled={loading || !password}
        className={pixelButtonClass("primary", "lg")}
      >
        {loading ? "Checking…" : "▶ Enter"}
      </button>
    </form>
  );
}
