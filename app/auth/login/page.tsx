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
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

type FormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors }, setValue } =
    useForm<FormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: FormData) => {
    const res = await signIn("credentials", {
      cpf: data.cpf,
      password: data.password,
      redirect: true,
      redirectTo: "/ingressos",
    });
    if ((res as any)?.error) toast.error("CPF ou senha inválidos");
  };

  return (
    <AuthShell title="Nosso Evento">
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
        <Field label="CPF" error={errors.cpf?.message}>
          <CPFInput aria-label="CPF" {...register("cpf")}
            onChange={(e:any)=> setValue("cpf", e.target.value, { shouldValidate: true })} />
        </Field>
        <Field label="Senha" error={errors.password?.message}>
          <Input aria-label="Senha" type="password" placeholder="Password" {...register("password")} />
        </Field>
        <Button type="submit" className="w-full">Entrar</Button>
        <Button asChild type="button" variant="secondary" className="w-full">
          <Link href="/auth/register">Cadastre-se</Link>
        </Button>
      </form>
    </AuthShell>
  );
}
