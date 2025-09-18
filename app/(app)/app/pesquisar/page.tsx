// app/(app)/app/pesquisar/page.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/form/field";

export default function PesquisarPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [tipo, setTipo] = useState(params.get("tipo") ?? "");
  const [data, setData] = useState("");
  const [local, setLocal] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const qs = new URLSearchParams();
    if (tipo) qs.set("tipo", tipo);
    if (data) qs.set("data", data);       // yyyy-mm-dd
    if (local) qs.set("local", local);
    router.push(`/app/eventos?${qs.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <h2 className="text-2xl font-bold">Pesquisar</h2>

      <div>
        <div className="text-xs font-semibold text-zinc-500 mb-2">Filtro</div>

        <Field label="Tipo de evento" hint="">
          <Input
            placeholder="Ex.: Show, Festa…"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          />
        </Field>

        <Field label="Data" hint="">
          <Input type="date" value={data} onChange={(e) => setData(e.target.value)} />
        </Field>

        <Field label="Local" hint="">
          <Input
            placeholder="Cidade, bairro…"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
          />
        </Field>
      </div>

      <Button type="submit" className="w-full">OK</Button>
    </form>
  );
}

