import type { TailoringSession } from "#/types/resume/tailorSession.types";

export type CreateTailoredResumePayload = {
  base_resume_id: string;
  job_description: string;
  name: string;
};

export type TailoredResume = {
  id: string;
  user_id: string;
  base_resume_id: string;
  name: string;
  template_id?: string;
  generation_step: TailoringSession["generation_step"];
  analysis: TailoringSession["analysis"];
  changes: TailoringSession["changes"];
  created_at: string;
  updated_at: string;
};

export type TailoredResumeListItem = {
  id: string;
  name: string;
  base_resume_id: string;
  template_id?: string;
  analysis: TailoringSession["analysis"];
  created_at: string;
  updated_at: string;
};

export interface UpdateTailoredResumePayload {
  changes?: any; // ResumeChanges type
  analysis?: any; // TailoringSessionAnalysis type
  name?: string;
  generation_step?: string;
  showToast?: boolean; // Optional: whether to show success/error toasts
  template_id?: string;
}
