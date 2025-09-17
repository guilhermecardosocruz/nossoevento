import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { Providers } from "@/components/providers";
import { auth } from "@/lib/auth"; // <-- importa auth para verificar sessão

const inter = Inter({ subsets: ["latin"] });

const APP_URL = "https://nossoevento-git-main-guilhermes-projects-b92ea6f9.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: { default: "Nosso Evento", template: "%s — Nosso Evento" },
  description: "Acesso por CPF — Nosso Evento",
  openGraph: { type: "website", title: "Nosso Evento", url: APP_URL },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", type: "image/png" },
      { url: "/icons/icon-512.png", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2563eb",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth(); // <-- checa se usuário está logado

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} min-h-dvh bg-white text-zinc-900`}>
        <Providers>
          <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
            <div className="mx-auto max-w-md px-4 h-14 flex items-center justify-center">
              <Link href="/" className="font-semibold text-lg tracking-tight">
                Nosso Evento
              </Link>
            </div>
          </header>

          <main className="mx-auto max-w-md min-h-[calc(100dvh-56px)]">
            {children}
          </main>

          {/* 🔥 Footer dinâmico */}
          <nav className="mx-auto max-w-md sticky bottom-0 bg-white border-t">
            <div className="grid grid-cols-2 text-center">
              {!session && (
                <Link href="/auth/login" className="py-3 text-zinc-700">
                  Login
                </Link>
              )}
              <Link href="/eventos" className="py-3 text-zinc-700">
                Eventos
              </Link>
            </div>
          </nav>
        </Providers>

        <Script id="sw-register" strategy="afterInteractive">
          {`if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(console.error);
              });
            }`}
        </Script>
      </body>
    </html>
  );
}

