import SignInPage from "#/components/pages/Auth/SignInPage";
import { supabase } from "#/utils/supabase";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_gateway/")({
  beforeLoad: async () => {
    // Check session before the component even starts rendering
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
  component: SignInPage,
});
