import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_app/tailored-resumes/$sessionId/preview/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/tailored-resumes/$sessionId/preview/"!</div>;
}
