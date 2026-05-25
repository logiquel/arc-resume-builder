import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "#/utils/supabase";
import SignUpPage from "#/components/pages/Auth/SignUpPage";

export const Route = createFileRoute("/_gateway/sign-up/")({
  beforeLoad: async () => {
    // Check session before the component even starts rendering
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      // If logged in, throw a router redirect straight to dashboard
      throw redirect({
        to: "/dashboard",
      });
    }
  },
  component: SignUpPage,
});
