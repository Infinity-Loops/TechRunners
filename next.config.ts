import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack ignores unrelated lockfiles higher up
  // the filesystem (e.g. a stray bun.lock in the home directory).
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
