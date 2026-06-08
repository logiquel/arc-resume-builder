import { Icon } from "@iconify/react";
import heroVideo from "/hero_video.mp4";
import { useRef } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, SplitText);

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!headingRef.current) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const split = SplitText.create(headingRef.current, {
        type: "lines,words",
        linesClass: "hero-line",
        mask: "lines",
      });

      gsap.set(".hero-line", {
        paddingBottom: "0.12em",
        marginBottom: "-0.12em",
      });

      gsap.set(videoRef.current, {
        scale: 1.08,
        transformOrigin: "center center",
      });
      gsap.set(split.words, {
        yPercent: 115,
        rotateX: -8,
        transformOrigin: "0% 100%",
        opacity: 0,
        filter: "blur(8px)",
      });
      gsap.set(
        [
          badgeRef.current,
          descriptionRef.current,
          ctaRef.current,
          trustRef.current,
        ],
        {
          y: 18,
          opacity: 0,
          filter: "blur(8px)",
        },
      );
      gsap.set(scrollRef.current, {
        y: 10,
        opacity: 0,
      });

      if (reduceMotion) {
        gsap.set(videoRef.current, { scale: 1.03 });
        gsap.set(split.words, {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
          filter: "blur(0px)",
        });
        gsap.set(
          [
            badgeRef.current,
            descriptionRef.current,
            ctaRef.current,
            trustRef.current,
            scrollRef.current,
          ],
          { y: 0, opacity: 1, filter: "blur(0px)" },
        );
        return () => split.revert();
      }

      const tl = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      tl.to(videoRef.current, {
        scale: 1.03,
        duration: 2.2,
        ease: "power2.out",
      })
        .to(
          badgeRef.current,
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.72,
            ease: "power3.out",
          },
          0.35,
        )
        .to(
          split.words,
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.05,
            stagger: 0.045,
            ease: "power4.out",
          },
          0.48,
        )
        .to(
          descriptionRef.current,
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.82,
            ease: "power3.out",
          },
          1.02,
        )
        .to(
          ctaRef.current,
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.82,
            ease: "power3.out",
          },
          1.14,
        )
        .to(
          trustRef.current,
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.82,
            ease: "power3.out",
          },
          1.28,
        )
        .to(
          scrollRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.72,
            ease: "power2.out",
          },
          1.55,
        );

      const scrollTween = gsap.timeline({ repeat: -1, repeatDelay: 0.2 });
      scrollTween
        .fromTo(
          ".hero-scroll-dot",
          {
            y: 0,
            opacity: 0,
            scale: 0.85,
          },
          {
            y: 14,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: "power2.out",
          },
        )
        .to(".hero-scroll-dot", {
          y: 18,
          opacity: 0,
          scale: 0.9,
          duration: 0.7,
          ease: "power2.in",
        });

      return () => {
        tl.kill();
        scrollTween.kill();
        split.revert();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[700px] overflow-hidden"
    >
      <video
        ref={videoRef}
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/75" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.45)_100%)]" />

      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="max-w-4xl">
            <div
              ref={badgeRef}
              className="mb-6 inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-white/90">
                AI-Powered Resume Tailoring
              </span>
            </div>

            <h1
              ref={headingRef}
              className="text-white font-bold leading-[1.02] tracking-tight [perspective:1000px]"
            >
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                Stop
                <span className="font-display font-normal italic">
                  {" "}
                  Writing.
                </span>
              </span>

              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                Start
                <span className="font-display font-normal italic">
                  {" "}
                  Landing.
                </span>
              </span>
            </h1>

            <p
              ref={descriptionRef}
              className="mt-6 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base md:text-base"
            >
              Generate tailored resumes, optimize for ATS, and apply with
              confidence — all powered by AI.
            </p>

            <div ref={ctaRef} className="mt-10">
              <button className="group inline-flex items-center rounded-full bg-white p-1 shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <span className="px-5 text-xs font-semibold uppercase tracking-wide text-text-primary sm:px-6 sm:text-sm">
                  Start Tailoring Free
                </span>

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand transition-transform duration-300 group-hover:translate-x-1 sm:h-14 sm:w-14">
                  <Icon
                    icon="mi:arrow-up"
                    className="rotate-45 text-lg text-white"
                  />
                </div>
              </button>
            </div>

            <div
              ref={trustRef}
              className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-xs text-white/60 sm:text-sm"
            >
              <span>ATS Optimized</span>
              <span>AI Tailoring</span>
              <span>Instant Resume Scoring</span>
              <span>No Credit Card Required</span>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/50">
            Scroll
          </span>

          <div className="flex h-11 w-6 justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm">
            <div className="hero-scroll-dot mt-2 h-2 w-2 rounded-full bg-white/70" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
