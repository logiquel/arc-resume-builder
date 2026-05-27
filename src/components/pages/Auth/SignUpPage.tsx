import { Icon } from "@iconify/react";
import { useForm } from "@tanstack/react-form";
import { useState, useEffect } from "react";
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

const SignUpPage = () => {
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [formData, setFormData] = useState<SignUpFormData | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  const signUpMutation = useSignUpMutation();
  const verifyOtpMutation = useVerifyOtpMutation();

  // Auto-advance carousel
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

  const currentSlide = carouselSlides[activeSlide];

  return (
    <div className="w-full h-full flex items-center justify-center bg-white overflow-hidden">
      <div className="w-full h-full flex items-center z-20 overflow-clip border-black/10">
        {/* Left: Form */}
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
                    Create your Account
                    <span className="flex gap-x-1 text-xxs text-text-muted font-normal mt-1">
                      Already registered?
                      <Link
                        to="/"
                        className="flex items-center text-brand font-medium border-b border-transparent hover:border-b hover:border-brand"
                      >
                        Sign In{" "}
                        <Icon
                          icon="lucide:arrow-up"
                          className="text-xs rotate-45"
                        />
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
                            className="w-full px-2 py-3 bg-gray-100 rounded-md outline-none text-text-primary text-xxs placeholder:font-normal placeholder:text-tiny mt-2 disabled:opacity-60"
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
                            className="w-full px-2 py-3 bg-gray-100 rounded-md outline-none text-text-primary text-xxs placeholder:font-normal placeholder:text-tiny mt-2 disabled:opacity-60"
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
                          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                            return "Enter a valid email";
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
                            className="w-full px-2 py-3 bg-gray-100 rounded-md outline-none text-text-primary placeholder:font-normal placeholder:text-tiny text-xxs mt-2 disabled:opacity-60"
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
                          )
                            return "Enter a valid phone number";
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
                            className="w-full px-2 py-3 bg-gray-100 rounded-md outline-none text-text-primary placeholder:font-normal placeholder:text-tiny text-xxs mt-2 disabled:opacity-60"
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
                        selector={(state) => ({ canSubmit: state.canSubmit })}
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
          </div>
        </section>

        {/* Right: Carousel */}
        <section className="relative w-[60%] h-full rounded-[inherit] overflow-clip flex flex-col gap-5 justify-center pl-30">
          {/* Decorative rings */}
          <div className="absolute left-0 top-0 bottom-0 my-auto h-full aspect-square flex items-center justify-center rounded-full border border-brand/20">
            <div className="h-[85%] aspect-square rounded-full border border-brand/20"></div>
          </div>

          {/* Slide caption */}
          <div className="relative max-w-xl pl-2 z-20 overflow-hidden">
            <h2
              className="text-text-primary text-base font-medium transition-all duration-300 ease-in-out"
              style={{
                opacity: isTransitioning ? 0 : 1,
                transform: isTransitioning
                  ? "translateY(6px)"
                  : "translateY(0)",
              }}
            >
              {currentSlide.text}
            </h2>
          </div>

          {/* Image frame */}
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

          {/* Dot indicators */}
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

export default SignUpPage;
