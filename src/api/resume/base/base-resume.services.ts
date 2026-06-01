import axios from "axios";
import { apiClient } from "#/api/apiClient";
import type { ApiResponse, ApiSuccessResponse } from "#/lib/api-response";
import type {
  BaseResume,
  BaseResumeListItem,
  CreateBaseResumePayload,
} from "./base-resume.types";

export const baseResumeService = {
  create: async (
    payload: CreateBaseResumePayload,
  ): Promise<ApiSuccessResponse<null>> => {
    try {
      const formData = new FormData();
      formData.append("name", payload.name);

      if (payload.file) {
        formData.append("file", payload.file);
      }

      if (payload.base_data) {
        formData.append("base_data", JSON.stringify(payload.base_data));
      }

      const { data: result } = await apiClient.post<ApiResponse<null>>(
        "/api/base-resume",
        formData,
      );

      if (!result.success) {
        throw new Error(result.error.details[0] || result.message);
      }

      return result;
    } catch (error: unknown) {
      if (axios.isAxiosError<ApiResponse<null>>(error)) {
        const result = error.response?.data;

        if (result && !result.success) {
          throw new Error(result.error.details[0] || result.message);
        }

        throw new Error(error.message || "Failed to create base resume");
      }

      if (error instanceof Error) {
        throw new Error(error.message);
      }

      throw new Error("Failed to create base resume");
    }
  },

  getAll: async (): Promise<ApiSuccessResponse<BaseResumeListItem[]>> => {
    try {
      const { data: result } =
        await apiClient.get<ApiResponse<BaseResumeListItem[]>>(
          "/api/base-resume",
        );

      if (!result.success) {
        throw new Error(result.error.details[0] || result.message);
      }

      return result;
    } catch (error: unknown) {
      if (axios.isAxiosError<ApiResponse<BaseResumeListItem[]>>(error)) {
        const result = error.response?.data;

        if (result && !result.success) {
          throw new Error(result.error.details[0] || result.message);
        }

        throw new Error(error.message || "Failed to fetch base resumes");
      }

      if (error instanceof Error) {
        throw new Error(error.message);
      }

      throw new Error("Failed to fetch base resumes");
    }
  },

  getById: async (
    resumeId: string,
  ): Promise<ApiSuccessResponse<BaseResume>> => {
    try {
      const { data: result } = await apiClient.get<ApiResponse<BaseResume>>(
        `/api/base-resume/${resumeId}`,
      );

      if (!result.success) {
        throw new Error(result.error.details[0] || result.message);
      }

      return result;
    } catch (error: unknown) {
      if (axios.isAxiosError<ApiResponse<BaseResume>>(error)) {
        const result = error.response?.data;

        if (result && !result.success) {
          throw new Error(result.error.details[0] || result.message);
        }

        throw new Error(error.message || "Failed to fetch base resume");
      }

      if (error instanceof Error) {
        throw new Error(error.message);
      }

      throw new Error("Failed to fetch base resume");
    }
  },
};
