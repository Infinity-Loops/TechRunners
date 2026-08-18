import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const runtime = "nodejs";
export const alt = "TechRunners — Features";

export default function Image() {
  return ogCard({ title: "Features", subtitle: "Real-time PvP, guild wars & tech upgrades" });
}
