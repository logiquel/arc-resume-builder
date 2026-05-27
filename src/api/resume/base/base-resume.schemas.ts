import type { ResumeData } from "#/types/resume/resume.types";

export type CreateBaseResumeRequest = {
  name: string;
  file?: File | null;
  baseData?: ResumeData;
};

export type BaseResume = {
  id: string;
  userId: string;
  name: string;
  baseData: ResumeData;
  createdAt: string;
  updatedAt: string;
};

export type BaseResumeListItem = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};
