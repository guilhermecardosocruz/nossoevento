"use client";

import { z } from "zod";
import ky from "ky";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthShell } from "@/components/auth/shell";
import { Field } from "@/components/form/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const schema = z.object({
  password: z.string().min(6, "Mínimo 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirme sua senha"),
}).refine((d) => d.password === d.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});
type FormData = z.infer<typeof schema>;

export default function ResetPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await ky.post("/api/auth/forgot/reset", { json: { token, password: data.password } });
      toast.success("Senha alterada! Faça login.");
      router.push("/auth/login");
    } catch {
      toast.error("Link inválido ou expirado.");
    }
  };

  return (
    <AuthShell title="Definir nova senha">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Nova senha" error={errors.password?.message ?? null}>
          <Input type="password" placeholder="••••••••" {...register("password")} />
        </Field>
        <Field label="Confirmar senha" error={errors.confirmPassword?.message ?? null}>
          <Input type="password" placeholder="••••••••" {...register("confirmPassword")} />
        </Field>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Salvar nova senha"}
        </Button>
      </form>
    </AuthShell>
  );
}

