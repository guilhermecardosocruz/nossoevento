// lib/validators.ts
import { z } from "zod";
import { onlyDigits, isValidCPF } from "./cpf";

/* ---------- Normalizadores ---------- */
const toTrimmed = (v: unknown) => String(v ?? "").trim().replace(/\s+/g, " ");
const toEmailLower = (v: unknown) => String(v ?? "").trim().toLowerCase();
const toCPF = (v: unknown) => onlyDigits(v).slice(0, 11);
const toPhone = (v: unknown) => onlyDigits(v).slice(0, 11);

/* ---------- REGISTER (sem birthDate) ---------- */
export const registerSchema = z.object({
  name: z.preprocess(toTrimmed, z.string().min(2, "Informe seu nome")),
  cpf: z.preprocess(
    toCPF,
    z
      .string()
      .length(11, "CPF deve ter 11 dígitos")
      .refine(isValidCPF, "CPF inválido")
  ),
  phone: z.preprocess(
    toPhone,
    z
      .string()
      .min(10, "Telefone inválido")
      .max(11, "Telefone inválido")
  ),
  email: z.preprocess(toEmailLower, z.string().email("E-mail inválido")),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

/* ---------- LOGIN ---------- */
export const loginSchema = z.object({
  cpf: z.preprocess(
    toCPF,
    z
      .string()
      .length(11, "CPF deve ter 11 dígitos")
      .refine(isValidCPF, "CPF inválido")
  ),
  password: z.string().min(1, "Informe a senha"),
});

/* ---------- Tipos ---------- */
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

