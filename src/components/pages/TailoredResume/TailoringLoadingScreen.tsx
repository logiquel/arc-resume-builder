import { useEffect, useRef, useState } from "react";
import type { TailoringGenerationStep } from "#/types/resume/tailorSession.types";
import { supabase } from "#/utils/supabase/client";
import { Icon } from "@iconify/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const TAILORING_STEP_ORDER: TailoringGenerationStep[] = [
  "PLACEHOLDER_CREATED",
  "READING_BASE_DATA",
  "JD_ANALYSIS",
  "TAILORING",
  "FINALIZING",
  "COMPLETED",
];

const TAILORING_STEP_META: Record<
  Exclude<TailoringGenerationStep, "FAILED">,
  { title: string; description: string }
> = {
  PLACEHOLDER_CREATED: {
    title: "Workspace initialized",
    description: "Preparing your tailoring session.",
  },
  READING_BASE_DATA: {
    title: "Reading base resume",
    description: "Loading and parsing the selected resume.",
  },
  JD_ANALYSIS: {
    title: "Analyzing job description",
    description: "Extracting role requirements and important keywords.",
  },
  TAILORING: {
    title: "Tailoring resume",
    description: "Generating targeted improvements for the selected role.",
  },
  FINALIZING: {
    title: "Finalizing output",
    description: "Preparing the session for review.",
  },
  COMPLETED: {
    title: "Completed",
    description: "Tailored resume is ready.",
  },
};

interface TailoringLoadingScreenProps {
  currentStep?: TailoringGenerationStep;
  sessionId: string;
  onComplete?: () => void;
}

const TailoringLoadingScreen = ({
  currentStep = "PLACEHOLDER_CREATED",
  sessionId,
  onComplete,
}: TailoringLoadingScreenProps) => {
  // Set the initial step from the prop on mount
  const [step, setStep] = useState<TailoringGenerationStep>(currentStep);
  const hasTriggeredComplete = useRef(false);

  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase
      .channel(`tailoring-session-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "tailoring_sessions",
          filter: `id=eq.${sessionId}`,
        },
        (payload) => {
          const nextStep = payload.new
            ?.generation_step as TailoringGenerationStep;

          if (nextStep && TAILORING_STEP_ORDER.includes(nextStep)) {
            console.log("[Supabase] Progressing UI state to:", nextStep);
            setStep(nextStep);

            // Trigger onComplete when step becomes COMPLETED
            if (nextStep === "COMPLETED" && !hasTriggeredComplete.current) {
              hasTriggeredComplete.current = true;
              console.log("[TailoringLoadingScreen] Generation completed!");
              onComplete?.();
            }
          }
        },
      )
      .subscribe((status, err) => {
        console.log("[Supabase] Realtime connection status:", status);
        if (err) console.error("[Supabase] Realtime connection error:", err);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, onComplete]); // Add onComplete to dependencies

  const activeStepIndex = TAILORING_STEP_ORDER.indexOf(step);
  return (
    <div className="w-full h-full flex items-center justify-center px-4 py-8 sm:px-6 bg-white">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[minmax(260px,360px)_1fr] gap-8 lg:gap-14 items-center">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="relative flex items-center justify-center w-full max-w-70 sm:max-w-[320px] lg:max-w-90">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(67,139,255,0.18)_0%,rgba(44,118,255,0.10)_28%,rgba(82,189,255,0.08)_45%,transparent_72%)] blur-2xl scale-125" />
            <div className="relative w-full">
              <DotLottieReact
                src="https://lottie.host/d5a00465-8f8b-46a2-a8a9-6dc89960e813/l4Y5Q4hgiY.lottie"
                loop
                autoplay
                speed={0.5}
              />
            </div>
          </div>

          <div className="mt-2 sm:mt-4">
            <h2 className="text-sm text-text-primary font-semibold">
              Creating your tailored resume
            </h2>
            <p className="text-[11px] text-text-muted mt-1 max-w-104">
              We are analyzing the role, matching relevant keywords, and
              refining your experience for a stronger fit.
            </p>
          </div>
        </div>

        <div className="w-full max-w-xl mx-auto lg:mx-0">
          <div className="flex flex-col">
            {TAILORING_STEP_ORDER.map((stepItem, index) => {
              const meta =
                TAILORING_STEP_META[
                  stepItem as keyof typeof TAILORING_STEP_META
                ];
              const isCompleted = index < activeStepIndex;
              const isActive = index === activeStepIndex;
              const isUpcoming = index > activeStepIndex;
              const showConnector = index < TAILORING_STEP_ORDER.length - 1;

              return (
                <div key={stepItem} className="flex flex-col">
                  <div className="flex flex-col">
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        isUpcoming ? "text-text-muted/70" : "text-text-primary"
                      }`}
                    >
                      {isCompleted ? (
                        <Icon
                          icon="pepicons-print:checkmark-circle-filled"
                          className="text-sm text-green-600 shrink-0"
                        />
                      ) : isActive ? (
                        <Icon
                          icon="si:spinner-fill"
                          className="text-sm text-sky-500 animate-spin shrink-0"
                        />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0" />
                      )}

                      {meta.title}
                    </div>

                    <p
                      className={`text-[9px] uppercase pl-6 tracking-widest ${
                        isCompleted
                          ? "text-text-muted"
                          : isActive
                            ? "animate-shine bg-[linear-gradient(120deg,#293056_25%,#3B82F6_50%,#34B6B3_75%)] bg-size-[200%_100%] bg-clip-text text-transparent"
                            : "text-text-muted/45"
                      }`}
                    >
                      {meta.description}
                    </p>
                  </div>

                  {showConnector && (
                    <div className="w-full h-4 pl-[0.42rem] my-1.5">
                      <div
                        className={`h-full w-px ${
                          index < activeStepIndex
                            ? "bg-sky-500/30"
                            : "bg-black/10"
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TailoringLoadingScreen;
