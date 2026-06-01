import { createFileRoute } from "@tanstack/react-router";
import { errorResponse, successResponse } from "#/lib/api-response";
import type { ResumeData } from "#/types/resume/resume.types";
import {
  buildBaseResumeData,
  extractResumeContent,
} from "#/api/resume/base/base_resume.utils";
import { requireAuthMiddleware } from "#/lib/require-auth.middleware";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const Route = createFileRoute("/api/base-resume/")({
  server: {
    middleware: [requireAuthMiddleware],
    handlers: ({ createHandlers }) =>
      createHandlers({
        GET: async ({ context }) => {
          try {
            const { supabase, user } = context;

            const { data, error } = await supabase
              .from("base_resumes")
              .select("id, name, created_at, updated_at")
              .eq("user_id", user.id)
              .order("updated_at", { ascending: false });

            if (error) {
              return errorResponse(
                500,
                "Failed to fetch base resumes",
                "BASE_RESUME_LIST_FETCH_FAILED",
                [error.message],
              );
            }

            return successResponse(
              200,
              "Base resumes fetched successfully.",
              data ?? [],
            );
          } catch (error) {
            console.error("[BASE_RESUME_LIST_GET_ERROR]:", error);

            return errorResponse(
              500,
              "Internal server error",
              "INTERNAL_SERVER_ERROR",
              ["Something went wrong while fetching base resumes."],
            );
          }
        },

        POST: async ({ request, context }) => {
          try {
            const { supabase, user } = context;
            const formData = await request.formData();

            const nameValue = formData.get("name");
            const fileValue = formData.get("file");
            const baseDataValue = formData.get("baseData");

            const name = typeof nameValue === "string" ? nameValue.trim() : "";

            if (!name) {
              return errorResponse(
                400,
                "Validation failed",
                "VALIDATION_ERROR",
                ["Resume name is required."],
              );
            }

            const hasFile = fileValue instanceof File && fileValue.size > 0;
            const hasBaseData =
              typeof baseDataValue === "string" &&
              baseDataValue.trim().length > 0;

            if (!hasFile && !hasBaseData) {
              return errorResponse(
                400,
                "Validation failed",
                "INVALID_CREATE_MODE",
                ["Provide either a resume file or baseData."],
              );
            }

            if (hasFile && hasBaseData) {
              return errorResponse(
                400,
                "Validation failed",
                "INVALID_CREATE_MODE",
                ["Provide only one input: file or baseData."],
              );
            }

            let finalBaseData: ResumeData;

            if (hasFile && fileValue instanceof File) {
              if (fileValue.size > MAX_FILE_SIZE_BYTES) {
                return errorResponse(
                  400,
                  "Validation failed",
                  "FILE_TOO_LARGE",
                  ["Resume file must be smaller than 5 MB."],
                );
              }

              if (!ALLOWED_FILE_TYPES.includes(fileValue.type)) {
                return errorResponse(
                  400,
                  "Validation failed",
                  "INVALID_FILE_TYPE",
                  ["Only PDF and DOCX files are supported."],
                );
              }

              const parsedData = await extractResumeContent(fileValue);
              finalBaseData = await buildBaseResumeData(parsedData);
            } else {
              try {
                finalBaseData = JSON.parse(
                  baseDataValue as string,
                ) as ResumeData;
              } catch {
                return errorResponse(
                  400,
                  "Validation failed",
                  "INVALID_BASE_DATA",
                  ["baseData must be valid JSON."],
                );
              }
            }

            const { error } = await supabase.from("base_resumes").insert({
              user_id: user.id,
              name,
              base_data: finalBaseData,
            });

            if (error) {
              return errorResponse(
                500,
                "Failed to create base resume",
                "BASE_RESUME_CREATE_FAILED",
                [error.message],
              );
            }

            // Return success response without data
            return successResponse(
              201,
              "Base resume created successfully.",
              null, // or undefined
            );
          } catch (error) {
            console.error("[BASE_RESUME_CREATE_ERROR]:", error);

            return errorResponse(
              500,
              "Internal server error",
              "INTERNAL_SERVER_ERROR",
              ["Something went wrong while creating the base resume."],
            );
          }
        },
      }),
  },
});
