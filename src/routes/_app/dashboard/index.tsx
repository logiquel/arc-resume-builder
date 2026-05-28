import { createFileRoute } from "@tanstack/react-router";
import resumeMock1 from "/sample_resume_image_1.jpg";
import resumeMock2 from "/sample_resume_image_2.jpg";
import resumeMock3 from "/sample_resume_image_3.jpg";
import resumeMock4 from "/sample_resume_image_4.jpg";
import resumeMock5 from "/sample_resume_image_5.jpg";
import resumeMock6 from "/sample_resume_image_6.jpg";
import { Icon } from "@iconify/react";
import { format, parseISO } from "date-fns";
import React, { useRef, useState, useEffect } from "react";
import ResumeStackMock from "#/components/common/Icons/ResumeStackMock";
import FileFolderIcon from "#/components/common/Icons/FileFolderIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/components/addons/tooltip";
import { useCreateBaseResumeMutation } from "#/api/resume/base/base-resume.mutations";
import { useFetchBaseResumeList } from "#/api/resume/base/base-resume.queries";
import BaseResumeSkeleton from "#/components/common/Skeletons/BaseResumeSkeleton";

export const Route = createFileRoute("/_app/dashboard/")({
  pendingComponent: () => <div>Loading...</div>,
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
      <span className="flex-1 h-[0.025rem] bg-gray-300">{secondaryLabel}</span>
    </div>
  );
};

interface AddBaseResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddBaseResumeModal: React.FC<AddBaseResumeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedOption, setSelectedOption] = useState<
    "form" | "upload" | null
  >(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createBaseResumeMutation = useCreateBaseResumeMutation();

  if (!isOpen) return null;

  const handleOptionSelect = (option: "form" | "upload") => {
    setSelectedOption(option);
    if (option === "upload") {
      setUploadedFile(null);
      setResumeName("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setResumeName(nameWithoutExt);
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;

    createBaseResumeMutation.mutate(
      {
        name: resumeName || uploadedFile.name,
        file: uploadedFile,
      },
      {
        onSuccess: () => {
          setSelectedOption(null);
          setUploadedFile(null);
          setResumeName("");
          onClose();
        },
      },
    );
  };

  const handleBack = () => {
    setSelectedOption(null);
    setUploadedFile(null);
    setResumeName("");
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-[480px] max-w-[90vw] shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-text-primary">
            Add New Base Resume
          </h2>
          <button
            onClick={() => {
              onClose();
              setSelectedOption(null);
              setUploadedFile(null);
              setResumeName("");
            }}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Icon icon="carbon:close" className="text-xl text-text-muted" />
          </button>
        </div>

        <div className="p-6">
          {selectedOption === null ? (
            <div className="flex flex-col gap-4">
              <button
                onClick={() => handleOptionSelect("form")}
                className="group p-6 border-2 border-gray-200 rounded-xl hover:border-brand/50 hover:bg-brand/5 transition-all duration-200 text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand/10 rounded-xl group-hover:bg-brand/20 transition-colors">
                    <Icon
                      icon="carbon:document"
                      className="text-2xl text-brand"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-text-primary mb-1">
                      Fill Resume Form
                    </h3>
                    <p className="text-sm text-text-muted">
                      Manually enter your resume information through our guided
                      form
                    </p>
                    <span className="inline-block mt-2 text-xs text-brand/60 group-hover:text-brand transition-colors">
                      Coming soon →
                    </span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleOptionSelect("upload")}
                className="group p-6 border-2 border-gray-200 rounded-xl hover:border-brand/50 hover:bg-brand/5 transition-all duration-200 text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand/10 rounded-xl group-hover:bg-brand/20 transition-colors">
                    <Icon
                      icon="carbon:upload"
                      className="text-2xl text-brand"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-text-primary mb-1">
                      Upload Resume File
                    </h3>
                    <p className="text-sm text-text-muted">
                      Upload an existing resume file (PDF, DOCX)
                    </p>
                  </div>
                </div>
              </button>
            </div>
          ) : selectedOption === "upload" ? (
            <div className="flex flex-col gap-5">
              {!uploadedFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-brand/50 hover:bg-brand/5 transition-all duration-200"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Icon
                    icon="carbon:cloud-upload"
                    className="text-4xl text-text-muted mx-auto mb-3"
                  />
                  <p className="text-text-primary font-medium mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-text-muted">
                    PDF or DOCX (Max 10MB)
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg border border-gray-200">
                      <Icon
                        icon="carbon:document-pdf"
                        className="text-2xl text-red-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {uploadedFile.name}
                      </p>
                      <p className="text-xs text-text-muted">
                        {(uploadedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setUploadedFile(null);
                        setResumeName("");
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Icon
                        icon="carbon:trash-can"
                        className="text-text-muted hover:text-red-500"
                      />
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Resume Name
                </label>
                <input
                  type="text"
                  value={resumeName}
                  onChange={(e) => setResumeName(e.target.value)}
                  placeholder="e.g., Frontend_Resume_2026"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                />
                <p className="text-xs text-text-muted mt-1">
                  Give your base resume a unique name for easy identification
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleBack}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-text-secondary hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!uploadedFile || createBaseResumeMutation.isPending}
                  className="flex-1 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {createBaseResumeMutation.isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    "Upload Resume"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="text-center py-8">
                <Icon
                  icon="carbon:construction"
                  className="text-4xl text-text-muted mx-auto mb-3"
                />
                <p className="text-text-primary font-medium mb-1">
                  Coming Soon
                </p>
                <p className="text-sm text-text-muted">
                  Resume form builder is under development
                </p>
              </div>
              <button
                onClick={handleBack}
                className="px-4 py-2 border border-gray-200 rounded-lg text-text-secondary hover:bg-gray-50 transition-colors"
              >
                Back to Options
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Route ────────────────────────────────────────────────────────────────────
const sampleBaseResumes = [
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

const sampleTailoredResumes = [
  {
    id: 1,
    name: "Roman's_SDE_Core.pdf",
    size: "126.17 KB",
    image: resumeMock1,
  },
  {
    id: 2,
    name: "Roman's_FullStack_v2.pdf",
    size: "142.30 KB",
    image: resumeMock2,
  },
  {
    id: 3,
    name: "Roman's_Frontend_React.pdf",
    size: "118.45 KB",
    image: resumeMock3,
  },
  {
    id: 4,
    name: "Roman's_Mobile_KMP.pdf",
    size: "126.12 KB",
    image: resumeMock4,
  },
  {
    id: 5,
    name: "Roman's_Backend_Node.pdf",
    size: "131.40 KB",
    image: resumeMock5,
  },
  {
    id: 6,
    name: "Roman's_DevOps_AWS.pdf",
    size: "124.85 KB",
    image: resumeMock6,
  },
  {
    id: 7,
    name: "Roman's_Systems_Engineer.pdf",
    size: "129.10 KB",
    image: resumeMock5,
  },
  {
    id: 8,
    name: "Roman's_AI_Engineer_v1.pdf",
    size: "135.22 KB",
    image: resumeMock6,
  },
];

function RouteComponent() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAddBaseModalOpen, setIsAddBaseModalOpen] = useState(false);
  const scrollAccumulator = useRef(0);
  const stackRef = useRef<HTMLDivElement>(null);

  const {
    data: baseResumes = [],
    isLoading: isBaseResumesLoading,
    isError: isBaseResumesError,
    error: baseResumesError,
  } = useFetchBaseResumeList();

  const hasBaseResumes = baseResumes.length > 0;
  const safeActiveIndex = hasBaseResumes ? activeIndex % baseResumes.length : 0;
  const activeBaseResume = hasBaseResumes ? baseResumes[safeActiveIndex] : null;

  const activeIndexRef = useRef(activeIndex);

  useEffect(() => {
    if (!hasBaseResumes) {
      setActiveIndex(0);
      return;
    }

    if (activeIndex >= baseResumes.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, baseResumes.length, hasBaseResumes]);

  useEffect(() => {
    activeIndexRef.current = safeActiveIndex;
  }, [safeActiveIndex]);

  useEffect(() => {
    const stackEl = stackRef.current;
    if (!stackEl || baseResumes.length <= 1) return;

    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault();

      scrollAccumulator.current += e.deltaY;

      if (Math.abs(scrollAccumulator.current) >= 80) {
        const currentIdx = activeIndexRef.current;

        if (scrollAccumulator.current > 0) {
          setActiveIndex((currentIdx + 1) % baseResumes.length);
        } else {
          setActiveIndex(
            (currentIdx - 1 + baseResumes.length) % baseResumes.length,
          );
        }

        scrollAccumulator.current = 0;
      }
    };

    stackEl.addEventListener("wheel", handleNativeWheel, { passive: false });

    return () => {
      stackEl.removeEventListener("wheel", handleNativeWheel);
    };
  }, [baseResumes.length]);

  return (
    <>
      <div className="w-full h-full flex flex-col">
        <div className="w-full flex flex-col px-5 py-3 sticky top-0 z-10 bg-[#F9FBFC]">
          <h1 className="text-base font-medium text-text-primary">
            Good Morning, Steve
          </h1>
          <h2 className="text-xs text-text-muted">
            A new day, a new opportunity! Let's create something amazing
            together.
          </h2>
        </div>
        <div className="w-full flex-1 min-h-0 flex">
          <main className="flex-1 h-full overflow-y-scroll hide-scrollbar pb-10">
            <section className="w-full flex flex-col gap-x-2 p-4">
              <div className="flex-1">
                <div className="w-[34vw] aspect-21/9 flex rounded-[2rem] border border-black/10 bg-white shadow-[0_8px_32px_0_rgba(14,165,233,0.04),inset_0_1px_1px_0_rgba(255,255,255,0.3)] group">
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

                    <button
                      type="button"
                      className="hover:border-brand/30 self-start mt-2 px-3.5 py-1.5 text-tiny font-medium text-white bg-brand rounded-xl shadow-xs transition-all duration-300 group-hover:bg-brand/90 group-hover:scale-[1.02] cursor-pointer"
                    >
                      Get Started
                    </button>
                  </div>

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
                {sampleTailoredResumes.map((resume, i) => (
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
                          src={resume.image}
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
                        {resume.name}
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

          <aside className="w-[23vw] p-4 flex flex-col border-l no-select">
            <SectionHeading label="BASE RESUME" />
            {isBaseResumesLoading ? (
              <BaseResumeSkeleton />
            ) : !hasBaseResumes ? (
              <div className="w-full flex flex-col border-red-400">
                <div className="relative flex-1 flex gap-x-3">
                  {/* Single Card Skeleton */}
                  <div className="relative w-[95%] h-20">
                    <div className="absolute inset-0 flex flex-col justify-evenly p-5 gap-y-1 rounded-2xl shadow-lg border border-black/12 bg-white">
                      <div className="flex items-center gap-x-2">
                        <div className="h-3 w-6 bg-gray-200 rounded"></div>
                        <div className="h-3 w-32 bg-gray-200 rounded"></div>
                      </div>
                      <div className="w-full flex items-center gap-x-1 ml-5">
                        <div className="h-3 w-3 bg-gray-200 rounded"></div>
                        <div className="h-3 w-24 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="w-6 h-6 shadow absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 flex items-center justify-center bg-white z-20 p-1 rounded-full border cursor-pointer group">
                      <span className="text-tiny">0</span>
                    </div>
                  </div>

                  {/* Dots Indicator Skeleton */}
                  <div className="h-full w-5 flex flex-col gap-y-1 justify-center items-center">
                    {[1].map((_, idx) => (
                      <div
                        key={idx}
                        className={`rounded-full transition-all duration-200 w-[4.2px] aspect-square bg-gray-300 ${
                          idx === 0 ? "scale-110" : ""
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <span className="w-full text-tiny flex text-text-muted mt-2 px-2">
                  <Icon icon="akar-icons:info" className="text-lg text-brand" />
                  <span className="mt-1 ml-1 font-mono font-medium">
                    No base resume yet. Click the button below to add your first
                    base resume.
                  </span>
                </span>
              </div>
            ) : (
              <div
                ref={stackRef}
                className="w-full flex flex-col border-red-400"
              >
                <div className="relative flex-1 flex gap-x-3">
                  <div
                    style={{ perspective: "1000px" }}
                    className="relative w-[95%] h-20 cursor-pointer"
                    onClick={() => {
                      setActiveIndex((prev) => (prev + 1) % baseResumes.length);
                    }}
                  >
                    {baseResumes.map((resume, idx) => {
                      const offset =
                        (idx - activeIndex + baseResumes.length) %
                        baseResumes.length;

                      const isVisibleStackCard = offset < 3;
                      const visualOffset = isVisibleStackCard ? offset : 2;
                      const translateY = visualOffset * 10;
                      const scale = 1 - visualOffset * 0.04;
                      const zIndex = baseResumes.length - offset;
                      const opacity =
                        offset === 0 ? 1 : isVisibleStackCard ? 0.65 : 0;
                      return (
                        <div
                          key={resume.id}
                          className="absolute inset-0 flex flex-col justify-evenly p-5 gap-y-1 rounded-2xl shadow-lg border bg-white border-black/12 backdrop-blur-md transition-all duration-300 ease-out"
                          style={{
                            transform: `translateY(${translateY}px) scale(${scale})`,
                            zIndex: zIndex,
                            opacity,
                            pointerEvents: offset === 0 ? "auto" : "none",
                          }}
                        >
                          <p className="text-xs text-text-primary">
                            <span className="text-xxs font-medium mb-2 mr-1 text-text-muted transition-all duration-200">
                              #{idx + 1}.
                            </span>
                            {resume.name.replace(/\.[^/.]+$/, "")}
                          </p>

                          <span className="w-full flex items-center gap-x-1 ml-5">
                            <Icon
                              icon="pepicons-print:calendar"
                              className="text-xs text-brand"
                            />
                            <p className="text-tiny text-text-muted">
                              {format(
                                parseISO(resume.updatedAt),
                                "MMMM do, yyyy",
                              )}
                            </p>
                          </span>

                          {offset === 0 && (
                            <button
                              className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 flex items-center justify-center bg-white z-20 p-1 rounded-full border cursor-pointer group"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <Icon
                                icon="carbon:trash-can"
                                className="text-xs text-text-muted transition-colors duration-200 group-hover:text-red-600"
                              />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="h-full w-5 flex flex-col gap-y-1 justify-center items-center">
                    {baseResumes.map((resume, dotIdx) => (
                      <Tooltip key={resume.id}>
                        <TooltipTrigger asChild>
                          <div
                            className={`rounded-full transition-all duration-200 ${
                              dotIdx === activeIndex
                                ? "w-[4.2px] aspect-square bg-brand scale-110"
                                : "w-[4.2px] aspect-square bg-gray-300"
                            }`}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xxs!">
                          Scroll cards to shuffle
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={() => setIsAddBaseModalOpen(true)}
              className="mt-10 w-[95%] group relative p-2 flex items-center rounded-2xl border bg-white border-black/12 backdrop-blur-md cursor-pointer hover:border-brand"
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
                  CLICK TO ADD NEW BASE
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

      <AddBaseResumeModal
        isOpen={isAddBaseModalOpen}
        onClose={() => setIsAddBaseModalOpen(false)}
      />
    </>
  );
}
