import OpenAI from "openai";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";
import type { ResumeData } from "#/types/resume/resume.types";
import type {
  TailoringSessionAnalysis,
  ResumeChanges,
} from "#/types/resume/tailorSession.types";
import {
  ANALYZE_JD_SYSTEM_PROMPT,
  buildJdAnalysisUserPrompt,
  BUILD_TAILORED_RESUME_SYSTEM_PROMPT,
  buildTailoredResumeUserPrompt,
} from "#/lib/prompts/tailor-resume.prompts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * ==========================================
 * ZOD SCHEMA SCHEMATICS FOR STEP 2 (JD ANALYSIS)
 * ==========================================
 */
const jdAnalysisOutputSchema = z.object({
  role_title: z.string(),
  domain_track: z.enum([
    "Frontend",
    "Backend",
    "Full-Stack",
    "DevOps",
    "Mobile",
  ]),
  core_hard_skills: z.array(z.string()),
  methodologies_and_architecture: z.array(z.string()),
  soft_skills_and_context: z.array(z.string()),
  high_priority_keywords: z.array(z.string()),
});

/**
 * ==========================================
 * ZOD SCHEMA SCHEMATICS FOR STEP 3 (TAILORING MATCH)
 * ==========================================
 */
const diffFormatSchema = z.enum(["text", "para", "bullet_points"]);
const diffModeSchema = z.enum(["inline", "structural", "inline_bullets"]);
const diffStatusSchema = z.literal("pending");

const stringDiffFieldSchema = z.object({
  old_value: z.string(),
  new_value: z.string(),
  old_format: diffFormatSchema,
  new_format: diffFormatSchema,
  diff_mode: diffModeSchema,
  status: diffStatusSchema,
  is_changed: z.boolean(),
});

const stringOrStringArrayDiffFieldSchema = z.object({
  old_value: z.union([z.string(), z.array(z.string())]),
  new_value: z.union([z.string(), z.array(z.string())]),
  old_format: diffFormatSchema,
  new_format: diffFormatSchema,
  diff_mode: diffModeSchema,
  status: diffStatusSchema,
  is_changed: z.boolean(),
});

const profileLinkChangeSchema = z.object({
  name: z.string(),
  url: z.string(),
});

const profileChangesSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  links: z.array(profileLinkChangeSchema),
  professional_title: stringDiffFieldSchema,
  summary: stringDiffFieldSchema,
});

const educationEntryChangeSchema = z.object({
  entry_id: z.string(),
  institution: z.string(),
  location: z.string(),
  start_date: z.union([z.string(), z.null()]),
  end_date: z.union([z.string(), z.null()]),
  link: z.string(),
  score: z.string(),
  degree: stringDiffFieldSchema,
  description: stringOrStringArrayDiffFieldSchema,
});

const experienceEntryChangeSchema = z.object({
  entry_id: z.string(),
  company: z.string(),
  location: z.string(),
  start_date: z.union([z.string(), z.null()]),
  end_date: z.union([z.string(), z.null()]),
  position: stringDiffFieldSchema,
  description: stringOrStringArrayDiffFieldSchema,
});

const projectEntryChangeSchema = z.object({
  entry_id: z.string(),
  title: z.string(),
  link: z.string(),
  start_date: z.union([z.string(), z.null()]),
  end_date: z.union([z.string(), z.null()]),
  subtitle: stringDiffFieldSchema,
  description: stringOrStringArrayDiffFieldSchema,
});

const certificateEntryChangeSchema = z.object({
  entry_id: z.string(),
  issuer: z.string(),
  issue_date: z.union([z.string(), z.null()]),
  expiry_date: z.union([z.string(), z.null()]),
  link: z.string(),
  name: stringDiffFieldSchema,
  description: stringDiffFieldSchema,
});

const skillLevelSchema = z.union([
  z.enum(["beginner", "amateur", "competent", "proficient", "expert"]),
  z.null(),
]);

const skillEntryChangeSchema = z.object({
  entry_id: z.string(),
  name: stringDiffFieldSchema,
  level: skillLevelSchema,
});

const languageLevelSchema = z.union([
  z.enum(["beginner", "intermediate", "advanced", "fluent", "native"]),
  z.null(),
]);

const languageEntryChangeSchema = z.object({
  entry_id: z.string(),
  name: z.string(),
  level: languageLevelSchema,
});

const interestEntryChangeSchema = z.object({
  entry_id: z.string(),
  name: z.string(),
});

const awardEntryChangeSchema = z.object({
  entry_id: z.string(),
  awarder: z.string(),
  date: z.union([z.string(), z.null()]),
  title: stringDiffFieldSchema,
  description: stringDiffFieldSchema,
});

const publicationEntryChangeSchema = z.object({
  entry_id: z.string(),
  publisher: z.string(),
  date: z.union([z.string(), z.null()]),
  link: z.string(),
  title: stringDiffFieldSchema,
  description: stringDiffFieldSchema,
});

const referenceEntryChangeSchema = z.object({
  entry_id: z.string(),
  name: z.string(),
  position: z.string(),
  organization: z.string(),
  email: z.string(),
  phone: z.string(),
});

const tailoringSessionAnalysisSchema = z.object({
  base_score: z.number().min(0).max(100),
  current_score: z.number().min(0).max(100),
  matched_keywords: z.array(z.string()),
  missing_keywords: z.array(z.string()),
  keyword_coverage: z.number().min(0).max(100),
  summary: z.string(),
});

const resumeChangesSchema = z.object({
  profile: profileChangesSchema,
  education: z.array(educationEntryChangeSchema),
  experience: z.array(experienceEntryChangeSchema),
  projects: z.array(projectEntryChangeSchema),
  certificates: z.array(certificateEntryChangeSchema),
  skills: z.array(skillEntryChangeSchema),
  languages: z.array(languageEntryChangeSchema),
  interests: z.array(interestEntryChangeSchema),
  awards: z.array(awardEntryChangeSchema),
  publications: z.array(publicationEntryChangeSchema),
  references: z.array(referenceEntryChangeSchema),
});

const tailoredResumeOutputSchema = z.object({
  name: z.string(),
  analysis: tailoringSessionAnalysisSchema,
  changes: resumeChangesSchema,
});

/**
 * EXECUTABLE ORCHESTRATION PIPELINE
 * Call individual steps to update progress checkpoints smoothly on the frontend
 */
export async function analyzeJobDescription(jd: string) {
  const response = await openai.responses.parse({
    model: "gpt-4o-mini",
    input: [
      { role: "system", content: ANALYZE_JD_SYSTEM_PROMPT },
      { role: "user", content: buildJdAnalysisUserPrompt(jd) },
    ],
    text: {
      format: zodTextFormat(jdAnalysisOutputSchema, "jd_analysis_output"),
    },
  });

  const parsed = response.output_parsed;
  if (!parsed) throw new Error("Failed to parse Job Description parameters.");
  return parsed;
}

export async function buildTailoringSessionData({
  jdAnalysis,
  baseData,
}: {
  jdAnalysis: any; // Resulting payload structured from analyzeJobDescription
  baseData: ResumeData;
}): Promise<{
  name: string;
  analysis: TailoringSessionAnalysis;
  changes: ResumeChanges;
}> {
  const response = await openai.responses.parse({
    model: "gpt-4o-mini", // Ready to switch seamlessly to any structural model or tier
    input: [
      {
        role: "system",
        content: BUILD_TAILORED_RESUME_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: buildTailoredResumeUserPrompt({
          jdAnalysis,
          baseData,
        }),
      },
    ],
    text: {
      format: zodTextFormat(
        tailoredResumeOutputSchema,
        "tailored_resume_output",
      ),
    },
  });

  const parsed = response.output_parsed;

  if (!parsed) {
    throw new Error("Failed to build tailored resume data.");
  }

  console.log(
    "OPENAI_TOKEN_USAGE",
    JSON.stringify(
      {
        model: response.model,
        response_id: response.id,
        input_tokens: response.usage?.input_tokens ?? 0,
        output_tokens: response.usage?.output_tokens ?? 0,
        total_tokens: response.usage?.total_tokens ?? 0,
      },
      null,
      2,
    ),
  );

  return parsed as {
    name: string;
    analysis: TailoringSessionAnalysis;
    changes: ResumeChanges;
  };
}
