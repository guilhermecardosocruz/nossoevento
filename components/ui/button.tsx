import * as React from "react";
import clsx from "clsx";
type Variant = "default" | "outline" | "secondary";
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean; variant?: Variant; children: React.ReactNode; };
export function Button({ asChild, className, variant = "default", children, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants: Record<Variant, string> = {
    default: "bg-black text-white hover:bg-zinc-800 focus:ring-black",
    outline: "border border-zinc-300 hover:bg-zinc-50",
    secondary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-600",
  };
  const cn = clsx(base, variants[variant], className);
  if (asChild && React.isValidElement(children)) return React.cloneElement(children as any, { className: clsx((children as any).props?.className, cn) });
  return <button className={cn} {...props}>{children}</button>;
}
