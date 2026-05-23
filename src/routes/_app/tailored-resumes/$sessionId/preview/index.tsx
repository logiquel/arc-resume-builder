import React, { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { tailoringSessionSampleData } from "#/types/resume/tailoringSessionSampleData";
import type { TailoringSession } from "#/types/resume/tailorSessionTypes";
import ResumePreviewClient, {
  type ResumePreviewTemplateKey,
} from "#/components/pages/analysis/ResumePreviewClient";
import { resolveResumeToFormat3 } from "#/lib/resolveResumeConverter";

type TemplateOption = {
  key: ResumePreviewTemplateKey;
  name: string;
  description: string;
  thumbnail: string;
};

const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    key: "ats",
    name: "ATS",
    description:
      "Clean and scanner-friendly layout for structured hiring flows.",
    thumbnail: "/sample_resume_image.jpg",
  },
  {
    key: "modern",
    name: "Modern",
    description: "Balanced layout with stronger hierarchy and visual rhythm.",
    thumbnail: "/sample_resume_image_2.jpg",
  },
  {
    key: "classic",
    name: "Classic",
    description: "Traditional professional resume style with familiar spacing.",
    thumbnail: "/sample_resume_image_3.jpg",
  },
];

export const Route = createFileRoute(
  "/_app/tailored-resumes/$sessionId/preview/",
)({
  component: RouteComponent,

  loader: async ({ params }) => {
    const tailoringSession: TailoringSession = {
      ...tailoringSessionSampleData,
      id: params.sessionId,
    };

    return {
      tailoringSession,
      breadcrumbs: [
        { label: "Dashboard", href: "/dashboard" },
        {
          label: tailoringSession.name || "Tailored Resume",
          href: `/tailored-resumes/${params.sessionId}`,
        },
        { label: "Preview", href: undefined },
      ],
    };
  },
});

function RouteComponent() {
  const { tailoringSession } = Route.useLoaderData();
  const [selectedTemplate, setSelectedTemplate] =
    useState<ResumePreviewTemplateKey>("ats");

  const format3Data = useMemo(
    () => resolveResumeToFormat3(tailoringSession),
    [tailoringSession],
  );

  return (
    <div className="w-full h-full flex overflow-hidden bg-[#F8FAFC]">
      <aside className="w-[340px] min-w-[340px] h-full border-r border-black/10 bg-white p-4 overflow-y-auto">
        <div className="mb-5">
          <h1 className="text-base font-semibold text-text-primary">
            Choose Template
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Select a template to preview your tailored resume.
          </p>
        </div>

        <div className="space-y-3">
          {TEMPLATE_OPTIONS.map((template) => {
            const isSelected = selectedTemplate === template.key;

            return (
              <button
                key={template.key}
                type="button"
                onClick={() => setSelectedTemplate(template.key)}
                className={[
                  "w-full text-left rounded-2xl border p-3 transition-all cursor-pointer",
                  isSelected
                    ? "border-brand bg-brand/5 shadow-sm"
                    : "border-black/10 bg-white hover:border-black/20 hover:bg-gray-50",
                ].join(" ")}
              >
                <div className="w-full aspect-[3/4] overflow-hidden rounded-xl border border-black/10 bg-gray-100 mb-3">
                  <img
                    src={template.thumbnail}
                    alt={`${template.name} template thumbnail`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-text-primary">
                      {template.name}
                    </h2>
                    <p className="text-xs text-text-muted mt-1 leading-5">
                      {template.description}
                    </p>
                  </div>

                  <span
                    className={[
                      "mt-0.5 h-3.5 w-3.5 rounded-full border shrink-0",
                      isSelected
                        ? "border-brand bg-brand"
                        : "border-gray-300 bg-white",
                    ].join(" ")}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      <main className="flex-1 min-w-0 h-full">
        <ResumePreviewClient
          data={format3Data}
          selectedTemplate={selectedTemplate}
          sessionId={tailoringSession.id}
        />
      </main>
    </div>
  );
}

export default RouteComponent;
