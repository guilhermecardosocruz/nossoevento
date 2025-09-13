// components/ui/button.tsx
import * as React from "react";
import clsx from "clsx";
// Se quiser usar <Link asChild>, mantenha este Slot simples:
const Slot = ({ asChild, children, ...props }: any) =>
  asChild ? React.cloneElement(React.Children.only(children), props) : <button {...props} />;

type Variant = "default" | "outline" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export type ButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  asChild?: boolean;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
};

const base =
  "inline-flex items-center justify-center rounded-2xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ring-offset-white";
const variants: Record<Variant, string> = {
  default: "bg-black text-white hover:bg-zinc-800 focus:ring-black",
  outline:
    "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 focus:ring-zinc-400",
  secondary:
    "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-600",
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
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const cn = clsx(
      base,
      variants[variant],
      sizes[size],
      fullWidth && "w-full",
      (disabled || isLoading) && "opacity-50 pointer-events-none",
      className
    );

    // Quando loading, marque o botão como ocupado para a11y
    const ariaBusy = isLoading ? { "aria-busy": true } : {};

    // Renderiza <button> por padrão; com asChild, injeta props no child (ex.: <Link>)
    const Comp: any = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn}
        disabled={disabled || isLoading}
        type={asChild ? undefined : type}
        {...ariaBusy}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span>Carregando…</span>
          </span>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

