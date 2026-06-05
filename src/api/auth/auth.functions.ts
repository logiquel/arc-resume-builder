import { createServerFn } from "@tanstack/react-start";
import { createClient } from "#/utils/supabase/server";
import type { AppUser } from "#/routes/__root";

export const getCurrentUserFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<AppUser | null> => {
    const supabase = createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email ?? null,
      firstName: user.user_metadata?.first_name ?? null,
      lastName: user.user_metadata?.last_name ?? null,
      phone: user.user_metadata?.phone ?? null,
    };
  },
);
