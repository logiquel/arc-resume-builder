// SignInPage.tsx
import { Icon } from "@iconify/react";
import SignInPageBg from "/SignIn_screen_bg.jpg";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import OtpForm from "./OtpForm";
import {
  useSignInMutation,
  useVerifyOtpMutation,
} from "#/api/auth/auth.mutations";

interface SignInFormData {
  email: string;
}

const SignInPage = () => {
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // FIX: Wire up the correct Sign In mutation here
  const requestOtpMutation = useSignInMutation();
  const verifyOtpMutation = useVerifyOtpMutation();

  const SignInForm = useForm({
    defaultValues: {
      email: "",
    } satisfies SignInFormData,
    onSubmit: async ({ value }) => {
      // Calls authService.signIn(payload) safely now
      requestOtpMutation.mutate(
        { email: value.email },
        {
          onSuccess: () => {
            setEmail(value.email);
            setShowOtpForm(true);
            console.log("SignIn OTP requested successfully for:", value.email);
          },
          onError: (error: any) => {
            console.error("SignIn challenge error:", error);
            alert(
              error.message ||
                "Failed to dispatch verification code. Please try again.",
            );
          },
        },
      );
    },
  });

  const handleVerifyOtp = async (otp: string) => {
    verifyOtpMutation.mutate(
      {
        email: email,
        token: otp,
        // profile is left out completely here because the user already exists
      },
      {
        onSuccess: (data) => {
          console.log("User successfully authenticated session:", data.user);
          navigate({ to: "/dashboard" });
        },
        onError: (error: any) => {
          console.error("SignIn OTP validation error:", error);
          alert(error.message || "Invalid or expired OTP code entered.");
        },
      },
    );
  };

  const isPendingRequest =
    requestOtpMutation.isPending || verifyOtpMutation.isPending;

  return (
    <div className="w-full h-full flex">
      <div className="flex-1 h-full">
        <img
          src={SignInPageBg}
          className="h-full object-cover"
          alt="SignIn Background"
        />
      </div>

      <div className="w-[30vw] h-full p-4 overflow-y-auto">
        {!showOtpForm ? (
          <>
            <h1 className="text-lg font-semibold text-text-primary">Sign In</h1>
            <p className="text-xs text-text-muted mt-1">
              Enter your email address to SignIn
            </p>

            <span className="block mt-3 mb-6 text-xs text-text-muted">
              Don&apos;t have an account yet?{" "}
              <Link to="/sign-up" className="text-brand hover:text-brand-hover">
                SignUp
              </Link>
            </span>

            <div className="w-full flex flex-col gap-y-3 mb-4">
              <SignInForm.Field
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
                      placeholder="steverroger@gmail.com"
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
              </SignInForm.Field>
            </div>

            <SignInForm.Subscribe
              selector={(state) => ({
                canSubmit: state.canSubmit,
              })}
            >
              {({ canSubmit }) => (
                <button
                  type="button"
                  onClick={() => SignInForm.handleSubmit()}
                  disabled={!canSubmit || isPendingRequest}
                  className="flex items-center rounded-full gap-2 bg-brand p-0.5 transition-all hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span className="text-xs text-white pl-4">
                    {requestOtpMutation.isPending ? "Sending OTP..." : "SignIn"}
                  </span>
                  <div className="h-8 aspect-square flex items-center justify-center bg-brand-hover rounded-full p-2">
                    {requestOtpMutation.isPending ? (
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
            </SignInForm.Subscribe>
          </>
        ) : (
          <OtpForm
            email={email}
            onVerify={handleVerifyOtp}
            onBack={() => setShowOtpForm(false)}
            title="Sign In"
            description={`Enter the OTP sent to ${email}`}
            backLabel="Back to SignIn"
            submitLabel="Verify OTP"
            submittingLabel="Verifying..."
            isSubmitting={verifyOtpMutation.isPending}
          />
        )}
      </div>
    </div>
  );
};

export default SignInPage;
