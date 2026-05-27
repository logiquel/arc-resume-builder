import pdfParse from "pdf-parse-new";
import mammoth from "mammoth";
import { base_data } from "#/data/base_resume_data";
import type { ResumeData } from "#/types/resume/resume.types";

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

export async function buildBaseResumeData() {
  return base_data as ResumeData;
}
