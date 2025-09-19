// app/auth/layout.tsx
export const metadata = {
  title: 'Login — B2G',
  description: 'Entre para descobrir os melhores eventos',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // layout simples para telas de auth (sem header global)
  return <>{children}</>;
}

