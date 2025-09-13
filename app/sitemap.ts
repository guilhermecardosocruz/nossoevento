import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return [
    {
      url: `${base}/`,
      lastModified: new Date(),
    },
    {
      url: `${base}/eventos`,
      lastModified: new Date(),
    },
    // Se quiser adicionar outras páginas públicas, basta incluir aqui
  ];
}

