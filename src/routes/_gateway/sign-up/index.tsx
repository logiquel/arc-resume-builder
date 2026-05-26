import { createFileRoute } from "@tanstack/react-router";
import SignUpPage from "#/components/pages/Auth/SignUpPage";

export const Route = createFileRoute("/_gateway/sign-up/")({
  component: SignUpPage,
});
