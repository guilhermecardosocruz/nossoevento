"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";

function maskCPF(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

type Props = React.ComponentProps<typeof Input>;

export const CPFInput = React.forwardRef<HTMLInputElement, Props>(
  ({ onChange, value, ...props }, ref) => {
    const [val, setVal] = React.useState<string>(String(value ?? ""));

    // 🔄 sincroniza quando o valor vem de fora (ex.: RHF reset)
    React.useEffect(() => {
      setVal(String(value ?? ""));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const masked = maskCPF(e.target.value);
      setVal(masked);

      // Propaga para o consumidor mantendo o mesmo evento,
      // mas com o value já mascarado
      if (onChange) {
        // cria um clone raso e ajusta apenas o target.value
        const cloned = { ...e, target: { ...e.target, value: masked } } as React.ChangeEvent<HTMLInputElement>;
        onChange(cloned);
      }
    };

    return (
      <Input
        ref={ref}
        inputMode="numeric"
        autoComplete="off"
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

