import "./globals.css";
import { Providers } from "@/components/providers";
import { Inter } from "next/font/google";
import Link from "next/link";
const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "Nosso Evento",
  description: "Acesso por CPF — Nosso Evento",
  openGraph: { title: "Nosso Evento", type: "website" }
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} min-h-dvh bg-white text-zinc-900`}>
        <Providers>
          <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
            <div className="mx-auto max-w-md px-4 h-14 flex items-center justify-center">
              <Link href="/auth/login" className="font-semibold text-lg tracking-tight">Nosso Evento</Link>
            </div>
          </header>
          <div className="mx-auto max-w-md min-h-[calc(100dvh-56px)]">{children}</div>
          <nav className="mx-auto max-w-md sticky bottom-0 bg-white border-t">
            <div className="grid grid-cols-2 text-center">
              <Link href="/auth/login" className="py-3 text-zinc-700">Login</Link>
              <Link href="/eventos" className="py-3 text-zinc-700">Eventos</Link>
            </div>
          </nav>
        </Providers>
        <script dangerouslySetInnerHTML={{__html:`if('serviceWorker' in navigator){addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(console.error))}`}} />
      </body>
    </html>
  );
}
