import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastManager } from "#/components/addons/toast";
import { tailoredResumeService } from "./tailor-resume.services";
import type { CreateTailoredResumePayload, UpdateTailoredResumePayload } from "./tailor-resume.types";

export function useCreateTailoredResumeMutation() {
  const queryClient = useQueryClient();
  const toastId = React.useRef("");

  return useMutation({
    mutationFn: (payload: CreateTailoredResumePayload) =>
      tailoredResumeService.create(payload),

    onMutate: () => {
      toastId.current = toastManager.add({
        title: "Creating tailored resume…",
        description: "Please wait while we tailor your resume.",
        type: "loading",
        timeout: 0,
      });
    },

    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: ["tailored-resume"],
      });

      toastManager.update(toastId.current, {
        title: "Tailored resume created",
        description: response.message,
        type: "success",
        timeout: 3000,
      });
    },

    onError: (error: any) => {
      toastManager.update(toastId.current, {
        title: "Create failed",
        description:
          error?.message || "Something went wrong. Please try again.",
        type: "error",
        timeout: 3000,
        data: { showClose: true },
      });
    },
  });
}

// Auto-save mutation 
export function useAutoSaveTailoredResumeMutation(sessionId: string) {
  const queryClient = useQueryClient();
  const mutationQueue = React.useRef<Promise<void>>(Promise.resolve());

  return useMutation({
    mutationFn: (payload: UpdateTailoredResumePayload) =>
      tailoredResumeService.update(sessionId, payload),

    onMutate: async (payload) => {
      // Queue mutations to avoid race conditions
      const previousMutation = mutationQueue.current;

      mutationQueue.current = previousMutation.then(async () => {
        await queryClient.cancelQueries({
          queryKey: ["tailored-resume", sessionId],
        });

        // Optimistic update
        queryClient.setQueryData(
          ["tailored-resume", sessionId],
          (old: any) => ({
            ...old,
            ...payload,
            updated_at: new Date().toISOString(),
          }),
        );
      });

      await mutationQueue.current;
    },

    onError: (error: any, payload) => {
      // Silent error - just log
      console.error("[AUTO_SAVE_ERROR]:", error);

      // Refetch to ensure consistency
      queryClient.invalidateQueries({
        queryKey: ["tailored-resume", sessionId],
      });
    },
  });
}

