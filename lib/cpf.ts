export function onlyDigits(v: string) { return v.replace(/\D/g, ""); }
export function isValidCPF(cpfRaw: string): boolean {
  const cpf = onlyDigits(cpfRaw);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;
  let s1 = 0, s2 = 0;
  for (let i = 0; i < 9; i++) {
    const n = parseInt(cpf[i], 10);
    s1 += n * (10 - i); s2 += n * (11 - i);
  }
  const d1 = (s1 * 10) % 11 % 10; s2 += d1 * 2;
  const d2 = (s2 * 10) % 11 % 10;
  return d1 === parseInt(cpf[9],10) && d2 === parseInt(cpf[10],10);
}
