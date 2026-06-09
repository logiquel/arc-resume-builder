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

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);

export default function HomePage() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

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
      <div id="smooth-content" ref={contentRef}>
        <HeroSection />
        <SubHeroSection />
        <HowItWorksSection />
        <InfoGraphicSection />
        <FeaturesSection />
        <PlansSection />
        <SubFooterSection />
        <FooterSection />
        {/* <div className="w-full h-screen"></div> */}
      </div>
    </div>
  );
}
