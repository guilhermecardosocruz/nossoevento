import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://nossoevento-git-main-guilhermes-projects-b92ea6f9.vercel.app";
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/eventos`, lastModified: new Date() },
  ];
}

