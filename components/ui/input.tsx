import * as React from "react";
import clsx from "clsx";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={clsx(
        "w-full rounded-2xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-600",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";

