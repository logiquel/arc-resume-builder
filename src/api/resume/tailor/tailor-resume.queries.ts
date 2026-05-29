import { useQuery } from "@tanstack/react-query";
import { tailoredResumeService } from "./tailor-resume.services";

export const useFetchTailoredResumeList = () => {
  return useQuery({
    queryKey: ["tailored-resume", "list"],
    queryFn: async () => {
      const response = await tailoredResumeService.getAll();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useFetchTailoredResumeById = (tailoredResumeId: string | null) => {
  return useQuery({
    queryKey: ["tailored-resume", "detail", tailoredResumeId],
    queryFn: async () => {
      const response = await tailoredResumeService.getById(
        tailoredResumeId as string,
      );
      return response.data;
    },
    enabled: !!tailoredResumeId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
