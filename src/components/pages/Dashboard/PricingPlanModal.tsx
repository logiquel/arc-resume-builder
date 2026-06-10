import { Icon } from "@iconify/react";
import type { Dispatch, SetStateAction } from "react";

const plans = [
  {
    name: "Free.",
    label: "Draft",
    price: "₹0",
    suffix: "",
    cta: "Start free",
    badge: "",
    featured: false,
    features: [
      "1 AI-tailored resume (one-time)",
      "1 basic resume template",
      "ATS score and proof-gap insights",
      "Valid for 30 days",
    ],
  },
  {
    name: "Pro.",
    label: "1 Month",
    price: "₹299",
    suffix: "/mo",
    cta: "Get 1 Month Plan",
    badge: "",
    featured: false,
    features: [
      "50 AI resume tailoring sessions",
      "All premium resume templates",
      "No daily usage caps",
      "Unwatermarked PDF exports",
    ],
  },
  {
    name: "Max.",
    label: "3 Months",
    price: "₹599",
    suffix: "/qtr",
    cta: "Get 3 Month Plan",
    badge: "Most popular",
    featured: true,
    features: [
      "Unlimited AI tailoring sessions",
      "Priority AI processing",
      "LinkedIn summary generator",
      "AI interview prep included",
    ],
  },
];

interface PricingPlanModalProps {
  setShowPricingModal: Dispatch<SetStateAction<boolean>>;
}

const PricingPlanModal: React.FC<PricingPlanModalProps> = ({
  setShowPricingModal,
}) => {
  return (
    <div className="absolute inset-0 left-0 right-0 top-0 bottom-0 z-50 my-auto mx-auto flex h-fit w-[92%] max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-2xl ring-4 ring-white/50 sm:w-[88%] lg:w-[70%]">
      <header className="relative px-5 pb-5 pt-5 sm:px-7 sm:pb-6 sm:pt-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mt-3 text-xl font-bold leading-tight text-text-primary">
            Plans That
            <span className="font-display italic font-semibold tracking-[0.02em]">
              {" "}
              Fit.
            </span>
            <br />
            Prices That Make
            <span className="font-display italic font-semibold tracking-[0.02em]">
              {" "}
              Sense.
            </span>
          </h2>
        </div>

        <button
          onClick={() => setShowPricingModal(false)}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-text-primary transition-colors hover:bg-black/[0.03] sm:right-4 sm:top-4 cursor-pointer"
          aria-label="Close pricing modal"
          type="button"
        >
          <Icon icon="iconamoon:close" className="text-lg" />
        </button>
      </header>

      <main className="max-h-[70vh] overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-7 lg:py-7">
        <div className="grid grid-cols-1 justify-items-center gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-4">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className="group relative flex h-full w-full max-w-[24rem] flex-col overflow-hidden rounded-[1.75rem] px-5 py-6 sm:px-6 sm:py-7"
            >
              <div
                className={[
                  "pointer-events-none absolute inset-0 rounded-[1.75rem]",
                  plan.featured
                    ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(245,249,255,0.97)_38%,rgba(228,240,255,0.90)_100%)]"
                    : "bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(246,250,255,0.90)_48%,rgba(233,243,255,0.72)_100%)]",
                ].join(" ")}
              />

              <div className="absolute inset-0 rounded-[1.75rem] border border-black/5" />

              {plan.badge ? (
                <span className="absolute right-4 top-4 z-10 rounded-full bg-white/92 px-3 py-1.5 text-xxs font-semibold uppercase tracking-[0.12em] text-brand backdrop-blur-sm sm:right-5 sm:top-5">
                  {plan.badge}
                </span>
              ) : null}

              <div className="relative z-10 flex h-full flex-col">
                <div>
                  <h3 className="font-display text-xl font-semibold leading-none italic tracking-[-0.035em] text-text-primary">
                    {plan.name}
                  </h3>

                  <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-brand">
                    {plan.label}
                  </p>

                  <div className="mt-4 flex items-end gap-1.5">
                    <span className="font-mono text-lg font-medium leading-none tracking-[-0.03em] text-text-primary">
                      {plan.price}
                    </span>

                    {plan.suffix ? (
                      <span className="pb-1 text-xs font-normal text-text-muted">
                        {plan.suffix}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="mt-6 flex flex-1 flex-col gap-3 sm:mt-7 sm:gap-3.5">
                  {plan.features.map((feature) => (
                    <p
                      key={feature}
                      className="flex items-start gap-3 text-xs leading-relaxed text-text-secondary"
                    >
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-brand">
                        <Icon icon="ic:sharp-plus" className="text-xs" />
                      </span>
                      <span>{feature}</span>
                    </p>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between gap-3 sm:mt-7">
                  <button
                    type="button"
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand px-5 text-xxs font-medium text-white transition-colors duration-200 hover:bg-brand/90"
                  >
                    {plan.cta}
                  </button>

                  {plan.featured ? (
                    <span className="text-tiny font-medium uppercase tracking-[0.12em] text-text-muted">
                      Best value
                    </span>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PricingPlanModal;
