import ATSClassicTemplate from "#/components/templates/ATSClassicTemplate";
import ATSModernTemplate from "#/components/templates/ATSModernTemplate";
import DualityTemplate from "#/components/templates/DualityTemplate";

export interface TemplateProps {
  data: any; // The tailored resume data
  sessionId: string;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  thumbnail: string; // URL or import path to thumbnail image
  component: React.ComponentType<TemplateProps>;
}

export enum TemplateId {
  ATSCLASSIC = "ats-classic",
  ATSMODERN = "ats-modern",
  DUALITYTWOCOL = "duality-two-col",
}

export const TEMPLATES: Record<TemplateId, ResumeTemplate> = {
  [TemplateId.ATSCLASSIC]: {
    id: TemplateId.ATSCLASSIC,
    name: "ATS Classic",
    thumbnail: "/resume_templates/ats_classic_template_thumbnail.png",
    component: ATSClassicTemplate,
  },
  [TemplateId.ATSMODERN]: {
    id: TemplateId.ATSMODERN,
    name: "ATS Modern",
    thumbnail: "/resume_templates/ats_modern_template_thumbnail.png",
    component: ATSModernTemplate,
  },
  [TemplateId.DUALITYTWOCOL]: {
    id: TemplateId.DUALITYTWOCOL,
    name: "Duality Two Column",
    thumbnail: "/resume_templates/duality_two_col_template_thumbnail.png",
    component: DualityTemplate,
  },
};

export const TEMPLATES_LIST = Object.values(TEMPLATES);

// Helper function to get template by ID
export const getTemplateById = (id: string): ResumeTemplate | undefined => {
  return TEMPLATES[id as TemplateId];
};

// Helper function to validate if template ID exists
export const isValidTemplateId = (id: string): id is TemplateId => {
  return Object.values(TemplateId).includes(id as TemplateId);
};
