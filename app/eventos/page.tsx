// app/eventos/page.tsx
import Link from "next/link";

const CTABtn = ({ children }: { children: React.ReactNode }) => (
  <button className="inline-flex items-center gap-2 rounded-lg bg-[#F36A00] px-6 py-3 font-semibold text-white shadow-sm transition hover:brightness-95">
    {children}
  </button>
);

export default function EventosPublicosPage() {
  // mock de dados
  const eventos = [
    { id: "1", titulo: "Reabjërurs, OZ", info: "Sax. 22f04, 22 horas", preco: "R$ 50,00" },
    { id: "2", titulo: "Fejjurs; Placa Luunge", info: "Sax, 32f4, 22 horas", preco: "R$ 50,00" },
    { id: "3", titulo: "4 Amigos. Ellas Angälon", info: "22 horas", preco: "R$ 50,00" },
  ];

  return (
    <main className="min-h-svh bg-white">
      <div className="mx-auto max-w-6xl px-6 pb-16">
        {/* faixa de CTAs */}
        <div className="-mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <CTABtn>🎟️ Evento Pré-Pago</CTABtn>
          <CTABtn>🧾 Evento Pós-Pago</CTABtn>
        </div>

        {/* título seção */}
        <h2 className="mt-10 text-lg font-semibold text-emerald-700">Eventos Públicos</h2>

        {/* Pesquisar / Filtro */}
        <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-3 text-2xl font-bold text-neutral-700">
              <SearchIcon className="h-6 w-6" />
              <span>Pesquisar</span>
            </div>
            <div className="mt-2 h-[2px] w-full max-w-sm bg-neutral-200" />
          </div>
          <div>
            <div className="flex items-center gap-3 text-2xl font-bold text-neutral-700">
              <FilterIcon className="h-6 w-6" />
              <span>Filtro</span>
            </div>
            <div className="mt-2 h-[2px] w-full max-w-sm bg-neutral-200" />
          </div>
        </div>

        {/* Cards */}
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          {eventos.map((e) => (
            <article key={e.id} className="rounded-xl border border-neutral-200 p-4 shadow-sm">
              {/* thumbnail placeholder; troque por <Image src="/events/1.jpg" .../> quando tiver imagens */}
              <div className="mb-4 h-28 w-full rounded-lg bg-neutral-200" />
              <Link href={`/eventos/${e.id}`} className="block font-semibold text-teal-700 hover:underline">
                {e.titulo}
              </Link>
              <p className="text-sm text-neutral-600">{e.info}</p>
              <p className="mt-1 font-semibold">{e.preco}</p>

              <div className="mt-4 flex items-center gap-3">
                <button className="flex-1 rounded-md bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110">
                  Comprar
                </button>
                <Link
                  href={`/eventos/${e.id}`}
                  className="flex-1 rounded-md bg-teal-600/90 px-4 py-2.5 text-center text-sm font-semibold text-white hover:brightness-110"
                >
                  Mais detalhes
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

function SearchIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
function FilterIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M6 12h12M10 18h4" />
    </svg>
  );
}

