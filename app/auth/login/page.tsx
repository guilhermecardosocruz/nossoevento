// app/auth/login/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import LoginForm from './_form';

export default function LoginPage() {
  return (
    <main className="min-h-svh bg-gradient-to-b from-[#FF8A00] to-[#F36A00]">
      <div className="mx-auto flex min-h-svh max-w-sm flex-col px-5 pt-12 pb-6">
        {/* topo: logo + slogan */}
        <div className="flex flex-col items-center">
          <Image
            src="/public/logo_b2g_3"
            alt="B2G"
            width={180}
            height={72}
            priority
            className="select-none"
          />
          <p className="mt-1 text-center font-extrabold tracking-[0.25em] text-white/95">
            BORN TO GO
          </p>
        </div>

        {/* form */}
        <div className="mt-10 flex-1">
          <LoginForm />
        </div>

        {/* nav inferior */}
        <nav className="mt-8 grid grid-cols-2 text-2xl font-extrabold text-white">
          <Link href="/auth/login" className="text-left hover:opacity-90">
            Login
          </Link>
          <Link href="/eventos" className="text-right hover:opacity-90">
            Eventos
          </Link>
        </nav>
      </div>
    </main>
  );
}

