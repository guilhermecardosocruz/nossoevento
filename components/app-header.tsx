// components/app-header.tsx
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo-b2g-white.png"; // use o PNG/SVG que você já colocou em /public

export default function AppHeader() {
  return (
    <header className="w-full bg-[#F36A00]">
      <div className="mx-auto flex h-24 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="inline-flex items-center">
          <Image src={Logo} alt="B2G" width={96} height={40} priority />
        </Link>

        <div className="flex items-center gap-6 text-white">
          <button aria-label="Favoritos" className="transition-opacity hover:opacity-90">
            <HeartIcon className="h-7 w-7" />
          </button>
          <Link href="/auth/login" aria-label="Conta" className="transition-opacity hover:opacity-90">
            <UserIcon className="h-7 w-7" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function HeartIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}
function UserIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

