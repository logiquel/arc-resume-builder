import axios from "axios";
import { apiClient } from "#/api/apiClient";
import type { ApiResponse, ApiSuccessResponse } from "#/lib/api-response";
import type {
  CreateTailoredResumePayload,
  TailoredResume,
  TailoredResumeListItem,
} from "./tailor-resume.types";

export const tailoredResumeService = {
  create: async (
    payload: CreateTailoredResumePayload,
  ): Promise<ApiSuccessResponse<TailoredResume>> => {
    try {
      const { data: result } = await apiClient.post<
        ApiResponse<TailoredResume>
      >("/api/tailored-resumes", payload);

      if (!result.success) {
        throw new Error(result.error.details[0] || result.message);
      }

      return result; // Returns snake_case data directly from backend
    } catch (error: unknown) {
      if (axios.isAxiosError<ApiResponse<TailoredResume>>(error)) {
        const result = error.response?.data;

        if (result && !result.success) {
          throw new Error(result.error.details[0] || result.message);
        }

        throw new Error(error.message || "Failed to create tailored resume");
      }

      if (error instanceof Error) {
        throw new Error(error.message);
      }

      throw new Error("Failed to create tailored resume");
    }
  },

  getAll: async (): Promise<ApiSuccessResponse<TailoredResumeListItem[]>> => {
    try {
      const { data: result } = await apiClient.get<
        ApiResponse<TailoredResumeListItem[]>
      >("/api/tailored-resumes");

      if (!result.success) {
        throw new Error(result.error.details[0] || result.message);
      }

      return result;
    } catch (error: unknown) {
      if (axios.isAxiosError<ApiResponse<TailoredResumeListItem[]>>(error)) {
        const result = error.response?.data;

        if (result && !result.success) {
          throw new Error(result.error.details[0] || result.message);
        }

        throw new Error(error.message || "Failed to fetch tailored resumes");
      }

      if (error instanceof Error) {
        throw new Error(error.message);
      }

      throw new Error("Failed to fetch tailored resumes");
    }
  },

  getById: async (
    tailoredResumeId: string,
  ): Promise<ApiSuccessResponse<TailoredResume>> => {
    try {
      const { data: result } = await apiClient.get<ApiResponse<TailoredResume>>(
        `/api/tailored-resumes/${tailoredResumeId}`,
      );

      if (!result.success) {
        throw new Error(result.error.details[0] || result.message);
      }

      return result;
    } catch (error: unknown) {
      if (axios.isAxiosError<ApiResponse<TailoredResume>>(error)) {
        const result = error.response?.data;

        if (result && !result.success) {
          throw new Error(result.error.details[0] || result.message);
        }

        throw new Error(error.message || "Failed to fetch tailored resume");
      }

      if (error instanceof Error) {
        throw new Error(error.message);
      }

      throw new Error("Failed to fetch tailored resume");
    }
  },
};
