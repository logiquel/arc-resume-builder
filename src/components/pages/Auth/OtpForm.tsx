// OtpForm.tsx
import { Icon } from "@iconify/react";
import { useState } from "react";

interface OtpFormProps {
  email: string;
  onVerify: (otp: string) => Promise<void>;
  onBack: () => void;
  isSubmitting?: boolean;
}

const OtpForm = ({
  email,
  onVerify,
  onBack,
  isSubmitting = false,
}: OtpFormProps) => {
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async () => {
    const otp = otpValues.join("");
    if (otp.length === 6) {
      await onVerify(otp);
    }
  };

  const maskedEmail = email.replace(
    /(.{3})(.*)(@.*)/,
    (_, first, middle, last) => {
      return first + "*".repeat(Math.min(middle.length, 5)) + last;
    },
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
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={value}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={isSubmitting}
              className="h-12 w-12 text-center bg-gray-50 outline-none text-text-primary text-lg font-mono border-2 border-transparent focus:border-brand rounded-md disabled:opacity-50"
            />
          ))}
        </fieldset>
        <div className="w-full flex flex-col col-span-2 mt-6">
          <button
            onClick={handleSubmit}
            disabled={otpValues.join("").length !== 6 || isSubmitting}
            className="w-full px-2 py-2 gap-x-2 flex items-center justify-center rounded-full bg-brand hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            <span className="w-fit h-fit text-xxs text-white">
              {isSubmitting ? "Verifying..." : "Verify OTP"}
            </span>
            {isSubmitting && (
              <Icon
                icon="mingcute:loading-2-line"
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
              Back to registration
            </span>
          </button>
          <span className="w-full mt-6 px-2 gap-x-0.5 text-tiny text-text-muted text-center">
            By signing up, you agree to the Terms of Service and Privacy Policy
          </span>
        </div>
      </div>
    </>
  );
};

export default OtpForm;
