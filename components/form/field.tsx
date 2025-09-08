import { ReactNode } from "react";
export function Field({label, children, error}: {label:string; children:ReactNode; error?:string}) {
  return (
    <div className="grid gap-1.5">
      <span className="sr-only">{label}</span>
      {children}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
