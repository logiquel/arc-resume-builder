// src/lib/server/require-auth.middleware.ts
import { createMiddleware } from "@tanstack/react-start";
import { createClient } from "#/utils/supabase/server";
import { errorResponse } from "#/lib/api-response";

export const requireAuthMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const supabase = createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      // For API routes, return the error response directly
      return errorResponse(401, "Unauthorized", "UNAUTHORIZED", [
        "You must be signed in to access this resource.",
      ]);
    }

    return next({
      context: {
        user,
        supabase,
      },
    });
  },
);
