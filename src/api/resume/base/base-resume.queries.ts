import { useQuery } from "@tanstack/react-query";
import { baseResumeService } from "./base-resume.services";

export const useFetchBaseResumeList = () => {
  return useQuery({
    queryKey: ["base-resume", "list"],
    queryFn: async () => {
      const response = await baseResumeService.getAll();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useFetchBaseResumeById = (resumeId: string | null) => {
  return useQuery({
    queryKey: ["base-resume", "detail", resumeId],
    queryFn: async () => {
      const response = await baseResumeService.getById(resumeId as string);
      return response.data;
    },
    enabled: !!resumeId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
