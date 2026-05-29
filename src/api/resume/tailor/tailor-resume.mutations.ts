import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastManager } from "#/components/addons/toast";
import { tailoredResumeService } from "./tailor-resume.services";
import type { CreateTailoredResumeRequest } from "./tailor-resume.schemas";

export function useCreateTailoredResumeMutation() {
  const queryClient = useQueryClient();
  const toastId = React.useRef("");

  return useMutation({
    mutationFn: (payload: CreateTailoredResumeRequest) =>
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
