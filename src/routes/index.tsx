import HomePage from "#/components/pages/Home/HomePage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeRouteComponent,
});

function HomeRouteComponent() {
  const { user } = Route.useRouteContext();
  return <HomePage user={user} />;
}
