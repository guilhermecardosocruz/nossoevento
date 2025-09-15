"use client";

import { useState } from "react";
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
import { onlyDigits } from "@/lib/cpf";

type FormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    try {
      // normaliza CPF para apenas dígitos, para casar com o que você salva no DB
      const cpf = onlyDigits(data.cpf);

      const res = await signIn("credentials", {
        cpf,
        password: data.password,
        redirect: false,
      });

      if (!res || res.error) {
        // marca erro no formulário e mostra toast
        setError("cpf", { message: "CPF ou senha inválidos" });
        setError("password", { message: " " }); // mantém layout do erro
        toast.error("CPF ou senha inválidos");
        return;
      }

      toast.success("Login realizado!");
      router.push("/logado");
    } catch (e) {
      toast.error("Erro de rede");
    }
  };

  return (
    <AuthShell
      title="Entrar"
      subtitle="Use seu CPF e senha para acessar"
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Não tem conta?{" "}
          <Link
            href="/auth/register"
            className="font-medium underline underline-offset-4"
          >
            Cadastrar
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="CPF" error={errors.cpf?.message}>
          <CPFInput
            inputMode="numeric"
            autoComplete="username"
            placeholder="000.000.000-00"
            aria-invalid={!!errors.cpf}
            disabled={isSubmitting}
            {...register("cpf")}
          />
        </Field>

        <Field label="Senha" error={errors.password?.message}>
          <div className="relative">
            <Input
              type={showPass ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              disabled={isSubmitting}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground underline underline-offset-4"
              aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
              tabIndex={-1}
            >
              {showPass ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </Field>

        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>

        <div className="text-center">
          <Link
            href="/auth/forgot"
            className="text-sm text-muted-foreground underline underline-offset-4"
          >
            Esqueci minha senha
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}

