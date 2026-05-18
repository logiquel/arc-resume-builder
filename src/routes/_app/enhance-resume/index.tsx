import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/enhance-resume/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/enhance-resume/"!</div>;
}
