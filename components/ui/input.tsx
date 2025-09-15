import * as React from "react";
import clsx from "clsx";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={clsx(
        // base
        "w-full rounded-2xl border px-3 py-2 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed",
        // cores / tema
        "bg-white text-zinc-900 border-zinc-300 placeholder:text-zinc-400",
        "dark:bg-zinc-900 dark:text-zinc-50 dark:border-zinc-700 dark:placeholder:text-zinc-500",
        // focus
        "outline-none focus-visible:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent",
        // erro via aria-invalid (integrado com <Field />)
        "aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-600",
        // leve elevação no foco
        "shadow-sm focus:shadow",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";

