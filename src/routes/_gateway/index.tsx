import SignInPage from "#/components/pages/Auth/SignInPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_gateway/")({
  component: SignInPage,
});
