# TechRunners — Playtest & Feedback

A neon pixel-art playtest hub for **TechRunners**. Players grab the build for
Android / iOS / Steam, then send structured playtest feedback (with screenshots
and clips). The team triages everything from a password-gated admin console.

Built with **Next.js 16 (App Router, Turbopack)**, **React 19**, **Tailwind
CSS v4**, and **Supabase** (Postgres + Storage). The art direction is lifted
straight from the game — the Haven map as a backdrop, the `TECHRUNNERS` banner,
and the game's own UI icons/emblem.

## Security posture (SSR-first)

Everything sensitive stays on the server:

- **No `NEXT_PUBLIC_*` secrets.** The Supabase **service-role** key and the
  admin password are read only inside Server Components and Route Handlers.
- **Server Components render data.** The admin list/detail pages query Supabase
  on the server; the browser only receives HTML.
- **Uploads go through a Route Handler** (`/api/reports`) — the browser never
  talks to Supabase directly, so even the anon key isn't shipped.
- **Media stays private.** The storage bucket is private; the admin views media
  through short-lived signed URLs generated server-side.
- **Admin gate** via `src/proxy.ts` (Next 16's renamed middleware) + a signed,
  httpOnly session cookie.

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev                  # http://localhost:3000
```

Without Supabase configured the site still runs — the feedback form and admin
console show a friendly "backend not configured" state.

## Environment variables

All server-side (see `.env.example`):

| Variable                    | Purpose                                             |
| --------------------------- | --------------------------------------------------- |
| `SUPABASE_URL`              | Supabase project URL                                |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key (server only — never expose)       |
| `SUPABASE_STORAGE_BUCKET`   | Storage bucket name (default `report-media`)        |
| `ADMIN_PASSWORD`            | Password for the `/admin` console                   |
| `SESSION_SECRET`            | Signs the admin cookie (long random string)         |
| `PLAYTEST_ANDROID_URL`      | Google Play internal-test link (optional)           |
| `PLAYTEST_IOS_URL`          | TestFlight link (optional)                           |
| `PLAYTEST_STEAM_URL`        | Steam playtest link (optional)                       |
| `SITE_URL`                  | Public URL, for OG metadata (optional)              |

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. **Project Settings → API**: copy the **Project URL** into `SUPABASE_URL` and
   the **`service_role`** key into `SUPABASE_SERVICE_ROLE_KEY`.
3. **SQL Editor → New query**: paste and run [`supabase/schema.sql`](./supabase/schema.sql).
   This creates the `reports` table and the private `report-media` bucket.

## Deploy to Vercel

1. Push this repo and import it in Vercel (framework auto-detected: Next.js).
2. Add every variable from the table above under **Settings → Environment
   Variables** (mark them for Production + Preview).
3. Deploy. Set `SITE_URL` to your production domain.

## Project layout

```
src/
  app/
    page.tsx                 landing + playtest download CTAs
    report/                  feedback form (client) + submit API + success page
    admin/                   login, dashboard (SSR list + filters), [id] detail
    api/reports/route.ts     upload media + insert report (service role)
    api/admin/               login / logout (signed cookie)
  components/                pixel UI kit, game icons, backgrounds
  lib/                       supabase client, data access, auth, validation
  proxy.ts                   admin route gate (Next 16 middleware)
supabase/schema.sql          table + private storage bucket
public/assets/               map-bg.webp, banner, emblem, extracted game icons
```

## Asset pipeline

The 34 MB `Map1.png` is downscaled to WebP (`map-bg.webp` ~200 KB, plus a mobile
variant). The banner and the game's UI icons (emblem, trophy, chart, chat, map,
ID card, gear, medal) were extracted from the Unity sprite sheet using the exact
rects in its `.meta`. Regenerate with ImageMagick (`magick`) if the source art
changes.

## Feedback fields

Platform, device model, OS version, game build, connection, region, in-game
name, contact email, problem area, severity, frequency, title, description,
steps to reproduce, expected vs. actual, and up to 6 image/video attachments.
