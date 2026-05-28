import pdfParse from "pdf-parse-new";
import mammoth from "mammoth";
import OpenAI from "openai";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";
import type { ResumeData } from "#/types/resume/resume.types";
import {
  BUILD_BASE_RESUME_SYSTEM_PROMPT,
  buildBaseResumeUserPrompt,
} from "#/lib/prompts/resume.prompts";

const PDF_MIME_TYPE = "application/pdf";
const DOCX_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export type ExtractedResumeContent = {
  fileName: string;
  mimeType: string;
  text: string;
};

export async function extractResumeContent(
  file: File,
): Promise<ExtractedResumeContent> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  let text = "";

  switch (file.type) {
    case PDF_MIME_TYPE: {
      const result = await pdfParse(buffer);
      text = result.text ?? "";
      break;
    }

    case DOCX_MIME_TYPE: {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value ?? "";
      break;
    }

    default:
      throw new Error("Unsupported file type. Only PDF and DOCX are allowed.");
  }

  const normalizedText = normalizeExtractedText(text);

  if (!normalizedText) {
    throw new Error(
      "Could not extract readable content from the uploaded file.",
    );
  }

  return {
    fileName: file.name,
    mimeType: file.type,
    text: normalizedText,
  };
}

function normalizeExtractedText(text: string) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const nullDateSchema = z.union([z.string(), z.null()]);
const nullStringSchema = z.union([z.string(), z.null()]);
const descriptionSchema = z.union([z.string(), z.array(z.string())]);

const skillLevelSchema = z.union([
  z.enum(["beginner", "amateur", "competent", "proficient", "expert"]),
  z.null(),
]);

const languageLevelSchema = z.union([
  z.enum(["beginner", "intermediate", "advanced", "fluent", "native"]),
  z.null(),
]);

const profileLinkSchema = z.object({
  id: nullStringSchema,
  name: z.string(),
  url: z.string(),
});

const resumeDataSchema = z.object({
  profile: z.object({
    profile_picture: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    professional_title: z.string(),
    email: z.string(),
    phone: z.string(),
    location: z.string(),
    links: z.array(profileLinkSchema),
    summary: z.string(),
  }),
  education: z.array(
    z.object({
      degree: z.string(),
      institution: z.string(),
      score: z.string(),
      location: z.string(),
      start_date: nullDateSchema,
      end_date: nullDateSchema,
      link: z.string(),
      description: descriptionSchema,
    }),
  ),
  experience: z.array(
    z.object({
      position: z.string(),
      company: z.string(),
      location: z.string(),
      start_date: nullDateSchema,
      end_date: nullDateSchema,
      description: descriptionSchema,
    }),
  ),
  projects: z.array(
    z.object({
      title: z.string(),
      subtitle: z.string(),
      link: z.string(),
      start_date: nullDateSchema,
      end_date: nullDateSchema,
      description: descriptionSchema,
    }),
  ),
  certificates: z.array(
    z.object({
      name: z.string(),
      issuer: z.string(),
      issue_date: nullDateSchema,
      expiry_date: nullDateSchema,
      link: z.string(),
      description: z.string(),
    }),
  ),
  skills: z.array(
    z.object({
      name: z.string(),
      level: skillLevelSchema,
    }),
  ),
  languages: z.array(
    z.object({
      name: z.string(),
      level: languageLevelSchema,
    }),
  ),
  interests: z.array(
    z.object({
      name: z.string(),
    }),
  ),
  awards: z.array(
    z.object({
      title: z.string(),
      awarder: z.string(),
      date: nullDateSchema,
      description: z.string(),
    }),
  ),
  publications: z.array(
    z.object({
      title: z.string(),
      publisher: z.string(),
      date: nullDateSchema,
      link: z.string(),
      description: z.string(),
    }),
  ),
  references: z.array(
    z.object({
      name: z.string(),
      position: z.string(),
      organization: z.string(),
      email: z.string(),
      phone: z.string(),
    }),
  ),
});

function normalizeDescription(value: string | string[]): string | string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => item.trim())
      .filter(Boolean)
      .map(stripBulletMarker);
  }

  const text = value.trim();

  if (!text) return "";

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const bulletLines = lines.filter(isBulletLine);

  if (bulletLines.length >= 2) {
    return bulletLines.map(stripBulletMarker).filter(Boolean);
  }

  return text;
}

function isBulletLine(line: string) {
  return /^(?:[•*-]|\d+\.)\s+/.test(line);
}

function stripBulletMarker(line: string) {
  return line.replace(/^(?:[•*-]|\d+\.)\s+/, "").trim();
}

function normalizeResumeDataDescriptions(data: ResumeData): ResumeData {
  return {
    ...data,
    education: data.education.map((item) => ({
      ...item,
      description: normalizeDescription(item.description),
    })),
    experience: data.experience.map((item) => ({
      ...item,
      description: normalizeDescription(item.description),
    })),
    projects: data.projects.map((item) => ({
      ...item,
      description: normalizeDescription(item.description),
    })),
  };
}

export async function buildBaseResumeData(
  parsedData: ExtractedResumeContent,
): Promise<ResumeData> {
  const response = await openai.responses.parse({
    model: "gpt-4o-mini",
    input: [
      {
        role: "system",
        content: BUILD_BASE_RESUME_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: buildBaseResumeUserPrompt(parsedData),
      },
    ],
    text: {
      format: zodTextFormat(resumeDataSchema, "resume_data"),
    },
  });

  const parsed = response.output_parsed;

  if (!parsed) {
    throw new Error("Failed to build structured resume data.");
  }

  const normalized = normalizeResumeDataDescriptions(parsed as ResumeData);

  console.log(
    "[OPENAI_TOKEN_USAGE]",
    JSON.stringify(
      {
        model: response.model,
        response_id: response.id,
        input_tokens: response.usage?.input_tokens ?? 0,
        output_tokens: response.usage?.output_tokens ?? 0,
        total_tokens: response.usage?.total_tokens ?? 0,
        input_tokens_details: response.usage?.input_tokens_details ?? null,
        output_tokens_details: response.usage?.output_tokens_details ?? null,
      },
      null,
      2,
    ),
  );

  console.log("[BASE_RESUME_DATA]", JSON.stringify(normalized, null, 2));

  return normalized;
}
