import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const ResumePreviewClient = lazy(
  () => import("#/components/pages/analysis/ResumePreviewClient"),
);

export const Route = createFileRoute("/_app/preview/$reportId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div className="w-full h-full border"></div>;
}
