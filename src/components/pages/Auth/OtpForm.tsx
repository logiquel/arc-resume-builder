// OtpForm.tsx
import { Icon } from "@iconify/react";
import { useForm } from "@tanstack/react-form";

interface OtpFormData {
  otp: string;
}

interface OtpFormProps {
  email: string;
  onVerify: (otp: string) => void | Promise<void>;
  onBack: () => void;
  title?: string;
  description?: string;
  backLabel?: string;
  submitLabel?: string;
  submittingLabel?: string;
  isSubmitting?: boolean; // Added to intercept external mutation status cleanly
}

const OtpForm = ({
  email,
  onVerify,
  onBack,
  title = "Verify Your Email",
  description,
  backLabel = "Back to registration",
  submitLabel = "Verify OTP",
  submittingLabel = "Verifying...",
  isSubmitting: externalIsSubmitting, // Map external loading states
}: OtpFormProps) => {
  const form = useForm({
    defaultValues: {
      otp: "",
    } satisfies OtpFormData,
    onSubmit: async ({ value }) => {
      await onVerify(value.otp);
    },
  });

  return (
    <>
      <div className="mb-8">
        <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
        <p className="text-xs text-text-muted mt-1">
          {description ?? `Enter the OTP sent to ${email}`}
        </p>
      </div>

      <button
        type="button"
        onClick={onBack}
        disabled={externalIsSubmitting}
        className="mb-6 text-xs text-brand hover:text-brand-hover flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icon icon="akar-icons:arrow-left" className="text-tiny" />
        {backLabel}
      </button>

      <form.Field
        name="otp"
        validators={{
          onChange: ({ value }) => {
            if (!value.trim()) return "OTP is required";
            if (value.length !== 8) return "OTP must be 8 digits";
            return undefined;
          },
        }}
      >
        {(field) => (
          <div className="mb-6">
            <label className="text-tiny font-medium text-brand mb-1 block">
              OTP CODE
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={8}
              value={field.state.value}
              onChange={(e) =>
                field.handleChange(e.target.value.replace(/\D/g, ""))
              }
              onBlur={field.handleBlur}
              disabled={externalIsSubmitting} // Lock input during verification
              className="w-full outline-none border-b border-gray-200 placeholder:text-text-muted/50 placeholder:text-xxs focus:border-brand text-xs py-1 mt-1 transition-colors disabled:opacity-60"
              placeholder="000000"
            />
            {field.state.meta.isTouched &&
              field.state.meta.errors.length > 0 && (
                <span className="text-tiny text-destructive mt-1 block">
                  {field.state.meta.errors.join(", ")}
                </span>
              )}
          </div>
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => ({
          internalSubmitting: state.isSubmitting,
          canSubmit: state.canSubmit,
        })}
      >
        {({ internalSubmitting, canSubmit }) => {
          // Combine both form submission state and query mutation states safely
          const loading = internalSubmitting || externalIsSubmitting;

          return (
            <button
              type="button"
              onClick={() => form.handleSubmit()}
              disabled={!canSubmit || loading}
              className="flex items-center rounded-full gap-2 bg-brand p-0.5 transition-all hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="text-xs text-white pl-4">
                {loading ? submittingLabel : submitLabel}
              </span>
              <div className="h-8 aspect-square flex items-center justify-center bg-brand-hover rounded-full p-2">
                {loading ? (
                  <Icon
                    icon="eos-icons:loading"
                    className="text-white animate-spin"
                  />
                ) : (
                  <Icon
                    icon="akar-icons:arrow-up"
                    className="text-white rotate-45"
                  />
                )}
              </div>
            </button>
          );
        }}
      </form.Subscribe>
    </>
  );
};

export default OtpForm;
