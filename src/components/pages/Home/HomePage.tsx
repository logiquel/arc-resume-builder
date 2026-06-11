import { useRef, lazy, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";
import { Link } from "@tanstack/react-router";

// Keep your Hero static so it renders immediately without a layout shift
import HeroSection from "./sections/HeroSection";
import AppLogo from "#/components/layouts/AppLogo";
import type { AppUser } from "#/routes/__root";

// Lazy load every component below the fold
const SubHeroSection = lazy(() => import("./sections/SubHeroSection"));
const HowItWorksSection = lazy(() => import("./sections/HowItWorksSection"));
const InfoGraphicSection = lazy(() => import("./sections/InfoGraphicSection"));
const FeaturesSection = lazy(() => import("./sections/FeaturesSection"));
const PlansSection = lazy(() => import("./sections/PlansSection"));
const SubFooterSection = lazy(() => import("./sections/SubFooterSection"));
const FooterSection = lazy(() => import("./sections/FooterSection"));

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);

interface HomePageProps {
  user: AppUser | null;
}

export default function HomePage({ user }: HomePageProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = (selector: string) => {
    const smoother = ScrollSmoother.get();
    if (smoother) {
      smoother.scrollTo(selector, true, "top top");
    } else {
      document.querySelector(selector)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useGSAP(
    () => {
      ScrollSmoother.get()?.kill();

      const smoother = ScrollSmoother.create({
        wrapper: wrapperRef.current!,
        content: contentRef.current!,
        smooth: 1,
        effects: true,
        smoothTouch: 0.08,
        normalizeScroll: false,
      });

      // CRITICAL FOR LAZY LOADING + GSAP:
      // Refresh calculations whenever lazy elements finish entering the DOM
      ScrollTrigger.refresh();

      return () => smoother.kill();
    },
    { scope: wrapperRef },
  );

  return (
    <div id="smooth-wrapper" ref={wrapperRef}>
      <nav
        className="fixed top-5 right-5 flex items-center bg-white rounded-full z-20 p-1 gap-x-4 pl-5 border border-black/5"
        style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
      >
        <button
          onClick={() => scrollToSection("#hero")}
          className="h-5 cursor-pointer"
        >
          <AppLogo secondaryColor="#3E4850" showTagLine={false} />
        </button>
        <button
          type="button"
          onClick={() => scrollToSection("#features")}
          className="text-xxs font-medium text-text-primary hover:text-brand cursor-pointer"
        >
          Features
        </button>
        <button
          type="button"
          onClick={() => scrollToSection("#pricing")}
          className="text-xxs font-medium text-text-primary hover:text-brand cursor-pointer"
        >
          Pricing
        </button>

        {!user ? (
          <>
            <Link
              to="/sign-in"
              className="text-xxs font-medium text-text-primary"
            >
              Login
            </Link>
            <Link
              to="/sign-up"
              className="text-xxs font-medium h-fit px-5 py-3 rounded-[inherit] bg-brand text-white flex items-center justify-center"
            >
              Register
            </Link>
          </>
        ) : (
          <Link
            to="/dashboard"
            className="text-xxs font-medium h-fit px-5 py-3 rounded-[inherit] bg-brand text-white flex items-center justify-center"
          >
            Dashboard
          </Link>
        )}
      </nav>

      <div id="smooth-content" ref={contentRef}>
        <HeroSection />

        {/* Wrap your lazy sections in Suspense so the build breaks them into separate chunks */}
        <Suspense
          fallback={<div className="h-40 w-full bg-white animate-pulse" />}
        >
          <SubHeroSection />
          <HowItWorksSection />
          <InfoGraphicSection />
          <FeaturesSection />
          <PlansSection />
          <SubFooterSection />
          <FooterSection user={user} scrollToSection={scrollToSection} />
        </Suspense>
      </div>
    </div>
  );
}
