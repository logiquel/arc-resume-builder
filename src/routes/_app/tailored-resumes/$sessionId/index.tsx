import { tailoringSessionSampleData } from "#/types/resume/tailoringSessionSampleData";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/tailored-resumes/$sessionId/")({
  component: RouteComponent,

  loader: async ({ params }) => {
    const tailoringSession = {
      ...tailoringSessionSampleData,
      id: params.sessionId,
    };

    return {
      tailoringSession,
      breadcrumbs: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Senior Full Stack Engineer - Stripe", href: undefined },
      ],
    };
  },
});

function RouteComponent() {
  const { tailoringSession } = Route.useLoaderData();

  return <div className="w-full h-full"></div>;
}
