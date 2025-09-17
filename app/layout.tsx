import "./globals.css";
import Link from "next/link";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { auth } from "@/lib/auth";
import { UserMenu } from "@/components/user-menu";

const inter = Inter({ subsets: ["latin"] });

/** 🔥 Garante que o layout SEMPRE seja dinâmico e não fique em cache */
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
// opcional: export const runtime = "nodejs";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://nossoevento.vercel.app"),
  title: "Nosso Evento",
  description: "Acesso por CPF — Nosso Evento",
  openGraph: { title: "Nosso Evento", type: "website" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Lê a sessão no SERVIDOR a cada request
  const session = await auth();
  const isAuthed = !!session;

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} min-h-dvh bg-white text-zinc-900`}>
        <Providers /* passa a sessão para o SessionProvider */ >
          {/* Header */}
          <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
            <div className="mx-auto max-w-md px-4 h-14 flex items-center justify-between">
              <Link
                href={isAuthed ? "/logado" : "/auth/login"}
                className="font-semibold text-lg tracking-tight"
              >
                Nosso Evento
              </Link>

              {/* Menu só quando logado */}
              {isAuthed ? <UserMenu name={session?.user?.name ?? "Usuário"} /> : null}
            </div>
          </header>

          {/* Conteúdo */}
          <div className="mx-auto max-w-md min-h-[calc(100dvh-56px)]">{children}</div>

          {/* Bottom nav só para DESLOGADO */}
          {!isAuthed && (
            <nav className="mx-auto max-w-md sticky bottom-0 bg-white border-t">
              <div className="grid grid-cols-2 text-center">
                <Link href="/auth/login" className="py-3 text-zinc-700">
                  Login
                </Link>
                <Link href="/eventos" className="py-3 text-zinc-700">
                  Eventos
                </Link>
              </div>
            </nav>
          )}
        </Providers>

        {/* SW opcional */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(console.error))}`,
          }}
        />
      </body>
    </html>
  );
}

