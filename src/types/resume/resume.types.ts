// ==================== DATA INTERFACES ====================

export type SkillLevel =
  | "beginner"
  | "amateur"
  | "competent"
  | "proficient"
  | "expert"
  | null;

export type LanguageLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "fluent"
  | "native"
  | null;

export interface ProfileLink {
  id?: string;
  name: string;
  url: string;
}

export interface ProfileData {
  profile_picture: string;
  first_name: string;
  last_name: string;
  professional_title: string;
  email: string;
  phone: string;
  location: string;
  links: ProfileLink[];
  summary: string;
}

export interface EducationData {
  degree: string;
  institution: string;
  score: string;
  location: string;
  start_date: string | null;
  end_date: string | null;
  link: string;
  description: string | string[];
}

export interface ExperienceData {
  position: string;
  company: string;
  location: string;
  start_date: string | null;
  end_date: string | null;
  description: string | string[];
}

export interface ProjectData {
  title: string;
  subtitle: string;
  link: string;
  start_date: string | null;
  end_date: string | null;
  description: string | string[];
}

export interface CertificateData {
  name: string;
  issuer: string;
  issue_date: string | null;
  expiry_date: string | null;
  link: string;
  description: string;
}

export interface SkillData {
  name: string;
  level: SkillLevel;
}

export interface LanguageData {
  name: string;
  level: LanguageLevel;
}

export interface InterestData {
  name: string;
}

export interface AwardData {
  title: string;
  awarder: string;
  date: string | null;
  description: string;
}

export interface PublicationData {
  title: string;
  publisher: string;
  date: string | null;
  link: string;
  description: string;
}

export interface ReferenceData {
  name: string;
  position: string;
  organization: string;
  email: string;
  phone: string;
}

export interface ResumeData {
  profile: {
    profile_picture: string;
    first_name: string;
    last_name: string;
    professional_title: string;
    email: string;
    phone: string;
    location: string;
    links: ProfileLink[];
    summary: string;
  };
  education: EducationData[];
  experience: ExperienceData[];
  projects: ProjectData[];
  certificates: CertificateData[];
  skills: SkillData[];
  languages: LanguageData[];
  interests: InterestData[];
  awards: AwardData[];
  publications: PublicationData[];
  references: ReferenceData[];
}

/*+


types
- ResumeData
- TailoringSession
- ResumeChanges

parse -> base_data(ResumeData)

base_data -> AI engine -> tailor_session(analysis, changes)(TailoringSession)
                           changes(ResumeChanges)


                           
                            
*/
