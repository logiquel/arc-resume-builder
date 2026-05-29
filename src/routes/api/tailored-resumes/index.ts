import { createFileRoute } from "@tanstack/react-router";
import { errorResponse, successResponse } from "#/lib/api-response";
import { requireAuthMiddleware } from "#/lib/require-auth.middleware";
import { buildTailoringSessionData } from "#/api/resume/tailor/tailor-resume.utils";
import type { ResumeData } from "#/types/resume/resume.types";

export const Route = createFileRoute("/api/tailored-resumes/")({
  server: {
    middleware: [requireAuthMiddleware],
    handlers: ({ createHandlers }) =>
      createHandlers({
        GET: async ({ context }) => {
          try {
            const { supabase, user } = context;

            const { data, error } = await supabase
              .from("tailoring_sessions")
              .select(
                "id, name, base_resume_id, analysis, created_at, updated_at",
              )
              .eq("user_id", user.id)
              .order("updated_at", { ascending: false });

            if (error) {
              return errorResponse(
                500,
                "Failed to fetch tailored resumes",
                "TAILORED_RESUME_LIST_FETCH_FAILED",
                [error.message],
              );
            }

            const mappedData =
              data?.map((item) => ({
                id: item.id,
                name: item.name,
                baseResumeId: item.base_resume_id,
                analysis: item.analysis,
                createdAt: item.created_at,
                updatedAt: item.updated_at,
              })) ?? [];

            return successResponse(
              200,
              "Tailored resumes fetched successfully.",
              mappedData,
            );
          } catch (error) {
            console.error("[TAILORED_RESUME_LIST_GET_ERROR]:", error);

            return errorResponse(
              500,
              "Internal server error",
              "INTERNAL_SERVER_ERROR",
              ["Something went wrong while fetching tailored resumes."],
            );
          }
        },

        POST: async ({ request, context }) => {
          try {
            const { supabase, user } = context;
            const body = (await request.json()) as {
              baseResumeId?: string;
              jd?: string;
            };

            const baseResumeId =
              typeof body.baseResumeId === "string"
                ? body.baseResumeId.trim()
                : "";
            const jd = typeof body.jd === "string" ? body.jd.trim() : "";

            if (!baseResumeId) {
              return errorResponse(
                400,
                "Validation failed",
                "VALIDATION_ERROR",
                ["baseResumeId is required."],
              );
            }

            if (!jd) {
              return errorResponse(
                400,
                "Validation failed",
                "VALIDATION_ERROR",
                ["Job description is required."],
              );
            }

            const { data: baseResume, error: baseResumeError } = await supabase
              .from("base_resumes")
              .select("id, user_id, name, base_data")
              .eq("id", baseResumeId)
              .eq("user_id", user.id)
              .single();

            if (baseResumeError || !baseResume) {
              return errorResponse(
                404,
                "Base resume not found",
                "BASE_RESUME_NOT_FOUND",
                [
                  "The requested base resume does not exist or is not accessible.",
                ],
              );
            }

            const aiPayload = await buildTailoringSessionData({
              jd,
              baseData: baseResume.base_data as ResumeData,
            });

            const { data, error } = await supabase
              .from("tailoring_sessions")
              .insert({
                user_id: user.id,
                base_resume_id: baseResume.id,
                name: aiPayload.name,
                analysis: aiPayload.analysis,
                changes: aiPayload.changes,
              })
              .select(
                "id, user_id, base_resume_id, name, analysis, changes, created_at, updated_at",
              )
              .single();

            if (error) {
              return errorResponse(
                500,
                "Failed to create tailored resume",
                "TAILORED_RESUME_CREATE_FAILED",
                [error.message],
              );
            }

            const mappedData = {
              id: data.id,
              userId: data.user_id,
              baseResumeId: data.base_resume_id,
              name: data.name,
              analysis: data.analysis,
              changes: data.changes,
              createdAt: data.created_at,
              updatedAt: data.updated_at,
            };

            return successResponse(
              201,
              "Tailored resume created successfully.",
              mappedData,
            );
          } catch (error) {
            console.error("[TAILORED_RESUME_CREATE_ERROR]:", error);

            return errorResponse(
              500,
              "Internal server error",
              "INTERNAL_SERVER_ERROR",
              ["Something went wrong while creating the tailored resume."],
            );
          }
        },
      }),
  },
});
