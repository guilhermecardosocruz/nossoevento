"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export function UserMenu({ name }: { name?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        className="h-9 px-3 rounded-xl border bg-white text-zinc-900 shadow-sm"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        ☰ Menu
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-xl border bg-white shadow-lg overflow-hidden"
          role="menu"
        >
          <div className="px-3 py-2 text-sm text-zinc-600">Olá, {name ?? "usuário"}!</div>
          <button
            className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-50"
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            role="menuitem"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}

