import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "#/utils/supabase";
import { signInRequestSchema } from "../../../api/auth/auth.schemas";

export const Route = createFileRoute("/api/auth/sign-in")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();

          const validation = signInRequestSchema.safeParse(body);
          if (!validation.success) {
            return new Response(
              JSON.stringify({ error: "Invalid email configuration format." }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          const { email } = validation.data;

          // Sign in flow prevents arbitrary new user instances from spawning inside Auth
          const { error: otpError } = await supabase.auth.signInWithOtp({
            email,
            options: {
              shouldCreateUser: false,
              emailRedirectTo: request.headers.get("origin") || undefined,
            },
          });

          if (otpError) {
            // Treat unauthorized user exceptions securely or forward clean messages
            return new Response(JSON.stringify({ error: otpError.message }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(
            JSON.stringify({
              success: true,
              message: "Login OTP sent successfully.",
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (error: any) {
          console.error("[SIGN_IN_OTP_FAILURE]:", error);
          return new Response(
            JSON.stringify({
              error:
                "Internal engine fault handling authentication code generation.",
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
