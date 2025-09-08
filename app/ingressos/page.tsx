// app/ingressos/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function IngressosPage() {
  const session = await auth();
  if (!session) {
    redirect("/auth/login?callbackUrl=/ingressos");
  }

  const name = session.user?.name ?? "Guilherme";
  return (
    <main className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-semibold">Você conseguiu, {name} 🎉</h1>
        <p className="text-muted-foreground">
          Em breve seus ingressos aparecerão aqui.
        </p>
      </div>
    </main>
  );
}

