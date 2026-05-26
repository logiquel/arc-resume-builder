import { createFileRoute } from "@tanstack/react-router";
import { signUpRequestSchema } from "../../../api/auth/auth.schemas";
import { createClient } from "#/utils/supabase/server";

export const Route = createFileRoute("/api/auth/sign-up")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();

          const validation = signUpRequestSchema.safeParse(body);
          if (!validation.success) {
            return new Response(
              JSON.stringify({
                error: "Validation failed.",
                details: validation.error.format(),
              }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          const { email } = validation.data;

          const supabase = createClient();

          // Strict Registration Gate: Verify uniqueness in our user record tables
          const { data: existingUser } = await supabase
            .from("users")
            .select("email")
            .eq("email", email)
            .maybeSingle();

          if (existingUser) {
            return new Response(
              JSON.stringify({
                error:
                  "User with this email already exists. Please login instead.",
              }),
              {
                status: 409,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          // Trigger novel user sign up OTP workflow
          const { error: otpError } = await supabase.auth.signInWithOtp({
            email,
            options: {
              shouldCreateUser: true,
              emailRedirectTo: request.headers.get("origin") || undefined,
            },
          });

          if (otpError) throw otpError;

          return new Response(
            JSON.stringify({
              success: true,
              message: "Registration OTP sent successfully.",
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (error: any) {
          console.error("[SIGN_UP_OTP_FAILURE]:", error);
          return new Response(
            JSON.stringify({
              error: error.message || "Failed to dispatch registration OTP.",
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      },
    },
  },
});
