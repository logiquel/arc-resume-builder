import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import SubHeroSectionSvg from "#/components/common/SubHeroSectionSvg";

gsap.registerPlugin(ScrollTrigger, SplitText);

const stats = [
  {
    value: "10x",
    label: "Faster resume creation",
  },
  {
    value: "95%",
    label: "ATS compatibility score",
  },
  {
    value: "3x",
    label: "More interview callbacks",
  },
  {
    value: "24/7",
    label: "AI-powered optimization",
  },
];

const SubHeroSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;

    if (!section || !heading) return;

    const ctx = gsap.context(() => {
      const split = new SplitText(heading, {
        type: "lines, words",
        linesClass: "split-line",
        wordsClass: "split-word",
      });

      gsap.set(split.words, {
        yPercent: 110,
        opacity: 0,
        willChange: "transform, opacity",
      });

      gsap.to(split.words, {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power4.out",
        stagger: 0.05,
        scrollTrigger: {
          trigger: heading,
          start: "top 82%",
          once: true,
        },
      });

      statRefs.current.forEach((statEl, index) => {
        if (!statEl) return;

        const raw = stats[index]?.value ?? "";
        const match = raw.match(/^(\d+)(.*)$/);
        const numberNode = statEl.querySelector<HTMLElement>("[data-number]");
        const suffixNode = statEl.querySelector<HTMLElement>("[data-suffix]");

        if (!numberNode || !match) {
          if (numberNode) numberNode.textContent = raw;
          return;
        }

        const target = Number(match[1]);
        const suffix = match[2] ?? "";

        numberNode.textContent = "0";
        if (suffixNode) suffixNode.textContent = suffix;

        gsap.fromTo(
          statEl,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            delay: index * 0.05,
            scrollTrigger: {
              trigger: statEl,
              start: "top 88%",
              once: true,
            },
          },
        );

        const counter = { value: 0 };

        gsap.to(counter, {
          value: target,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statEl,
            start: "top 88%",
            once: true,
          },
          onUpdate: () => {
            numberNode.textContent = Math.round(counter.value).toString();
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          {/* LEFT */}
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-brand">
              WHY IT WORKS
            </span>

            <h2
              ref={headingRef}
              className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-text-primary"
            >
              Every resume.
              <br />
              Tailored for the
              <span className="font-display italic font-normal">
                {" "}
                job you're targeting.
              </span>
            </h2>

            <p className="mt-6 max-w-md text-sm sm:text-base leading-relaxed text-text-secondary">
              Match recruiter expectations, improve ATS performance, and
              generate application-ready resumes in minutes.
            </p>

            {/* STATS */}
            <div className="mt-12 grid grid-cols-2 gap-x-10 gap-y-10">
              {stats.map((item, index) => (
                <div
                  key={item.value}
                  ref={(el) => {
                    statRefs.current[index] = el;
                  }}
                  className="border-l border-brand/20 pl-4"
                >
                  <div className="text-4xl sm:text-5xl font-mono font-semibold text-brand">
                    <span data-number>0</span>
                    <span data-suffix />
                  </div>

                  <div className="mt-2 text-xs sm:text-sm uppercase tracking-wide text-text-muted">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative flex justify-center">
            {/* subtle glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-[500px] w-[500px] rounded-full bg-brand/5 blur-3xl" />
            </div>

            <div className="relative w-full max-w-4xl">
              <SubHeroSectionSvg />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubHeroSection;
