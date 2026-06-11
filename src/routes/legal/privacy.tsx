import { useState, useEffect, useRef, useCallback } from "react";
import { createFileRoute, useMatches, useRouter } from "@tanstack/react-router";
import { ArrowUp } from "lucide-react";
import { Icon } from "@iconify/react";
import AppBreadcrumb from "#/components/layouts/AppBreadcrumb";

export const Route = createFileRoute("/legal/privacy")({
  staticData: {
    pageLabel: "Privacy Policy",
    pageDescription: "",
  },
  component: PrivacyPage,
});

const PRIVACY_SECTIONS = [
  { id: "introduction", number: "1", title: "Introduction" },
  { id: "collection", number: "2", title: "Personal Data We Collect" },
  { id: "usage", number: "3", title: "How We Use Personal Data" },
  { id: "sharing", number: "4", title: "Data Sharing & Sub-processors" },
  { id: "rights", number: "5", title: "Your Rights as Data Principal" },
  { id: "retention", number: "6", title: "Data Retention & Security" },
  { id: "children", number: "7", title: "Children's Privacy Protection" },
];

function PrivacyPage() {
  const router = useRouter();
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];

  const label = currentMatch?.staticData?.pageLabel ?? "Page";
  const description = currentMatch?.staticData?.pageDescription ?? "";

  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simplified scroll telemetry handler (removes heavy DOM querying logic)
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const progress = scrollTop / (scrollHeight - clientHeight);
    setScrollProgress(Math.min(progress, 1));
    setShowBackToTop(scrollTop > 400);
  }, []);

  // Sync scroll listener
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Modern Intersection Observer setup for active Table of Contents tracking
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const visibleSections = new Map<string, boolean>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleSections.set(entry.target.id, entry.isIntersecting);
        });

        // Locate first intersecting item present in array topology
        const currentVisible = PRIVACY_SECTIONS.find((s) =>
          visibleSections.get(s.id),
        );
        if (currentVisible) {
          setActiveSection(currentVisible.id);
        }
      },
      {
        root: container,
        // Aligns precisely with 'scroll-mt-8' layout vectors (32px top padding margin matrix)
        rootMargin: "-32px 0px -70% 0px",
        threshold: 0,
      },
    );

    PRIVACY_SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

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
        {/* Visual Progress Bar UI Element */}
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-brand transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress * 100}%` }}
        />
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
                  Data Governance Framework
                </span>
              </div>
              <h1 className="font-display text-xl font-normal text-text-primary leading-[1.1] mb-3 tracking-[-0.01em]">
                Privacy Policy
              </h1>
              <p className="text-tiny text-text-muted/70 font-mono tracking-wide">
                Last Updated: June 10, 2026
              </p>
              <div className="mt-8 h-px bg-linear-to-r from-gray-200/80 via-gray-100 to-transparent" />
            </header>

            <div className="space-y-16 text-xs leading-[1.8] pb-24">
              {/* Section 1 */}
              <section id="introduction" className="scroll-mt-8 space-y-5">
                <PrivacySectionHeading number="1">
                  Introduction
                </PrivacySectionHeading>
                <p>
                  Welcome to ARC — AI Resume Builder ("ARC"). This Privacy
                  Policy outlines how Logiquel ("Agency", "we", "us", or "our")
                  collects, uses, stores, and discloses your personal data when
                  you use our website, services, and applications (collectively,
                  the "Site").
                </p>
                <p>
                  We are committed to protecting your privacy and complying with
                  the applicable data protection laws of India. In the context
                  of this service, Logiquel acts as the{" "}
                  <strong className="text-text-primary font-medium">
                    Data Fiduciary/Controller
                  </strong>
                  , and you, the user, are the{" "}
                  <strong className="text-text-primary font-medium">
                    Data Principal/Subject
                  </strong>
                  .
                </p>
                <Callout>
                  By accessing or using our Site, you signify your informed
                  consent to the collection, tracking, processing, and framework
                  methodologies described inside this Policy.
                </Callout>
              </section>

              {/* Section 2 */}
              <section id="collection" className="scroll-mt-8 space-y-5">
                <PrivacySectionHeading number="2">
                  Personal Data We Collect
                </PrivacySectionHeading>
                <p>
                  We collect personal data that you voluntarily submit to the
                  platform during core setup interfaces and processing routines:
                </p>
                <ul className="space-y-5 list-none pl-0">
                  <PrivacySubItem title="Account Registration">
                    Name, email address, and explicit profile login account
                    credentials.
                  </PrivacySubItem>
                  <PrivacySubItem title="Payment Lifecycle Information">
                    Transactional tokens managed strictly and securely via our
                    selected external payment platform partners.
                  </PrivacySubItem>
                  <PrivacySubItem title="Resume Data Architecture">
                    Information you enter to build your career document, such as
                    educational background, professional experience, specific
                    skill descriptions, and personal contact vectors.
                  </PrivacySubItem>
                  <PrivacySubItem title="Technical & Telemetry Data">
                    IP address strings, browser classifications, core operating
                    system parameters, interaction logs (pages visited, duration
                    metrics), and AI parsing text structures.
                  </PrivacySubItem>
                </ul>
              </section>

              {/* Section 3 */}
              <section id="usage" className="scroll-mt-8 space-y-5">
                <PrivacySectionHeading number="3">
                  How We Use Personal Data
                </PrivacySectionHeading>
                <p>
                  Your captured analytical variables are utilized strictly for
                  the matching processing actions:
                </p>
                <ul className="space-y-3 pl-0 list-none">
                  <li className="flex gap-3.5 items-start">
                    <span className="w-5 h-5 rounded-md bg-brand/[0.07] flex items-center justify-center mt-0.5 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand/70" />
                    </span>
                    <div>
                      <strong className="text-text-primary font-medium">
                        To Deliver Content:
                      </strong>{" "}
                      Building AI-powered content workflows, account state
                      lookups, and updating token allocations.
                    </div>
                  </li>
                  <li className="flex gap-3.5 items-start">
                    <span className="w-5 h-5 rounded-md bg-brand/[0.07] flex items-center justify-center mt-0.5 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand/70" />
                    </span>
                    <div>
                      <strong className="text-text-primary font-medium">
                        Model Calibration:
                      </strong>{" "}
                      Using anonymized or de-identified data clusters to refine
                      our underlying processing parameters, unless you
                      explicitly choose to opt-out.
                    </div>
                  </li>
                  <li className="flex gap-3.5 items-start">
                    <span className="w-5 h-5 rounded-md bg-brand/[0.07] flex items-center justify-center mt-0.5 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand/70" />
                    </span>
                    <div>
                      <strong className="text-text-primary font-medium">
                        Service Communication:
                      </strong>{" "}
                      Transmitting necessary payment receipts, support queries,
                      and changes to structural legal conditions.
                    </div>
                  </li>
                  <li className="flex gap-3.5 items-start">
                    <span className="w-5 h-5 rounded-md bg-brand/[0.07] flex items-center justify-center mt-0.5 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand/70" />
                    </span>
                    <div>
                      <strong className="text-text-primary font-medium">
                        Platform Infrastructure Security:
                      </strong>{" "}
                      Auditing interface security to mitigate fraud and secure
                      operational databases.
                    </div>
                  </li>
                </ul>
              </section>

              {/* Section 4 */}
              <section id="sharing" className="scroll-mt-8 space-y-5">
                <div className="h-px bg-linear-to-r from-gray-200/60 via-gray-100 to-transparent mb-12" />
                <PrivacySectionHeading number="4">
                  Data Sharing & Sub-processors
                </PrivacySectionHeading>
                <p>
                  <strong className="text-text-primary font-semibold block mb-2">
                    Core Principle: We do not sell your personal data.
                  </strong>
                  We disclose data structures solely to sub-processors handling
                  operations required to run the platform application smoothly:
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 my-4">
                  <DataCard title="AI Sub-Processors">
                    Third-party computational layers tasked only with rendering
                    system resume text transformations.
                  </DataCard>
                  <DataCard title="Secure Payments">
                    Highly encrypted payment processors managing transactions
                    without passing details to our primary storage.
                  </DataCard>
                  <DataCard title="Statutory Mandates">
                    Regulatory or law enforcement agencies, strictly when
                    requested under binding provisions of Indian law.
                  </DataCard>
                </div>
              </section>

              {/* Section 5 */}
              <section id="rights" className="scroll-mt-8 space-y-5">
                <div className="h-px bg-linear-to-r from-gray-200/60 via-gray-100 to-transparent mb-12" />
                <PrivacySectionHeading number="5">
                  Your Rights as Data Principal
                </PrivacySectionHeading>
                <p>
                  Under active provisions of data protection laws in India, you
                  hold concrete legal entitlements over your privacy parameters:
                </p>
                <div className="space-y-3 font-mono text-xxs text-text-primary bg-linear-to-br from-gray-50/80 to-gray-50/40 border border-gray-200/60 p-6 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                  <p className="flex gap-2 items-start">
                    <span className="text-brand shrink-0">•</span>
                    <span>
                      <strong className="font-semibold text-brand">
                        Access and Rectification:
                      </strong>{" "}
                      The right to view, audit, and modify any incorrect record
                      metrics directly within your profile view.
                    </span>
                  </p>
                  <p className="flex gap-2 items-start">
                    <span className="text-brand shrink-0">•</span>
                    <span>
                      <strong className="font-semibold text-brand">
                        Erasure Protocol:
                      </strong>{" "}
                      The right to request comprehensive deletion of your
                      account footprint and any associated resume outputs.
                    </span>
                  </p>
                  <p className="flex gap-2 items-start">
                    <span className="text-brand shrink-0">•</span>
                    <span>
                      <strong className="font-semibold text-brand">
                        Consent Withdrawal:
                      </strong>{" "}
                      The right to decline tracking hooks or automated
                      generation routines, which might lower your application
                      functionality.
                    </span>
                  </p>
                </div>
                <p className="text-xxs text-text-muted leading-relaxed">
                  To invoke these structural frameworks, route your direct
                  intent via message template to our security inbox at{" "}
                  <a
                    href="mailto:hello@logiquel.com"
                    className="text-brand font-medium underline decoration-brand/20 underline-offset-2 hover:decoration-brand/60 transition-colors"
                  >
                    hello@logiquel.com
                  </a>
                  .
                </p>
              </section>

              {/* Section 6 */}
              <section id="retention" className="scroll-mt-8 space-y-5">
                <div className="h-px bg-linear-to-r from-gray-200/60 via-gray-100 to-transparent mb-12" />
                <PrivacySectionHeading number="6">
                  Data Retention & Security
                </PrivacySectionHeading>
                <p>
                  We store records as long as your account remains actively
                  maintained. Personal documents and resume text components are
                  systematically and permanently purged upon user deletion
                  requests, or after a continuous timeline of platform
                  inactivity covering{" "}
                  <strong className="text-text-primary font-medium">
                    24 months
                  </strong>
                  .
                </p>
                <p>
                  We set up industry-standard organizational setups to shield
                  your data. However, remember that no digital transmission
                  network on the open internet can be completely bulletproof;
                  absolute safety parameters cannot be mathematically
                  guaranteed.
                </p>
              </section>

              {/* Section 7 */}
              <section id="children" className="scroll-mt-8 space-y-5">
                <div className="h-px bg-linear-to-r from-gray-200/60 via-gray-100 to-transparent mb-12" />
                <PrivacySectionHeading number="7">
                  Children's Privacy Protection
                </PrivacySectionHeading>
                <p>
                  Our application framework is not designed, calibrated, or
                  intended for access by individuals under the age of{" "}
                  <strong className="text-text-primary font-medium">18</strong>.
                  We do not knowingly capture or process personal identifiers
                  from minors.
                </p>
              </section>

              {/* Footer Block */}
              <footer className="mt-20">
                <div className="h-px bg-linear-to-r from-gray-200/80 via-gray-100 to-transparent mb-10" />

                <div className="bg-linear-to-br from-gray-50/80 to-white border border-gray-200/50 p-6 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                  <h3 className="text-xxs font-mono uppercase text-text-primary/80 font-bold mb-3 tracking-[0.08em] flex items-center gap-2">
                    <span className="w-3 h-px bg-gray-300" />
                    Grievance and Contact Information
                  </h3>
                  <p className="text-xxs text-text-muted mb-5 leading-relaxed">
                    For concerns regarding compliance parameters, data
                    governance audits, or to launch clear requests to exercise
                    your rights, connect with our tracking team directly:
                  </p>
                  <div className="font-mono text-xxs text-text-primary space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-brand/70 font-medium w-12 text-tiny uppercase tracking-wide">
                        Agency
                      </span>
                      <span className="text-text-secondary">Logiquel</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-brand/70 font-medium w-12 text-tiny uppercase tracking-wide">
                        Email
                      </span>
                      <a
                        href="mailto:hello@logiquel.com"
                        className="text-text-secondary hover:text-brand transition-colors duration-200 hover:underline underline-offset-2"
                      >
                        hello@logiquel.com
                      </a>
                    </div>
                  </div>
                  <p className="text-tiny text-text-muted/60 mt-5 italic leading-relaxed">
                    Note: Logiquel is a digital-only infrastructure agency. We
                    do not maintain physical mail rooms or hardcopy paperwork
                    intake queues. All interactions must proceed electronically
                    via the channels listed above.
                  </p>
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
            Data Principles
          </p>
          <nav className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-100" />
            <ul className="space-y-0.5">
              {PRIVACY_SECTIONS.map((s) => (
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
                    />
                    <span className="font-mono mr-1.5 text-tiny opacity-30 group-hover:opacity-60">
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
function PrivacySectionHeading({
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

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative bg-brand/3 border border-brand/3 p-5 my-5 rounded-xl overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-0.75 bg-brand/60 rounded-r-full" />
      <p className="text-xxs text-text-primary/90 font-medium leading-[1.7] pl-1">
        {children}
      </p>
    </div>
  );
}

function PrivacySubItem({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3.5 items-start border-b border-gray-100/60 pb-4 last:border-0 last:pb-0">
      <span className="w-5 h-5 rounded-md bg-brand/[0.07] flex items-center justify-center mt-0.5 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-brand/70" />
      </span>
      <div>
        <strong className="text-text-primary block font-medium mb-1 text-xs">
          {title}
        </strong>
        <span className="text-text-secondary text-xxs leading-relaxed">
          {children}
        </span>
      </div>
    </li>
  );
}

function DataCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 border border-gray-200/50 rounded-xl bg-linear-to-br from-gray-50/80 to-white shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <h4 className="text-xxs font-mono font-bold text-text-primary mb-1.5 tracking-wide">
        {title}
      </h4>
      <p className="text-tiny text-text-muted leading-relaxed">{children}</p>
    </div>
  );
}
