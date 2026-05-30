import { createFileRoute } from "@tanstack/react-router";
import { errorResponse, successResponse } from "#/lib/api-response";
import { requireAuthMiddleware } from "#/lib/require-auth.middleware";
import { analyzeJobDescription, buildTailoringSessionData } from "#/api/resume/tailor/tailor-resume.utils";
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

            // Validation Checks
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

            // Verify base resume availability before spinning up execution hooks
            const { data: baseResumeCheck, error: baseResumeError } =
              await supabase
                .from("base_resumes")
                .select("id")
                .eq("id", baseResumeId)
                .eq("user_id", user.id)
                .single();

            if (baseResumeError || !baseResumeCheck) {
              return errorResponse(
                404,
                "Base resume not found",
                "BASE_RESUME_NOT_FOUND",
                [
                  "The requested base resume does not exist or is not accessible.",
                ],
              );
            }

            // ========================================================
            // STEP 1: Create a Placeholder Session Entry
            // ========================================================
            const { data: placeholderSession, error: placeholderError } =
              await supabase
                .from("tailoring_sessions")
                .insert({
                  user_id: user.id,
                  base_resume_id: baseResumeId,
                  name: "Initializing Workspace...",
                  generation_step: "PLACEHOLDER_CREATED", // Explicit Step 1 State Flag
                  analysis: {
                    base_score: 0,
                    current_score: 0,
                    matched_keywords: [],
                    missing_keywords: [],
                    keyword_coverage: 0,
                    summary:
                      "Allocating configuration slots inside workspace...",
                  },
                  // changes remains explicitly null/omitted as handled in the migration
                })
                .select(
                  "id, user_id, base_resume_id, name, generation_step, analysis, created_at, updated_at",
                )
                .single();

            if (placeholderError || !placeholderSession) {
              return errorResponse(
                500,
                "Failed to initialize tailoring workspace",
                "TAILORED_RESUME_INIT_FAILED",
                [
                  placeholderError?.message ??
                    "Could not write structural entry rows.",
                ],
              );
            }

            // Kick off fire-and-forget background worker execution pipeline
            (async () => {
              const sessionId = placeholderSession.id;
              try {
                // ========================================================
                // STEP 2: Reading Base Data
                // ========================================================
                await supabase
                  .from("tailoring_sessions")
                  .update({ generation_step: "READING_BASE_DATA" })
                  .eq("id", sessionId);

                const { data: baseResumeFetch, error: fetchError } =
                  await supabase
                    .from("base_resumes")
                    .select("base_data")
                    .eq("id", baseResumeId)
                    .single();

                if (fetchError || !baseResumeFetch) {
                  throw new Error(
                    `Base data read exception: ${fetchError?.message}`,
                  );
                }

                // ========================================================
                // STEP 3: JD Analysis
                // ========================================================
                await supabase
                  .from("tailoring_sessions")
                  .update({ generation_step: "JD_ANALYSIS" })
                  .eq("id", sessionId);

                const jdAnalysis = await analyzeJobDescription(jd);

                // ========================================================
                // STEP 4: Tailoring
                // ========================================================
                await supabase
                  .from("tailoring_sessions")
                  .update({ generation_step: "TAILORING" })
                  .eq("id", sessionId);

                const aiPayload = await buildTailoringSessionData({
                  jdAnalysis,
                  baseData: baseResumeFetch.base_data as ResumeData,
                });

                // ========================================================
                // STEP 5: Finalizing
                // ========================================================
                await supabase
                  .from("tailoring_sessions")
                  .update({ generation_step: "FINALIZING" })
                  .eq("id", sessionId);

                // Commit structural payload updates and promote to COMPLETED state
                const { error: finalizationError } = await supabase
                  .from("tailoring_sessions")
                  .update({
                    name: aiPayload.name,
                    analysis: aiPayload.analysis,
                    changes: aiPayload.changes,
                    generation_step: "COMPLETED",
                  })
                  .eq("id", sessionId);

                if (finalizationError) throw finalizationError;
              } catch (bgError) {
                console.error(
                  `[BACKGROUND_ORCHESTRATION_FAULT AT ${sessionId}]:`,
                  bgError,
                );

                // Roll back smoothly to Step 2 so the client layout can serve manual triggers safely
                await supabase
                  .from("tailoring_sessions")
                  .update({
                    generation_step: "READING_BASE_DATA",
                    name: "Generation Interrupted",
                    "analysis.summary":
                      "The pipeline encountered a parsing error. Please verify parameters and hit retry.",
                  })
                  .eq("id", sessionId);
              }
            })();

            // Map and return placeholder response layout context immediately (~100ms)
            const mappedData = {
              id: placeholderSession.id,
              userId: placeholderSession.user_id,
              baseResumeId: placeholderSession.base_resume_id,
              name: placeholderSession.name,
              generationStep: placeholderSession.generation_step,
              analysis: placeholderSession.analysis,
              createdAt: placeholderSession.created_at,
              updatedAt: placeholderSession.updated_at,
            };

            return successResponse(
              201,
              "Tailoring session initialized successfully.",
              mappedData,
            );
          } catch (error) {
            console.error("[TAILORED_RESUME_CREATE_ERROR]:", error);

            return errorResponse(
              500,
              "Internal server error",
              "INTERNAL_SERVER_ERROR",
              ["Something went wrong while initializing the tailored resume."],
            );
          }
        },
      }),
  },
});
