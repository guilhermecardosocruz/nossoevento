// app/(app)/app/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Button } from "@/components/ui/button";

export default async function AppHome() {
  const events = await prisma.event.findMany({
    where: { isPublished: true, startsAt: { gte: new Date() } },
    orderBy: { startsAt: "asc" },
    take: 10,
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <Button asChild className="w-full">
          <Link href="/app/pesquisar?tipo=pre">Evento Pré-Pago</Link>
        </Button>
        <Button asChild variant="secondary" className="w-full">
          <Link href="/app/pesquisar?tipo=pos">Evento Pós-Pago</Link>
        </Button>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-teal-700">Eventos Públicos</h2>
        <ul className="space-y-3">
          {events.map((e) => (
            <li
              key={e.id}
              className="flex gap-3 rounded-2xl border p-3 hover:bg-zinc-50"
            >
              {/* Thumb “fake” por enquanto */}
              <div className="h-16 w-24 rounded-xl bg-gradient-to-br from-zinc-200 to-zinc-300" />

              <div className="flex-1">
                <div className="text-sm font-medium leading-5">{e.title}</div>
                <div className="text-xs text-zinc-500">
                  {format(e.startsAt, "d 'de' MMMM yyyy", { locale: ptBR })}
                </div>
                {e.location && (
                  <div className="text-xs text-zinc-500">{e.location}</div>
                )}
              </div>

              <Button asChild size="sm" variant="outline">
                <Link href={`/app/eventos?id=${e.id}`}>Detalhes</Link>
              </Button>
            </li>
          ))}

          {events.length === 0 && (
            <li className="text-sm text-zinc-500">Nenhum evento publicado.</li>
          )}
        </ul>
      </section>
    </div>
  );
}

