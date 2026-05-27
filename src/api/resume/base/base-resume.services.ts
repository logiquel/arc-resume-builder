import type { ApiResponse, ApiSuccessResponse } from "#/lib/api-response";
import type {
  BaseResume,
  BaseResumeListItem,
  CreateBaseResumeRequest,
} from "./base-resume.schemas";

export const baseResumeService = {
  create: async (
    payload: CreateBaseResumeRequest,
  ): Promise<ApiSuccessResponse<BaseResume>> => {
    const formData = new FormData();
    formData.append("name", payload.name);

    if (payload.file) {
      formData.append("file", payload.file);
    }

    if (payload.baseData) {
      formData.append("baseData", JSON.stringify(payload.baseData));
    }

    const res = await fetch("/api/base-resume", {
      method: "POST",
      body: formData,
    });

    const result: ApiResponse<BaseResume> = await res.json();

    if (!result.success) {
      throw new Error(result.error.details[0] || result.message);
    }

    return result;
  },
  getAll: async (): Promise<ApiSuccessResponse<BaseResumeListItem[]>> => {
    const res = await fetch("/api/base-resume", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const result: ApiResponse<BaseResumeListItem[]> = await res.json();

    if (!result.success) {
      throw new Error(result.error.details[0] || result.message);
    }

    return result;
  },

  getById: async (
    resumeId: string,
  ): Promise<ApiSuccessResponse<BaseResume>> => {
    const res = await fetch(`/api/base-resume/${resumeId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const result: ApiResponse<BaseResume> = await res.json();

    if (!result.success) {
      throw new Error(result.error.details[0] || result.message);
    }

    return result;
  },
};
