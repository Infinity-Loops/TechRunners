import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";

const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const vt323 = VT323({
  variable: "--font-vt323",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.SITE_URL || "http://localhost:3000"
  ),
  title: "TechRunners — Playtest",
  description:
    "Join the TechRunners playtest on Android, iOS and Steam. Play the build and share your feedback with screenshots and clips to help shape the launch.",
  icons: {
    icon: "/assets/favicon.png",
  },
  openGraph: {
    title: "TechRunners — Playtest",
    description:
      "Join the TechRunners playtest and help shape the game before launch.",
    images: ["/assets/banner.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${pressStart.variable} ${vt323.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col scanlines">{children}</body>
    </html>
  );
}
