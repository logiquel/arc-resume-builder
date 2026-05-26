import { createServerFn } from "@tanstack/react-start";
import { createClient } from "#/utils/supabase/server";

export const getCurrentUserFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const supabase = createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      return null;
    }

    return user ?? null;
  },
);
