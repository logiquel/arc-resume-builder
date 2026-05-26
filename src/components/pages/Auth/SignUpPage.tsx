import { Icon } from "@iconify/react";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import OtpForm from "./OtpForm";
import {
  useSignUpMutation,
  useVerifyOtpMutation,
} from "#/api/auth/auth.mutations";
import AppLogo from "#/components/Layouts/AppLogo";

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const SignUpPage = () => {
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
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
      const response = await signUpMutation.mutateAsync({ email: value.email });

      setFormData(value);
      setRegisteredEmail(value.email);
      setShowOtpForm(true);

      console.log("OTP successfully sent to:", value.email, response);
    },
  });

  const handleVerifyOtp = async (otp: string) => {
    if (!formData) return;

    await verifyOtpMutation.mutateAsync({
      email: registeredEmail,
      token: otp,
      profile: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      },
    });

    console.log("User registered successfully");
    navigate({ to: "/dashboard" });
  };

  const isPendingRequest =
    signUpMutation.isPending || verifyOtpMutation.isPending;

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
                  Create your Account
                  <span className="flex gap-x-1 text-xxs text-text-muted font-normal mt-1">
                    Already registered?
                    <Link
                      to="/"
                      className="flex items-center text-brand font-medium border-b border-transparent hover:border-b hover:border-brand"
                    >
                      Sign In{" "}
                      <Icon icon="si:arrow-right-line" className="text-sm" />
                    </Link>
                  </span>
                </h2>

                <form
                  className="w-full flex-1 grid grid-cols-2 gap-x-4 gap-y-2 content-start mt-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                >
                  <form.Field
                    name="firstName"
                    validators={{
                      onChange: ({ value }) =>
                        !value.trim() ? "First name is required" : undefined,
                    }}
                  >
                    {(field) => (
                      <fieldset className="w-full flex-col">
                        <label className="text-tiny text-brand">
                          FIRST NAME
                        </label>
                        <input
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          disabled={isPendingRequest}
                          placeholder="E.g. John"
                          className="w-full px-2 py-3 bg-gray-50 outline-none text-text-primary text-xxs placeholder:font-normal placeholder:text-tiny mt-2 disabled:opacity-60"
                        />
                        <span className="h-5 flex items-center text-destructive text-tiny mt-1">
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
                      <fieldset className="w-full flex-col">
                        <label className="text-tiny text-brand">
                          LAST NAME
                        </label>
                        <input
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          disabled={isPendingRequest}
                          placeholder="E.g. Doe"
                          className="w-full px-2 py-3 bg-gray-50 outline-none text-text-primary text-xxs placeholder:font-normal placeholder:text-tiny mt-2 disabled:opacity-60"
                        />
                        <span className="h-5 flex items-center text-destructive text-tiny mt-1">
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
                      <fieldset className="w-full flex-col">
                        <label className="text-tiny text-brand">
                          EMAIL ADDRESS
                        </label>
                        <input
                          type="email"
                          value={field.state.value}
                          placeholder="E.g. johndoe@example.com"
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          disabled={isPendingRequest}
                          className="w-full px-2 py-3 bg-gray-50 outline-none text-text-primary placeholder:font-normal placeholder:text-tiny text-xxs mt-2 disabled:opacity-60"
                        />
                        <span className="h-5 flex items-center text-destructive text-tiny mt-1">
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
                        if (
                          !/^\+?[0-9]{10,14}$/.test(value.replace(/\s/g, ""))
                        ) {
                          return "Enter a valid phone number";
                        }
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <fieldset className="w-full flex-col">
                        <label className="text-tiny text-brand">PHONE</label>
                        <input
                          type="tel"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          disabled={isPendingRequest}
                          placeholder="+91 1234567890"
                          className="w-full px-2 py-3 bg-gray-50 outline-none text-text-primary placeholder:font-normal placeholder:text-tiny text-xxs mt-2 disabled:opacity-60"
                        />
                        <span className="h-5 flex items-center text-destructive text-tiny mt-1">
                          {field.state.meta.isTouched &&
                            field.state.meta.errors.length > 0 &&
                            field.state.meta.errors.join(", ")}
                        </span>
                      </fieldset>
                    )}
                  </form.Field>

                  <div className="w-full flex flex-col col-span-2 mt-4">
                    <form.Subscribe
                      selector={(state) => ({
                        canSubmit: state.canSubmit,
                      })}
                    >
                      {({ canSubmit }) => (
                        <button
                          type="submit"
                          disabled={!canSubmit || isPendingRequest}
                          className="w-full px-2 py-2 gap-x-2 flex items-center justify-center rounded-full bg-brand hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
                        >
                          <span className="w-fit h-fit text-xxs text-white">
                            {signUpMutation.isPending
                              ? "Sending OTP..."
                              : "Create Account"}
                          </span>
                          {signUpMutation.isPending && (
                            <Icon
                              icon="mingcute:loading-2-line"
                              className="size-4 animate-spin text-white"
                            />
                          )}
                        </button>
                      )}
                    </form.Subscribe>

                    <span className="w-full mt-4 px-2 gap-x-0.5 text-tiny text-text-muted text-center">
                      By signing up, you agree to the Terms of Service and
                      Privacy Policy
                    </span>
                  </div>
                </form>
              </>
            ) : (
              <OtpForm
                email={registeredEmail}
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
              A person who never made a mistake never tried anything new.
            </p>
            <p className="text-white text-sm mt-3 tracking-wider">
              — Albert Einstein
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SignUpPage;
