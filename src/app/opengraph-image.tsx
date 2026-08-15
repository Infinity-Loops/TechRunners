import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { ImageResponse } from "next/og";

// Dynamic Open Graph card, generated on demand. 1200x630 is the standard size
// social platforms crop to.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "TechRunners — Playtest on Android, iOS and Steam";

// Node runtime so we can read the co-located font/emblem from disk.
// (The `new URL(..., import.meta.url)` refs let Next trace them into the bundle.)
export const runtime = "nodejs";

export default async function OpengraphImage() {
  const [fontData, emblemData] = await Promise.all([
    readFile(fileURLToPath(new URL("./PressStart2P-Regular.ttf", import.meta.url))),
    readFile(fileURLToPath(new URL("./og-emblem.png", import.meta.url))),
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
            "radial-gradient(900px 500px at 50% 0%, rgba(52,226,232,0.22), transparent 60%)," +
            "radial-gradient(800px 500px at 100% 100%, rgba(255,63,164,0.20), transparent 55%)," +
            "radial-gradient(700px 500px at 0% 100%, rgba(139,108,255,0.20), transparent 55%)",
          fontFamily: "PressStart",
          position: "relative",
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
            boxShadow: "0 0 40px rgba(52,226,232,0.25)",
            display: "flex",
          }}
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={emblemSrc} width={150} height={150} alt="" />

        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 66,
            color: "#34e2e8",
            letterSpacing: -2,
          }}
        >
          <span>TECH</span>
          <span style={{ color: "#ff3fa4" }}>RUNNERS</span>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 30,
            fontSize: 20,
            color: "#dcecff",
            letterSpacing: 1,
          }}
        >
          PLAYTEST IS LIVE
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 34,
          }}
        >
          {["ANDROID", "iOS", "STEAM"].map((p) => (
            <div
              key={p}
              style={{
                display: "flex",
                fontSize: 18,
                color: "#9dff5b",
                border: "2px solid rgba(157,255,91,0.6)",
                padding: "10px 18px",
              }}
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "PressStart",
          data: fontData,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
