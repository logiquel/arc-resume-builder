import { Icon } from "@iconify/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
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

const carouselSlides = [
  {
    src: "/auth_page_banner_1.png",
    alt: "Dashboard overview",
    text: "Get a clear view of everything — track applications, monitor progress, and stay on top of your job search from one unified dashboard.",
  },
  {
    src: "/auth_page_banner_2.png",
    alt: "AI tailored resume",
    text: "Let AI tailor your resume to every job. Match keywords, highlight relevant experience, and land more interviews with less effort.",
  },
];

const SignInPage = () => {
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [email, setEmail] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  const requestOtpMutation = useSignInMutation();
  const verifyOtpMutation = useVerifyOtpMutation();

  useEffect(() => {
    const interval = setInterval(() => {
      goToSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (indexOrUpdater: number | ((prev: number) => number)) => {
    setIsTransitioning(true);

    setTimeout(() => {
      setActiveSlide(indexOrUpdater as any);
      setIsTransitioning(false);
    }, 300);
  };

  const handleDotClick = (index: number) => {
    if (index === activeSlide) return;
    goToSlide(index);
  };

  const signInForm = useForm({
    defaultValues: {
      email: "praveenlohar.in@gmail.com",
    } satisfies SignInFormData,
    onSubmit: async ({ value }) => {
      await requestOtpMutation.mutateAsync({ email: value.email });

      setEmail(value.email);
      setShowOtpForm(true);

      console.log("SignIn OTP requested successfully for:", value.email);
    },
  });

  const handleVerifyOtp = async (otp: string) => {
    await verifyOtpMutation.mutateAsync({
      email,
      token: otp,
    });

    navigate({ to: "/dashboard", replace: true });
  };

  const isPendingRequest =
    requestOtpMutation.isPending || verifyOtpMutation.isPending;

  const currentSlide = carouselSlides[activeSlide];

  return (
    <div className="w-full h-full flex items-center justify-center bg-white overflow-hidden">
      <div className="w-full h-full flex items-center z-20 overflow-clip border-black/10">
        <section className="flex-1 h-[70%] flex items-center justify-center z-20">
          <div className="w-[65%] h-full flex flex-col z-20">
            <header className="w-full flex items-center px-6">
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
                      Don&apos;t have an account?
                      <Link
                        to="/sign-up"
                        className="flex items-center text-brand font-medium border-b border-transparent hover:border-b hover:border-brand"
                      >
                        Sign Up{" "}
                        <Icon
                          icon="lucide:arrow-up"
                          className="text-xs rotate-45"
                        />
                      </Link>
                    </span>
                  </h2>

                  <form
                    className="w-full flex-1 grid grid-cols-1 gap-y-4 content-start mt-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      signInForm.handleSubmit();
                    }}
                  >
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
                            className="w-full px-2 py-3 bg-gray-100 rounded-md outline-none text-text-primary text-xxs placeholder:font-normal placeholder:text-tiny mt-2 disabled:opacity-60"
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
                            type="submit"
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
                  </form>
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
          </div>
        </section>

        <section className="relative w-[60%] h-full rounded-[inherit] overflow-clip flex flex-col gap-5 justify-center pl-30">
          <div className="absolute left-0 top-0 bottom-0 my-auto h-full aspect-square flex items-center justify-center rounded-full border border-brand/20">
            <div className="h-[85%] aspect-square rounded-full border border-brand/20"></div>
          </div>

          <div className="relative max-w-xl pl-2 z-20">
            <p
              className="text-text-primary text-base font-medium transition-all duration-300 ease-in-out"
              style={{
                opacity: isTransitioning ? 0 : 1,
                transform: isTransitioning
                  ? "translateY(6px)"
                  : "translateY(0)",
              }}
            >
              {currentSlide.text}
            </p>
          </div>

          <div
            className="relative w-full h-[70%] border rounded-l-2xl overflow-clip z-20"
            style={{
              boxShadow:
                "0 0 40px 8px rgba(14, 165, 233, 0.22), 0 0 20px 4px rgba(14, 165, 233, 0.14), 0 0 8px 1px rgba(14, 165, 233, 0.18)",
            }}
          >
            {carouselSlides.map((slide, i) => (
              <img
                key={slide.src}
                src={slide.src}
                alt={slide.alt}
                className="absolute inset-0 w-full h-full object-cover object-left z-0 transition-opacity duration-500 ease-in-out"
                style={{ opacity: i === activeSlide ? 1 : 0 }}
              />
            ))}
          </div>

          <div className="w-full h-8 flex items-center gap-x-2 px-3">
            {carouselSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => handleDotClick(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="transition-all duration-300 ease-in-out rounded-full cursor-pointer"
                style={{
                  width: i === activeSlide ? "2rem" : "0.375rem",
                  height: "0.375rem",
                  backgroundColor:
                    i === activeSlide
                      ? "var(--color-brand, #0ea5e9)"
                      : "#d1d5db",
                }}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SignInPage;
