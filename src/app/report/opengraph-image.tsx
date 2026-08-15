import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { ImageResponse } from "next/og";

// Distinct OG card for the feedback page (overrides the root card for /report).
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "TechRunners — share your playtest feedback";
export const runtime = "nodejs";

export default async function ReportOpengraphImage() {
  const [fontData, emblemData] = await Promise.all([
    readFile(fileURLToPath(new URL("../PressStart2P-Regular.ttf", import.meta.url))),
    readFile(fileURLToPath(new URL("../og-emblem.png", import.meta.url))),
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
            "radial-gradient(900px 520px at 50% 100%, rgba(255,63,164,0.24), transparent 60%)," +
            "radial-gradient(760px 480px at 0% 0%, rgba(52,226,232,0.18), transparent 55%)," +
            "radial-gradient(760px 480px at 100% 0%, rgba(139,108,255,0.18), transparent 55%)",
          fontFamily: "PressStart",
          position: "relative",
        }}
      >
        {/* magenta neon frame */}
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: "3px solid rgba(255,63,164,0.6)",
            boxShadow: "0 0 40px rgba(255,63,164,0.25)",
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

        {/* headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 44,
            lineHeight: 1.35,
          }}
        >
          <span style={{ fontSize: 58, color: "#ff3fa4" }}>SHARE YOUR</span>
          <span style={{ fontSize: 58, color: "#34e2e8", marginTop: 14 }}>
            FEEDBACK
          </span>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 19,
            color: "#dcecff",
          }}
        >
          Tell us how your run went
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontSize: 15,
            color: "#8296bd",
          }}
        >
          screenshots &amp; clips welcome
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "PressStart", data: fontData, style: "normal", weight: 400 },
      ],
    }
  );
}
