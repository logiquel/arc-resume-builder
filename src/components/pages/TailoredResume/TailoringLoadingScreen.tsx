import type { TailoringGenerationStep } from "#/types/resume/tailorSession.types";
import { Icon } from "@iconify/react";

const STEPS: {
  step: TailoringGenerationStep;
  label: string;
  description: string;
}[] = [
  {
    step: "PLACEHOLDER_CREATED",
    label: "Initializing Workspace",
    description: "Setting up your tailoring session...",
  },
  {
    step: "READING_BASE_DATA",
    label: "Reading Resume",
    description: "Parsing your base resume data...",
  },
  {
    step: "JD_ANALYSIS",
    label: "Analyzing Job Description",
    description: "Extracting key requirements and keywords...",
  },
  {
    step: "TAILORING",
    label: "Tailoring Resume",
    description: "Aligning your experience with the role...",
  },
  {
    step: "FINALIZING",
    label: "Finalizing",
    description: "Preparing your enhanced resume changes...",
  },
  {
    step: "COMPLETED",
    label: "Done",
    description: "Your tailored resume is ready.",
  },
];

const STEP_ORDER: TailoringGenerationStep[] = [
  "PLACEHOLDER_CREATED",
  "READING_BASE_DATA",
  "JD_ANALYSIS",
  "TAILORING",
  "FINALIZING",
  "COMPLETED",
];

interface TailoringLoadingScreenProps {
  currentStep: string;
}
const TailoringLoadingScreen: React.FC<TailoringLoadingScreenProps> = ({
  currentStep,
}) => {
  const currentIndex = STEP_ORDER.indexOf(currentStep);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-4">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-lg font-semibold text-text-primary">
          Tailoring your resume
        </h2>
        <p className="text-sm text-text-secondary">
          This usually takes 20–40 seconds. Please stay on this page.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        {STEPS.filter((s) => s.step !== "COMPLETED").map((s, idx) => {
          const isDone = idx < currentIndex;
          const isActive = idx === currentIndex;

          return (
            <div key={s.step} className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <Icon
                    icon="lucide:check-circle"
                    className="w-5 h-5 text-green-500"
                  />
                ) : isActive ? (
                  <Icon
                    icon="lucide:loader-circle"
                    className="w-5 h-5 text-primary animate-spin"
                  />
                ) : (
                  <Icon
                    icon="lucide:circle"
                    className="w-5 h-5 text-text-faint"
                  />
                )}
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-sm font-medium ${
                    isDone
                      ? "text-text-secondary line-through"
                      : isActive
                        ? "text-text-primary"
                        : "text-text-faint"
                  }`}
                >
                  {s.label}
                </span>
                {isActive && (
                  <span className="text-xs text-text-secondary mt-0.5">
                    {s.description}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TailoringLoadingScreen;
