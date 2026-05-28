import type {
  AwardData,
  CertificateData,
  EducationData,
  ExperienceData,
  InterestData,
  LanguageData,
  LanguageLevel,
  ProfileData,
  ProjectData,
  PublicationData,
  ReferenceData,
  ResumeData, // This is sample format of base_data
  SkillData,
  SkillLevel,
} from "#/types/resume/resume.types";

export type DiffFormat = "text" | "para" | "bullet_points";
export type DiffMode = "inline" | "structural";
export type DiffStatus = "pending" | "accepted" | "rejected";

export interface DiffField<T> {
  old_value: T;
  new_value: T;
  old_format: DiffFormat;
  new_format: DiffFormat;
  diff_mode: DiffMode;
  status: DiffStatus;
  resolved_value?: T;
}

export type MaybeDiffField<T> = T | DiffField<T>;

export interface TailoringSessionAnalysis {
  score: number;
  matched_keywords: string[];
  missing_keywords: string[];
  keyword_coverage: number;
  summary: string;
}

export interface TailoringSession {
  id: string;
  user_id: string;
  base_resume_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  analysis: TailoringSessionAnalysis;
  changes: ResumeChanges;
}

export interface ResumeChanges {
  profile: ProfileChanges;
  education: EducationEntryChange[];
  experience: ExperienceEntryChange[];
  projects: ProjectEntryChange[];
  certificates: CertificateEntryChange[];
  skills: SkillEntryChange[];
  languages: LanguageEntryChange[];
  interests: InterestEntryChange[];
  awards: AwardEntryChange[];
  publications: PublicationEntryChange[];
  references: ReferenceEntryChange[];
}

export interface ProfileLinkChange {
  name: string;
  url: string;
}

export interface ProfileChanges {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  location: string;
  links: ProfileLinkChange[];
  professional_title?: DiffField<string>;
  summary?: DiffField<string>;
}

export interface EducationEntryChange {
  entry_id: string;
  institution: string;
  location: string;
  start_date: string | null;
  end_date: string | null;
  link: string;
  degree?: DiffField<string>;
  score: string;
  description?: DiffField<string | string[]>;
}

export interface ExperienceEntryChange {
  entry_id: string;
  company: string;
  location: string;
  start_date: string | null;
  end_date: string | null;
  position?: DiffField<string>;
  description?: DiffField<string | string[]>;
}

export interface ProjectEntryChange {
  entry_id: string;
  title: string;
  link: string;
  start_date: string | null;
  end_date: string | null;
  subtitle?: DiffField<string>;
  description?: DiffField<string | string[]>;
}

export interface CertificateEntryChange {
  entry_id: string;
  issuer: string;
  issue_date: string | null;
  expiry_date: string | null;
  link: string;
  name?: DiffField<string>;
  description?: DiffField<string>;
}

export interface SkillEntryChange {
  entry_id: string;
  name: MaybeDiffField<string>;
  level: SkillLevel;
}

export interface LanguageEntryChange extends LanguageData {
  entry_id: string;
}

export interface InterestEntryChange extends InterestData {
  entry_id: string;
}

export interface AwardEntryChange {
  entry_id: string;
  awarder: string;
  date: string | null;
  title?: DiffField<string>;
  description?: DiffField<string>;
}

export interface PublicationEntryChange {
  entry_id: string;
  publisher: string;
  date: string | null;
  link: string;
  title?: DiffField<string>;
  description?: DiffField<string>;
}

export interface ReferenceEntryChange extends ReferenceData {
  entry_id: string;
}

export type ResolvedProfileData = ProfileData;
export type ResolvedEducationData = EducationData;
export type ResolvedExperienceData = ExperienceData;
export type ResolvedProjectData = ProjectData;
export type ResolvedCertificateData = CertificateData;
export type ResolvedSkillData = SkillData;
export type ResolvedLanguageData = LanguageData;
export type ResolvedInterestData = InterestData;
export type ResolvedAwardData = AwardData;
export type ResolvedPublicationData = PublicationData;
export type ResolvedReferenceData = ReferenceData;
export type ResolvedResumeData = ResumeData; // This is the type of data that will be used in previewing and downloading resume. Changes from tailoringSession will be converted to this format on fly using convertor function.
