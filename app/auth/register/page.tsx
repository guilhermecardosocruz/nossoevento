"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/validators";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CPFInput } from "@/components/cpf-input";
import { AuthShell } from "@/components/auth/shell";
import { Field } from "@/components/form/field";
import { toast } from "sonner";
import ky from "ky";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

type FormData = z.infer<typeof registerSchema>;

/** ---- máscara telefone BR ---- */
const maskPhoneBR = (value: string) => {
  const v = value.replace(/\D/g, "").slice(0, 11);
  if (v.length <= 2) return `(${v}`;
  if (v.length <= 7) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
  return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
};

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      cpf: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Máscara de telefone
  const onPhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const masked = maskPhoneBR(e.target.value);
      setValue("phone", masked, { shouldValidate: true });
    },
    [setValue]
  );

  const onSubmit = async (data: FormData) => {
    try {
      // Envie só o necessário à API
      const payload = {
        name: data.name,
        cpf: data.cpf,
        phone: data.phone,
        email: data.email,
        password: data.password,
      };

      await ky.post("/api/register", { json: payload });

      toast.success("Conta criada! Faça login.");
      reset();
      router.push("/auth/login");
    } catch (e: any) {
      const status = e?.response?.status;
      if (status === 409) {
        toast.error("CPF/E-mail já cadastrado");
      } else if (status === 400) {
        toast.error("Dados inválidos");
      } else {
        toast.error("Erro de rede");
      }
    }
  };

  const password = watch("password");

  return (
    <AuthShell title="Criar conta" subtitle="Preencha seus dados para continuar">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Nome completo" error={errors.name?.message}>
          <Input placeholder="Nome Completo" {...register("name")} />
        </Field>

        <Field label="CPF" error={errors.cpf?.message}>
          <CPFInput
            placeholder="000.000.000-00"
            inputMode="numeric"
            {...register("cpf")}
          />
        </Field>

        <Field label="Telefone" hint="Com DDD" error={errors.phone?.message}>
          <Input
            placeholder="(11) 99999-9999"
            inputMode="numeric"
            {...register("phone")}
            onChange={onPhoneChange}
          />
        </Field>

        <Field label="E-mail" error={errors.email?.message}>
          <Input
            type="email"
            placeholder="voce@exemplo.com"
            {...register("email")}
          />
        </Field>

        <Field
          label="Senha"
          hint="Mínimo 6 caracteres"
          error={errors.password?.message}
        >
          <Input type="password" placeholder="Senha" {...register("password")} />
        </Field>

        <Field
          label="Confirmar senha"
          error={errors.confirmPassword?.message}
          hint={password ? "Repita a mesma senha" : undefined}
        >
          <Input
            type="password"
            placeholder="Repita a senha"
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
        </Field>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Enviando..." : "Cadastrar"}
        </Button>
      </form>
    </AuthShell>
  );
}

