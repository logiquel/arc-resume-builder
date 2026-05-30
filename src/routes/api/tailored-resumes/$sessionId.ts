import { createFileRoute } from "@tanstack/react-router";
import { errorResponse, successResponse } from "#/lib/api-response";
import { requireAuthMiddleware } from "#/lib/require-auth.middleware";

export const Route = createFileRoute("/api/tailored-resumes/$sessionId")({
  server: {
    middleware: [requireAuthMiddleware],
    handlers: {
      GET: async ({ params, context }) => {
        try {
          const { supabase, user } = context;
          const sessionId =
            typeof params.sessionId === "string" ? params.sessionId.trim() : "";

          if (!sessionId) {
            return errorResponse(400, "Validation failed", "VALIDATION_ERROR", [
              "sessionId is required.",
            ]);
          }

          const { data, error } = await supabase
            .from("tailoring_sessions")
            .select(
              "id, user_id, base_resume_id, name, generation_step, analysis, changes, created_at, updated_at",
            )
            .eq("id", sessionId)
            .eq("user_id", user.id)
            .single();

          if (error || !data) {
            return errorResponse(
              404,
              "Tailored resume not found",
              "TAILORED_RESUME_NOT_FOUND",
              [
                "The requested tailored resume does not exist or is not accessible.",
              ],
            );
          }

          const mappedData = {
            id: data.id,
            userId: data.user_id,
            baseResumeId: data.base_resume_id,
            name: data.name,
            generationStep: data.generation_step,
            analysis: data.analysis,
            changes: data.changes,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };

          return successResponse(
            200,
            "Tailored resume fetched successfully.",
            mappedData,
          );
        } catch (error) {
          console.error("[TAILORED_RESUME_GET_BY_ID_ERROR]:", error);

          return errorResponse(
            500,
            "Internal server error",
            "INTERNAL_SERVER_ERROR",
            ["Something went wrong while fetching the tailored resume."],
          );
        }
      },
    },
  },
});
