"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextInput } from "@/components/form";
import { pixelButtonClass } from "@/components/ui";

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
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
        router.replace(data.next || "/admin");
        router.refresh();
      } else {
        setError(data.error || "Login failed.");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
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
