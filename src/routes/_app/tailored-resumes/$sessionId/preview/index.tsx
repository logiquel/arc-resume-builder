import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import type { TailoringSession } from "#/types/resume/tailorSession.types";
import ResumePreviewClient, {
  type ResumePreviewTemplateKey,
} from "#/components/pages/PreviewResume/ResumePreviewClient";
import { resolveResumeToFormat3 } from "#/lib/resolveResumeConverter";
import { Icon } from "@iconify/react";
import { tailor_session_sample_data } from "#/data/tailor_resume_data";

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
    thumbnail: "/ats_template_thumb.png",
  },
  {
    key: "atsAesthetic",
    name: "ATS Aesthetic",
    description:
      "Clean and scanner-friendly layout for structured hiring flows.",
    thumbnail: "/ats_aesthetic_template_thumb.png",
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
  {
    key: "twoColumn",
    name: "ATS Dual Column",
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
      ...tailor_session_sample_data,
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
    <div className="w-full h-full flex">
      <aside className="w-[23vw] h-full flex flex-col gap-y-4 border-r border-black/5">
        <h2 className="text-lg flex flex-col text-text-primary font-medium px-4 pt-4">
          Templates
          <span className="text-tiny text-text-muted font-normal">
            Choose template to preview how your tailored resume will look.
          </span>
        </h2>
        <div className="w-full grid grid-cols-2 gap-x-6 gap-y-2 items-start overflow-y-scroll hide-scrollbar px-4">
          {TEMPLATE_OPTIONS.map((template, i) => (
            <div
              key={i}
              className="relative flex-1 h-fit border-black/15 flex flex-col items-center bg-[#FAFAFA]/0 rounded-0 cursor-pointer transition-all duration-300 group"
            >
              <span className="w-fit ml-1 self-start text-tiny text-text-muted font-medium mb-1">
                # {i + 1}.
              </span>
              <div
                onClick={() => setSelectedTemplate(template.key)}
                className={`relative w-full aspect-[1/1.414] bg-[#E7E8F1] rounded border ${selectedTemplate === template.key ? "border-[#0A65CC]" : "border-black/5"}  relative translate-y-2 group-hover:translate-y-0 transition-all duration-300`}
                style={{
                  boxShadow: "rgba(14, 165, 233, 0.15) 0px 7px 29px 0px",
                }}
              >
                {/* Absolute positioning locks the image down to prevent container pushing */}
                <img
                  src={template.thumbnail}
                  className="absolute top-0 left-0 w-full h-full object-cover object-top rounded-[inherit]"
                />

                {selectedTemplate === template.key && (
                  <div className="w-4.5 h-4.5 rounded-full shadow-sm  bg-[#0A65CC] flex items-center justify-center absolute top-0 right-0 translate-x-1/3 -translate-y-1/3">
                    <Icon
                      icon="si:check-fill"
                      className="text-white w-[60%] h-[60%]"
                    />
                  </div>
                )}
              </div>
              <div className="w-full flex flex-col bg-[#F9FBFC]/70 px-1.5 py-2 pt-[12%]">
                <h2 className="text-xxs text-text-secondary">
                  {template.name}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </aside>
      <main className="flex-1 min-w-0 min-h-0 h-full flex flex-col overflow-hidden">
        <ResumePreviewClient
          data={format3Data}
          selectedTemplate={selectedTemplate}
          sessionId={tailoringSession.id}
        />
      </main>
    </div>
  );
}
