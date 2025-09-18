// app/(app)/app/layout.tsx
import type { PropsWithChildren } from "react";
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function AppLayout({ children }: PropsWithChildren) {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-screen-sm h-14 px-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Eventeasy</h1>

          {/* Sair direto do header */}
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/auth/login" });
            }}
          >
            <Button size="sm" variant="outline">Sair</Button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-screen-sm w-full flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}

