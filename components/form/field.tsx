import React, { isValidElement, cloneElement, useId, type PropsWithChildren } from "react";
import clsx from "clsx";

type FieldProps = PropsWithChildren<{
  label: string;
  error?: string | null;
  description?: string;
  hint?: string;            // alias compatível
  className?: string;
  showLabel?: boolean;
  inputId?: string;
}>;

export function Field({
  label,
  error = null,
  description,
  hint,
  className,
  showLabel = false,
  inputId,
  children,
}: FieldProps) {
  const reactId = useId();
  const id = inputId ?? `field-${reactId}`;
  const errorId = `${id}-error`;
  const descId = `${id}-desc`;

  const helpText = description ?? hint ?? null;

  const control = isValidElement(children)
    ? cloneElement(children as React.ReactElement<any>, {
        id,
        "aria-invalid": Boolean(error),
        "aria-describedby":
          [helpText ? descId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined,
      } as any)
    : children;

  return (
    <div className={clsx("grid gap-1.5", className)}>
      <label htmlFor={id} className={clsx("text-sm font-medium text-zinc-800", !showLabel && "sr-only")}>
        {label}
      </label>

      {control}

      {helpText ? (
        <p id={descId} className="text-xs text-zinc-500">
          {helpText}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} role="alert" aria-live="polite" className="text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

