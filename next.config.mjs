/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Ajuda a encontrar problemas em dev
  poweredByHeader: false, // Remove o header "X-Powered-By" por segurança
  compress: true, // Gzip automático
  experimental: {
    serverActions: {
      allowedOrigins: [
        'http://localhost:3000', // Dev local
        'https://meuevento.com.br' // Produção
      ]
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Permite imagens de qualquer domínio (ou restrinja ao seu CDN)
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

