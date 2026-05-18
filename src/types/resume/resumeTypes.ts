
// ==================== DATA INTERFACES ====================

export interface ProfileLink {
  id?: string;
  name: string;
  value: string;
  icon: string;
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
  description: string;
}

export interface ExperienceData {
  position: string;
  company: string;
  location: string;
  start_date: string | null;
  end_date: string | null;
  description: string;
}

export interface ProjectData {
  title: string;
  subtitle: string;
  link: string;
  start_date: string | null;
  end_date: string | null;
  description: string;
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
  level: string; // beginner | amateur | competent | proficient | expert
}

export interface LanguageData {
  name: string;
  level: string; // beginner | intermediate | advanced | fluent | native
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
