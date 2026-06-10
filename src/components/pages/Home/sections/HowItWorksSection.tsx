import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const steps = [
  {
    number: "01",
    title: "Upload your resume",
    description:
      "PDF or DOCX. Do it once — we parse every section and build your career profile.",
  },
  {
    number: "02",
    title: "AI tailors it",
    description:
      "Our engine rewrites your bullet points to match the JD keywords — using only your real experience. Nothing fabricated.",
  },
  {
    number: "03",
    title: "Download & apply",
    description:
      "Accept the changes you want, reject the rest. Export a polished PDF ready to submit.",
  },
];

const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const eyebrowRef = useRef<HTMLSpanElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const eyebrow = eyebrowRef.current;
    const heading = headingRef.current;
    const paragraph = paragraphRef.current;

    if (!section || !eyebrow || !heading || !paragraph) return;

    const ctx = gsap.context(() => {
      const headingSplit = new SplitText(heading, {
        type: "lines, words",
        linesClass: "split-line",
        wordsClass: "split-word",
      });

      const paragraphSplit = new SplitText(paragraph, {
        type: "lines, words",
        linesClass: "split-line",
        wordsClass: "split-word",
      });

      gsap.set(eyebrow, {
        opacity: 0,
        y: 14,
      });

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

      gsap.set(cardRefs.current, {
        opacity: 0,
        y: 22,
      });

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
        duration: 0.55,
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
          "-=0.2",
        )
        .to(
          paragraphSplit.lines,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.08,
          },
          "-=0.45",
        )
        .to(
          cardRefs.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.08,
          },
          "-=0.3",
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="how-it-works" className="w-full py-20 lg:py-32">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-6 lg:px-12">
        <span
          ref={eyebrowRef}
          className="text-xs font-medium uppercase tracking-[0.25em] text-brand"
        >
          HOW IT WORKS
        </span>

        <h2
          ref={headingRef}
          className="mt-5 font-display text-3xl italic leading-tight text-text-primary"
        >
          3 Easy Steps.
        </h2>

        <p
          ref={paragraphRef}
          className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary"
        >
          Create professional, ATS-friendly resumes in under 2 minutes with
          AI-powered writing, smart formatting, and tailored content designed to
          help you stand out to recruiters and land more interviews.
        </p>

        <div className="mt-10 grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
          {steps.map((step, index) => {
            const isFeatured = index === 1;

            return (
              <div
                key={step.number}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className={`group relative flex min-h-[220px] flex-col overflow-hidden rounded-t-[3rem] px-6 py-6 lg:px-7 lg:py-7 ${
                  index === 2 ? "md:col-span-2 xl:col-span-1" : ""
                }`}
              >
                <div
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    isFeatured
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  } bg-linear-to-b from-[#e7f2ff] via-[#f4f9ff] to-white`}
                />

                <div className="relative z-10 flex h-full flex-col">
                  <span
                    className={`text-3xl font-mono font-medium ${
                      isFeatured ? "text-brand" : "text-brand"
                    }`}
                  >
                    {step.number}
                  </span>

                  <span className="mt-3 text-lg text-text-primary">
                    {step.title}
                  </span>

                  <span className="mt-2 text-xs leading-relaxed text-text-muted">
                    {step.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
