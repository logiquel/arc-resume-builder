// SignUpPage.tsx
import { Icon } from "@iconify/react";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import OtpForm from "./OtpForm";
import {
  useSignUpMutation,
  useVerifyOtpMutation,
} from "#/api/auth/auth.mutations";

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const SignUpPage = () => {
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [registeredEmail, setSignUpedEmail] = useState("");
  const [formData, setFormData] = useState<SignUpFormData | null>(null);
  const navigate = useNavigate();

  const signUpMutation = useSignUpMutation();
  const verifyOtpMutation = useVerifyOtpMutation();

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    } satisfies SignUpFormData,
    onSubmit: async ({ value }) => {
      // route registration workflow through your backend proxy
      signUpMutation.mutate(
        { email: value.email },
        {
          onSuccess: () => {
            setFormData(value);
            setSignUpedEmail(value.email);
            setShowOtpForm(true);
            console.log(
              "OTP successfully sent via server proxy to:",
              value.email,
            );
          },
          onError: (error: any) => {
            console.error("Registration endpoint request failure:", error);
            alert(
              error.message ||
                "Failed to issue registration OTP request. Please try again.",
            );
          },
        },
      );
    },
  });

  const handleVerifyOtp = async (otp: string) => {
    if (!formData) return;

    // Send the token challenge combined with the profile payload
    // to allow the server to securely provision the database entry.
    verifyOtpMutation.mutate(
      {
        email: registeredEmail,
        token: otp,
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        },
      },
      {
        onSuccess: (data) => {
          console.log("User entry and session built cleanly:", data.user);
          navigate({ to: "/dashboard" });
        },
        onError: (error: any) => {
          console.error("OTP verification service exception:", error);
          alert(
            error.message ||
              "Invalid or expired confirmation code. Please attempt registration again.",
          );
        },
      },
    );
  };

  // derived state for form activity status indicator
  const isPendingRequest =
    signUpMutation.isPending || verifyOtpMutation.isPending;

  return (
    <div className="w-full h-full flex">
      <div className="flex-1 h-full">
        <img
          src="../../../../public/login_screen_bg.jpg"
          className="h-full object-cover"
          alt="Registration background"
        />
      </div>

      <div className="w-[28vw] h-full p-8 overflow-y-auto">
        {!showOtpForm ? (
          <>
            <div className="mb-6">
              <h1 className="text-lg font-semibold text-text-primary">
                SignUp
              </h1>
              <p className="text-xxs text-text-muted font-normal mt-1">
                Fill in details to get started
              </p>
            </div>

            <div className="w-full flex flex-col gap-y-3 mb-4">
              <form.Field
                name="firstName"
                validators={{
                  onChange: ({ value }) =>
                    !value.trim() ? "First name is required" : undefined,
                }}
              >
                {(field) => (
                  <fieldset>
                    <label className="text-tiny font-medium text-brand block">
                      FIRST NAME
                    </label>
                    <input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      disabled={isPendingRequest}
                      className="w-full outline-none border-b border-gray-200 focus:border-brand text-xs py-1 mt-1 transition-colors disabled:opacity-60"
                    />
                    <span className="h-5 text-tiny text-destructive mt-1 block">
                      {field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0 &&
                        field.state.meta.errors.join(", ")}
                    </span>
                  </fieldset>
                )}
              </form.Field>

              <form.Field
                name="lastName"
                validators={{
                  onChange: ({ value }) =>
                    !value.trim() ? "Last name is required" : undefined,
                }}
              >
                {(field) => (
                  <fieldset>
                    <label className="text-tiny font-medium text-brand block">
                      LAST NAME
                    </label>
                    <input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      disabled={isPendingRequest}
                      className="w-full outline-none border-b border-gray-200 focus:border-brand text-xs py-1 mt-1 transition-colors disabled:opacity-60"
                    />
                    <span className="h-5 text-tiny text-destructive mt-1 block">
                      {field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0 &&
                        field.state.meta.errors.join(", ")}
                    </span>
                  </fieldset>
                )}
              </form.Field>

              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) => {
                    if (!value.trim()) return "Email is required";
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                      return "Enter a valid email";
                    }
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <fieldset>
                    <label className="text-tiny font-medium text-brand block">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      disabled={isPendingRequest}
                      className="w-full outline-none border-b border-gray-200 focus:border-brand text-xs py-1 mt-1 transition-colors disabled:opacity-60"
                    />
                    <span className="h-5 text-tiny text-destructive mt-1 block">
                      {field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0 &&
                        field.state.meta.errors.join(", ")}
                    </span>
                  </fieldset>
                )}
              </form.Field>

              <form.Field
                name="phone"
                validators={{
                  onChange: ({ value }) => {
                    if (!value.trim()) return "Phone is required";
                    if (!/^\+?[0-9]{10,14}$/.test(value.replace(/\s/g, ""))) {
                      return "Enter a valid phone number";
                    }
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <fieldset>
                    <label className="text-tiny font-medium text-brand block">
                      PHONE NUMBER
                    </label>
                    <input
                      type="tel"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="ex. +91 1234567890"
                      disabled={isPendingRequest}
                      className="w-full outline-none border-b border-gray-200 placeholder:text-text-muted/50 placeholder:text-xxs focus:border-brand text-xs py-1 mt-1 transition-colors disabled:opacity-60"
                    />
                    <span className="h-5 text-tiny text-destructive mt-1 block">
                      {field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0 &&
                        field.state.meta.errors.join(", ")}
                    </span>
                  </fieldset>
                )}
              </form.Field>
            </div>

            <form.Subscribe
              selector={(state) => ({
                canSubmit: state.canSubmit,
              })}
            >
              {({ canSubmit }) => (
                <button
                  type="button"
                  onClick={() => form.handleSubmit()}
                  disabled={!canSubmit || isPendingRequest}
                  className="flex items-center rounded-full gap-2 bg-brand p-0.5 transition-all hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span className="text-xs text-white pl-4">
                    {signUpMutation.isPending
                      ? "Sending OTP..."
                      : "Create Account"}
                  </span>

                  <div className="h-8 aspect-square flex items-center justify-center bg-brand-hover rounded-full p-2">
                    {signUpMutation.isPending ? (
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
              )}
            </form.Subscribe>
          </>
        ) : (
          <OtpForm
            email={registeredEmail}
            onVerify={handleVerifyOtp}
            onBack={() => setShowOtpForm(false)}
            title="Verify Your Email"
            backLabel="Back to registration"
            submitLabel="Verify OTP"
            submittingLabel="Verifying..."
            isSubmitting={verifyOtpMutation.isPending}
          />
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
