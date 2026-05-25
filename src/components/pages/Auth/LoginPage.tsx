// LoginPage.tsx
import { Icon } from "@iconify/react";
import loginPageBg from "/login_screen_bg.jpg";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import OtpForm from "./OtpForm";
import {
  useSignInMutation,
  useVerifyOtpMutation,
} from "#/api/auth/auth.mutations";

interface LoginFormData {
  email: string;
}

const LoginPage = () => {
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // FIX: Wire up the correct Sign In mutation here
  const requestOtpMutation = useSignInMutation();
  const verifyOtpMutation = useVerifyOtpMutation();

  const loginForm = useForm({
    defaultValues: {
      email: "",
    } satisfies LoginFormData,
    onSubmit: async ({ value }) => {
      // Calls authService.signIn(payload) safely now
      requestOtpMutation.mutate(
        { email: value.email },
        {
          onSuccess: () => {
            setEmail(value.email);
            setShowOtpForm(true);
            console.log("Login OTP requested successfully for:", value.email);
          },
          onError: (error: any) => {
            console.error("Login challenge error:", error);
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
          console.error("Login OTP validation error:", error);
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
          src={loginPageBg}
          className="h-full object-cover"
          alt="Login Background"
        />
      </div>

      <div className="w-[30vw] h-full p-4 overflow-y-auto">
        {!showOtpForm ? (
          <>
            <h1 className="text-lg font-semibold text-text-primary">Sign In</h1>
            <p className="text-xs text-text-muted mt-1">
              Enter your email address to login
            </p>

            <span className="block mt-3 mb-6 text-xs text-text-muted">
              Don&apos;t have an account yet?{" "}
              <Link
                to="/register"
                className="text-brand hover:text-brand-hover"
              >
                Register
              </Link>
            </span>

            <div className="w-full flex flex-col gap-y-3 mb-4">
              <loginForm.Field
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
              </loginForm.Field>
            </div>

            <loginForm.Subscribe
              selector={(state) => ({
                canSubmit: state.canSubmit,
              })}
            >
              {({ canSubmit }) => (
                <button
                  type="button"
                  onClick={() => loginForm.handleSubmit()}
                  disabled={!canSubmit || isPendingRequest}
                  className="flex items-center rounded-full gap-2 bg-brand p-0.5 transition-all hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span className="text-xs text-white pl-4">
                    {requestOtpMutation.isPending ? "Sending OTP..." : "Login"}
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
            </loginForm.Subscribe>
          </>
        ) : (
          <OtpForm
            email={email}
            onVerify={handleVerifyOtp}
            onBack={() => setShowOtpForm(false)}
            title="Sign In"
            description={`Enter the OTP sent to ${email}`}
            backLabel="Back to login"
            submitLabel="Verify OTP"
            submittingLabel="Verifying..."
            isSubmitting={verifyOtpMutation.isPending}
          />
        )}
      </div>
    </div>
  );
};

export default LoginPage;
