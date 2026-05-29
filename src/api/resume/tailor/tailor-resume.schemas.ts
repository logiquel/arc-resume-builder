import type { TailoringSession } from "#/types/resume/tailorSession.types";

export type CreateTailoredResumeRequest = {
  baseResumeId: string;
  jd: string;
};

export type TailoredResume = {
  id: string;
  userId: string;
  baseResumeId: string;
  name: string;
  analysis: TailoringSession["analysis"];
  changes: TailoringSession["changes"];
  createdAt: string;
  updatedAt: string;
};

export type TailoredResumeListItem = {
  id: string;
  name: string;
  baseResumeId: string;
  analysis: TailoringSession["analysis"];
  createdAt: string;
  updatedAt: string;
};
