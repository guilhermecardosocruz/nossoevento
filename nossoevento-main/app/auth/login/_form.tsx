"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validators";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CPFInput } from "@/components/cpf-input";
import { AuthShell } from "@/components/auth/shell";
import { Field } from "@/components/form/field";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await signIn("credentials", {
        cpf: data.cpf,
        password: data.password,
        redirect: false,
      });
      if (res?.error) {
        toast.error("CPF ou senha inválidos");
        return;
      }
      toast.success("Login realizado!");
      router.push("/logado");
    } catch {
      toast.error("Erro de rede");
    }
  };

  return (
    <AuthShell
      title="Entrar"
      subtitle="Use seu CPF e senha para acessar"
      footer={
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <p>
            Não tem conta?{" "}
            <Link
              href="/auth/register"
              className="font-medium underline underline-offset-4"
            >
              Cadastrar
            </Link>
          </p>
          <Link
            href="/auth/forgot"
            className="underline underline-offset-4"
          >
            Esqueci minha senha
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="CPF" error={errors.cpf?.message ?? null}>
          <CPFInput
            inputMode="numeric"
            autoComplete="username"
            placeholder="000.000.000-00"
            {...register("cpf")}
          />
        </Field>

        <Field label="Senha" error={errors.password?.message ?? null}>
          <Input
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            {...register("password")}
          />
        </Field>

        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </AuthShell>
  );
}

