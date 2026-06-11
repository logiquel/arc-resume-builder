import { useState, useEffect, useRef, useCallback } from "react";
import { createFileRoute, useMatches, useRouter } from "@tanstack/react-router";
import { ArrowUp } from "lucide-react";
import { Icon } from "@iconify/react";
import AppBreadcrumb from "../../components/layouts/AppBreadcrumb";

export const Route = createFileRoute("/legal/terms")({
  staticData: {
    pageLabel: "Terms & Condition",
    pageDescription: "",
  },
  component: TermsPage,
});

const SECTIONS = [
  { id: "introduction", number: "1", title: "Introduction and Acceptance" },
  { id: "privacy", number: "2", title: "Privacy and Data Usage" },
  { id: "token-model", number: "3", title: "Token-Based Service Model" },
  { id: "ai-disclaimer", number: "4", title: "AI Service Disclaimer" },
  { id: "payments", number: "5", title: "Payments, Cancellation & Refunds" },
  { id: "delivery", number: "6", title: "Digital Shipping and Delivery" },
  { id: "legal", number: "7", title: "Legal Framework and Liability" },
];

function TermsPage() {
  const router = useRouter();

  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];

  const label = currentMatch?.staticData?.pageLabel ?? "Page";
  const description = currentMatch?.staticData?.pageDescription ?? "";

  const [activeSection, setActiveSection] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop } = el;

    setShowBackToTop(scrollTop > 400);

    const containerRect = el.getBoundingClientRect();
    let current = "";

    for (const s of SECTIONS) {
      const sec = document.getElementById(s.id);
      if (sec) {
        const rect = sec.getBoundingClientRect();
        const relativeTop = rect.top - containerRect.top;
        if (relativeTop <= 80) {
          current = s.id;
        }
      }
    }
    setActiveSection(current || SECTIONS[0].id);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-white font-sans text-text-secondary selection:bg-brand/10 selection:text-brand">
      {/* Top Navigation Frame */}
      <header className="min-h-14 w-full flex items-center gap-3 px-6 py-2 bg-white/80 backdrop-blur-xl border-b border-gray-100/80 shrink-0 relative z-10">
        <button
          onClick={() => router.history.back()}
          className="h-8 w-8 shrink-0 flex items-center justify-center border border-gray-200/80 rounded-lg bg-white hover:bg-gray-50 hover:border-gray-300/80 cursor-pointer transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
        >
          <Icon
            icon="lets-icons:back"
            className="w-4 h-4 text-text-secondary"
          />
        </button>
        <div className="flex flex-col gap-0.5">
          <h2 className="text-xs text-text-primary flex items-center font-medium leading-tight">
            {label}
          </h2>
          {description && (
            <p className="text-xxs text-text-muted leading-tight">
              {description}
            </p>
          )}
          <AppBreadcrumb />
        </div>
      </header>

      {/* Main Structural Body Viewport */}
      <div className="w-full flex-1 min-h-0 flex overflow-hidden">
        {/* --- Content Component Frame (Left side layout) --- */}
        <main
          ref={scrollRef}
          className="flex-1 h-full overflow-y-auto bg-linear-to-b from-white to-gray-50/30 hide-scrollbar px-6 md:px-12 lg:px-16 py-12 md:py-16"
        >
          <div className="max-w-170 ml-auto mr-auto lg:mr-16 xl:mx-auto">
            {/* Document Header */}
            <header className="pb-10 mb-14">
              <div className="flex items-center gap-2.5 mb-6">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-tiny font-mono uppercase tracking-widest text-brand/90 bg-brand/6 border border-brand/8 rounded-full font-medium">
                  <span className="w-1 h-1 rounded-full bg-brand/60" />
                  Legal Agreement
                </span>
              </div>
              <h1 className="font-display text-xl font-normal text-text-primary leading-[1.1] mb-3 tracking-[-0.01em]">
                Terms and Conditions
              </h1>
              <p className="text-tiny text-text-muted/70 font-mono tracking-wide">
                Last Updated: June 10, 2026
              </p>
              <div className="mt-8 h-px bg-linear-to-r from-gray-200/80 via-gray-100 to-transparent" />
            </header>

            <div className="space-y-16 text-xs leading-[1.8] pb-24">
              {/* Section 1 */}
              <section id="introduction" className="scroll-mt-8 space-y-5">
                <SectionHeading number="1">
                  Introduction and Acceptance
                </SectionHeading>
                <p>
                  Welcome to ARC — AI Resume Builder ("ARC"). These Terms and
                  Conditions and all other legal documents incorporated by
                  reference (collectively, the "Terms") set forth the legal
                  contract between Logiquel ("Agency", "we," "us," or "our") and
                  each end user ("User", "you" or "your") with respect to your
                  access to and use of our website, platform, tools, software,
                  and services (collectively, the "Service").
                </p>
                <Callout>
                  PLEASE READ THESE TERMS CAREFULLY. By accessing or using the
                  Service, you represent that you are of legal age to enter into
                  a binding contract and you agree to be bound by these Terms.
                </Callout>
              </section>

              {/* Section 2 */}
              <section id="privacy" className="scroll-mt-8 space-y-5">
                <SectionHeading number="2">
                  Privacy and Data Usage
                </SectionHeading>
                <p>
                  Your privacy is very important to us. Our Privacy Policy
                  explains how we collect, use, and protect your personal data.
                  The Privacy Policy is hereby incorporated by reference into
                  these Terms.
                </p>
              </section>

              {/* Section 3 */}
              <section id="token-model" className="scroll-mt-8 space-y-5">
                <SectionHeading number="3">
                  Token-Based Service Model
                </SectionHeading>
                <ul className="space-y-6 list-none pl-0">
                  <SubItem number="3.1" title="Manual Payments">
                    ARC operates on a manual payment basis. There is NO
                    auto-renewal. When your payment cycle ends or your tokens
                    are exhausted, you must manually pay again to continue using
                    premium features.
                  </SubItem>
                  <SubItem number="3.2" title="Token Usage">
                    Access to AI features is governed by "Tokens". Each action
                    (e.g., generating a resume, rewriting a section) consumes a
                    specific number of tokens.
                  </SubItem>
                  <SubItem number="3.3" title="Token Exhaustion">
                    If you use all your allocated tokens before your payment
                    cycle (e.g., 30 days) expires, the AI features will cease to
                    work immediately. You must recharge or purchase a new plan
                    to continue using these features.
                  </SubItem>
                  <SubItem number="3.4" title="Cycle Expiration and Carryover">
                    Each payment covers a specific "Cycle" or "Validity Period".
                    If your cycle finishes while you still have tokens
                    remaining, you must recharge or purchase a new plan to gain
                    access to the service and a fresh set of tokens. However,
                    any remaining tokens from your previous cycle can still be
                    used{" "}
                    <span className="italic font-medium text-text-primary">
                      after
                    </span>{" "}
                    you have recharged for a new cycle. Tokens only become
                    accessible again once a valid, active cycle is in place.
                  </SubItem>
                </ul>
              </section>

              {/* Section 4 */}
              <section id="ai-disclaimer" className="scroll-mt-8 space-y-5">
                <SectionHeading number="4">
                  AI Service Disclaimer and Accuracy
                </SectionHeading>
                <div className="space-y-4">
                  <p>
                    <strong className="text-text-primary font-medium">
                      AI-Generated Content:
                    </strong>{" "}
                    ARC uses artificial intelligence to help generate resume
                    content. AI-generated content can occasionally be inaccurate
                    or biased.
                  </p>
                  <p>
                    <strong className="text-text-primary font-medium">
                      User Responsibility:
                    </strong>{" "}
                    You are solely responsible for reviewing and verifying all
                    content generated. Logiquel does not guarantee the accuracy
                    of AI-generated content.
                  </p>
                  <p>
                    <strong className="text-text-primary font-medium">
                      No Guarantee of Employment:
                    </strong>{" "}
                    Use of the Service does not guarantee job interviews or
                    offers.
                  </p>
                </div>
              </section>

              {/* Section 5 */}
              <section id="payments" className="scroll-mt-8 space-y-5">
                <div className="h-px bg-linear-to-r from-gray-200/60 via-gray-100 to-transparent mb-12" />
                <SectionHeading number="5">
                  Payments, Cancellation, and Refunds
                </SectionHeading>
                <p>
                  You agree to honor your payment obligations. Fees are
                  inclusive of applicable taxes. ARC — AI Resume Builder
                  operates on a non-recurring, manual payment basis with no
                  automatic renewals.
                </p>
                <div className="bg-linear-to-br from-gray-50/80 to-gray-50/40 border border-gray-200/60 p-6 rounded-xl space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                  <h3 className="text-xxs font-mono uppercase text-text-primary font-bold tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400/80" />
                    Strict No-Refund Policy
                  </h3>
                  <p className="text-xxs text-text-secondary leading-[1.7]">
                    Due to the digital nature of the services provided by ARC —
                    AI Resume Builder (including the immediate allocation of AI
                    tokens and access to premium features),{" "}
                    <strong className="text-text-primary font-semibold">
                      all payments made to Logiquel are non-refundable.
                    </strong>{" "}
                    This applies to all purchases, regardless of whether tokens
                    have been partially used or remain unused.
                  </p>
                  <p className="text-xxs text-text-secondary leading-[1.7]">
                    As our service provides immediate access to digital assets
                    and computational AI resources, we cannot offer refunds once
                    the transaction is complete. Refunds are not provided for
                    unused tokens.
                  </p>
                </div>
                <p className="text-xxs text-text-muted italic leading-relaxed">
                  Before filing a chargeback with your bank, we kindly request
                  that you contact us at{" "}
                  <a
                    href="mailto:hello@logiquel.com"
                    className="text-brand not-italic font-medium underline decoration-brand/20 underline-offset-2 hover:decoration-brand/60 transition-colors"
                  >
                    hello@logiquel.com
                  </a>{" "}
                  to resolve any billing issues directly.
                </p>
              </section>

              {/* Section 6 */}
              <section id="delivery" className="scroll-mt-8 space-y-5">
                <div className="h-px bg-linear-to-r from-gray-200/60 via-gray-100 to-transparent mb-12" />
                <SectionHeading number="6">
                  Digital Shipping and Delivery
                </SectionHeading>
                <p>
                  All of our products and services, including subscriptions and
                  one-time purchases, are delivered{" "}
                  <strong className="text-text-primary font-semibold">
                    entirely digitally.
                  </strong>{" "}
                  No physical items will be shipped to your address.
                </p>
                <p>
                  Once your payment is successfully processed, you will receive
                  immediate access to your purchased services electronically
                  via:
                </p>
                <ul className="space-y-4 pl-0">
                  <li className="flex gap-3.5 items-start">
                    <span className="w-5 h-5 rounded-md bg-brand/[0.07] flex items-center justify-center mt-0.5 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand/70" />
                    </span>
                    <div>
                      <strong className="text-text-primary font-medium">
                        Instant Account Access:
                      </strong>{" "}
                      Your service will be activated instantly and will be
                      available in your personal account dashboard on our
                      website.
                    </div>
                  </li>
                  <li className="flex gap-3.5 items-start">
                    <span className="w-5 h-5 rounded-md bg-brand/[0.07] flex items-center justify-center mt-0.5 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand/70" />
                    </span>
                    <div>
                      <strong className="text-text-primary font-medium">
                        Email Confirmation:
                      </strong>{" "}
                      We will send a confirmation email containing your purchase
                      details and instructions to the address provided during
                      checkout.
                    </div>
                  </li>
                </ul>
                <p className="text-xxs text-text-muted leading-relaxed">
                  If you experience access delays, check your spam or junk
                  folder, ensure you are logged into the right account, or
                  contact customer support.
                </p>
              </section>

              {/* Section 7 */}
              <section id="legal" className="scroll-mt-8 space-y-6">
                <div className="h-px bg-linear-to-r from-gray-200/60 via-gray-100 to-transparent mb-12" />
                <SectionHeading number="7">
                  Legal Framework and Liability
                </SectionHeading>
                <div className="space-y-8">
                  <LegalBlock title="Ownership">
                    Except for your User Content, the Service and all materials
                    therein are the property of Logiquel. You retain ownership
                    of your input data and grant us a license to process it to
                    provide the Service.
                  </LegalBlock>
                  <LegalBlock title="Disclaimer of Warranties">
                    <p className="font-mono text-xxs uppercase bg-linear-to-br from-gray-50 to-gray-50/50 border border-gray-200/60 p-5 rounded-xl text-text-primary/80 leading-[1.8] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                      THE SERVICE IS PROVIDED ON AN "AS IS" BASIS. LOGIQUEL
                      DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED. WE DO NOT
                      WARRANT THAT THE SERVICE WILL BE ERROR-FREE.
                    </p>
                  </LegalBlock>
                  <LegalBlock title="Limitation of Liability">
                    To the fullest extent permitted by law, Logiquel shall not
                    be liable for any indirect or consequential damages. Our
                    total liability is limited to the amount you paid us in the
                    12 months preceding the claim.
                  </LegalBlock>
                  <LegalBlock title="Governing Law">
                    These Terms shall be governed by the laws of India. Any
                    disputes shall be subject to the exclusive jurisdiction of
                    the competent courts in India.
                  </LegalBlock>
                </div>
              </section>

              {/* Footer Block */}
              <footer className="mt-20">
                <div className="h-px bg-linear-to-r from-gray-200/80 via-gray-100 to-transparent mb-10" />
                <p className="text-xxs text-text-muted mb-5">
                  For any questions about these Terms, please contact customer
                  support:
                </p>
                <div className="font-mono text-xxs text-text-primary bg-linear-to-br from-gray-50/80 to-white border border-gray-200/50 p-5 rounded-xl inline-flex flex-col gap-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                  <span className="flex items-center gap-3">
                    <span className="text-brand/70 font-medium w-12 text-tiny uppercase tracking-wide">
                      Agency
                    </span>
                    <span className="text-text-secondary">Logiquel</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="text-brand/70 font-medium w-12 text-tiny uppercase tracking-wide">
                      Email
                    </span>
                    <a
                      href="mailto:hello@logiquel.com"
                      className="text-text-secondary hover:text-brand transition-colors duration-200 hover:underline underline-offset-2"
                    >
                      hello@logiquel.com
                    </a>
                  </span>
                </div>

                <div className="mt-20 flex items-center justify-between text-tiny text-text-muted/60">
                  <span>
                    © {new Date().getFullYear()} Logiquel. All rights reserved.
                  </span>
                  <span className="font-mono text-tiny tracking-wider">
                    ARC v1.0
                  </span>
                </div>
              </footer>
            </div>
          </div>

          {/* Floating Back-to-Top Action Button */}
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className={`fixed bottom-8 right-8 z-50 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200/80 shadow-lg shadow-black/6 flex items-center justify-center text-text-muted hover:text-brand hover:border-brand/20 hover:shadow-brand/8 hover:shadow-xl transition-all duration-300 cursor-pointer group ${
              showBackToTop
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-3 scale-95 pointer-events-none"
            }`}
          >
            <ArrowUp className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
          </button>
        </main>

        {/* --- Right Navigation TOC --- */}
        <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-linear-to-b from-white to-gray-50/20 h-full overflow-y-auto py-12 md:py-16 px-5">
          <p className="text-tiny font-mono uppercase tracking-[0.15em] text-text-muted/60 mb-5 font-medium pl-4">
            On this page
          </p>
          <nav className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-100" />
            <ul className="space-y-0.5">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => scrollToSection(s.id)}
                    className={`relative block w-full text-left pl-4 py-2 text-xxs transition-all duration-200 cursor-pointer rounded-r-md group font-normal ${
                      activeSection === s.id
                        ? "text-brand"
                        : "text-text-muted/80 hover:text-text-secondary hover:bg-gray-50/50"
                    }`}
                  >
                    {/* Active indicator */}
                    <span
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-full transition-all duration-300 ${
                        activeSection === s.id
                          ? "h-5 bg-brand opacity-100"
                          : "h-0 bg-brand opacity-0"
                      }`}
                    />
                    <span
                      className={`font-mono mr-1.5 text-tiny transition-opacity duration-200 ${
                        activeSection === s.id ? "opacity-60" : "opacity-30"
                      }`}
                    >
                      {s.number}.
                    </span>
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </div>
  );
}

/* ─── Shared Local Functional Components ─── */
function SectionHeading({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <h2 className="text-sm font-semibold text-text-primary tracking-[-0.01em] flex items-baseline gap-2.5 leading-snug">
      <span className="font-mono text-brand/50 text-xxs font-bold shrink-0">
        {number}.
      </span>
      {children}
    </h2>
  );
}

// Fixed fluid styling from text-xs down to text-tiny/xxs where optimal
function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative bg-brand/3 border border-brand/8 p-5 my-5 rounded-xl overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-0.75 bg-brand/60 rounded-r-full" />
      <p className="text-xxs text-text-primary/90 font-medium leading-[1.7] pl-1">
        {children}
      </p>
    </div>
  );
}

function SubItem({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3.5 items-start">
      <span className="font-mono text-brand/50 text-xxs font-bold select-none mt-0.75 shrink-0 w-6 text-right">
        {number}
      </span>
      <div>
        <strong className="text-text-primary block font-medium mb-1 text-xs">
          {title}
        </strong>
        <span className="text-text-secondary">{children}</span>
      </div>
    </li>
  );
}

function LegalBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-xxs font-mono uppercase text-text-primary/80 font-bold mb-3 tracking-[0.08em] flex items-center gap-2">
        <span className="w-3 h-px bg-gray-300" />
        {title}
      </h3>
      <div className="text-text-secondary pl-5">{children}</div>
    </div>
  );
}
