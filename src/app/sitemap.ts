import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ecogen.uz";
  const now = new Date("2026-11-18T00:00:00Z");

  const routes = [
    "",
    "/assistant",
    "/economy",
    "/climate",
    "/education",
    "/projects",
    "/challenges",
    "/login",
    "/register",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
