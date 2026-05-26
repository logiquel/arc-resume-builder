import { createFileRoute } from "@tanstack/react-router";
import { signUpRequestSchema } from "../../../api/auth/auth.schemas";
import { createClient } from "#/utils/supabase/server";
import { createAdminClient } from "#/utils/supabase/admin";
import { errorResponse, successResponse } from "#/lib/api-response";

export const Route = createFileRoute("/api/auth/sign-up")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const validation = signUpRequestSchema.safeParse(body);

          if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors;
            const details = Object.values(fieldErrors).flat().filter(Boolean);

            return errorResponse(
              400,
              "Validation failed",
              "VALIDATION_ERROR",
              details.length > 0 ? details : ["Invalid registration payload."],
            );
          }

          const { email } = validation.data;

          const supabase = createClient();
          const admin = createAdminClient();

          const { data: authUser, error: authUserError } =
            await admin.auth.admin.listUsers();

          if (authUserError) {
            return errorResponse(
              500,
              "Failed to validate user registration state",
              "USER_LOOKUP_FAILED",
              [authUserError.message],
            );
          }

          const existingUser = authUser.users.find(
            (user) => user.email?.toLowerCase() === email.toLowerCase(),
          );

          if (existingUser) {
            return errorResponse(
              409,
              "User already exists. Please sign in instead.",
              "USER_ALREADY_EXISTS",
              [
                "An account with this email already exists. Please sign in instead.",
              ],
            );
          }

          const origin = request.headers.get("origin");

          const { error: otpError } = await supabase.auth.signInWithOtp({
            email,
            options: {
              shouldCreateUser: true,
              emailRedirectTo: origin || undefined,
            },
          });

          if (otpError) {
            return errorResponse(
              400,
              "Failed to dispatch registration OTP",
              "OTP_SIGN_UP_FAILED",
              [otpError.message],
            );
          }

          return successResponse(
            200,
            "Registration OTP sent successfully.",
            null,
          );
        } catch (error: any) {
          console.error("[SIGN_UP_OTP_FAILURE]:", error);

          return errorResponse(
            500,
            "Internal server error",
            "INTERNAL_SERVER_ERROR",
            [error?.message || "Failed to dispatch registration OTP."],
          );
        }
      },
    },
  },
});
