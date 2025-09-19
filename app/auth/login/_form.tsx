'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginForm() {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [usarBiometria, setUsarBiometria] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: autenticação real aqui (cpf, senha, usarBiometria)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        inputMode="numeric"
        autoComplete="username"
        placeholder="CPF"
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
        className="h-14 w-full rounded-2xl bg-white/95 px-5 text-[16px] leading-none text-neutral-800 placeholder:font-semibold placeholder:uppercase placeholder:tracking-wide shadow-sm outline-none ring-0 focus:ring-4 focus:ring-white/40"
      />

      <input
        type="password"
        autoComplete="current-password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        className="h-14 w-full rounded-2xl bg-white/95 px-5 text-[16px] leading-none text-neutral-800 placeholder:font-semibold placeholder:tracking-wide shadow-sm outline-none ring-0 focus:ring-4 focus:ring-white/40"
      />

      {/* biometria */}
      <label className="mt-2 flex cursor-pointer select-none items-center gap-3 text-white/90">
        <FingerprintIcon className="h-5 w-5" />
        <input
          type="checkbox"
          checked={usarBiometria}
          onChange={(e) => setUsarBiometria(e.target.checked)}
          className="h-5 w-5 rounded border-white/50 bg-transparent text-white accent-white"
        />
        <span className="text-[15px]">Usar biometria</span>
      </label>

      {/* CTA principal */}
      <button
        type="submit"
        className="h-14 w-full rounded-2xl bg-gradient-to-b from-[#FF8A00] to-[#F36A00] text-[16px] font-extrabold uppercase tracking-wider text-white shadow-lg transition-[transform,opacity] active:scale-[0.99]"
      >
        Entrar
      </button>

      {/* CTA secundário */}
      <Link
        href="/auth/register"
        className="block h-14 w-full rounded-2xl bg-white text-center text-[16px] font-extrabold uppercase tracking-wider text-[#F36A00] shadow"
      >
        <span className="inline-flex h-full items-center justify-center">Cadastre-se</span>
      </Link>

      <Link
        href="/auth/recover"
        className="block text-center text-[15px] font-semibold text-white/90 hover:text-white"
      >
        Recuperar senha
      </Link>
    </form>
  );
}

/** Ícone simples de impressão digital (SVG inline) */
function FingerprintIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2.75a8.25 8.25 0 0 0-8.25 8.25" />
      <path d="M20.25 11A8.25 8.25 0 0 0 12 2.75" />
      <path d="M6.5 11a5.5 5.5 0 0 1 11 0" />
      <path d="M4.75 15.5a7.25 7.25 0 0 0 2.5 4.75" />
      <path d="M16.75 20.25a7.25 7.25 0 0 0 2.5-4.75" />
      <path d="M9 11a3 3 0 0 1 6 0" />
      <path d="M9.5 13.5c0 2 .75 3.5 1.5 5" />
      <path d="M13 13.5c0 2-.5 3.5-1 5" />
    </svg>
  );
}

