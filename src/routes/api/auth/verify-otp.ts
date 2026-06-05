import { createFileRoute } from "@tanstack/react-router";
import { verifyOtpRequestSchema } from "../../../api/auth/auth.schemas";
import { createClient } from "#/utils/supabase/server";
import { errorResponse, successResponse } from "#/lib/api-response";

export const Route = createFileRoute("/api/auth/verify-otp")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();

          const validation = verifyOtpRequestSchema.safeParse(body);

          if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors;
            const details = Object.values(fieldErrors).flat().filter(Boolean);

            return errorResponse(
              400,
              "Validation failed",
              "VALIDATION_ERROR",
              details.length > 0
                ? details
                : ["Invalid OTP verification payload."],
            );
          }

          const { email, token, profile } = validation.data;
          const supabase = createClient();

          // ── 1. Verify OTP ────────────────────────────────────────────────
          const { data: sessionData, error: sessionError } =
            await supabase.auth.verifyOtp({
              email,
              token,
              type: "email",
            });

          if (sessionError) {
            const rawMessage = sessionError.message.toLowerCase();

            const friendlyMessage =
              rawMessage.includes("expired") || rawMessage.includes("invalid")
                ? "This verification code is invalid or has expired. Please request a new code and try again."
                : "We couldn't verify your code. Please try again.";

            return errorResponse(
              401,
              "OTP verification failed",
              "OTP_VERIFICATION_FAILED",
              [friendlyMessage],
            );
          }

          const authUser = sessionData.user;

          if (!authUser) {
            return errorResponse(
              500,
              "Authenticated user resolution failed",
              "AUTH_USER_MISSING",
              ["Auth execution session resolved without a user object."],
            );
          }

          // ── 2. Embed profile into user_metadata ──────────────────────────
          // This ensures name, phone and email are available in every
          // subsequent session via supabase.auth.getUser() / getSession()
          if (profile) {
            const { error: metaError } = await supabase.auth.updateUser({
              data: {
                first_name: profile.firstName,
                last_name: profile.lastName,
                phone: profile.phone,
                email,
              },
            });

            if (metaError) {
              console.error(
                "[VERIFY_OTP] user_metadata update failed:",
                metaError.message,
              );
              // Non-fatal — profile row insert below still proceeds
            }
          }

          // ── 3. Insert profile row ────────────────────────────────────────
          if (profile) {
            const { error: insertError } = await supabase.from("users").insert({
              id: authUser.id,
              email: authUser.email!,
              first_name: profile.firstName,
              last_name: profile.lastName,
              phone: profile.phone,
            });

            if (insertError) {
              return errorResponse(
                500,
                "Account setup failed while creating user profile",
                "PROFILE_INSERT_FAILED",
                [insertError.message],
              );
            }
          }

          // ── 4. Return enriched user object ───────────────────────────────
          return successResponse(200, "OTP verified successfully.", {
            user: {
              id: authUser.id,
              email: authUser.email,
              firstName: profile?.firstName ?? null,
              lastName: profile?.lastName ?? null,
              phone: profile?.phone ?? null,
            },
          });
        } catch (error: any) {
          console.error("[VERIFY_OTP_CORE_FAILURE]:", error);

          return errorResponse(
            500,
            "Internal server error",
            "INTERNAL_SERVER_ERROR",
            [
              error?.message ||
                "Verification operations sequence halted internally.",
            ],
          );
        }
      },
    },
  },
});
