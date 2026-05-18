import { Field, FieldDescription, FieldLabel } from '#/components/addons/field'
import { Input } from '#/components/addons/input'
import type { AnyFieldApi } from '@tanstack/react-form'

interface TextInputProps {
  field: AnyFieldApi
  label: string
  placeholder?: string
  description?: string
  type?: React.HTMLInputTypeAttribute
  required?: boolean
}

export function TextInput({
  field,
  label,
  placeholder,
  description,
  type = 'text',
  required = false,
}: TextInputProps) {
  const hasError = field.state.meta.errors.length > 0

  return (
    <Field data-invalid={hasError}>
      {label && (
        <FieldLabel htmlFor={field.name}>
          {label}
          {required && <span className="text-destructive">*</span>}
        </FieldLabel>
      )}
      <Input
        id={field.name}
        type={type}
        placeholder={placeholder}
        aria-invalid={hasError}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
      />
      {hasError ? (
        <p className="text-xxs text-destructive leading-normal font-normal mt-1">
          {field.state.meta.errors[0]}
        </p>
      ) : description ? (
        <FieldDescription className="mt-1">{description}</FieldDescription>
      ) : null}
    </Field>
  )
}
