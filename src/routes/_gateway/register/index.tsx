import { createFileRoute, redirect } from "@tanstack/react-router";
import RegisterPage from "#/components/pages/Auth/RegisterPage";
import { supabase } from "#/utils/supabase";

export const Route = createFileRoute("/_gateway/register/")({
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
  component: RegisterPage,
});
