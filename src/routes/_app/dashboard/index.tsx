import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
import {
  useCreateBaseResumeMutation,
  useDeleteBaseResumeMutation,
} from "#/api/resume/base/base-resume.mutations";
import { useFetchBaseResumeList } from "#/api/resume/base/base-resume.queries";
import BaseResumeSkeleton from "#/components/common/Skeletons/BaseResumeSkeleton";
import PlaceholderResume from "#/components/common/PlaceholderResume";
import { useCreateTailoredResumeMutation } from "#/api/resume/tailor/tailor-resume.mutations";
import PaperIcon from "#/components/common/PaperIcon";
import FormIcon from "#/components/common/FormIcon";
import DeleteModal from "#/components/common/DeleteModal";
import { useFetchTailoredResumeList } from "#/api/resume/tailor/tailor-resume.queries";
import {
  TEMPLATES,
  TEMPLATES_LIST,
  type TemplateId,
} from "#/config/templates.config";

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

  const { mutate: createBaseResume, isPending } = useCreateBaseResumeMutation();

  if (!isOpen) {
    return null;
  }

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
    if (!uploadedFile) {
      return;
    }

    createBaseResume(
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

  const handleNext = () => {
    if (selectedOption === "upload") {
      handleUpload();
    }
  };

  const isNextDisabled = () => {
    if (selectedOption === "upload") {
      return !uploadedFile || isPending;
    }
    return true; // Form option is disabled
  };

  return (
    <div className="absolute inset-0 z-50 flex justify-center">
      <div className="w-100 h-fit mt-[10%] flex flex-col gap-1 p-1 bg-white shadow-2xl border border-black/10 rounded-4xl overflow-hidden transition-all duration-300">
        <header className="w-full flex gap-2 p-3 justify-between shrink-0">
          <div className="flex flex-col">
            <h2 className="text-base">
              Select how you want to add Base Resume
            </h2>
            <p className="text-text-muted text-xxs">
              Choose a base resume to begin tailoring it for specific job
              applications
            </p>
          </div>
          <button
            onClick={() => {
              onClose();
              setSelectedOption(null);
              setUploadedFile(null);
              setResumeName("");
            }}
            className="self-start flex items-center justify-center border rounded-full p-2 cursor-pointer shadow"
          >
            <Icon icon="iconamoon:close" />
          </button>
        </header>

        <div className="transition-all duration-300 ease-in-out">
          {selectedOption === "upload" ? (
            <div className="w-full px-3 py-1">
              <div className="w-full aspect-4/1.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-full flex flex-col items-center p-5 border-2 border-dashed border-brand-100 rounded-3xl shadow-[0_0_30px_rgba(59,130,246,0.08)] cursor-pointer"
                >
                  <Icon
                    icon="lets-icons:upload-light"
                    className="text-text-muted text-xl"
                  />

                  <p className="text-text-muted text-xxs text-center font-normal mt-2">
                    Upload your resume in{" "}
                    <span className="font-medium text-brand">PDF</span> or{" "}
                    <span className="font-medium text-brand">DOCX</span> format
                    to use as the base for AI tailoring.
                  </p>

                  {uploadedFile && (
                    <p className="mt-3 text-xxs font-medium text-brand">
                      {uploadedFile.name}
                    </p>
                  )}
                </div>
              </div>
              {/* Show input whenever a file is uploaded, regardless of resumeName value */}
              {uploadedFile && (
                <div className="mt-3 px-1 py-1">
                  <label className="text-tiny text-brand font-medium block px-1 mb-1 uppercase">
                    Resume Name
                  </label>
                  <input
                    type="text"
                    value={resumeName}
                    onChange={(e) => setResumeName(e.target.value)}
                    placeholder="Enter resume name"
                    className="w-full px-3 py-3 text-xs bg-gray-50 rounded-lg focus:outline-none focus:border-brand"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="w-full flex flex-col gap-2 p-2">
              <button
                onClick={() => handleOptionSelect("upload")}
                className="w-full aspect-[1/0.3] flex border rounded-2xl cursor-pointer overflow-clip p-1"
              >
                <div className="h-full aspect-square flex items-end overflow-clip bg-gray-50 rounded-[inherit]">
                  <div className="w-full h-[80%] translate-y-1 flex justify-center">
                    <PaperIcon />
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center items-start gap-y-1 px-3">
                  <p className="text-sm text-text-primary font-medium">
                    Upload File
                  </p>

                  <p className="text-tiny text-text-muted text-start">
                    Upload your resume in{" "}
                    <span className="font-medium text-brand">PDF</span> or{" "}
                    <span className="font-medium text-brand">DOCX</span> format
                    to use as a base for AI tailoring.
                  </p>
                </div>
              </button>

              <button
                disabled
                className="w-full aspect-[1/0.3] flex border rounded-2xl cursor-not-allowed overflow-clip p-1 opacity-70"
              >
                <div className="h-full aspect-square flex items-end overflow-clip bg-gray-50 rounded-[inherit]">
                  <div className="w-full h-[85%] translate-y-1 flex justify-center">
                    <FormIcon />
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center items-start gap-y-1 px-3">
                  <p className="text-sm text-text-primary font-medium">
                    Fill Form
                  </p>

                  <p className="text-tiny text-text-muted text-start">
                    Manually input your resume details in a structured form.
                  </p>

                  <p className="text-tiny text-text-secondary text-start bg-gray-50 px-2 py-0.5 rounded-full mt-1">
                    Coming Soon!
                  </p>
                </div>
              </button>
            </div>
          )}
        </div>

        <footer className="w-full flex items-center p-2 shrink-0">
          <div className="flex items-center gap-1 p-2">
            <div
              className={`h-[0.35rem] rounded-full transition-all duration-200 ${
                selectedOption === null
                  ? "w-6 bg-brand"
                  : "w-[0.35rem] bg-gray-100"
              }`}
            ></div>
            <div
              className={`h-[0.35rem] rounded-full transition-all duration-200 ${
                selectedOption !== null
                  ? "w-6 bg-brand"
                  : "w-[0.35rem] bg-gray-100"
              }`}
            ></div>
          </div>
          <div className="flex-1 flex items-center justify-end gap-2">
            {selectedOption !== null && (
              <button
                onClick={handleBack}
                className="px-5 py-2 text-xxs bg-gray-100 rounded-full cursor-pointer"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={isNextDisabled()}
              className="px-5 py-2 text-xxs text-white bg-brand rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending
                ? "Uploading..."
                : selectedOption === null
                  ? "Next"
                  : "Upload"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
// ── Route ────────────────────────────────────────────────────────────────────

function RouteComponent() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAddBaseModalOpen, setIsAddBaseModalOpen] = useState(false);
  const [isTailorModalOpen, setIsTailorModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBaseResumeId, setSelectedBaseResumeId] = useState<
    string | null
  >(null);
  const [jobDescription, setJobDescription] = useState("");
  const scrollAccumulator = useRef(0);
  const stackRef = useRef<HTMLDivElement>(null);

  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    resumeId: string | null;
    resumeName: string;
  }>({
    isOpen: false,
    resumeId: null,
    resumeName: "",
  });

  const { mutate: deleteBaseResume, isPending: isDeletingBaseResume } =
    useDeleteBaseResumeMutation();

  const { data: baseResumes = [], isLoading: isBaseResumesLoading } =
    useFetchBaseResumeList();

  const { data: tailoredResumes = [], isLoading: isTailoredResumesLoading } =
    useFetchTailoredResumeList();

  const { mutate: createTailoredResume, isPending: isTailoringPending } =
    useCreateTailoredResumeMutation();

  const hasBaseResumes = baseResumes.length > 0;
  const safeActiveIndex = hasBaseResumes ? activeIndex % baseResumes.length : 0;

  const activeIndexRef = useRef(activeIndex);

  const resetTailorState = () => {
    setIsTailorModalOpen(false);
    setCurrentStep(1);
    setSelectedBaseResumeId(null);
    setJobDescription("");
  };

  const handleGetStarted = () => {
    setIsTailorModalOpen(true);
    setCurrentStep(1);
    setSelectedBaseResumeId(null);
    setJobDescription("");
  };

  const handleCloseModal = () => {
    if (isTailoringPending) {
      return;
    }
    resetTailorState();
  };

  const handleNextStep = () => {
    if (currentStep === 1 && selectedBaseResumeId) {
      setCurrentStep(2);
    }
  };

  const handleTailor = () => {
    if (!selectedBaseResumeId || !jobDescription.trim() || isTailoringPending) {
      return;
    }

    createTailoredResume(
      {
        base_resume_id: selectedBaseResumeId,
        job_description: jobDescription.trim(),
      },
      {
        onSuccess: async (response) => {
          const sessionId = response.data.id;

          resetTailorState();

          await navigate({
            to: "/tailored-resumes/$sessionId",
            params: { sessionId },
          });
        },
      },
    );
  };

  const handleDeleteClick = (
    e: React.MouseEvent,
    resumeId: string,
    resumeName: string,
  ) => {
    e.stopPropagation();
    setDeleteModalState({
      isOpen: true,
      resumeId,
      resumeName,
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteModalState.resumeId) return;

    deleteBaseResume(
      { resumeId: deleteModalState.resumeId },
      {
        onSuccess: () => {
          setDeleteModalState({
            isOpen: false,
            resumeId: null,
            resumeName: "",
          });
          // Reset active index if needed
          if (baseResumes.length === 1) {
            setActiveIndex(0);
          }
        },
        onError: (error) => {
          console.error("Failed to delete:", error);
          // Optionally show error state
          setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
        },
      },
    );
  };

  const handleCloseDeleteModal = () => {
    if (isDeletingBaseResume) return;
    setDeleteModalState({
      isOpen: false,
      resumeId: null,
      resumeName: "",
    });
  };

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

  // Helper function to get template thumbnail by template_id with fallback
  const getTemplateThumbnail = (templateId?: string): string => {
    if (templateId && TEMPLATES[templateId as TemplateId]) {
      return TEMPLATES[templateId as TemplateId].thumbnail;
    }
    // Fallback to first template's thumbnail
    return TEMPLATES_LIST[0]?.thumbnail || "/default-resume-thumbnail.png";
  };

  // Helper function to get template name by template_id with fallback
  const getTemplateName = (templateId?: string): string => {
    if (templateId && TEMPLATES[templateId as TemplateId]) {
      return TEMPLATES[templateId as TemplateId].name;
    }
    // Fallback to first template's name
    return TEMPLATES_LIST[0]?.name || "Resume";
  };

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
                      onClick={handleGetStarted}
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
              <SectionHeading label="MY TAILORED RESUMES" />
              <div className="w-full flex-1 grid grid-cols-5 gap-2">
                {isTailoredResumesLoading ? (
                  // Loading skeletons
                  Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="relative flex-1 border-black/15 flex flex-col items-center bg-[#FAFAFA]/0 rounded-0 overflow-clip"
                    >
                      <div
                        className="h-40 aspect-12/15 bg-[#E7E8F1] rounded border-2 border-black/5 translate-y-3 animate-pulse"
                        style={{
                          boxShadow:
                            "0 15px 30px -5px rgba(14, 165, 233, 0.5), 0 10px 15px -6px rgba(14, 165, 233, 0.4)",
                        }}
                      >
                        <div className="bg-white h-full min-w-0 flex-1 rounded-[inherit] border-black/20 overflow-clip">
                          <PlaceholderResume />
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
                        <div className="h-2 w-3/4 bg-gray-200 rounded animate-pulse mb-1" />
                        <div className="h-2 w-1/2 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                  ))
                ) : tailoredResumes.length === 0 ? (
                  // Empty state
                  <div className="col-span-5 flex flex-col items-center justify-center py-12">
                    <Icon
                      icon="mdi:file-document-outline"
                      className="text-4xl text-text-muted mb-3"
                    />
                    <p className="text-sm text-text-muted">
                      No tailored resumes yet
                    </p>
                    <p className="text-xxs text-text-muted mt-1">
                      Create your first tailored resume by clicking "Get
                      Started"
                    </p>
                  </div>
                ) : (
                  // Actual tailored resumes
                  tailoredResumes.map((resume, i) => (
                    <div
                      key={resume.id || i}
                      className="relative flex-1 border-black/15 flex flex-col items-center bg-[#FAFAFA]/0 rounded-0 overflow-clip cursor-pointer hover:border-brand transition-all duration-300 group"
                      onClick={() => {
                        // Navigate to tailored resume detail
                        navigate({
                          to: "/tailored-resumes/$sessionId",
                          params: { sessionId: resume.id },
                        });
                      }}
                    >
                      <div
                        className="h-40 aspect-12/15 bg-[#E7E8F1] rounded border-2 border-black/5 translate-y-3 group-hover:translate-y-0 transition-all duration-300"
                        style={{
                          boxShadow:
                            "0 15px 30px -5px rgba(14, 165, 233, 0.5), 0 10px 15px -6px rgba(14, 165, 233, 0.4)",
                        }}
                      >
                        <div className="h-full min-w-0 flex-1 rounded-[inherit] border-black/20 overflow-clip">
                          <img
                            src={getTemplateThumbnail(resume.template_id || "")}
                            alt={getTemplateName(resume.template_id || "")}
                            className="h-full w-full object-cover object-top"
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
                        <h2 className="text-tiny text-text-primary font-medium truncate w-full">
                          {resume.name || `Tailored Resume ${i + 1}`}
                        </h2>
                        <h3 className="text-tiny text-text-muted font-mono">
                          Last edited{" "}
                          {resume.updated_at
                            ? format(parseISO(resume.updated_at), "MMM do")
                            : "recently"}
                        </h3>
                      </div>
                    </div>
                  ))
                )}
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
                                parseISO(resume.updated_at),
                                "MMMM do, yyyy",
                              )}
                            </p>
                          </span>

                          {offset === 0 && (
                            <button
                              className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 flex items-center justify-center bg-white shadow z-20 p-1 rounded-full border cursor-pointer group"
                              onClick={(e) =>
                                handleDeleteClick(e, resume.id, resume.name)
                              }
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

      {/* Tailor Resume Modal */}
      {isTailorModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="relative w-180 max-w-[90vw] rounded-4xl bg-white border border-black/10 shadow-2xl overflow-hidden">
            <div className="w-full p-5 flex gap-2 justify-between">
              <div className="flex flex-col">
                <h2 className="text-base">
                  {currentStep === 1
                    ? "Select a Base Resume to get Started"
                    : "Paste Job Description"}
                </h2>
                <p className="text-text-muted text-xxs">
                  {currentStep === 1
                    ? "Choose a base resume to begin tailoring it for specific job applications."
                    : "Paste the job description to tailor your resume accordingly"}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="self-start flex items-center justify-center border rounded-full p-2 cursor-pointer shadow"
              >
                <Icon icon="iconamoon:close" />
              </button>
            </div>

            {currentStep === 1 ? (
              <div className="w-full h-90 grid grid-cols-5 p-5 gap-6 overflow-scroll custom-scrollbar">
                {baseResumes.map((base, idx) => (
                  <div
                    key={base.id}
                    onClick={() => setSelectedBaseResumeId(base.id)}
                    className="relative w-full flex flex-col cursor-pointer group"
                  >
                    <div
                      className={`w-full aspect-12/14 overflow-hidden rounded-lg bg-white border-2 transition-all duration-200 ${
                        selectedBaseResumeId === base.id
                          ? "border-brand"
                          : "border-black/10 group-hover:border-brand"
                      }`}
                    >
                      <PlaceholderResume />
                    </div>
                    <span className="text-xxs text-text-primary leading-snug text-wrap w-[95%] truncate mt-2 px-1">
                      <span className="font-medium mb-2 mr-1 text-text-muted transition-all duration-200">
                        #{idx + 1}.
                      </span>
                      {base.name}
                    </span>
                    <span className="text-tiny text-text-muted leading-snug text-wrap w-[95%] truncate mt-0.5 px-1">
                      {format(parseISO(base.updated_at), "MMMM do, yyyy")}
                    </span>
                    {selectedBaseResumeId === base.id && (
                      <div className="w-4.5 h-4.5 rounded-full shadow-sm bg-brand flex items-center justify-center absolute top-0 right-0 translate-x-1/3 -translate-y-1/3">
                        <Icon
                          icon="mingcute:check-fill"
                          className="text-white w-[50%] h-[50%]"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-90 px-4">
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full h-full resize-none focus:outline-none p-5 border rounded-2xl text-xxs placeholder:text-text-muted transition-all duration-200"
                  placeholder="Paste job description here..."
                  style={{
                    boxShadow:
                      "0 0 20px rgba(14, 165, 233, 0.15), rgba(149, 157, 165, 0.2) 0px 8px 24px",
                  }}
                />
              </div>
            )}

            <div className="w-full flex items-center gap-1 px-5 py-3">
              <div className="flex items-center gap-1">
                <div
                  className={`h-[0.35rem] rounded-full transition-all duration-200 ${
                    currentStep === 1
                      ? "bg-brand w-6"
                      : "bg-text-muted w-[0.35rem]"
                  }`}
                />
                <div
                  className={`h-[0.35rem] rounded-full transition-all duration-200 ${
                    currentStep === 2
                      ? "bg-brand w-6"
                      : "bg-gray-300 w-[0.35rem]"
                  }`}
                />
              </div>
              <div className="flex-1 flex justify-end gap-2">
                {currentStep === 2 && (
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-2 text-xxs bg-gray-100 rounded-full cursor-pointer"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={currentStep === 1 ? handleNextStep : handleTailor}
                  disabled={
                    currentStep === 1
                      ? !selectedBaseResumeId
                      : !jobDescription.trim()
                  }
                  className="px-5 py-2 text-xxs text-white bg-brand rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentStep === 1 ? "Next" : "Tailor"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={deleteModalState.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        resumeName={deleteModalState.resumeName}
        isDeleting={isDeletingBaseResume}
      />
    </>
  );
}
