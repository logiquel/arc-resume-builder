import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "#/utils/supabase/server";

export const Route = createFileRoute("/api/auth/session")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const supabase = createClient();

          const {
            data: { user },
            error,
          } = await supabase.auth.getUser();

          if (error) {
            return new Response(
              JSON.stringify({
                authenticated: false,
                user: null,
                error: error.message,
              }),
              {
                status: 401,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          return new Response(
            JSON.stringify({
              authenticated: !!user,
              user: user
                ? {
                    id: user.id,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    createdAt: user.created_at,
                  }
                : null,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (error) {
          console.error("[AUTH_SESSION_FETCH_FAILURE]:", error);

          return new Response(
            JSON.stringify({
              authenticated: false,
              user: null,
              error: "Failed to resolve authenticated session.",
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
