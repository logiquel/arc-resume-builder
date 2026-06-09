import { Icon } from "@iconify/react";
import { useRef } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

const SubFooterSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (!headingRef.current) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const headingSplit = SplitText.create(headingRef.current, {
        type: "lines,words",
        linesClass: "subfooter-line",
        mask: "lines",
      });

      const descriptionSplit = SplitText.create(descriptionRef.current, {
        type: "lines",
        linesClass: "subfooter-desc-line",
        mask: "lines",
      });

      gsap.set(".subfooter-line", {
        paddingBottom: "0.12em",
        marginBottom: "-0.12em",
      });

      gsap.set(eyebrowRef.current, {
        y: 14,
        opacity: 0,
        filter: "blur(6px)",
      });

      gsap.set(headingSplit.words, {
        yPercent: 115,
        rotateX: -8,
        transformOrigin: "0% 100%",
        opacity: 0,
        filter: "blur(8px)",
      });

      gsap.set(descriptionSplit.lines, {
        y: 18,
        opacity: 0,
        filter: "blur(8px)",
      });

      gsap.set([ctaRef.current, metaRef.current], {
        y: 18,
        opacity: 0,
        filter: "blur(8px)",
      });

      if (reduceMotion) {
        gsap.set(eyebrowRef.current, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
        });
        gsap.set(headingSplit.words, {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
          filter: "blur(0px)",
        });
        gsap.set(descriptionSplit.lines, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
        });
        gsap.set([ctaRef.current, metaRef.current], {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
        });

        return () => {
          headingSplit.revert();
          descriptionSplit.revert();
        };
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          once: true,
        },
        defaults: {
          ease: "power4.out",
        },
      });

      tl.to(eyebrowRef.current, {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.62,
        ease: "power3.out",
      })
        .to(
          headingSplit.words,
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            stagger: 0.045,
            ease: "power4.out",
          },
          "-=0.18",
        )
        .to(
          descriptionSplit.lines,
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.75,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.48",
        )
        .to(
          ctaRef.current,
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.75,
            ease: "power3.out",
          },
          "-=0.3",
        )
        .to(
          metaRef.current,
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.72,
            ease: "power3.out",
          },
          "-=0.42",
        );

      return () => {
        tl.kill();
        headingSplit.revert();
        descriptionSplit.revert();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 lg:py-32"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/[0.07] blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(10,101,204,0.04),transparent_62%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <span
            ref={eyebrowRef}
            className="text-xs font-medium uppercase tracking-[0.24em] text-brand"
          >
            GET STARTED
          </span>

          <h2
            ref={headingRef}
            className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.04em] text-text-primary sm:text-5xl lg:text-[4.3rem] [perspective:1000px]"
          >
            Tailor each{" "}
            <span className="font-display font-normal italic">application</span>
            <br />
            with more{" "}
            <span className="font-display font-normal italic">precision.</span>
          </h2>

          <p
            ref={descriptionRef}
            className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base"
          >
            Create a stronger resume for the role you want with AI-guided
            tailoring, clearer positioning, and templates built for real hiring
            workflows.
          </p>

          <div ref={ctaRef} className="mt-10">
            <button
              className="inline-flex items-center rounded-full bg-white p-1 cursor-pointer"
              style={{
                boxShadow:
                  "0 18px 50px rgba(10,101,204,0.12), 0 0 28px rgba(10,101,204,0.10), 0 1px 0 rgba(255,255,255,0.9) inset",
              }}
            >
              <span className="px-5 text-xs font-semibold uppercase tracking-[0.14em] text-text-primary sm:px-6 sm:text-sm">
                Start tailoring free
              </span>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand sm:h-14 sm:w-14">
                <Icon
                  icon="mi:arrow-up"
                  className="rotate-45 text-lg text-white"
                />
              </div>
            </button>
          </div>

          <p
            ref={metaRef}
            className="mt-6 text-xs tracking-[0.08em] text-text-muted sm:text-sm"
          >
            ATS-ready templates · AI-guided tailoring · No card required
          </p>
        </div>
      </div>
    </section>
  );
};

export default SubFooterSection;
