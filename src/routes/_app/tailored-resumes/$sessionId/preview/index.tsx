import { useMemo, useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useFetchTailoredResumeById } from "#/api/resume/tailor/tailor-resume.queries";
import { useUpdateTailoredResumeTemplateMutation } from "#/api/resume/tailor/tailor-resume.mutations";
import ResumePreviewClient from "#/components/pages/PreviewResume/ResumePreviewClient";
import { resolveResumeToFormat3 } from "#/lib/resolveResumeConverter";
import { Icon } from "@iconify/react";
import {
  TemplateId,
  TEMPLATES_LIST,
  type ResumeTemplate,
  isValidTemplateId,
} from "#/config/templates.config";

export const Route = createFileRoute(
  "/_app/tailored-resumes/$sessionId/preview/",
)({
  component: RouteComponent,

  loader: async ({ params }) => {
    return {
      sessionId: params.sessionId,
      breadcrumbs: [
        { label: "Dashboard", href: "/dashboard" },
        {
          label: "Tailored Resume",
          href: `/tailored-resumes/${params.sessionId}`,
        },
        { label: "Preview", href: undefined },
      ],
    };
  },
});

function RouteComponent() {
  const { sessionId } = Route.useLoaderData();

  const {
    data: tailoringSession,
    isLoading,
    error,
  } = useFetchTailoredResumeById(sessionId);

  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId>(
    () => {
      const firstId = TEMPLATES_LIST[0]?.id;
      return (
        isValidTemplateId(firstId) ? firstId : TemplateId.ATSCLASSIC
      ) as TemplateId;
    },
  );

  // isPending from the mutation is the single source of truth for loading state
  const { mutate: updateTemplate, isPending: isUpdatingTemplate } =
    useUpdateTailoredResumeTemplateMutation(sessionId);

  // On mount/data load: prefer saved template_id, otherwise keep first template selected
  useEffect(() => {
    if (!tailoringSession) {
      return;
    }

    if (
      tailoringSession.template_id &&
      isValidTemplateId(tailoringSession.template_id)
    ) {
      setSelectedTemplateId(tailoringSession.template_id);
      return;
    }

    if (TEMPLATES_LIST[0]?.id) {
      setSelectedTemplateId(TEMPLATES_LIST[0].id as TemplateId);
    }
  }, [tailoringSession]);

  const previewData = useMemo(
    () => (tailoringSession ? resolveResumeToFormat3(tailoringSession) : null),
    [tailoringSession],
  );

  const handleTemplateChange = (templateId: TemplateId) => {
    // Do nothing if already selected
    if (templateId === selectedTemplateId) return;

    setSelectedTemplateId(templateId);
    updateTemplate(templateId);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Icon icon="svg-spinners:3-dots-fade" className="text-2xl text-brand" />
      </div>
    );
  }

  // Error state
  if (error || !tailoringSession) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <Icon
            icon="mdi:alert-circle"
            className="text-4xl text-red-500 mx-auto mb-3"
          />
          <p className="text-text-muted">Failed to load resume session</p>
          <p className="text-xxs text-text-muted mt-1">
            Please try again later
          </p>
        </div>
      </div>
    );
  }

  // No preview data state
  if (!previewData) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <Icon
            icon="mdi:file-document-outline"
            className="text-4xl text-text-muted mx-auto mb-3"
          />
          <p className="text-text-muted">Unable to generate preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex">
      <aside className="w-[23vw] h-full flex flex-col gap-y-4 border-r border-black/5">
        <h2 className="text-lg flex flex-col text-text-primary font-medium px-4 pt-4">
          Templates
          <span className="text-tiny text-text-muted font-normal">
            Choose template to preview how your tailored resume will look.
          </span>
        </h2>
        <div className="w-full grid grid-cols-2 gap-x-6 gap-y-2 items-start overflow-y-scroll hide-scrollbar px-4">
          {TEMPLATES_LIST.map((template: ResumeTemplate, idx: number) => {
            const isSelected = selectedTemplateId === template.id;
            // Only the currently selected template shows the spinner while updating
            const isThisUpdating = isSelected && isUpdatingTemplate;

            return (
              <div
                key={template.id}
                className="relative flex-1 h-fit border-black/15 flex flex-col items-center bg-[#FAFAFA]/0 rounded-0 cursor-pointer transition-all duration-300 group"
              >
                <span className="w-fit ml-1 self-start text-tiny text-text-muted font-medium mb-1">
                  # {idx + 1}.
                </span>
                <div
                  onClick={() =>
                    handleTemplateChange(template.id as TemplateId)
                  }
                  className={`relative w-full aspect-[1/1.414] bg-[#E7E8F1] rounded  ${isSelected ? "border border-[#0A65CC]" : ""} transition-all duration-300`}
                  style={{
                    boxShadow: "rgba(14, 165, 233, 0.15) 0px 7px 29px 0px",
                  }}
                >
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="absolute top-0 left-0 w-full h-full object-cover object-top rounded-[inherit]"
                  />

                  {isSelected && (
                    <div className="w-4.5 h-4.5 rounded-full shadow-sm bg-[#0A65CC] flex items-center justify-center absolute top-0 right-0 translate-x-1/3 -translate-y-1/3">
                      {isThisUpdating ? (
                        <Icon
                          icon="mingcute:loading-fill"
                          className="text-white w-[90%] h-[90%] animate-spin"
                        />
                      ) : (
                        <Icon
                          icon="si:check-fill"
                          className="text-white w-[60%] h-[60%]"
                        />
                      )}
                    </div>
                  )}
                </div>
                <div className="w-full flex flex-col bg-[#F9FBFC]/70 px-1.5 py-2 pt-[12%]">
                  <h2 className="text-xxs text-text-secondary">
                    {template.name}
                  </h2>
                </div>
              </div>
            );
          })}
        </div>
      </aside>
      <main className="flex-1 min-w-0 min-h-0 h-full flex flex-col overflow-hidden">
        <ResumePreviewClient
          data={previewData}
          selectedTemplate={selectedTemplateId}
          sessionId={tailoringSession.id}
        />
      </main>
    </div>
  );
}
