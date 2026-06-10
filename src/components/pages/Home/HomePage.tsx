import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";
import HeroSection from "./sections/HeroSection";
import SubHeroSection from "./sections/SubHeroSection";
import HowItWorksSection from "./sections/HowItWorksSection";
import InfoGraphicSection from "./sections/InfoGraphicSection";
import FeaturesSection from "./sections/FeaturesSection";
import PlansSection from "./sections/PlansSection";
import SubFooterSection from "./sections/SubFooterSection";
import FooterSection from "./sections/FooterSection";
import AppLogo from "#/components/layouts/AppLogo";
import type { AppUser } from "#/routes/__root";
import { Link } from "@tanstack/react-router";

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

      return () => smoother.kill();
    },
    { scope: wrapperRef },
  );

  return (
    <div id="smooth-wrapper" ref={wrapperRef}>
      <nav
        className="fixed top-5 right-5 flex items-center bg-white rounded-full z-20 p-1 gap-x-4 pl-5 border border-black/5"
        style={{
          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
        }}
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
        <SubHeroSection />
        <HowItWorksSection />
        <InfoGraphicSection />
        <FeaturesSection />
        <PlansSection />
        <SubFooterSection />
        <FooterSection user={user} scrollToSection={scrollToSection} />
      </div>
    </div>
  );
}
