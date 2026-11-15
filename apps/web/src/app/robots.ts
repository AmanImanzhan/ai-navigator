import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";

// /robots.txt: страницы сайта индексировать можно, API — нет.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: new URL("/sitemap.xml", getSiteUrl()).toString(),
  };
}
