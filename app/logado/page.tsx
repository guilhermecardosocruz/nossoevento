import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LogadoPage() {
  const session = await auth();

  // Redireciona para login se não houver sessão
  if (!session) {
    redirect("/auth/login?callbackUrl=/logado");
  }

  const name = session.user?.name ?? "usuário";

  return (
    <main className="min-h-[60vh] flex items-center justify-center p-6">
      <section className="max-w-md w-full text-center space-y-4">
        <h1 className="text-3xl font-bold">
          Bem-vindo, {name} 🎉
        </h1>
        <p className="text-muted-foreground">
          Você está logado! Em breve adicionaremos funcionalidades
          e informações personalizadas nesta área.
        </p>

        {/* Botão de sair opcional */}
        {/* 
        <form action="/api/auth/signout" method="post">
          <button
            type="submit"
            className="mt-4 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            Sair
          </button>
        </form>
        */}
      </section>
    </main>
  );
}

