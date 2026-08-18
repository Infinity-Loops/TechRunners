import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { ImageResponse } from "next/og";

/**
 * Shared Open Graph card generator for interior pages. Home has its own
 * dedicated card; every other page renders this dynamic one with its own title.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Font/emblem live next to the root OG route; resolved relative to this module
// so Next traces them into each interior page's bundle.
const FONT_URL = new URL("../app/PressStart2P-Regular.ttf", import.meta.url);
const EMBLEM_URL = new URL("../app/og-emblem.png", import.meta.url);

function titleSize(title: string) {
  const n = title.length;
  if (n <= 8) return 68;
  if (n <= 12) return 52;
  if (n <= 18) return 40;
  return 32;
}

export async function ogCard({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const [fontData, emblemData] = await Promise.all([
    readFile(fileURLToPath(FONT_URL)),
    readFile(fileURLToPath(EMBLEM_URL)),
  ]);
  const emblemSrc = `data:image/png;base64,${Buffer.from(emblemData).toString(
    "base64"
  )}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#05070f",
          backgroundImage:
            "radial-gradient(900px 500px at 50% 0%, rgba(52,226,232,0.20), transparent 60%)," +
            "radial-gradient(800px 500px at 100% 100%, rgba(255,63,164,0.16), transparent 55%)," +
            "radial-gradient(700px 500px at 0% 100%, rgba(139,108,255,0.16), transparent 55%)",
          fontFamily: "PressStart",
          position: "relative",
          padding: 64,
        }}
      >
        {/* neon frame */}
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: "3px solid rgba(52,226,232,0.6)",
            boxShadow: "0 0 40px rgba(52,226,232,0.22)",
            display: "flex",
          }}
        />

        {/* brand lockup */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={emblemSrc} width={64} height={64} alt="" />
          <div style={{ display: "flex", fontSize: 22, color: "#34e2e8" }}>
            <span>TECH</span>
            <span style={{ color: "#ff3fa4" }}>RUNNERS</span>
          </div>
        </div>

        {/* page title */}
        <div
          style={{
            display: "flex",
            textAlign: "center",
            marginTop: 48,
            fontSize: titleSize(title),
            color: "#dcecff",
            letterSpacing: -1,
            maxWidth: 1000,
          }}
        >
          {title.toUpperCase()}
        </div>

        {subtitle && (
          <div
            style={{
              display: "flex",
              textAlign: "center",
              marginTop: 26,
              fontSize: 18,
              color: "#8296bd",
              maxWidth: 900,
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </div>
        )}

        {/* accent bar */}
        <div
          style={{
            display: "flex",
            marginTop: 40,
            width: 90,
            height: 6,
            backgroundColor: "#ff3fa4",
          }}
        />
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "PressStart", data: fontData, style: "normal", weight: 400 },
      ],
    }
  );
}
