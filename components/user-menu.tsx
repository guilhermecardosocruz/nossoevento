"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-sm shadow-sm hover:bg-zinc-50"
      >
        ☰ Menu
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-44 rounded-2xl border bg-white p-1 shadow-lg"
        >
          <button
            role="menuitem"
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="w-full text-left rounded-xl px-3 py-2 text-sm hover:bg-zinc-100"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}

