import { createFileRoute, redirect } from "@tanstack/react-router";
import SignUpPage from "#/components/pages/Auth/SignUpPage";

export const Route = createFileRoute("/_gateway/sign-up/")({
  beforeLoad: ({ context }) => {
    if (context.user) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
  component: SignUpPage,
});
