import { Icon } from "@iconify/react";
import type { Dispatch, SetStateAction } from "react";

interface PricingPlanModalProps {
  setShowPricingModal: Dispatch<SetStateAction<boolean>>;
}
const PricingPlanModal: React.FC<PricingPlanModalProps> = ({
  setShowPricingModal,
}) => {
  return (
    <div className="absolute w-[70%] h-fit flex flex-col mx-auto my-auto top-0 bottom-0 left-0 right-0 inset-0 ring-5 ring-white/50 bg-white border border-black/10 shadow-2xl rounded-4xl z-50">
      <header className="w-full flex items-center justify-center pt-5 relative">
        <div className="flex-1 flex flex-col items-center mx-auto font-mono">
          <h2 className="text-lg font-semibold text-text-primary leading-snug">
            Plans That{" "}
            <span className="font-display italic tracking-wider">Fit</span>.
          </h2>
          <h2 className="text-lg font-semibold text-text-primary leading-snug">
            Prices That Make{" "}
            <span className="font-display italic tracking-wider">Sense</span>.
          </h2>
          <p className="text-xxs text-text-muted leading-snug mt-1">
            Plans that grow with you - no hidden fees, just the tools you need.
          </p>
        </div>
        <button
          onClick={() => setShowPricingModal(false)}
          className="absolute top-3 right-3 h-fit aspect-square p-3 flex items-center justify-center border rounded-full cursor-pointer"
        >
          <Icon icon="iconamoon:close" />
        </button>
      </header>

      <main className="w-full flex-1 flex items-center justify-evenly min-h-0 py-8">
        {/* Plan Card - 1: Free */}
        <div className="w-[30%] h-auto flex flex-col rounded-4xl p-6">
          <h2 className="text-lg text-text-primary font-display font-semibold italic tracking-wider">
            Free.
          </h2>
          <span className="text-tiny text-brand font-medium leading-snug uppercase">
            Draft
          </span>
          <h2 className="text-lg text-text-primary font-mono font-medium leading-snug mt-1">
            ₹0
          </h2>
          <div className="w-full flex-1 flex flex-col justify-center gap-4 py-8">
            <p className="flex gap-2 text-text-primary text-xxs font-medium items-start">
              <Icon
                icon="ic:sharp-plus"
                className="text-brand text-xs mt-0.5 shrink-0"
              />
              1 AI-tailored resume (one-time)
            </p>
            <p className="flex gap-2 text-text-primary text-xxs font-medium items-start">
              <Icon
                icon="ic:sharp-plus"
                className="text-brand text-xs mt-0.5 shrink-0"
              />
              1 Basic resume template
            </p>
            <p className="flex gap-2 text-text-primary text-xxs font-medium items-start">
              <Icon
                icon="ic:sharp-plus"
                className="text-brand text-xs mt-0.5 shrink-0"
              />
              ATS score & proof-gap insights
            </p>
            <p className="flex gap-2 text-text-primary text-xxs font-medium items-start">
              <Icon
                icon="ic:sharp-plus"
                className="text-brand text-xs mt-0.5 shrink-0"
              />
              Valid for 30 days
            </p>
          </div>
          <button className="w-fit px-5 py-2.5 bg-brand text-xxs font-medium text-white rounded-full cursor-pointer hover:bg-brand/90 transition-colors">
            Start free
          </button>
        </div>

        {/* Plan Card - 2: Pro */}
        <div className="w-[30%] h-auto flex flex-col rounded-4xl p-6 bg-slate-50 border border-slate-100">
          <h2 className="text-lg text-text-primary font-display font-semibold italic tracking-wider">
            Pro.
          </h2>
          <span className="text-tiny text-brand font-medium leading-snug uppercase">
            1 Month
          </span>
          <h2 className="text-lg text-text-primary font-mono font-medium leading-snug mt-1">
            ₹299
            <span className="text-xs text-text-muted font-sans font-normal">
              /mo
            </span>
          </h2>
          <div className="w-full flex-1 flex flex-col justify-center gap-4 py-8">
            <p className="flex gap-2 text-text-primary text-xxs font-medium items-start">
              <Icon
                icon="ic:sharp-plus"
                className="text-brand text-xs mt-0.5 shrink-0"
              />
              50 AI resume tailoring sessions
            </p>
            <p className="flex gap-2 text-text-primary text-xxs font-medium items-start">
              <Icon
                icon="ic:sharp-plus"
                className="text-brand text-xs mt-0.5 shrink-0"
              />
              All premium resume templates
            </p>
            <p className="flex gap-2 text-text-primary text-xxs font-medium items-start">
              <Icon
                icon="ic:sharp-plus"
                className="text-brand text-xs mt-0.5 shrink-0"
              />
              No daily usage caps
            </p>
            <p className="flex gap-2 text-text-primary text-xxs font-medium items-start">
              <Icon
                icon="ic:sharp-plus"
                className="text-brand text-xs mt-0.5 shrink-0"
              />
              Unwatermarked PDF exports
            </p>
          </div>
          <button className="w-fit px-5 py-2.5 bg-brand text-xxs font-medium text-white rounded-full cursor-pointer hover:bg-brand/90 transition-colors">
            Get 1 Month Plan
          </button>
        </div>

        {/* Plan Card - 3: Max */}
        <div
          className="relative w-[30%] h-auto flex flex-col rounded-4xl p-6 border border-sky-200
             bg-linear-to-t from-[#DCEFFF] via-[#F2F9FF] to-white"
        >
          <span
            className="absolute right-3 top-3 w-fit h-fit px-3 py-1.5 text-tiny font-semibold text-brand rounded-full bg-white border border-sky-100"
            style={{
              boxShadow:
                "0 4px 12px rgba(14,165,233,0.08), 0 0 20px rgba(14,165,233,0.12)",
            }}
          >
            Save ₹100/mo
          </span>
          <h2 className="text-lg text-text-primary font-display font-semibold italic tracking-wider">
            Max.
          </h2>
          <span className="text-tiny text-brand font-medium leading-snug uppercase">
            3 Months
          </span>
          <h2 className="text-lg text-text-primary font-mono font-medium leading-snug mt-1">
            ₹599
            <span className="text-xs text-text-muted font-sans font-normal">
              /qtr
            </span>
          </h2>
          <div className="w-full flex-1 flex flex-col justify-center gap-4 py-8">
            <p className="flex gap-2 text-text-primary text-xxs font-medium items-start">
              <Icon
                icon="ic:sharp-plus"
                className="text-brand text-xs mt-0.5 shrink-0"
              />
              Unlimited AI tailoring sessions
            </p>
            <p className="flex gap-2 text-text-primary text-xxs font-medium items-start">
              <Icon
                icon="ic:sharp-plus"
                className="text-brand text-xs mt-0.5 shrink-0"
              />
              Priority AI processing
            </p>
            <p className="flex gap-2 text-text-primary text-xxs font-medium items-start">
              <Icon
                icon="ic:sharp-plus"
                className="text-brand text-xs mt-0.5 shrink-0"
              />
              LinkedIn summary generator
            </p>
            <p className="flex gap-2 text-text-primary text-xxs font-medium items-start">
              <Icon
                icon="ic:sharp-plus"
                className="text-brand text-xs mt-0.5 shrink-0"
              />
              AI interview prep included
            </p>
          </div>
          <button className="w-fit px-5 py-2.5 bg-brand text-xxs font-medium text-white rounded-full cursor-pointer hover:bg-brand/90 transition-colors shadow-md">
            Get 3 Month Plan
          </button>
        </div>
      </main>
    </div>
  );
};

export default PricingPlanModal;
