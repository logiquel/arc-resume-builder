import { createFileRoute } from "@tanstack/react-router";
import resumeMock1 from "../../../../public/sample_resume_image.jpg";
import resumeMock2 from "../../../../public/sample_resume_image_2.jpg";
import resumeMock3 from "../../../../public/sample_resume_image_3.jpg";
import resumeMock4 from "../../../../public/sample_resume_image_4.jpg";
import { sampleResume } from "../../../../sample_resume_data";
import { Icon } from "@iconify/react";
import { useRef, useState, useEffect } from "react";
import ResumeStackMock from "#/components/common/Icons/ResumeStackMock";
import FileFolderIcon from "#/components/common/Icons/FileFolderIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/components/addons/tooltip";

const mockImages = [resumeMock1, resumeMock2, resumeMock3, resumeMock4];
export const Route = createFileRoute("/_app/dashboard/")({
  component: RouteComponent,
});

interface SectionHeadingProps {
  label: string;
  secondaryLabel?: string;
}
const SectionHeading: React.FC<SectionHeadingProps> = ({
  label,
  secondaryLabel,
}) => {
  return (
    <div className="w-full flex items-center gap-x-2 bg-[#F9FBFC] mb-4 px-1">
      <h1 className="text-xs uppercase text-brand font-medium">{label}</h1>
      <span className="flex-1 h-[0.025rem] bg-gray-300"></span>
    </div>
  );
};

// ── Route ────────────────────────────────────────────────────────────────────
const dummyResumes = [
  { id: 1, name: "SDE_Core_Master.pdf", size: "126.17 KB", image: resumeMock1 },
  {
    id: 2,
    name: "FullStack_General_v2.pdf",
    size: "142.30 KB",
    image: resumeMock2,
  },
  {
    id: 3,
    name: "Frontend_React_2026.pdf",
    size: "118.45 KB",
    image: resumeMock3,
  },
  {
    id: 4,
    name: "Mobile_KMP_2026.pdf",
    size: "126.12 KB",
    image: resumeMock4,
  },
];

function RouteComponent() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollAccumulator = useRef(0);
  const stackRef = useRef<HTMLDivElement>(null);

  // Sync state index to a mutable reference to safely bypass event listener closure locks
  const activeIndexRef = useRef(activeIndex);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const stackEl = stackRef.current;
    if (!stackEl) return;

    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault();

      scrollAccumulator.current += e.deltaY;

      if (Math.abs(scrollAccumulator.current) >= 80) {
        const currentIdx = activeIndexRef.current;
        if (scrollAccumulator.current > 0) {
          setActiveIndex((currentIdx + 1) % dummyResumes.length);
        } else {
          setActiveIndex(
            (currentIdx - 1 + dummyResumes.length) % dummyResumes.length,
          );
        }
        scrollAccumulator.current = 0;
      }
    };

    stackEl.addEventListener("wheel", handleNativeWheel, { passive: false });
    return () => {
      stackEl.removeEventListener("wheel", handleNativeWheel);
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full flex flex-col px-5 py-3 sticky top-0 z-10 bg-[#F9FBFC]">
        <h1 className="text-base font-medium text-text-primary">
          Good Morning, Steve
        </h1>
        <h2 className="text-xs text-text-muted">
          A new day, a new opportunity! Let's create something amazing together.
        </h2>
      </div>
      <div className="w-full flex-1 min-h-0 flex">
        <main className="flex-1 h-full overflow-y-scroll hide-scrollbar pb-10">
          <section className="w-full flex flex-col gap-x-2 p-4">
            {/* <SectionHeading label="TAILOR RESUME" /> */}
            <div className="flex-1">
              <div className="w-[34vw] aspect-21/9 flex rounded-[2rem] border border-black/10 bg-white shadow-[0_8px_32px_0_rgba(14,165,233,0.04),inset_0_1px_1px_0_rgba(255,255,255,0.3)] group">
                {/* Left Content Area */}
                <div className="flex-1 h-full flex flex-col justify-between p-6">
                  <div className="flex flex-col gap-y-1.5">
                    <h2 className="text-base font-semibold text-text-primary tracking-tight leading-snug">
                      Create an AI-Tailored <br /> Resume.
                    </h2>
                    <h3 className="text-xxs font-medium text-text-muted leading-relaxed">
                      Build from scratch or optimize your profile to perfectly
                      match a target job description.
                    </h3>
                  </div>

                  {/* Elegant subtle CTA button replacing the arrow icon */}
                  <button
                    type="button"
                    className="hover:border-brand/30 self-start mt-2 px-3.5 py-1.5 text-tiny font-medium text-white bg-brand rounded-xl shadow-xs transition-all duration-300 group-hover:bg-brand/90 group-hover:scale-[1.02] cursor-pointer"
                  >
                    Get Started
                  </button>
                </div>

                {/* Right Graphic Area */}
                <div className="h-full aspect-square flex items-center justify-center overflow-visible">
                  <div className="w-full h-full flex justify-center items-center overflow-clip">
                    <ResumeStackMock />
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="w-full flex flex-col p-4">
            <SectionHeading label="RECENTS" />
            <div className="w-full flex-1 grid grid-cols-5 gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="relative flex-1 border-black/15 flex flex-col items-center bg-[#FAFAFA]/0 rounded-0 overflow-clip cursor-pointer hover:border-brand transition-all duration-300 group"
                >
                  <div
                    className="h-40 aspect-12/15 border bg-[#E7E8F1] rounded border-black/10 translate-y-3 group-hover:translate-y-0 transition-all duration-300"
                    style={{
                      boxShadow:
                        "0 15px 30px -5px rgba(14, 165, 233, 0.5), 0 10px 15px -6px rgba(14, 165, 233, 0.4)",
                    }}
                  >
                    <div className="bg-white h-full flex-1 rounded-[inherit] border border-black/20 overflow-clip">
                      <img
                        src={mockImages[i % mockImages.length]}
                        className="h-full object-cover"
                      />
                    </div>
                  </div>
                  <div
                    className="absolute bottom-0 w-full flex flex-col bg-[#F9FBFC]/70 backdrop-blur-md px-3 py-2 pt-6 rounded-b-[inherit]"
                    style={{
                      maskImage:
                        "linear-gradient(to top, black 60%, transparent 100%)",
                      WebkitMaskImage:
                        "linear-gradient(to top, black 60%, transparent 100%)",
                    }}
                  >
                    <h2 className="text-tiny text-text-primary font-medium">
                      Praveen's SDE Resume
                    </h2>
                    <h3 className="text-tiny text-text-muted font-mono">
                      Last edited 2m ago
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
        <aside className="w-[23vw] p-4 flex flex-col border-l">
          <SectionHeading label="BASE RESUME" />
          <div className="w-full flex flex-col">
            {/* Dynamic Index Label tracking the current top card */}
            <span className="text-xxs font-medium mb-2 px-1 text-text-secondary transition-all duration-200">
              # {dummyResumes[activeIndex].id}.
            </span>

            {/* Layout Wrapper to hold the shuffling stack and the locked dots side-by-side */}
            <div className="self-start relative flex items-center mb-4">
              {/* Trackpad Wheel Interactive Stack Wrapper */}
              <div
                ref={stackRef}
                className="relative h-40 aspect-12/15 select-none cursor-pointer"
                style={{ perspective: "1000px" }}
                onClick={() => {
                  setActiveIndex((prev) => (prev + 1) % dummyResumes.length);
                }}
              >
                {dummyResumes.map((resume, idx) => {
                  const offset =
                    (idx - activeIndex + dummyResumes.length) %
                    dummyResumes.length;

                  // ── VIRTUAL STACK CAP ──────────────────────────────────────────────────
                  // Limit visual stacking effects to 3 cards max (offset 0, 1, and 2).
                  // Cards beyond this clamp to the same position as the 3rd card and fade out.
                  const isVisibleStackCard = offset < 3;
                  const visualOffset = isVisibleStackCard ? offset : 2;

                  const translateY = visualOffset * 10;
                  const scale = 1 - visualOffset * 0.04;
                  const zIndex = dummyResumes.length - offset; // Maintains natural stacking order
                  const opacity =
                    offset === 0 ? 1 : isVisibleStackCard ? 0.65 : 0;

                  return (
                    <div
                      key={resume.id}
                      className="absolute top-0 left-0 w-full h-full border bg-[#E7E8F1] rounded-xl border-black/10 p-px shadow-lg transition-all duration-300 ease-out origin-bottom"
                      style={{
                        transform: `translateY(${translateY}px) scale(${scale})`,
                        zIndex: zIndex,
                        opacity: opacity,
                        // Disable mouse clicks entirely when a card is cycled to the back/hidden layer
                        pointerEvents: offset === 0 ? "auto" : "none",
                      }}
                    >
                      {/* Trash button remains strictly bound to the active top card */}
                      {offset === 0 && (
                        <button
                          className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 flex items-center justify-center bg-white z-20 p-1 rounded-full border cursor-pointer group"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle your delete logic here
                          }}
                        >
                          <Icon
                            icon="carbon:trash-can"
                            className="text-xs text-text-muted transition-colors duration-200 group-hover:text-red-600"
                          />
                        </button>
                      )}

                      <div className="bg-white h-full flex-1 rounded-[inherit] border border-black/20 overflow-clip">
                        <img
                          src={resume.image}
                          className="w-full h-auto min-h-full object-cover object-top pointer-events-none"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Locked Right Paginator Dots Indicator — Completely separated from the cards so it stays dead-still */}
              <div className="absolute left-full pl-1.5 flex flex-col items-center justify-center gap-y-1 h-40 w-5">
                {dummyResumes.map((_, dotIdx) => (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        key={dotIdx}
                        className={`rounded-full w-1.5 aspect-square transition-all duration-200 ${
                          dotIdx === activeIndex
                            ? "bg-brand scale-110"
                            : "bg-gray-300"
                        }`}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xxs!">
                      Swipe cards to shuffle
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>

            {/* Dynamic File Context Footer info */}
            <span className="text-xxs font-medium mb-4 mt-3 px-1 text-text-secondary transition-all duration-200">
              {dummyResumes[activeIndex].name} <span className="mx-1">∙</span>{" "}
              <span className="font-normal text-brand text-tiny">
                {dummyResumes[activeIndex].size}
              </span>
            </span>
          </div>

          <button
            type="button"
            className="mt-5 w-[95%] group relative p-2 flex items-center rounded-2xl border bg-white border-black/12 backdrop-blur-md cursor-pointer hover:border-brand"
            style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
          >
            <Icon
              icon="ic:twotone-plus"
              className="absolute top-2 right-2 text-text-muted"
            />
            <div className="h-16 aspect-square flex items-center justify-center bg-white/40 rounded-lg p-1">
              <FileFolderIcon />
            </div>
            <div className="relative flex-1 h-full flex flex-col items-start justify-center pr-1">
              <span className="text-tiny text-text-primary flex justify-between items-center font-medium">
                CLICK TO UPLOAD NEW BASE
              </span>
              <span className="text-tiny text-brand mt-0.5 font-mono font-medium">
                PDF<span className="text-text-muted">, </span>DOCX
              </span>
            </div>
          </button>

          <span className="w-full text-tiny flex text-text-muted mt-1 px-2">
            <Icon icon="akar-icons:info" className="text-lg text-brand" />
            <span className="mt-1 ml-1 font-mono font-medium">
              Your base resume is the master data. This information is used
              during AI tailoring.
            </span>
          </span>
        </aside>
      </div>
    </div>
  );
}
