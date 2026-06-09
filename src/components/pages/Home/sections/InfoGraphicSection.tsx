import { Icon } from "@iconify/react";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const InfoGraphicSection = () => {
  const [currentScore, setCurrentScore] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const eyebrowRef = useRef<HTMLSpanElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);
  const windowRef = useRef<HTMLDivElement | null>(null);
  const scoreCardRef = useRef<HTMLDivElement | null>(null);
  const changesCardRef = useRef<HTMLDivElement | null>(null);
  const keywordsContainerRef = useRef<HTMLDivElement | null>(null);

  // Micro-animation internal element trackers
  const diffRemovesRef = useRef<HTMLParagraphElement[]>([]);
  const diffAddsRef = useRef<HTMLParagraphElement[]>([]);
  const changeItemsRef = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const eyebrow = eyebrowRef.current;
    const heading = headingRef.current;
    const paragraph = paragraphRef.current;
    const windowEl = windowRef.current;
    const scoreCard = scoreCardRef.current;
    const changesCard = changesCardRef.current;
    const keywordsContainer = keywordsContainerRef.current;

    if (
      !section ||
      !eyebrow ||
      !heading ||
      !paragraph ||
      !windowEl ||
      !scoreCard ||
      !changesCard ||
      !keywordsContainer
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

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

      // Filter out any potential unmapped ref items safely
      const activeRemoves = diffRemovesRef.current.filter(Boolean);
      const activeAdds = diffAddsRef.current.filter(Boolean);
      const activeChangeItems = changeItemsRef.current.filter(Boolean);
      const keywordChips = Array.from(keywordsContainer.children);

      // Split green text additions into separate characters for typing sequences
      const splitAdds = activeAdds.map(
        (el) => new SplitText(el, { type: "words, chars" }),
      );

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

      gsap.set(windowEl, {
        opacity: 0,
        y: 28,
        scale: 0.985,
        willChange: "transform, opacity",
      });

      gsap.set(scoreCard, {
        opacity: 0,
        filter: "blur(8px)",
        willChange: "opacity, filter",
      });

      gsap.set(changesCard, {
        opacity: 0,
        filter: "blur(8px)",
        willChange: "opacity, filter",
      });

      if (reduceMotion) {
        gsap.set(eyebrow, { opacity: 1, y: 0 });
        gsap.set(headingSplit.words, { opacity: 1, yPercent: 0 });
        gsap.set(paragraphSplit.lines, { opacity: 1, y: 0 });
        gsap.set(windowEl, { opacity: 1, y: 0, scale: 1 });
        gsap.set(scoreCard, { opacity: 1, filter: "blur(0px)" });
        gsap.set(changesCard, { opacity: 1, filter: "blur(0px)" });
        splitAdds.forEach((split) => gsap.set(split.chars, { opacity: 1 }));
        setCurrentScore(92);

        return () => {
          headingSplit.revert();
          paragraphSplit.revert();
        };
      }

      // --- MAIN ENTRANCE (Reveals the containers) ---
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
          windowEl,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.28",
        )
        .to(
          scoreCard,
          {
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.18",
        )
        .to(
          changesCard,
          {
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.42",
        )
        .add(() => {
          loopTimeline.play();
        });

      // --- CLOCKWORK TIMING ENGINE LOOP ---
      const loopTimeline = gsap.timeline({
        paused: true,
        repeat: -1,
      });

      const allActiveIcons = activeChangeItems
        .map((i) => i.querySelector("svg"))
        .filter(Boolean);
      const allActiveParas = activeChangeItems
        .flatMap((i) => Array.from(i.querySelectorAll("p")))
        .filter(Boolean);

      // Score proxy object for clean mathematical gauge tweening — lives inside ctx
      const scoreProxy = { value: 0 };

      // ─── FRAME 0: Instantaneous full reset ───────────────────────────────────
      loopTimeline
        .set(activeRemoves, { opacity: 1 })
        .set(
          splitAdds.flatMap((s) => s.chars),
          { opacity: 0 },
        )
        .set(keywordChips, { opacity: 0, scale: 0.85, y: 6 })
        .set(allActiveIcons, { scale: 0, opacity: 0 })
        .set(allActiveParas, { opacity: 0, x: -6 })
        .add(() => {
          scoreProxy.value = 0;
          setCurrentScore(0);
        })

        // ─── PHASE 1 LEAD-IN: brief hold before sequence fires ────────────────
        .to(
          activeRemoves,
          {
            opacity: 0.25,
            duration: 0.35,
            stagger: 0.1,
            ease: "power2.out",
          },
          "+=0.2",
        )

        // ─── PHASE 1A: Typing animation — characters reveal one by one ─────────
        .to(
          splitAdds.flatMap((s) => s.chars),
          {
            opacity: 1,
            duration: 0.012,
            stagger: { each: 0.008, amount: 0.6 },
            ease: "none",
          },
          "-=0.05",
        )

        // ─── PHASE 1B: Keyword chips lift in — exactly concurrent with typing ──
        .to(
          keywordChips,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.06,
            ease: "back.out(1.4)",
          },
          "<",
        )

        // ─── PHASE 2: Gauge proxy tweens 0 → 92 over 2 s ─────────────────────
        .to(
          scoreProxy,
          {
            value: 92,
            duration: 2.0,
            ease: "power3.out",
            onUpdate() {
              setCurrentScore(Math.floor(scoreProxy.value));
            },
          },
          "+=0.1",
        )
        .addLabel("gaugeStart", "-=2.0");

      // ─── PHASE 2 (concurrent): checklist reveals pinned to gaugeStart ─────────
      activeChangeItems.forEach((item, index) => {
        const icon = item.querySelector("svg");
        const textualParagraphs = Array.from(item.querySelectorAll("p"));
        const offset = index * 0.45;

        if (icon) {
          loopTimeline.to(
            icon,
            {
              scale: 1,
              opacity: 1,
              duration: 0.35,
              ease: "back.out(1.6)",
            },
            `gaugeStart+=${offset}`,
          );
        }

        if (textualParagraphs.length > 0) {
          loopTimeline.to(
            textualParagraphs,
            {
              opacity: 1,
              x: 0,
              duration: 0.3,
              ease: "power2.out",
            },
            `gaugeStart+=${offset + 0.15}`,
          );
        }
      });

      // ─── PHASE 3: Snappy wait, then reset smoothly to create an endless loop ───
      loopTimeline.to(
        [
          ...splitAdds.flatMap((s) => s.chars),
          ...Array.from(keywordChips),
          ...allActiveIcons,
          ...allActiveParas,
          ...activeRemoves,
        ].filter(Boolean),
        {
          opacity: 0,
          duration: 0.45,
          ease: "power2.inOut",
        },
        "+=1.5", // Sweeps out exactly 1.5 seconds after the last checkmark registers
      );

      return () => {
        headingSplit.revert();
        paragraphSplit.revert();
        splitAdds.forEach((s) => s.revert());
      };
    }, section);

    return () => ctx.revert();
  }, []);

  let statusText = "Needs Improvement";
  let statusColor = "text-red-500";

  if (currentScore > 25) {
    statusText = "Fair";
    statusColor = "text-amber-500";
  }
  if (currentScore > 50) {
    statusText = "Average";
    statusColor = "text-orange-400";
  }
  if (currentScore > 75) {
    statusText = "Good";
    statusColor = "text-emerald-500";
  }

  const cx = 50,
    cy = 50,
    r = 38;

  const arcPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  const arcLen = Math.PI * r;
  const gap = 3;
  const vis = (arcLen - 3 * gap) / 4;
  const unit = vis + gap;

  const segments = [
    { color: "#E55353", offset: 0 },
    { color: "#F2C16D", offset: -unit },
    { color: "#E28739", offset: -(unit * 2) },
    { color: "#63C27C", offset: -(unit * 3) },
  ];

  const innerR = 28;
  const innerArcPath = `M ${cx - innerR} ${cy} A ${innerR} ${innerR} 0 0 1 ${cx + innerR} ${cy}`;

  const angle = Math.PI - (currentScore / 100) * Math.PI;
  const needleX = cx + innerR * Math.cos(angle);
  const needleY = cy - innerR * Math.sin(angle);

  return (
    <section ref={sectionRef} className="w-full h-auto flex flex-col">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <span
            ref={eyebrowRef}
            className="text-xs font-medium uppercase tracking-[0.24em] text-brand"
          >
            AI ENHANCEMENT
          </span>

          <h2
            ref={headingRef}
            className="mt-4 text-3xl font-bold leading-tight text-text-primary sm:text-4xl lg:text-[3rem]"
          >
            One AI tool. Better career
            <br />
            <span className="font-display font-normal italic">
              opportunities.
            </span>
          </h2>

          <p
            ref={paragraphRef}
            className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-[0.95rem]"
          >
            Upload once. Let AI tailor your resume for every job automatically —
            then apply in seconds.
          </p>
        </div>
      </div>

      <div
        ref={windowRef}
        className="relative w-full max-w-[92%] sm:max-w-[88%] lg:max-w-[78%] xl:w-[60%] flex flex-col mx-auto mt-10 rounded-3xl border border-black/10 bg-white shadow-[0_0_80px_rgba(10,101,204,0.12),0_25px_80px_rgba(10,101,204,0.08)]"
      >
        <header className="w-full flex items-center px-4 py-2.5 rounded-t-[inherit] border-b">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF605C]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD44]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#00CA4E]"></span>
          </div>
          <div className="flex-1 flex items-center pl-4 sm:pl-6 md:pl-10 min-w-0">
            <p className="text-tiny text-text-muted truncate">
              www.arc-resume/tailor
            </p>
          </div>
        </header>

        <div className="w-[80%] flex-1 p-4 sm:p-5 flex flex-col mx-auto">
          <h2 className="text-sm text-text-primary font-medium tracking-[0.5px]">
            Enhance Resume Report
          </h2>
          <p className="text-tiny text-text-muted">
            Review your changes. Accept or edit AI suggestions to finalize your
            resume.
          </p>

          <div className="w-full flex-1 flex flex-col lg:flex-row gap-6 mt-4">
            <div className="flex-1 flex flex-col gap-5 overflow-hidden min-w-0">
              <section className="w-full flex flex-col">
                <h2 className="text-text-primary text-xxs uppercase font-semibold">
                  PROJECTS
                </h2>
                <h2 className="text-text-muted text-xxs font-medium mt-2">
                  AI Chat Bot
                </h2>
                <div className="flex flex-col gap-2">
                  <p
                    ref={(el) => {
                      if (el) diffRemovesRef.current[0] = el;
                    }}
                    className="text-tiny text-red-800 line-through font-mono font-medium mt-2 wrap-break-word"
                  >
                    - Improved website performance
                  </p>
                  <p
                    ref={(el) => {
                      if (el) diffAddsRef.current[0] = el;
                    }}
                    className="text-tiny text-green-800 font-mono font-medium w-full sm:w-[75%] wrap-break-word"
                  >
                    + Improved website performance by 42% through frontend
                    optimization
                  </p>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <p
                    ref={(el) => {
                      if (el) diffRemovesRef.current[1] = el;
                    }}
                    className="text-tiny text-red-800 line-through font-mono font-medium mt-2 wrap-break-word"
                  >
                    - Fixed UI bugs in dashboard
                  </p>
                  <p
                    ref={(el) => {
                      if (el) diffAddsRef.current[1] = el;
                    }}
                    className="text-tiny text-green-800 font-mono font-medium w-full sm:w-[75%] wrap-break-word"
                  >
                    + Resolved 30+ UI issues improving usability and consistency
                    across devices.
                  </p>
                </div>
              </section>

              <section className="w-full flex flex-col">
                <h2 className="text-text-primary text-xxs uppercase font-semibold">
                  WORK EXPERIENCE
                </h2>
                <h2 className="text-text-muted text-xxs font-medium mt-2">
                  Acme Co-operation, HYD
                </h2>
                <div className="flex flex-col gap-2">
                  <p
                    ref={(el) => {
                      if (el) diffAddsRef.current[2] = el;
                    }}
                    className="text-tiny text-green-800 font-mono font-medium mt-2 wrap-break-word"
                  >
                    -{" "}
                    <span className="text-red-800 line-through">
                      Worked with
                    </span>{" "}
                    Collaborated cross-functionally with a team of 12+ sales
                    professionals to help with streamline client workflows and
                    improve operational efficiency
                  </p>
                </div>
              </section>
            </div>

            <aside className="w-full lg:w-[30%] h-full flex flex-col gap-5">
              <h2 className="text-xs text-text-primary uppercase font-mono font-medium">
                KEYWORDS ANALYZED
              </h2>
              <div
                ref={keywordsContainerRef}
                className="w-full h-fit flex flex-wrap gap-2 sm:gap-3"
              >
                {[
                  "React",
                  "CI/CD",
                  "Redis",
                  "Frontend",
                  "Rest API",
                  "Microservices",
                  "System Design",
                  "Problem Solving",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex h-fit w-fit rounded-sm items-center text-tiny bg-[#FEF0C7] border border-[#FEDF89] text-[#F79009] font-mono px-2 py-1"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>

        <div
          ref={scoreCardRef}
          className="relative xl:absolute xl:-left-35 2xl:-left-45 xl:top-[54%] xl:-translate-y-1/2 mt-4 xl:mt-0 mx-4 sm:mx-6 xl:mx-0 bg-white border border-black/10 rounded-2xl"
          style={{
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          }}
        >
          <h2 className="flex items-center text-tiny text-text-primary font-medium uppercase px-4 py-3">
            ATS SCORE
          </h2>
          <div className="relative z-10 flex flex-col items-center justify-center px-5 pb-5">
            <svg viewBox="0 0 100 54" className="w-32 sm:w-40 overflow-visible">
              {segments.map((seg, i) => (
                <path
                  key={i}
                  d={arcPath}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={3}
                  strokeLinecap="butt"
                  strokeDasharray={`${vis} ${arcLen}`}
                  strokeDashoffset={seg.offset}
                />
              ))}

              <path
                d={innerArcPath}
                fill="none"
                stroke="#9CA3AF"
                strokeWidth={0.9}
                strokeLinecap="round"
                strokeDasharray="0.01 4"
                opacity={0.75}
              />

              <line
                x1={cx}
                y1={cy}
                x2={needleX}
                y2={needleY}
                stroke="#0a8cff"
                strokeWidth={1}
                strokeLinecap="round"
              />

              <circle cx={cx} cy={cy} r={1.8} fill="#0a8cff" />
              <rect
                x={needleX - 4}
                y={needleY - 2}
                width={8}
                height={4}
                rx={2}
                ry={2}
                fill="#ffffff"
                stroke="#0a8cff"
                strokeWidth={1}
                transform={`rotate(${(-angle * 180) / Math.PI} ${needleX} ${needleY})`}
              />
            </svg>
            <div className="w-full mt-3 flex flex-col items-center justify-center text-center">
              <div className="text-lg font-mono tracking-tight text-text-primary leading-none">
                {currentScore}
                <span className="ml-0.5 text-base font-sans font-medium text-slate-400">
                  %
                </span>
              </div>

              <div className="mt-1 flex flex-wrap items-center justify-center gap-x-1.5 text-tiny">
                <div className="gap-x-1 text-text-secondary">
                  <span>Up from Base score</span>
                </div>
                <span className="font-semibold text-text-secondary">{62}%</span>
                <div className="flex items-center gap-x-0.5">
                  <span className="text-emerald-600 text-tiny">+</span>
                  <span className="font-medium text-emerald-600">
                    {currentScore - 62}
                  </span>
                  <Icon icon="ph:trend-up" className="text-emerald-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={changesCardRef}
          className="relative xl:absolute flex flex-col gap-y-2 mt-4 xl:mt-0 mx-4 sm:mx-6 xl:mx-0 bg-white border border-black/10 rounded-2xl p-5 xl:-bottom-15 xl:-right-20 2xl:-right-32"
          style={{
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          }}
        >
          <div
            ref={(el) => {
              if (el) changeItemsRef.current[0] = el;
            }}
            className="w-full flex flex-col"
          >
            <p className="flex gap-x-1 text-text-primary text-tiny uppercase font-mono">
              <Icon
                icon="icon-park-solid:check-one"
                className="text-xxs text-green-500 mt-0.5"
              />
              KEYWORDS MATCHED
            </p>
            <p className="max-w-50 text-text-muted text-tiny pl-4">
              Optimize resumes with recruiter-focused keywords.
            </p>
          </div>
          <div
            ref={(el) => {
              if (el) changeItemsRef.current[1] = el;
            }}
            className="w-full flex flex-col"
          >
            <p className="flex gap-x-1 text-text-primary text-tiny uppercase font-mono">
              <Icon
                icon="icon-park-solid:check-one"
                className="text-xxs text-green-500 mt-0.5"
              />
              BULLET POINT ADDED
            </p>
            <p className="max-w-50 text-text-muted text-tiny pl-4">
              Improve wording, clarity, and professional tone.
            </p>
          </div>
          <div
            ref={(el) => {
              if (el) changeItemsRef.current[2] = el;
            }}
            className="w-full flex flex-col"
          >
            <p className="flex gap-x-1 text-text-primary text-tiny uppercase font-mono">
              <Icon
                icon="icon-park-solid:check-one"
                className="text-xxs text-green-500 mt-0.5"
              />
              SPELL CHECK DONE
            </p>
            <p className="max-w-50 text-text-muted text-tiny pl-4">
              Customize resumes for every application instantly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoGraphicSection;
