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

type FormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit, setValue, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: FormData) => {
    try {
      await ky.post("/api/register", { json: data });
      toast.success("Conta criada! Faça login.");
      router.push("/auth/login");
    } catch (e:any) {
      toast.error(e?.response ? "CPF/e-mail já cadastrado ou dados inválidos" : "Erro de rede");
    }
  };

  return (
    <AuthShell title="Nosso Evento" subtitle="Cadastro">
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
        <Field label="Nome" error={errors.name?.message}>
          <Input aria-label="Nome" placeholder="Nome" {...register("name")} />
        </Field>
        <Field label="CPF" error={errors.cpf?.message}>
          <CPFInput aria-label="CPF" {...register("cpf")}
            onChange={(e:any)=> setValue("cpf", e.target.value, { shouldValidate: true })} />
        </Field>
        <Field label="Data de nascimento" error={errors.birthDate?.message}>
          <Input aria-label="Data de nascimento" type="date" {...register("birthDate")} />
        </Field>
        <Field label="Telefone" error={errors.phone?.message}>
          <Input aria-label="Telefone" inputMode="tel" placeholder="(00) 00000-0000" {...register("phone")} />
        </Field>
        <Field label="E-mail" error={errors.email?.message}>
          <Input aria-label="E-mail" type="email" placeholder="email@exemplo.com" {...register("email")} />
        </Field>
        <Field label="Senha" error={errors.password?.message}>
          <Input aria-label="Senha" type="password" placeholder="Crie uma senha" {...register("password")} />
        </Field>
        <Button type="submit" className="w-full">Próximo</Button>
      </form>
    </AuthShell>
  );
}
