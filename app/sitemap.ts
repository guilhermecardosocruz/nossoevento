import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://nossoevento-git-main-guilhermes-projects-b92ea6f9.vercel.app";

  const now = new Date();

  return [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/eventos`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // Adicione outras páginas públicas aqui se necessário
  ];
}

