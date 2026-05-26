// src/routes/api/auth/logout.ts
import { createClient } from "#/utils/supabase/server";
import { createFileRoute } from "@tanstack/react-router";
import { errorResponse, successResponse } from "#/lib/api-response";

export const Route = createFileRoute("/api/auth/logout")({
  server: {
    handlers: {
      POST: async () => {
        try {
          const supabase = createClient();

          const { error } = await supabase.auth.signOut({ scope: "local" });

          if (error) {
            return errorResponse(400, "Logout failed", "LOGOUT_FAILED", [
              error.message,
            ]);
          }

          return successResponse(200, "Logged out successfully.", null);
        } catch (error: any) {
          console.error("[LOGOUT_FAILURE]:", error);

          return errorResponse(
            500,
            "Internal server error",
            "INTERNAL_SERVER_ERROR",
            [
              error?.message ||
                "Internal engine fault handling logout request.",
            ],
          );
        }
      },
    },
  },
});
