// src/hooks/useTailoringSessionRealtime.ts
import type { TailoringGenerationStep } from "#/types/resume/tailorSession.types";
import { createClient } from "#/utils/supabase/server";
import { useEffect, useState } from "react";

export function useTailoringSessionRealtime(
  sessionId: string,
  initialStep: TailoringGenerationStep,
  onCompleted: () => void,
) {
  const supabase = createClient();
  const [currentStep, setCurrentStep] =
    useState<TailoringGenerationStep>(initialStep);

  useEffect(() => {
    if (initialStep === "COMPLETED" || initialStep === "FAILED") return;

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
          const newStep = payload.new
            ?.generation_step as TailoringGenerationStep;
          if (newStep) {
            setCurrentStep(newStep);
            if (newStep === "COMPLETED") {
              onCompleted();
            }
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, initialStep, onCompleted, supabase]);

  return { currentStep };
}
