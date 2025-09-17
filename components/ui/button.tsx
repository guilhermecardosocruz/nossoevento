// components/ui/button.tsx
"use client";

import * as React from "react";
import clsx from "clsx";

/** Slot minimalista para suportar `asChild` (ex: <Link>) */
type SlotProps = React.HTMLAttributes<HTMLElement> & { asChild?: boolean };
const Slot = ({ asChild, children, ...props }: SlotProps) =>
  asChild ? React.cloneElement(React.Children.only(children as React.ReactElement), props) : <button {...props} />;

type Variant = "default" | "outline" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  asChild?: boolean;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ring-offset-white disabled:opacity-50 disabled:pointer-events-none select-none";
const variants: Record<Variant, string> = {
  default: "bg-black text-white hover:bg-zinc-800 focus:ring-black",
  outline: "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 focus:ring-zinc-400",
  secondary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-600",
  ghost: "bg-transparent text-zinc-900 hover:bg-zinc-100 focus:ring-zinc-300",
};
const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild,
      className,
      variant = "default",
      size = "md",
      fullWidth,
      isLoading,
      disabled,
      leftIcon,
      rightIcon,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const classes = clsx(
      base,
      variants[variant],
      sizes[size],
      fullWidth && "w-full",
      className
    );

    const Comp: any = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={classes}
        // data-attrs úteis p/ testes/estilos (ex: [data-variant="outline"])
        data-variant={variant}
        data-size={size}
        aria-busy={isLoading || undefined}
        disabled={disabled || isLoading}
        type={asChild ? undefined : type}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner />
            <span className="sr-only">Carregando…</span>
          </>
        ) : (
          <>
            {leftIcon && <span aria-hidden="true" className="inline-flex">{leftIcon}</span>}
            {children}
            {rightIcon && <span aria-hidden="true" className="inline-flex">{rightIcon}</span>}
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

/** Spinner minimalista (SVG) */
function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

