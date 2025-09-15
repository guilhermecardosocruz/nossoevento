"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

/** 
 * Aplica máscara no CPF: 000.000.000-00 
 */
function maskCPF(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export type CPFInputProps = React.ComponentProps<typeof Input>;

export const CPFInput = React.forwardRef<HTMLInputElement, CPFInputProps>(
  ({ onChange, value, ...props }, ref) => {
    const [val, setVal] = React.useState<string>(String(value ?? ""));

    // Sincroniza com valor externo (ex.: RHF reset)
    React.useEffect(() => {
      setVal(String(value ?? ""));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const masked = maskCPF(e.target.value);
      setVal(masked);

      // Propaga evento com valor mascarado
      onChange?.({
        ...e,
        target: { ...e.target, value: masked },
      } as React.ChangeEvent<HTMLInputElement>);
    };

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        autoComplete="username" // ajuda no autofill de login
        aria-label="CPF"
        placeholder="000.000.000-00"
        maxLength={14}
        value={val}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

CPFInput.displayName = "CPFInput";

