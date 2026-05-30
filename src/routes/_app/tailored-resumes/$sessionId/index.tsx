import { createFileRoute } from "@tanstack/react-router";
import TailoringLoadingScreen from "#/components/pages/TailoredResume/TailoringLoadingScreen";

export const Route = createFileRoute("/_app/tailored-resumes/$sessionId/")({
  component: RouteComponent,

  loader: async ({ params }) => {
    return {
      breadcrumbs: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Senior Full Stack Engineer - Stripe", href: undefined },
      ],
    };
  },
});

function RouteComponent() {
  return (
    <div className="w-full h-full flex overflow-hidden">
      <TailoringLoadingScreen />
    </div>
  );
}
