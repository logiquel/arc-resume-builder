// SignInPage.tsx
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import OtpForm from "./OtpForm";
import {
  useSignInMutation,
  useVerifyOtpMutation,
} from "#/api/auth/auth.mutations";
import AppLogo from "#/components/Layouts/AppLogo";

interface SignInFormData {
  email: string;
}

const SignInPage = () => {
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const requestOtpMutation = useSignInMutation();
  const verifyOtpMutation = useVerifyOtpMutation();

  const signInForm = useForm({
    defaultValues: {
      email: "praveenlohar.in@gmail.com",
    } satisfies SignInFormData,
    onSubmit: async ({ value }) => {
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
      },
      {
        onSuccess: (data) => {
          navigate({ to: "/dashboard", replace: true });
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
    <div className="w-full h-full flex items-center justify-center bg-[#F9FBFC] overflow-hidden">
      <div
        className="w-[80%] h-[80%] flex z-20 rounded-4xl overflow-clip bg-white border border-black/10 p-[3.5px]"
        style={{
          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
        }}
      >
        <section className="flex-1 h-full flex flex-col bg-white z-20">
          <header className="w-full flex items-center px-6 pt-6">
            <div className="h-[85%]">
              <AppLogo />
            </div>
          </header>
          <div className="flex-1 w-full h-full flex flex-col gap-y-4 p-6">
            {!showOtpForm ? (
              <>
                <h2 className="flex flex-col text-text-primary text-lg font-medium">
                  Welcome Back
                  <span className="flex gap-x-1 text-xxs text-text-muted font-normal mt-1">
                    Don't have an account?
                    <Link
                      to="/sign-up"
                      className="flex items-center text-brand font-medium border-b border-transparent hover:border-b hover:border-brand"
                    >
                      Sign Up{" "}
                      <Icon icon="si:arrow-right-line" className="text-sm" />
                    </Link>
                  </span>
                </h2>
                <div className="w-full flex-1 grid grid-cols-1 gap-y-4 content-start mt-2">
                  <signInForm.Field
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
                      <fieldset className="w-full flex-col">
                        <label className="text-tiny text-brand">
                          EMAIL ADDRESS
                        </label>
                        <input
                          type="email"
                          placeholder="john.doe@example.com"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          disabled={isPendingRequest}
                          className="w-full px-2 py-3 bg-gray-50 outline-none text-text-primary text-xxs placeholder:font-normal placeholder:text-tiny mt-2 disabled:opacity-60"
                        />
                        <span className="h-5 flex items-center text-destructive text-tiny mt-1">
                          {field.state.meta.isTouched &&
                            field.state.meta.errors.length > 0 &&
                            field.state.meta.errors.join(", ")}
                        </span>
                      </fieldset>
                    )}
                  </signInForm.Field>

                  <div className="w-full flex flex-col mt-0">
                    <signInForm.Subscribe
                      selector={(state) => ({
                        canSubmit: state.canSubmit,
                      })}
                    >
                      {({ canSubmit }) => (
                        <button
                          onClick={() => signInForm.handleSubmit()}
                          disabled={!canSubmit || isPendingRequest}
                          className="w-full px-2 py-2 gap-x-2 flex items-center justify-center rounded-full bg-brand hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
                        >
                          <span className="w-fit h-fit text-xxs text-white">
                            {requestOtpMutation.isPending
                              ? "Sending OTP..."
                              : "Sign In"}
                          </span>
                          {requestOtpMutation.isPending && (
                            <Icon
                              icon="mingcute:loading-2-line"
                              className="size-4 animate-spin text-white"
                            />
                          )}
                        </button>
                      )}
                    </signInForm.Subscribe>
                    <span className="w-full mt-4 px-2 gap-x-0.5 text-tiny text-text-muted text-center">
                      By signing in, you agree to the Terms of Service and
                      Privacy Policy
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <OtpForm
                email={email}
                onVerify={handleVerifyOtp}
                onBack={() => setShowOtpForm(false)}
                isSubmitting={verifyOtpMutation.isPending}
              />
            )}
          </div>
        </section>
        <section className="relative w-[60%] h-full rounded-[inherit] overflow-clip flex flex-col justify-end p-12">
          <img
            src="/login_screen_bg.jpg"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className="absolute inset-0 bg-[#282A37]/10 z-10" />
          <div className="absolute inset-0 bg-linear-to-t from-[#1e293b]/90 via-[#0f172a]/50 to-transparent z-15 pointer-events-none" />
          <div className="relative z-20 max-w-xl">
            <p className="text-white text-lg">
              The only way to do great work is to love what you do.
            </p>
            <p className="text-white text-sm mt-3 tracking-wider">
              — Steve Jobs
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SignInPage;
