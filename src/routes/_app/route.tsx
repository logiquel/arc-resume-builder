import AppLayout from "#/components/Layouts/AppLayout";
import { supabase } from "#/utils/supabase";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw redirect({ to: "/" });
    }
  },
  component: AppLayout,
});
