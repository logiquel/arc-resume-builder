// src/routes/api/auth/logout.ts
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "#/utils/supabase";

export const Route = createFileRoute("/api/auth/logout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // Get the session token from the Authorization header
          const authHeader = request.headers.get("Authorization");
          const token = authHeader?.replace("Bearer ", "");

          if (!token) {
            return new Response(
              JSON.stringify({ error: "No active session found." }),
              {
                status: 401,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          // Sign out using the user's token
          const { error: signOutError } =
            await supabase.auth.admin.signOut(token);

          if (signOutError) {
            return new Response(
              JSON.stringify({ error: signOutError.message }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          // Create response with clear cookie instructions
          const response = new Response(
            JSON.stringify({
              success: true,
              message: "Logged out successfully.",
            }),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
                "Set-Cookie":
                  "sb-access-token=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax",
              },
            },
          );

          return response;
        } catch (error: any) {
          console.error("[LOGOUT_FAILURE]:", error);
          return new Response(
            JSON.stringify({
              error: "Internal engine fault handling logout request.",
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
