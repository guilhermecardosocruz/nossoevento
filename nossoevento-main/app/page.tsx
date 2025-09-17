export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  try {
    const session = await auth();
    if (session) redirect("/logado");
  } catch {
    // se houver cookie antigo inválido, trata como não logado
  }
  redirect("/auth/login");
}

