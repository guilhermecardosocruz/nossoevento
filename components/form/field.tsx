import React, {
  PropsWithChildren,
  isValidElement,
  cloneElement,
  useId,
  ReactElement,
} from "react";
import clsx from "clsx";

type FieldProps = PropsWithChildren<{
  label: string;
  error?: string;
  description?: string;
  className?: string;
  showLabel?: boolean; // quando false, usa sr-only
  inputId?: string; // força um id estável se necessário
  required?: boolean; // exibe * e propaga aria-required
}>;

export function Field({
  label,
  error,
  description,
  className,
  showLabel = false,
  inputId,
  required = false,
  children,
}: FieldProps) {
  const reactId = useId();
  const id = inputId ?? `field-${reactId}`;
  const errorId = `${id}-error`;
  const descId = `${id}-desc`;
  const describedBy =
    [description ? descId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  // Clona TODOS os filhos válidos aplicando atributos de acessibilidade
  const controls = React.Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    const el = child as ReactElement<any>;
    return cloneElement(el, {
      id: el.props.id ?? id, // preserva id se já existir
      "aria-invalid": !!error,
      "aria-describedby":
        [el.props["aria-describedby"], describedBy].filter(Boolean).join(" ") || undefined,
      "aria-required": required || undefined,
    });
  });

  return (
    <div className={clsx("grid gap-1.5", className)}>
      <label
        htmlFor={id}
        className={clsx("text-sm font-medium text-zinc-800", !showLabel && "sr-only")}
      >
        {label}
        {required && (
          <span aria-hidden="true" className="ml-1 text-red-600">
            *
          </span>
        )}
      </label>

      {controls}

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

