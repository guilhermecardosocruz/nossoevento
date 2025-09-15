import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth();

  if (session) {
    // Usuário logado → manda para área logada
    redirect("/logado");
  }

  // Usuário não logado → manda para login
  redirect("/auth/login");
}

