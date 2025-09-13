import React, { PropsWithChildren, isValidElement, cloneElement, useId } from "react";
import clsx from "clsx";

type FieldProps = PropsWithChildren<{
  label: string;
  error?: string;
  description?: string;
  className?: string;
  showLabel?: boolean;
  inputId?: string;
}>;

export function Field({
  label,
  error,
  description,
  className,
  showLabel = false,
  inputId,
  children,
}: FieldProps) {
  const reactId = useId();
  const id = inputId ?? `field-${reactId}`;
  const errorId = `${id}-error`;
  const descId = `${id}-desc`;

  const control = isValidElement(children)
    ? cloneElement(children as React.ReactElement, {
        id,
        "aria-invalid": !!error,
        "aria-describedby": [description ? descId : null, error ? errorId : null]
          .filter(Boolean)
          .join(" ") || undefined,
      })
    : children;

  return (
    <div className={clsx("grid gap-1.5", className)}>
      <label
        htmlFor={id}
        className={clsx("text-sm font-medium text-zinc-800", !showLabel && "sr-only")}
      >
        {label}
      </label>

      {control}

      {description ? (
        <p id={descId} className="text-xs text-zinc-500">
          {description}
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

