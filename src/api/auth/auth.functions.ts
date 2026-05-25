// src/features/auth/logout.ts
import { supabase } from "#/utils/supabase";
import { createServerFn } from "@tanstack/react-start";

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
});
