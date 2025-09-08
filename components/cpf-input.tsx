"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
function maskCPF(v: string) {
  return v.replace(/\D/g, "").slice(0, 11).replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}
export const CPFInput = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof Input>>(
  ({ onChange, value, ...props }, ref) => {
    const [val, setVal] = React.useState(String(value ?? ""));
    return (
      <Input ref={ref} inputMode="numeric" autoComplete="on" aria-label="CPF" placeholder="000.000.000-00"
        value={val}
        onChange={(e) => { const v = maskCPF(e.target.value); setVal(v); onChange?.({ ...e, target: { ...e.target, value: v } } as any); }}
        {...props} />
    );
  }
);
CPFInput.displayName = "CPFInput";
