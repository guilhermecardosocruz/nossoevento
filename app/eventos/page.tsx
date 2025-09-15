export default function EventosPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <section className="text-center max-w-md">
        <h1 className="text-3xl font-bold text-gray-800">
          Ainda não há eventos cadastrados
        </h1>
        <p className="mt-3 text-gray-600">
          Volte mais tarde ou aguarde o primeiro evento ser publicado.
        </p>
      </section>
    </main>
  );
}

