import type { ResumeData } from "#/types/resume/resume.types";

export type CreateBaseResumePayload = {
  name: string;
  file?: File | null;
  base_data?: ResumeData;
};

export type BaseResume = {
  id: string;
  user_id: string;
  name: string;
  base_data: ResumeData;
  created_at: string;
  updated_at: string;
};

export type BaseResumeListItem = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};
