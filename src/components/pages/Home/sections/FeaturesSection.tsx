import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import DiffReviewSvg from "./InfoSvgs/Features/DiffReviewSvg";
import JDFirstAnalysisSvg from "./InfoSvgs/Features/JDFirstAnalysisSvg";
import TemplatesSvg from "./InfoSvgs/Features/TemplatesSvg";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface FeatureRowProps {
  index: number;
  heading: string;
  body: string;
  visual: React.ReactNode;
  /** When true the text column is on the left, SVG on right. Default: SVG left */
  textFirst?: boolean;
}

const FeatureRow = ({
  heading,
  body,
  visual,
  textFirst = false,
}: FeatureRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const svgWrapperRef = useRef<HTMLDivElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const row = rowRef.current;
    const headingEl = headingRef.current;
    const bodyEl = bodyRef.current;
    const svgWrapper = svgWrapperRef.current;
    const svgContainer = svgContainerRef.current;

    if (!row || !headingEl || !bodyEl || !svgWrapper || !svgContainer) return;

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const headingSplit = new SplitText(headingEl, {
        type: "lines, words",
        linesClass: "split-line overflow-hidden",
        wordsClass: "split-word inline-block",
      });

      const bodySplit = new SplitText(bodyEl, {
        type: "lines",
        linesClass: "split-line overflow-hidden",
      });

      if (reduceMotion) {
        return () => {
          headingSplit.revert();
          bodySplit.revert();
        };
      }

      // Initial hidden states
      gsap.set(headingSplit.words, {
        yPercent: 105,
        opacity: 0,
        willChange: "transform, opacity",
      });
      gsap.set(bodySplit.lines, {
        y: 16,
        opacity: 0,
        willChange: "transform, opacity",
      });
      gsap.set(svgContainer, { y: 30, willChange: "transform" });

      // Text reveal on scroll enter
      const textTl = gsap.timeline({
        scrollTrigger: {
          trigger: row,
          start: "top 80%",
          once: true,
        },
      });

      textTl
        .to(headingSplit.words, {
          yPercent: 0,
          opacity: 1,
          duration: 0.75,
          ease: "power4.out",
          stagger: 0.045,
        })
        .to(
          bodySplit.lines,
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: "power3.out",
            stagger: 0.07,
          },
          "-=0.45",
        );

      // SVG parallax scrub — translates y from 30px → -20px as row scrolls through view
      gsap.to(svgContainer, {
        y: -20,
        ease: "none",
        scrollTrigger: {
          trigger: svgWrapper,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      return () => {
        headingSplit.revert();
        bodySplit.revert();
      };
    }, row);

    return () => ctx.revert();
  }, []);

  const textCol = (
    <div className="flex flex-col justify-center gap-3 py-4 md:py-0">
      <h3
        ref={headingRef}
        className="font-display text-xl italic leading-snug tracking-[0.02em] text-text-primary sm:text-2xl lg:text-[1.65rem]"
      >
        {heading}
      </h3>
      <p
        ref={bodyRef}
        className="text-sm leading-relaxed text-text-muted lg:text-[0.9rem]"
        style={{ maxWidth: "46ch" }}
      >
        {body}
      </p>
    </div>
  );

  const visualCol = (
    <div
      ref={svgWrapperRef}
      className="w-full overflow-clip rounded-2xl bg-gray-50 md:rounded-3xl"
      style={{ aspectRatio: "4/2.2" }}
    >
      <div
        ref={svgContainerRef}
        className="flex h-full w-full items-end justify-center"
      >
        {visual}
      </div>
    </div>
  );

  return (
    <div
      ref={rowRef}
      className="grid w-full grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-10 lg:gap-14"
    >
      <div className={textFirst ? "order-2 md:order-1" : "order-2"}>
        {textCol}
      </div>

      <div className={textFirst ? "order-1 md:order-2" : "order-1"}>
        {visualCol}
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const sectionHeadingRef = useRef<HTMLHeadingElement>(null);
  const sectionBodyRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const eyebrow = eyebrowRef.current;
    const heading = sectionHeadingRef.current;
    const body = sectionBodyRef.current;

    if (!section || !eyebrow || !heading || !body) return;

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const headingSplit = new SplitText(heading, {
        type: "lines, words",
        linesClass: "split-line overflow-hidden",
        wordsClass: "split-word inline-block",
      });

      const bodySplit = new SplitText(body, {
        type: "lines",
        linesClass: "split-line overflow-hidden",
      });

      if (reduceMotion) {
        return () => {
          headingSplit.revert();
          bodySplit.revert();
        };
      }

      gsap.set(eyebrow, { opacity: 0, y: 12 });
      gsap.set(headingSplit.words, { yPercent: 110, opacity: 0 });
      gsap.set(bodySplit.lines, { y: 14, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          once: true,
        },
      });

      tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" })
        .to(
          headingSplit.words,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.75,
            ease: "power4.out",
            stagger: 0.06,
          },
          "-=0.18",
        )
        .to(
          bodySplit.lines,
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: "power3.out",
            stagger: 0.07,
          },
          "-=0.42",
        );

      return () => {
        headingSplit.revert();
        bodySplit.revert();
      };
    }, section);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      heading: "JD First Analysis.",
      body: "Other tools ask you to build a resume in the dark. We start with the job you want — every suggestion is made specifically for that role, not generically.",
      visual: <JDFirstAnalysisSvg />,
      textFirst: false,
    },
    {
      heading: "Detailed Diff Review.",
      body: "See every single change the AI made, word by word. Accept what fits, reject what doesn't. No black box — complete transparency.",
      visual: <DiffReviewSvg />,
      textFirst: true,
    },
    {
      heading: "Templates That Work, Not Just Look Good.",
      body: "Every template is designed to pass ATS filters and land clean in a recruiter's inbox. No fancy columns that confuse hiring software. No graphics that disappear in a PDF. Just your experience, clearly presented.",
      visual: <TemplatesSvg />,
      textFirst: false,
    },
  ];

  return (
    <section ref={sectionRef} className="w-full py-20 lg:py-32">
      {/* Section header */}
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="max-w-2xl">
          <span
            ref={eyebrowRef}
            className="text-xs font-medium uppercase tracking-[0.25em] text-brand"
          >
            WHAT MAKES IT BETTER
          </span>

          <h2
            ref={sectionHeadingRef}
            className="mt-5 font-display text-3xl italic leading-tight text-text-primary sm:text-4xl lg:text-[3.2rem]"
          >
            Features.
          </h2>

          <p
            ref={sectionBodyRef}
            className="mt-4 text-sm leading-relaxed text-text-secondary sm:text-[0.95rem]"
          >
            Most resume tools give you more features than you need and less help
            than you want. Fifty templates. A chatbot. An "AI score" that means
            nothing. We stripped all of that away and kept only what moves the
            needle.
          </p>
        </div>
      </div>

      {/* Feature rows */}
      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-y-16 px-6 sm:gap-y-20 lg:mt-16 lg:gap-y-24 lg:px-12">
        {features.map((f, i) => (
          <FeatureRow key={f.heading} index={i} {...f} />
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
