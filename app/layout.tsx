// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Providers } from "@/components/providers";
import { UserMenu } from "@/components/user-menu"; // apenas import, NÃO exporte nada daqui

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "Nosso Evento",
  description: "Acesso por CPF — Nosso Evento",
  openGraph: { title: "Nosso Evento", type: "website" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} min-h-dvh bg-white text-zinc-900`}>
        <Providers>
          {/* Header */}
          <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
            <div className="mx-auto max-w-md px-4 h-14 flex items-center justify-between">
              <Link href={session ? "/logado" : "/auth/login"} className="font-semibold text-lg tracking-tight">
                Nosso Evento
              </Link>
              {/* Quando logado, mostra o menu com “Sair”; quando deslogado, mantém espaço */}
              {session ? <UserMenu /> : <span className="w-[64px]" aria-hidden />}
            </div>
          </header>

          {/* Conteúdo */}
          <div className="mx-auto max-w-md min-h-[calc(100dvh-56px)]">{children}</div>

          {/* Bottom nav só quando NÃO está logado */}
          {!session && (
            <nav className="mx-auto max-w-md sticky bottom-0 bg-white border-t">
              <div className="grid grid-cols-2 text-center">
                <Link href="/auth/login" className="py-3 text-zinc-700">Login</Link>
                <Link href="/eventos" className="py-3 text-zinc-700">Eventos</Link>
              </div>
            </nav>
          )}
        </Providers>

        {/* registra SW do PWA */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if('serviceWorker' in navigator){addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(console.error))}",
          }}
        />
      </body>
    </html>
  );
}

