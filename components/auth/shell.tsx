import { PropsWithChildren } from "react";

type AuthShellProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  footer?: React.ReactNode; // permite passar links (ex: "Não tem conta?")
}>;

export function AuthShell({ title, subtitle, footer, children }: AuthShellProps) {
  return (
    <main className="px-4 py-8">
      <div className="mx-auto max-w-md bg-white border shadow-sm rounded-2xl p-6 grid gap-5">
        {/* Cabeçalho */}
        <header className="text-center space-y-1">
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </header>

        {/* Conteúdo principal */}
        <div className="space-y-4">{children}</div>

        {/* Footer opcional */}
        {footer && <footer className="pt-2">{footer}</footer>}
      </div>
    </main>
  );
}

