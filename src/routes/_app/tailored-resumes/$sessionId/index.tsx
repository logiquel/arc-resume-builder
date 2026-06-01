import { createFileRoute } from "@tanstack/react-router";
import TailoringLoadingScreen from "#/components/pages/TailoredResume/TailoringLoadingScreen";
import { useFetchTailoredResumeById } from "#/api/resume/tailor/tailor-resume.queries";
import { useQueryClient } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import TailoringSessionScreen from "#/components/pages/TailoredResume/TailoringSessionScreen";

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
  const queryClient = useQueryClient();
  const { data, isLoading } = useFetchTailoredResumeById(sessionId);

  const handleComplete = () => {
    console.log("[Tailored Resume] Generation completed, refetching data...");

    queryClient.invalidateQueries({
      queryKey: ["tailored-resume", "detail", sessionId],
    });
  };

  // Don't show loading screen if we already have completed data
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center overflow-hidden">
        <Icon
          icon="si:spinner-fill"
          className="text-base text-text-primary animate-spin shrink-0"
        />
      </div>
    );
  }

  // If we have data and it's completed, show the resume immediately
  if (data && data.generation_step === "COMPLETED") {
    return <TailoringSessionScreen tailorSession={data} />;
  }

  // Show loading screen for incomplete sessions
  const currentStep = data?.generation_step || "PLACEHOLDER_CREATED";

  return (
    <div className="w-full h-full flex overflow-hidden">
      <TailoringLoadingScreen
        sessionId={sessionId}
        currentStep={currentStep}
        onComplete={handleComplete}
      />
    </div>
  );
}
