import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "#/utils/supabase";
import { verifyOtpRequestSchema } from "../../../api/auth/auth.schemas";

export const Route = createFileRoute("/api/auth/verify-otp")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();

          const validation = verifyOtpRequestSchema.safeParse(body);
          if (!validation.success) {
            return new Response(
              JSON.stringify({
                error: "Invalid properties verification state payload.",
                details: validation.error.format(),
              }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          const { email, token, profile } = validation.data;

          const { data: sessionData, error: sessionError } =
            await supabase.auth.verifyOtp({
              email,
              token,
              type: "email",
            });

          if (sessionError) {
            return new Response(
              JSON.stringify({ error: sessionError.message }),
              {
                status: 401,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          const authUser = sessionData.user;
          if (!authUser)
            throw new Error("Auth execution session resolve drop exception.");

          // Profile provisioning strategy if running a sign-up action sequence
          if (profile) {
            const { error: insertError } = await supabase.from("users").insert({
              id: authUser.id,
              email: authUser.email!,
              first_name: profile.firstName,
              last_name: profile.lastName,
              phone: profile.phone,
            });

            if (insertError) {
              // Roll back newly initialized authentication user instance if row profiling insertion breaches integrity constraints
              await supabase.auth.admin.deleteUser(authUser.id);
              return new Response(
                JSON.stringify({
                  error:
                    "Account setup collapsed establishing profile row parameters.",
                }),
                {
                  status: 500,
                  headers: { "Content-Type": "application/json" },
                },
              );
            }
          }

          return new Response(
            JSON.stringify({
              success: true,
              user: {
                id: authUser.id,
                email: authUser.email,
                firstName: profile?.firstName || null,
                lastName: profile?.lastName || null,
              },
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (error: any) {
          console.error("[VERIFY_OTP_CORE_FAILURE]:", error);
          return new Response(
            JSON.stringify({
              error: "Verification operations sequence halted internally.",
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
