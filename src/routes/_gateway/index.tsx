import SignInPage from "#/components/pages/Auth/SignInPage";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_gateway/")({
  beforeLoad: ({ context }) => {
    if (context.user) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
  component: SignInPage,
});
