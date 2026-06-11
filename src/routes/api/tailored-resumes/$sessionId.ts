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
              "id, user_id, base_resume_id, name, generation_step, analysis, changes, template_id, created_at, updated_at",
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

          return successResponse(
            200,
            "Tailored resume fetched successfully.",
            data,
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

      // PATCH - Update tailoring session
      PATCH: async ({ params, context, request }) => {
        try {
          const { supabase, user } = context;
          const sessionId =
            typeof params.sessionId === "string" ? params.sessionId.trim() : "";

          if (!sessionId) {
            return errorResponse(400, "Validation failed", "VALIDATION_ERROR", [
              "sessionId is required.",
            ]);
          }

          // Parse request body
          const body = await request.json();
          const { changes, analysis, name, generation_step, template_id } =
            body;

          // Build update object with only provided fields
          const updateData: Record<string, unknown> = {};

          if (changes !== undefined) {
            updateData.changes = changes;
          }
          if (analysis !== undefined) {
            updateData.analysis = analysis;
          }
          if (name !== undefined) {
            updateData.name = name;
          }
          if (generation_step !== undefined) {
            updateData.generation_step = generation_step;
          }
          if (template_id !== undefined) {
            updateData.template_id = template_id;
          }

          // Check if there's anything to update
          if (Object.keys(updateData).length === 0) {
            return errorResponse(400, "Validation failed", "VALIDATION_ERROR", [
              "No valid fields provided for update.",
            ]);
          }

          // Verify session exists and belongs to user
          const { data: existingSession, error: fetchError } = await supabase
            .from("tailoring_sessions")
            .select("id")
            .eq("id", sessionId)
            .eq("user_id", user.id)
            .single();

          if (fetchError || !existingSession) {
            return errorResponse(
              404,
              "Tailored resume not found",
              "TAILORED_RESUME_NOT_FOUND",
              [
                "The requested tailored resume does not exist or is not accessible.",
              ],
            );
          }

          // Update the session
          const { data, error } = await supabase
            .from("tailoring_sessions")
            .update({
              ...updateData,
              updated_at: new Date().toISOString(),
            })
            .eq("id", sessionId)
            .eq("user_id", user.id)
            .select(
              "id, user_id, base_resume_id, name, generation_step, analysis, changes, template_id, created_at, updated_at",
            )
            .single();

          if (error) {
            console.error("[TAILORED_RESUME_UPDATE_ERROR]:", error);
            return errorResponse(
              500,
              "Failed to update tailored resume",
              "UPDATE_FAILED",
              [error.message],
            );
          }

          return successResponse(
            200,
            "Tailored resume updated successfully.",
            data,
          );
        } catch (error) {
          console.error("[TAILORED_RESUME_UPDATE_ERROR]:", error);

          return errorResponse(
            500,
            "Internal server error",
            "INTERNAL_SERVER_ERROR",
            ["Something went wrong while updating the tailored resume."],
          );
        }
      },
      DELETE: async ({ params, context }) => {
        try {
          const { supabase, user } = context;
          const sessionId =
            typeof params.sessionId === "string" ? params.sessionId.trim() : "";

          if (!sessionId) {
            return errorResponse(400, "Validation failed", "VALIDATION_ERROR", [
              "sessionId is required.",
            ]);
          }

          const { error } = await supabase
            .from("tailoring_sessions")
            .delete()
            .eq("id", sessionId)
            .eq("user_id", user.id);

          if (error) {
            return errorResponse(
              500,
              "Failed to delete tailored resume",
              "DELETE_FAILED",
              [error.message],
            );
          }

          return successResponse(
            200,
            "Tailored resume deleted successfully.",
            null,
          );
        } catch (error) {
          console.error("[TAILORED_RESUME_DELETE_ERROR]:", error);

          return errorResponse(
            500,
            "Internal server error",
            "INTERNAL_SERVER_ERROR",
            ["Something went wrong while deleting the tailored resume."],
          );
        }
      },
    },
  },
});
