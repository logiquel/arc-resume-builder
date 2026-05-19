import { Field, FieldDescription, FieldLabel } from "#/components/addons/field";
import { Input } from "#/components/addons/input";
import type { AnyFieldApi } from "@tanstack/react-form";

interface TextInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "onBlur"
> {
  // TanStack specific field controller (Optional)
  field?: AnyFieldApi;

  // Standard fallback props for vanilla usage
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;

  // Common UI Layout Props
  label?: string;
  description?: string;
  required?: boolean;
  inputClass?: string;
}

export function TextInput({
  field,
  value,
  onChange,
  onBlur,
  error,
  label,
  placeholder,
  description,
  type = "text",
  required = false,
  id,
  className,
  inputClass,
  ...props // Captures any other standard native HTML input attributes (disabled, autoFocus, etc.)
}: TextInputProps) {
  // 1. Resolve State Pipeline: Prioritize TanStack Form, fall back to explicit primitive props
  const activeValue = field ? field.state.value : (value ?? "");
  const activeError = field ? field.state.meta.errors[0] : error;
  const hasError = !!activeError;
  const inputId = id || field?.name;

  // 2. Resolve Event Pipeline
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (field) field.handleChange(val);
    if (onChange) onChange(val);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (field) field.handleBlur();
    if (onBlur) onBlur(e);
  };

  return (
    <Field data-invalid={hasError} className={className}>
      {label && (
        <FieldLabel htmlFor={inputId}>
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </FieldLabel>
      )}

      <Input
        id={inputId}
        type={type}
        placeholder={placeholder}
        aria-invalid={hasError}
        value={activeValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        className={inputClass}
        {...props}
      />

      {hasError ? (
        <p className="text-tiny text-destructive leading-normal font-normal pl-1">
          {activeError}
        </p>
      ) : description ? (
        <FieldDescription className="text-tiny! pl-1 text-text-secondary">
          {description}
        </FieldDescription>
      ) : null}
    </Field>
  );
}
