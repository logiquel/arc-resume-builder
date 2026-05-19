import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { diffWords } from "diff";
import {
  aiProcessedSampleData,
  type BlockAIField,
  type BulletAIField,
  type InlineAIField,
} from "../../../../ai_process_sample_data";
import { Icon } from "@iconify/react";
import { TextInput } from "#/components/common/Inputs/TextInput";

export const Route = createFileRoute("/_app/analysis/$reportId")({
  loader: async ({ params }) => {
    return {
      breadcrumbs: [
        { label: "Dashboard", href: "/dashboard" },
        { label: params.reportId, href: "" },
        { label: "Report", href: "" },
      ],
    };
  },
  component: RouteComponent,
});

interface SectionHeadingProps {
  sectionLabel: string;
}
const SectionHeading: React.FC<SectionHeadingProps> = ({ sectionLabel }) => {
  return (
    <div className="w-full flex items-center justify-between  px-4 py-3 border-b cursor-pointer">
      <h1 className="text-xxs font-medium text-text-primary uppercase">
        {sectionLabel}
      </h1>
      <Icon icon="ic:twotone-plus" className="text-text-muted" />
    </div>
  );
};

function RouteComponent() {
  return (
    <div className="w-full h-full flex overflow-hidden">
      {/* ── LEFT ASIDE: Live Score Breakdown & Metrics ── */}
      <aside className="w-[20vw] h-full"></aside>

      {/* ── CENTER MAIN: The Interactive Diff Workspace Panel ── */}
      <main className="h-full flex-1 overflow-y-auto hide-scrollbar border-x border-black/10">
        <section className="w-full flex-col">
          <SectionHeading sectionLabel="Profile" />
          <div className="w-full grid grid-cols-2 p-3 gap-1">
            <fieldset className="flex flex-col gap-y-1">
              <label className="text-tiny px-2 text-brand font-medium">
                FULL NAME
              </label>
              <input
                value="Roman Backer"
                className="rounded-none col-span-2 py-1 px-2 border border-transparent outline-0 transition-colors focus:border-gray-300 text-text-primary text-xs"
              />
            </fieldset>
            <fieldset className="flex flex-col gap-y-1">
              <label className="text-tiny px-2 text-brand font-medium">
                PROFESSIONAL TITLE
              </label>
              <input
                value="Full Stack Developer (MERN & Next.js)"
                className="rounded-none col-span-2 py-1 px-2 border border-transparent outline-0 transition-colors focus:border-gray-300 text-text-primary text-xs"
              />
            </fieldset>
            <fieldset className="flex flex-col gap-y-1">
              <label className="text-tiny px-2 text-brand font-medium">
                EMAIL
              </label>
              <input
                value="cammabri@logiquel.io"
                className="rounded-none col-span-2 py-1 px-2 border border-transparent outline-0 transition-colors focus:border-gray-300 text-text-primary text-xs"
              />
            </fieldset>
            <fieldset className="flex flex-col gap-y-1">
              <label className="text-tiny px-2 text-brand font-medium">
                PHONE
              </label>
              <input
                value="+91 98765 43210"
                className="rounded-none col-span-2 py-1 px-2 border border-transparent outline-0 transition-colors focus:border-gray-300 text-text-primary text-xs"
              />
            </fieldset>
          </div>
        </section>
        <section className="w-full flex-col">
          <SectionHeading sectionLabel="Work Experience" />
          <div className="w-full grid grid-cols-2 p-3 gap-2">
            <fieldset className="flex flex-col gap-y-1">
              <label className="text-tiny px-2 text-brand font-medium">
                COMPANY
              </label>
              <input
                value="Roman Backer"
                className="rounded-none col-span-2 py-1 px-2 border border-transparent outline-0 transition-colors focus:border-gray-300 text-text-primary text-xs"
              />
            </fieldset>
            <fieldset className="flex flex-col gap-y-1">
              <label className="text-tiny px-2 text-brand font-medium">
                ROLE
              </label>
              <input
                value="Full Stack Developer (MERN & Next.js)"
                className="rounded-none col-span-2 py-1 px-2 border border-transparent outline-0 transition-colors focus:border-gray-300 text-text-primary text-xs"
              />
            </fieldset>
            <fieldset className="flex flex-col gap-y-1">
              <label className="text-tiny px-2 text-brand font-medium">
                LOCATION
              </label>
              <input
                value="cammabri@logiquel.io"
                className="rounded-none col-span-2 py-1 px-2 border border-transparent outline-0 transition-colors focus:border-gray-300 text-text-primary text-xs"
              />
            </fieldset>
            <fieldset className="flex flex-col col-span-2 gap-y-1">
              <label className="text-tiny px-2 text-brand font-medium">
                DESCRIPTION
              </label>
              <textarea
                value="Architected secure, scalable backend RESTful microservices using Node.js and Express while building reusable modular user interfaces in React."
                className="rounded-none col-spanArchitected secure, scalable backend RESTful microservices using Node.js and Express while building reusable modular user interfaces in React.-2 py-1 px-2 border border-transparent outline-0 transition-colors focus:border-gray-300 text-text-primary text-xs"
              />
            </fieldset>
          </div>
        </section>
      </main>

      {/* ── RIGHT ASIDE: Template Preview Controller ── */}
      <aside className="w-[20vw] h-full"></aside>
    </div>
  );
}
