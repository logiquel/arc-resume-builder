import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastManager } from "#/components/addons/toast";
import { baseResumeService } from "./base-resume.services";
import type {
  CreateBaseResumePayload,
  DeleteBaseResumePayload,
} from "./base-resume.types";

export function useCreateBaseResumeMutation() {
  const queryClient = useQueryClient();
  const toastId = React.useRef("");

  return useMutation({
    mutationFn: (payload: CreateBaseResumePayload) =>
      baseResumeService.create(payload),

    onMutate: () => {
      toastId.current = toastManager.add({
        title: "Creating base resume…",
        description: "Please wait while we save your resume.",
        type: "loading",
        timeout: 0,
      });
    },

    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: ["base-resume"],
      });

      toastManager.update(toastId.current, {
        title: "Base resume created",
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

export function useDeleteBaseResumeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeleteBaseResumePayload) =>
      baseResumeService.delete(payload.resumeId),

    onSuccess: async () => {
      // Invalidate and refetch base resumes list
      await queryClient.invalidateQueries({
        queryKey: ["base-resumes"],
      });
    },

    onError: (error: Error) => {
      // Just log the error, UI will handle showing error state
      console.error("[DELETE_BASE_RESUME_ERROR]:", error.message);
    },
  });
}
