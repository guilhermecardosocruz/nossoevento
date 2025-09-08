import { z } from "zod";
import { isValidCPF } from "./cpf";

export const registerSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  cpf: z.string().refine(isValidCPF, "CPF inválido"),
  birthDate: z.string().refine((d)=>!Number.isNaN(Date.parse(d)), "Data inválida"),
  phone: z.string().min(8, "Telefone inválido").max(20),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export const loginSchema = z.object({
  cpf: z.string().refine(isValidCPF, "CPF inválido"),
  password: z.string().min(1, "Informe a senha"),
});
