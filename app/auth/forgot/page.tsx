"use client";

import { z } from "zod";
import ky from "ky";
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthShell } from "@/components/auth/shell";
import { Field } from "@/components/form/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("E-mail inválido").transform((v) => v.trim().toLowerCase()),
});
type FormData = z.infer<typeof schema>;

export default function ForgotPage() {
  const [exists, setExists] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [sending, setSending] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const email = watch("email");

  const checkEmail = useCallback(async (value: string) => {
    if (!value) { setExists(null); return; }
    setChecking(true);
    try {
      const res = await ky.get(`/api/auth/forgot/check`, { searchParams: { email: value } }).json<{ exists: boolean }>();
      setExists(res.exists);
    } catch {
      setExists(null);
    } finally {
      setChecking(false);
    }
  }, []);

  const onSubmit = async ({ email }: FormData) => {
    setSending(true);
    try {
      await ky.post("/api/auth/forgot/request", { json: { email } });
      toast.success("Se o e-mail existir, enviaremos o link de recuperação.");
      setExists(null);
    } catch {
      toast.error("Não foi possível enviar o e-mail agora.");
    } finally {
      setSending(false);
    }
  };

  return (
    <AuthShell title="Recuperação de senha" subtitle="Informe seu e-mail de cadastro">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="E-mail" error={errors.email?.message ?? null}>
          <Input
            type="email"
            placeholder="seuemail@exemplo.com"
            {...register("email", { onBlur: (e) => checkEmail(e.target.value) })}
          />
        </Field>

        {/* Mostra o botão APENAS se o e-mail existir */}
        {exists ? (
          <Button type="submit" className="w-full" isLoading={sending}>
            Recuperar senha
          </Button>
        ) : (
          <Button className="w-full" variant="outline" disabled>
            {checking ? "Verificando..." : "Digite seu e-mail para continuar"}
          </Button>
        )}
      </form>
    </AuthShell>
  );
}

