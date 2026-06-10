import { Icon } from "@iconify/react";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

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

const PlansSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const eyebrowRef = useRef<HTMLSpanElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const eyebrow = eyebrowRef.current;
    const heading = headingRef.current;
    const paragraph = paragraphRef.current;
    const cards = cardsRef.current.filter(Boolean);

    if (!section || !eyebrow || !heading || !paragraph || !cards.length) return;

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const headingSplit = new SplitText(heading, {
        type: "lines, words",
        linesClass: "split-line",
        wordsClass: "split-word",
      });

      const paragraphSplit = new SplitText(paragraph, {
        type: "lines",
        linesClass: "split-line",
      });

      const cardTitles = cards
        .map((card) => card.querySelector("[data-plan-title]"))
        .filter(Boolean);
      const cardPrices = cards
        .map((card) => card.querySelector("[data-plan-price]"))
        .filter(Boolean);
      const cardBadges = cards
        .map((card) => card.querySelector("[data-plan-badge]"))
        .filter(Boolean);
      const cardFeatures = cards.map((card) =>
        Array.from(card.querySelectorAll("[data-plan-feature]")),
      );
      const cardButtons = cards
        .map((card) => card.querySelector("[data-plan-cta]"))
        .filter(Boolean);

      gsap.set(eyebrow, { opacity: 0, y: 12 });
      gsap.set(headingSplit.words, {
        opacity: 0,
        yPercent: 110,
        willChange: "transform, opacity",
      });
      gsap.set(paragraphSplit.lines, {
        opacity: 0,
        y: 16,
        willChange: "transform, opacity",
      });

      gsap.set(cards, {
        opacity: 0,
        y: 28,
        willChange: "transform, opacity",
      });
      gsap.set(cardTitles, { opacity: 0, y: 18 });
      gsap.set(cardPrices, { opacity: 0, y: 18 });
      gsap.set(cardBadges, { opacity: 0, scale: 0.92 });
      gsap.set(cardButtons, { opacity: 0, y: 14 });

      cardFeatures.forEach((items) => {
        gsap.set(items, { opacity: 0, x: -10 });
      });

      if (reduceMotion) {
        gsap.set(eyebrow, { opacity: 1, y: 0 });
        gsap.set(headingSplit.words, { opacity: 1, yPercent: 0 });
        gsap.set(paragraphSplit.lines, { opacity: 1, y: 0 });
        gsap.set(cards, { opacity: 1, y: 0 });
        gsap.set(cardTitles, { opacity: 1, y: 0 });
        gsap.set(cardPrices, { opacity: 1, y: 0 });
        gsap.set(cardBadges, { opacity: 1, scale: 1 });
        gsap.set(cardButtons, { opacity: 1, y: 0 });
        cardFeatures.forEach((items) => gsap.set(items, { opacity: 1, x: 0 }));

        return () => {
          headingSplit.revert();
          paragraphSplit.revert();
        };
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          once: true,
        },
      });

      tl.to(eyebrow, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
      })
        .to(
          headingSplit.words,
          {
            opacity: 1,
            yPercent: 0,
            duration: 0.8,
            ease: "power4.out",
            stagger: 0.05,
          },
          "-=0.18",
        )
        .to(
          paragraphSplit.lines,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power3.out",
            stagger: 0.08,
          },
          "-=0.42",
        )
        .to(
          cards,
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            stagger: 0.12,
          },
          "-=0.2",
        )
        .to(
          cardTitles,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
            stagger: 0.1,
          },
          "-=0.55",
        )
        .to(
          cardPrices,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
            stagger: 0.1,
          },
          "-=0.42",
        )
        .to(
          cardBadges,
          {
            opacity: 1,
            scale: 1,
            duration: 0.45,
            ease: "back.out(1.5)",
            stagger: 0.1,
          },
          "-=0.35",
        );

      cardFeatures.forEach((items, index) => {
        tl.to(
          items,
          {
            opacity: 1,
            x: 0,
            duration: 0.45,
            ease: "power2.out",
            stagger: 0.06,
          },
          `-=${index === 0 ? 0.2 : 0.32}`,
        );
      });

      tl.to(
        cardButtons,
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power3.out",
          stagger: 0.1,
        },
        "-=0.28",
      );

      return () => {
        headingSplit.revert();
        paragraphSplit.revert();
      };
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="pricing" className="w-full py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <span
            ref={eyebrowRef}
            className="text-xs font-medium uppercase tracking-[0.24em] text-brand"
          >
            PLANS
          </span>

          <h2
            ref={headingRef}
            className="mt-4 text-3xl font-bold leading-tight text-text-primary sm:text-4xl lg:text-[3rem]"
          >
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

          <p
            ref={paragraphRef}
            className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-[0.95rem]"
          >
            Plans that grow with you — no hidden fees, just the tools you need.
          </p>
        </div>

        <main className="mt-14 grid grid-cols-1 justify-items-center gap-5 sm:gap-6 lg:grid-cols-3 lg:gap-5">
          {plans.map((plan, index) => (
            <article
              key={plan.name}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="group relative flex h-full w-full max-w-[22rem] flex-col overflow-hidden rounded-[2rem] px-7 py-8 sm:max-w-[23rem] sm:px-8 sm:py-9 lg:max-w-[21.5rem]"
            >
              <div
                className={[
                  "pointer-events-none absolute inset-0 rounded-[2rem] transition-opacity duration-300",
                  plan.featured
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100",
                ].join(" ")}
              >
                <div
                  className={[
                    "absolute inset-0 rounded-[2rem]",
                    plan.featured
                      ? "bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(245,249,255,0.97)_38%,rgba(228,240,255,0.90)_100%)]"
                      : "bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(246,250,255,0.90)_48%,rgba(233,243,255,0.72)_100%)]",
                  ].join(" ")}
                />
              </div>

              {plan.badge ? (
                <span
                  data-plan-badge
                  className="absolute right-6 top-6 z-10 rounded-full bg-white/92 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand backdrop-blur-sm"
                >
                  {plan.badge}
                </span>
              ) : null}

              <div className="relative z-10 flex h-full flex-col">
                <div>
                  <h3
                    data-plan-title
                    className="font-display text-[2.1rem] leading-none font-semibold italic tracking-[-0.035em] text-text-primary sm:text-[2.45rem] lg:text-[2.7rem]"
                  >
                    {plan.name}
                  </h3>

                  <p className="mt-3 text-tiny font-medium uppercase tracking-[0.16em] text-brand">
                    {plan.label}
                  </p>

                  <div data-plan-price className="mt-5 flex items-end gap-1.5">
                    <span className="font-mono text-[2rem] leading-none font-medium tracking-[-0.03em] text-text-primary sm:text-[2.2rem]">
                      {plan.price}
                    </span>
                    {plan.suffix ? (
                      <span className="pb-1 text-xs font-normal text-text-muted">
                        {plan.suffix}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="mt-8 flex flex-1 flex-col gap-3.5">
                  {plan.features.map((feature) => (
                    <p
                      key={feature}
                      data-plan-feature
                      className="flex items-start gap-3 text-sm leading-relaxed text-text-secondary"
                    >
                      <span className="mt-0.5 flex h-4 w-4 items-center justify-center shrink-0 text-brand">
                        <Icon icon="ic:sharp-plus" className="text-xs" />
                      </span>
                      <span>{feature}</span>
                    </p>
                  ))}
                </div>

                <div className="mt-7 flex items-center justify-between gap-4">
                  <button
                    data-plan-cta
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand px-5 text-xxs font-medium text-white transition-colors duration-200 hover:bg-brand/90"
                  >
                    {plan.cta}
                  </button>

                  {plan.featured ? (
                    <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted">
                      Best value
                    </span>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </main>
      </div>
    </section>
  );
};

export default PlansSection;
