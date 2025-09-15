// components/auth/shell.tsx
import type { PropsWithChildren, ReactNode } from "react";

type AuthShellProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  footer?: ReactNode;
}>;

export function AuthShell({ title, subtitle, footer, children }: AuthShellProps) {
  return (
    <main className="px-4 py-6">
      <div className="mx-auto max-w-md bg-white border shadow-sm rounded-2xl p-5 grid gap-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">{title}</h1>
          {subtitle ? <p className="text-sm text-zinc-500 mt-1">{subtitle}</p> : null}
        </div>

        {children}

        {footer ? <div className="pt-2">{footer}</div> : null}
      </div>
    </main>
  );
}

