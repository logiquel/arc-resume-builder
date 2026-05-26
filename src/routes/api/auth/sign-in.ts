import { createFileRoute } from "@tanstack/react-router";
import { signInRequestSchema } from "../../../api/auth/auth.schemas";
import { createClient } from "#/utils/supabase/server";
import { errorResponse, successResponse } from "#/lib/api-response";

export const Route = createFileRoute("/api/auth/sign-in")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();

          const validation = signInRequestSchema.safeParse(body);

          if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors;
            const details = Object.values(fieldErrors).flat().filter(Boolean);

            return errorResponse(
              400,
              "Validation failed",
              "VALIDATION_ERROR",
              details.length > 0
                ? details
                : ["Please enter a valid email address."],
            );
          }

          const email = validation.data.email.trim().toLowerCase();
          const supabase = createClient();
          const origin = request.headers.get("origin");

          const { error: otpError } = await supabase.auth.signInWithOtp({
            email,
            options: {
              shouldCreateUser: false,
              emailRedirectTo: origin || undefined,
            },
          });

          if (otpError) {
            const rawMessage = otpError.message.toLowerCase();

            const friendlyMessage = rawMessage.includes(
              "signups not allowed for otp",
            )
              ? "We couldn’t send a login code for this email. Please check the email address or sign up first."
              : "We couldn’t send your login code right now. Please try again.";

            return errorResponse(
              400,
              "Failed to send login OTP",
              "OTP_SIGN_IN_FAILED",
              [friendlyMessage],
            );
          }

          return successResponse(200, "Login OTP sent successfully.", null);
        } catch (error) {
          console.error("[SIGN_IN_OTP_FAILURE]:", error);

          return errorResponse(
            500,
            "Internal server error",
            "INTERNAL_SERVER_ERROR",
            [
              "Something went wrong while sending your login code. Please try again.",
            ],
          );
        }
      },
    },
  },
});
