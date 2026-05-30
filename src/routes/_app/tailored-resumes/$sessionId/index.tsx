import { createFileRoute } from "@tanstack/react-router";
import TailoringLoadingScreen from "#/components/pages/TailoredResume/TailoringLoadingScreen";
import { useFetchTailoredResumeById } from "#/api/resume/tailor/tailor-resume.queries";

export const Route = createFileRoute("/_app/tailored-resumes/$sessionId/")({
  component: RouteComponent,

  loader: async () => {
    return {
      breadcrumbs: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Senior Full Stack Engineer - Stripe", href: undefined },
      ],
    };
  },
});

function RouteComponent() {
  const { sessionId } = Route.useParams();

  const { data, isLoading, isError } = useFetchTailoredResumeById(sessionId);

  if (isLoading) {
    return <div className="w-full h-full bg-white" />;
  }

  if (isError || !data) {
    return <div className="w-full h-full bg-white" />;
  }

  return (
    <div className="w-full h-full flex overflow-hidden">
      <TailoringLoadingScreen
        sessionId={sessionId}
        currentStep={data.generationStep}
      />
    </div>
  );
}
