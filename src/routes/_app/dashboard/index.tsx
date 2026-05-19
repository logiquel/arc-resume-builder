import { createFileRoute } from "@tanstack/react-router";
import resumeMock1 from "../../../../public/sample_resume_image.jpg";
import resumeMock2 from "../../../../public/sample_resume_image_2.jpg";
import resumeMock3 from "../../../../public/sample_resume_image_3.jpg";
import resumeMock4 from "../../../../public/sample_resume_image_4.jpg";
import { sampleResume } from "../../../../sample_resume_data";
import FileFolderIcon from "#/components/common/Icons/FileFolderIcon";
import { Icon } from "@iconify/react";
import { useState } from "react";
import ResumeStackMock from "#/components/common/Icons/ResumeStackMock";

const mockImages = [resumeMock1, resumeMock2, resumeMock3, resumeMock4];
export const Route = createFileRoute("/_app/dashboard/")({
  component: RouteComponent,
});

interface SectionHeadingProps {
  label: string;
}
const SectionHeading: React.FC<SectionHeadingProps> = ({ label }) => {
  return (
    <div className="w-full flex items-center gap-x-2 bg-[#F9FBFC] mb-4 px-1">
      <h1 className="text-xs uppercase text-brand font-medium">{label}</h1>
      <span className="flex-1 h-[0.025rem] bg-gray-300"></span>
    </div>
  );
};

// ── Route ────────────────────────────────────────────────────────────────────

function RouteComponent() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full h-full overflow-y-scroll space-y-10 custom-scrollbar p-4">
      <section className="w-full flex gap-x-10 border-red-500">
        <aside className="flex flex-col">
          <SectionHeading label="BASE RESUME" />
          <div className="flex flex-col">
            <div className="self-start h-40 aspect-12/15 border bg-[#E7E8F1] rounded-xl border-black/10 p-0.5 shadow-lg">
              <div className="bg-white h-full flex-1 rounded-[inherit] border border-black/20 overflow-clip cursor-pointer hover:border-brand transition-all duration-300">
                <img src={resumeMock1} className="h-full" />
              </div>
            </div>
            <span className="text-xxs font-medium mt-2 mb-4 pb-2 px-1 text-text-secondary border-b">
              Resume file-EN.pdf
            </span>
          </div>
          <button
            type="button"
            className="relative h-20 aspect-21/8 p-2 flex items-center rounded-2xl border bg-white border-black/12 backdrop-blur-md cursor-pointer hover:border-brand"
            style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
          >
            <Icon
              icon="ic:twotone-plus"
              className="absolute top-3 right-3 text-text-muted"
            />
            <div className="h-[90%] aspect-square flex items-center justify-center bg-white/40 rounded-lg p-1">
              <FileFolderIcon />
            </div>
            <div className="relative flex-1 h-full flex flex-col items-start justify-center pr-1">
              <span className="text-tiny text-text-primary flex justify-between items-center font-medium">
                UPLOAD NEW BASE
              </span>
              <span className="text-tiny text-brand mt-0.5 font-mono font-medium">
                PDF<span className="text-text-muted">, </span>DOCX
              </span>
            </div>
          </button>
        </aside>

        {/* Base Parse result */}
        <div className="flex-1 p-4">
          <div className="w-[30vw] aspect-21/10 flex border border-black/10 rounded-[2rem] bg-linear-to-br from-white to-[#F5F7F9] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] cursor-pointer hover:border-brand hover:-translate-y-0.5 transition-all duration-300 group">
            {/* Left Content Area */}
            <div className="flex-1 h-full flex flex-col justify-between p-6">
              <div className="flex flex-col gap-y-1.5">
                <h2 className="text-base font-semibold text-text-primary tracking-tight leading-snug">
                  Help me build my <br /> resume.
                </h2>
                <h3 className="text-xxs font-medium text-text-muted leading-relaxed">
                  Start fresh or let AI guide <br /> your layout
                </h3>
              </div>

              {/* Micro-interaction: Arrow translates slightly right on card hover */}
              <Icon
                icon="si:arrow-right-duotone"
                className="text-text-secondary text-lg mt-2 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand"
              />
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

      <section className="w-full flex flex-col">
        <SectionHeading label="RECENTS" />
        <div className="w-full flex-1 grid grid-cols-6 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="relative flex-1 border border-black/15 flex flex-col items-center bg-[#FAFAFA] rounded-2xl overflow-clip cursor-pointer hover:border-brand transition-all duration-300"
            >
              <div
                className="h-40 aspect-12/15 border bg-[#E7E8F1] rounded border-black/10 translate-y-4 transition-all duration-300"
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
                className="absolute bottom-0 w-full flex flex-col bg-white/70 backdrop-blur-md px-3 py-2 pt-6 rounded-b-[inherit]"
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
    </div>
  );
}
