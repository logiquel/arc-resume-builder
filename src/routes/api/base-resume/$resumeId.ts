// /api/base-resume/$resumeId.tsx
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { errorResponse, successResponse } from "#/lib/api-response";
import { requireAuthMiddleware } from "#/lib/require-auth.middleware";

const paramsSchema = z.object({
  resumeId: z.string().uuid("Invalid resume id"),
});

export const Route = createFileRoute("/api/base-resume/$resumeId")({
  server: {
    middleware: [requireAuthMiddleware],
    handlers: ({ createHandlers }) =>
      createHandlers({
        GET: async ({ params, context }) => {
          try {
            const parsedParams = paramsSchema.safeParse(params);

            if (!parsedParams.success) {
              const details = parsedParams.error.issues.map(
                (issue) => issue.message,
              );

              return errorResponse(
                400,
                "Validation failed",
                "VALIDATION_ERROR",
                details,
              );
            }

            const { resumeId } = parsedParams.data;
            const { supabase, user } = context;

            const { data, error } = await supabase
              .from("base_resumes")
              .select("id, user_id, name, base_data, created_at, updated_at")
              .eq("id", resumeId)
              .eq("user_id", user.id)
              .maybeSingle();

            if (error) {
              return errorResponse(
                500,
                "Failed to fetch base resume",
                "BASE_RESUME_FETCH_FAILED",
                [error.message],
              );
            }

            if (!data) {
              return errorResponse(
                404,
                "Base resume not found",
                "BASE_RESUME_NOT_FOUND",
                ["No base resume found for the provided id."],
              );
            }

            return successResponse(
              200,
              "Base resume fetched successfully.",
              data,
            );
          } catch (error) {
            console.error("[BASE_RESUME_GET_BY_ID_ERROR]:", error);

            return errorResponse(
              500,
              "Internal server error",
              "INTERNAL_SERVER_ERROR",
              ["Something went wrong while fetching the base resume."],
            );
          }
        },

        // Add DELETE handler
        DELETE: async ({ params, context }) => {
          try {
            const parsedParams = paramsSchema.safeParse(params);

            if (!parsedParams.success) {
              const details = parsedParams.error.issues.map(
                (issue) => issue.message,
              );

              return errorResponse(
                400,
                "Validation failed",
                "VALIDATION_ERROR",
                details,
              );
            }

            const { resumeId } = parsedParams.data;
            const { supabase, user } = context;

            // First verify the resume exists and belongs to the user
            const { data: existingResume, error: fetchError } = await supabase
              .from("base_resumes")
              .select("id")
              .eq("id", resumeId)
              .eq("user_id", user.id)
              .maybeSingle();

            if (fetchError) {
              return errorResponse(
                500,
                "Failed to verify base resume",
                "BASE_RESUME_VERIFY_FAILED",
                [fetchError.message],
              );
            }

            if (!existingResume) {
              return errorResponse(
                404,
                "Base resume not found",
                "BASE_RESUME_NOT_FOUND",
                ["No base resume found for the provided id."],
              );
            }

            // Delete the base resume
            const { error: deleteError } = await supabase
              .from("base_resumes")
              .delete()
              .eq("id", resumeId)
              .eq("user_id", user.id);

            if (deleteError) {
              return errorResponse(
                500,
                "Failed to delete base resume",
                "BASE_RESUME_DELETE_FAILED",
                [deleteError.message],
              );
            }

            return successResponse(200, "Base resume deleted successfully.", {
              id: resumeId,
            });
          } catch (error) {
            console.error("[BASE_RESUME_DELETE_ERROR]:", error);

            return errorResponse(
              500,
              "Internal server error",
              "INTERNAL_SERVER_ERROR",
              ["Something went wrong while deleting the base resume."],
            );
          }
        },
      }),
  },
});
