"use client";

import { useCallback } from "react";
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
import { onlyDigits } from "@/lib/cpf";

type FormData = z.infer<typeof registerSchema>;

/** ---- helpers de máscara ---- */
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
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      cpf: "",
      phone: "",
      email: "",
      password: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  // Máscara de telefone: (11) 99999-9999
  const onPhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const masked = maskPhoneBR(e.target.value);
      setValue("phone", masked, { shouldValidate: true, shouldDirty: true });
    },
    [setValue]
  );

  const onSubmit = async (data: FormData) => {
    try {
      // Normaliza os dados conforme o backend espera
      const payload = {
        name: data.name.trim(),
        cpf: onlyDigits(data.cpf),
        phone: onlyDigits(data.phone),
        email: data.email.trim().toLowerCase(),
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

  // Para não sobrescrever o onChange interno do RHF ao aplicar máscara
  const phoneReg = register("phone");

  return (
    <AuthShell title="Criar conta" subtitle="Preencha seus dados para continuar">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Nome completo" error={errors.name?.message}>
          <Input
            placeholder="Nome Completo"
            autoComplete="name"
            aria-invalid={!!errors.name}
            disabled={isSubmitting}
            {...register("name")}
          />
        </Field>

        <Field label="CPF" error={errors.cpf?.message}>
          <CPFInput
            placeholder="000.000.000-00"
            inputMode="numeric"
            autoComplete="username"
            aria-invalid={!!errors.cpf}
            disabled={isSubmitting}
            {...register("cpf")}
          />
        </Field>

        <Field label="Telefone" hint="Com DDD" error={errors.phone?.message}>
          <Input
            placeholder="(11) 99999-9999"
            inputMode="numeric"
            autoComplete="tel-national"
            aria-invalid={!!errors.phone}
            disabled={isSubmitting}
            {...phoneReg}
            onChange={(e) => {
              phoneReg.onChange(e); // mantém RHF em sincronia
              onPhoneChange(e);     // aplica máscara
            }}
          />
        </Field>

        <Field label="E-mail" error={errors.email?.message}>
          <Input
            type="email"
            placeholder="voce@exemplo.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            disabled={isSubmitting}
            {...register("email")}
          />
        </Field>

        <Field label="Senha" hint="Mínimo 6 caracteres" error={errors.password?.message}>
          <Input
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            disabled={isSubmitting}
            {...register("password")}
          />
        </Field>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Enviando..." : "Cadastrar"}
        </Button>
      </form>
    </AuthShell>
  );
}

