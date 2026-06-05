import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";

interface OtpFormProps {
  email: string;
  onVerify: (otp: string) => Promise<void>;
  onBack: () => void;
  isSubmitting?: boolean;
}

const OTP_LENGTH = 6;

const OtpForm = ({
  email,
  onVerify,
  onBack,
  isSubmitting = false,
}: OtpFormProps) => {
  const [otpValues, setOtpValues] = useState(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const nextOtp = [...otpValues];
    nextOtp[index] = value;
    setOtpValues(nextOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;

    const nextOtp = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, index) => {
      nextOtp[index] = char;
    });

    setOtpValues(nextOtp);

    const focusIndex = Math.min(pasted.length, OTP_LENGTH) - 1;
    if (focusIndex >= 0) {
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otp = otpValues.join("");
    if (otp.length === OTP_LENGTH) {
      await onVerify(otp);
    }
  };

  const maskedEmail = email.replace(
    /(.{3})(.*)(@.*)/,
    (_, first, middle, last) =>
      first + "*".repeat(Math.min(middle.length, 5)) + last,
  );

  return (
    <>
      <h2 className="flex flex-col text-text-primary text-lg font-medium">
        Check Your Email
        <p className="self-start flex flex-col gap-x-1 text-xxs text-text-muted font-normal mt-1">
          We have sent you a 6-digit verification code to your email,
          <span className="text-brand font-normal">{maskedEmail}</span>
        </p>
      </h2>

      <div className="w-full flex-1 grid grid-cols-2 gap-x-4 gap-y-4 content-start mt-6">
        <fieldset className="w-full flex justify-center gap-3 col-span-2">
          {otpValues.map((value, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={value}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={isSubmitting}
              aria-label={`OTP digit ${index + 1}`}
              className="w-[16%] aspect-square text-center  rounded-md bg-gray-50 text-text-primary outline-none border border-black/10 text-lg font-mono placeholder:font-normal placeholder:text-tiny mt-2 disabled:opacity-60 transition-all duration-200 focus:border-[#0A65CC]/40 hover:border-black/12 focus:shadow-[0_0_0_4px_rgba(10,101,204,0.08),0_4px_14px_rgba(10,101,204,0.10),inset_0_1px_0_rgba(255,255,255,0.9)]"
            />
          ))}
        </fieldset>

        <div className="w-full flex flex-col col-span-2 mt-6">
          <button
            onClick={handleSubmit}
            disabled={otpValues.join("").length !== OTP_LENGTH || isSubmitting}
            className="w-full px-2 py-2 gap-x-2 flex items-center justify-center rounded-full bg-brand hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            <span className="w-fit h-fit text-xxs text-white">
              {isSubmitting ? "Verifying..." : "Verify OTP"}
            </span>
            {isSubmitting && (
              <Icon
                icon="mingcute:loading-fill"
                className="size-4 animate-spin text-white"
              />
            )}
          </button>

          <button
            onClick={onBack}
            disabled={isSubmitting}
            className="w-full mt-3 px-2 py-2 gap-x-2 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 disabled:opacity-50 cursor-pointer transition-all"
          >
            <span className="w-fit h-fit text-xxs text-text-secondary">
              Back
            </span>
          </button>

          <span className="w-full mt-6 px-2 gap-x-0.5 text-tiny text-text-muted text-center">
            By continuing, you agree to the Terms of Service and Privacy Policy
          </span>
        </div>
      </div>
    </>
  );
};

export default OtpForm;
