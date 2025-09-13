
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LogadoPage() {
  const session = await auth();

  // Se não houver sessão, redireciona para login
  if (!session) {
    redirect("/auth/login?callbackUrl=/logado");
  }

  // Usa o nome do usuário se existir, caso contrário exibe "usuário"
  const name = session.user?.name ?? "usuário";

  return (
    <main className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-semibold">
          Bem-vindo, {name} 🎉
        </h1>
        <p className="text-muted-foreground">
          Você está logado! Em breve adicionaremos funcionalidades
          e informações personalizadas nesta área.
        </p>
      </div>
    </main>
  );
}

