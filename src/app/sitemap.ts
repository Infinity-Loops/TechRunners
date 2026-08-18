import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const page = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
  ) => ({ url: `${SITE_URL}${path}`, lastModified, changeFrequency, priority });

  return [
    page("/", 1, "weekly"),
    page("/features", 0.9, "monthly"),
    page("/leaderboard", 0.8, "daily"),
    page("/about", 0.7, "monthly"),
    page("/community", 0.7, "weekly"),
    page("/support", 0.6, "monthly"),
    page("/contact", 0.6, "monthly"),
    page("/report", 0.5, "monthly"),
    page("/privacy-policy", 0.3, "yearly"),
    page("/terms-of-service", 0.3, "yearly"),
    page("/developer-identity", 0.3, "yearly"),
  ];
}
