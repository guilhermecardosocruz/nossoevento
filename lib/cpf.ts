// lib/cpf.ts

/** Mantém apenas dígitos (aceita string ou number). */
export const onlyDigits = (s: string | number): string =>
  String(s ?? "").replace(/\D/g, "");

/** Formata o CPF progressivamente: 000.000.000-00 */
export function formatCPF(input: string | number): string {
  const v = onlyDigits(input).slice(0, 11);
  if (v.length <= 3) return v;
  if (v.length <= 6) return `${v.slice(0, 3)}.${v.slice(3)}`;
  if (v.length <= 9) return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6)}`;
  return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6, 9)}-${v.slice(9, 11)}`;
}

/** Valida CPF pelo algoritmo oficial (descarta sequências repetidas). */
export function isValidCPF(input: string | number): boolean {
  const cpf = onlyDigits(input);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false; // 000... / 111... etc.

  const calc = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) {
      sum += Number(cpf[i]) * (len + 1 - i);
    }
    const mod = (sum * 10) % 11;
    return mod === 10 ? 0 : mod;
  };

  const d1 = calc(9);
  if (d1 !== Number(cpf[9])) return false;

  const d2 = calc(10);
  return d2 === Number(cpf[10]);
}

/** Garante CPF válido: retorna apenas dígitos ou lança erro. Útil em Server Actions/APIs. */
export function assertValidCPF(input: string | number): string {
  const digits = onlyDigits(input);
  if (!isValidCPF(digits)) throw new Error("CPF inválido");
  return digits;
}

/** Regex para CPF já formatado (###.###.###-##). Útil para máscara/inputs. */
export const CPF_FORMATTED_REGEX = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

