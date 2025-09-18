// app/(app)/app/eventos/page.tsx
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR"; 

type Props = {
  searchParams: { tipo?: string; data?: string; local?: string };
};

export default async function EventosFiltrados({ searchParams }: Props) {
  const where: any = { isPublished: true };

  if (searchParams.local) {
    where.location = { contains: searchParams.local, mode: "insensitive" };
  }

  if (searchParams.data) {
    const d = new Date(searchParams.data);
    const end = new Date(d);
    end.setHours(23, 59, 59, 999);
    where.startsAt = { gte: d, lte: end };
  }

  // `tipo` ainda não existe no schema; por enquanto ignoramos ou você pode
  // mapear alguns termos em description/title.
  if (searchParams.tipo) {
    where.title = { contains: searchParams.tipo, mode: "insensitive" };
  }

  const events = await prisma.event.findMany({
    where,
    orderBy: { startsAt: "asc" },
    take: 30,
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Eventos</h2>
      <ul className="space-y-3">
        {events.map((e) => (
          <li key={e.id} className="flex gap-3 rounded-2xl border p-3">
            <div className="h-16 w-24 rounded-xl bg-gradient-to-br from-zinc-200 to-zinc-300" />
            <div className="flex-1">
              <div className="text-sm font-medium leading-5">{e.title}</div>
              <div className="text-xs text-zinc-500">
                {format(e.startsAt, "EEE, dd/MM, HH:mm", { locale: ptBR })}
              </div>
              {e.location && (
                <div className="text-xs text-zinc-500">{e.location}</div>
              )}
            </div>
          </li>
        ))}
        {events.length === 0 && (
          <li className="text-sm text-zinc-500">Nenhum evento encontrado.</li>
        )}
      </ul>
    </div>
  );
}

