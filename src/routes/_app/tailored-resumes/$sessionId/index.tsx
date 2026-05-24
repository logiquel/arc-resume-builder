import React, { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { tailoringSessionSampleData } from "#/types/resume/tailoringSessionSampleData";
import ScorePanel from "#/components/pages/analysis/ScorePanel";
import { AiDiffField } from "#/components/pages/analysis/AiDiffField";
import { AutoSaveNotification } from "#/components/pages/analysis/AutoSaveNotification";
import { Icon } from "@iconify/react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/components/addons/tooltip";

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

interface SectionHeadingProps {
  sectionLabel: string;
  entriesCount?: number;
  sectionIcon?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  sectionLabel,
  entriesCount,
  sectionIcon = "",
}) => (
  <div className="w-full flex items-center px-5 py-4 border-b border-black/10 top-0 bg-white z-10 shadow-[0_8px_16px_-8px_rgba(0,0,0,0.06),0_4px_8px_-4px_rgba(0,0,0,0.03)]">
    <Icon icon={sectionIcon} className="text-xs text-text-muted mr-1" />

    <h1 className="text-xxs font-medium text-brand uppercase">
      {sectionLabel}
    </h1>

    {entriesCount !== undefined && (
      <span className="w-4 h-4 flex items-center justify-center text-tiny font-medium text-muted-foreground ml-1 rounded-full bg-gray-100 border">
        {entriesCount}
      </span>
    )}
  </div>
);

type DiffStatus = "pending" | "accepted" | "rejected";

const FieldStatusBadge: React.FC<{ status?: DiffStatus }> = ({ status }) => {
  if (!status || status === "pending") return null;

  const isAccepted = status === "accepted";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={`flex items-center text-tiny font-medium uppercase border-l border-black/40 pl-2 ml-2 cursor-pointer ${isAccepted ? "text-emerald-700" : "text-red-600"}`}
        >
          <Icon
            icon="akar-icons:info"
            className="text-text-muted text-xxs mr-1"
          />{" "}
          {status}
        </span>
      </TooltipTrigger>
      <TooltipContent side="right" className="text-tiny!">
        {isAccepted ? "Accepted" : "Rejected"} - This change has been{" "}
        {isAccepted ? "accepted" : "rejected"} based on the AI suggestion and
        your edits.
      </TooltipContent>
    </Tooltip>
  );
};

const FieldLabel: React.FC<{
  label: string;
  status?: DiffStatus;
}> = ({ label, status }) => (
  <div className="flex items-center">
    <label className="text-tiny text-text-muted font-medium">{label}</label>
    <FieldStatusBadge status={status} />
  </div>
);

function RouteComponent() {
  const { sessionId } = Route.useParams();
  const { tailoringSession: loaderTailoringSession } = Route.useLoaderData();

  const storageKey = `tailoring-session:${sessionId}`;

  const [saveStatus, setSaveStatus] = useState<
    "saving" | "saved" | "error" | null
  >(null);
  const [hydrated, setHydrated] = useState(false);
  const [tailoringSession, setTailoringSession] = useState(
    loaderTailoringSession,
  );

  useEffect(() => {
    setHydrated(true);

    try {
      const persisted = localStorage.getItem(storageKey);
      if (!persisted) return;

      setTailoringSession(JSON.parse(persisted));
    } catch (error) {
      console.error("Failed to load persisted tailoring session:", error);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) return;

    try {
      setSaveStatus("saving");
      localStorage.setItem(storageKey, JSON.stringify(tailoringSession));
      setSaveStatus("saved");
    } catch (error) {
      console.error("Failed to persist tailoring session:", error);
      setSaveStatus("error");
    }
  }, [hydrated, tailoringSession, storageKey]);

  const sections = tailoringSession.changes;
  const {
    profile,
    education,
    experience,
    projects,
    skills,
    certificates,
    languages,
    interests,
    awards,
    publications,
    references,
  } = sections;

  const updateSession = (
    updater: (prev: typeof tailoringSession) => typeof tailoringSession,
  ) => {
    setTailoringSession((prev: typeof tailoringSession) => updater(prev));
  };

  const handlePrimitiveChange = (
    section: keyof typeof sections,
    index: number | null,
    field: string,
    value: string,
  ) => {
    updateSession((prev) => {
      const next = structuredClone(prev);

      if (index === null) {
        (next.changes[section] as unknown as Record<string, unknown>)[field] =
          value;
      } else {
        const entries = (
          next.changes[section] as unknown as {
            entries: Record<string, unknown>[];
          }
        ).entries;
        entries[index] = {
          ...entries[index],
          [field]: value,
        };
      }

      next.updated_at = new Date().toISOString();
      return next;
    });
  };

  const isSameValue = (
    a: string | string[] | undefined,
    b: string | string[] | undefined,
  ) => JSON.stringify(a) === JSON.stringify(b);

  const getResolvedStatus = (
    oldValue: string | string[],
    newValue: string | string[],
    resolvedValue: string | string[],
  ): "accepted" | "rejected" => {
    if (isSameValue(resolvedValue, newValue)) return "accepted";
    if (isSameValue(resolvedValue, oldValue)) return "rejected";

    return "accepted";
  };

  const handleAiFieldUpdate = (
    section: keyof typeof sections,
    index: number | null,
    field: string,
    newValue: string | string[],
  ) => {
    updateSession((prev) => {
      const next = structuredClone(prev);

      if (index === null) {
        const sectionObj = next.changes[section] as Record<string, any>;
        const currentField = sectionObj[field];

        sectionObj[field] = {
          ...currentField,
          resolved_value: newValue,
          status: getResolvedStatus(
            currentField.old_value,
            currentField.new_value,
            newValue,
          ),
        };
      } else {
        const entries = (
          next.changes[section] as { entries: Record<string, any>[] }
        ).entries;

        const currentField = entries[index][field];

        entries[index] = {
          ...entries[index],
          [field]: {
            ...currentField,
            resolved_value: newValue,
            status: getResolvedStatus(
              currentField.old_value,
              currentField.new_value,
              newValue,
            ),
          },
        };
      }

      next.updated_at = new Date().toISOString();
      return next;
    });
  };

  return (
    <div className="w-full h-full flex overflow-hidden">
      <AutoSaveNotification
        status={saveStatus}
        onClose={() => setSaveStatus(null)}
      />

      <main className="h-full min-h-0 flex-1 flex flex-col">
        <div className="w-full flex flex-col h-full">
          <div className="flex justify-between items-start mb-3 p-3">
            <div>
              <h1 className="text-lg text-text-primary">
                Enhance Resume Report
              </h1>
              <h3 className="text-xxs text-text-muted">
                Review your change. Accept or edit AI suggestions to finalize
                your resume.
              </h3>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto hide-scrollbar space-y-4 px-3">
            <section
              className="w-full flex-col border border-black/10 bg-white rounded-3xl overflow-clip pb-4"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="Profile"
                sectionIcon="ri:user-6-line"
              />

              <div className="w-full grid grid-cols-3 p-5 gap-3">
                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium">
                    FIRST NAME
                  </label>
                  <input
                    value={profile.first_name ?? ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "profile",
                        null,
                        "first_name",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                  />
                </fieldset>

                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium">
                    LAST NAME
                  </label>
                  <input
                    value={profile.last_name ?? ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "profile",
                        null,
                        "last_name",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                  />
                </fieldset>

                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium">
                    EMAIL
                  </label>
                  <input
                    value={profile.email ?? ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "profile",
                        null,
                        "email",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 border border-transparent outline-0 transition-colors focus:border-gray-300 text-text-primary text-xs"
                  />
                </fieldset>

                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium">
                    PHONE
                  </label>
                  <input
                    value={profile.phone ?? ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "profile",
                        null,
                        "phone",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                  />
                </fieldset>

                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium">
                    LOCATION
                  </label>
                  <input
                    value={profile.location ?? ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "profile",
                        null,
                        "location",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                  />
                </fieldset>

                <fieldset className="flex flex-col col-span-3">
                  <FieldLabel
                    label="PROFESSIONAL TITLE"
                    status={profile.professional_title?.status}
                  />
                  <AiDiffField
                    fieldData={profile.professional_title}
                    onUpdateValue={(val) =>
                      handleAiFieldUpdate(
                        "profile",
                        null,
                        "professional_title",
                        val,
                      )
                    }
                  />
                </fieldset>

                <fieldset className="flex flex-col col-span-3">
                  <FieldLabel
                    label="SUMMARY"
                    status={profile.summary?.status}
                  />
                  <AiDiffField
                    fieldData={profile.summary}
                    onUpdateValue={(val) =>
                      handleAiFieldUpdate("profile", null, "summary", val)
                    }
                  />
                </fieldset>
              </div>
            </section>

            <section
              className="w-full flex-col border border-black/10 bg-white rounded-3xl overflow-clip pb-4"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="Education"
                entriesCount={education.entries?.length}
                sectionIcon="qlementine-icons:education-16"
              />

              {education.entries?.map((edu: any, idx: number) => (
                <div
                  key={idx}
                  className="w-full grid grid-cols-2 p-5 gap-3 border-b last:border-b-0 border-black/5"
                >
                  <div className="col-span-2 text-xs font-medium text-text-primary">
                    #{idx + 1}
                  </div>

                  <fieldset className="flex flex-col">
                    <label className="text-tiny text-text-muted font-medium">
                      INSTITUTION
                    </label>
                    <input
                      value={edu.institution ?? ""}
                      onChange={(e) =>
                        handlePrimitiveChange(
                          "education",
                          idx,
                          "institution",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <label className="text-tiny text-text-muted font-medium">
                      LOCATION
                    </label>
                    <input
                      value={edu.location ?? ""}
                      onChange={(e) =>
                        handlePrimitiveChange(
                          "education",
                          idx,
                          "location",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <label className="text-tiny text-text-muted font-medium">
                      START DATE
                    </label>
                    <input
                      value={edu.start_date ?? ""}
                      onChange={(e) =>
                        handlePrimitiveChange(
                          "education",
                          idx,
                          "start_date",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <label className="text-tiny text-text-muted font-medium">
                      END DATE
                    </label>
                    <input
                      value={edu.end_date ?? ""}
                      onChange={(e) =>
                        handlePrimitiveChange(
                          "education",
                          idx,
                          "end_date",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                    />
                  </fieldset>

                  <fieldset className="flex flex-col col-span-2">
                    <FieldLabel label="DEGREE" status={edu.degree?.status} />
                    <AiDiffField
                      fieldData={edu.degree}
                      onUpdateValue={(val) =>
                        handleAiFieldUpdate("education", idx, "degree", val)
                      }
                    />
                  </fieldset>

                  <fieldset className="flex flex-col col-span-2">
                    <FieldLabel
                      label="DESCRIPTION"
                      status={edu.description?.status}
                    />
                    <AiDiffField
                      fieldData={edu.description}
                      onUpdateValue={(val) =>
                        handleAiFieldUpdate(
                          "education",
                          idx,
                          "description",
                          val,
                        )
                      }
                    />
                  </fieldset>
                </div>
              ))}
            </section>

            <section
              className="w-full flex-col border border-black/10 bg-white rounded-3xl overflow-clip pb-4"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="Work Experience"
                entriesCount={experience.entries?.length}
                sectionIcon="famicons:briefcase-outline"
              />

              {experience.entries?.map((exp: any, idx: number) => (
                <div
                  key={idx}
                  className="w-full grid grid-cols-2 p-5 gap-3 border-b last:border-b-0 border-black/5"
                >
                  <div className="col-span-2 text-xs font-medium text-text-primary">
                    #{idx + 1}
                  </div>

                  <fieldset className="flex flex-col">
                    <label className="text-tiny text-text-muted font-medium">
                      COMPANY
                    </label>
                    <input
                      value={exp.company ?? ""}
                      onChange={(e) =>
                        handlePrimitiveChange(
                          "experience",
                          idx,
                          "company",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <label className="text-tiny text-text-muted font-medium">
                      LOCATION
                    </label>
                    <input
                      value={exp.location ?? ""}
                      onChange={(e) =>
                        handlePrimitiveChange(
                          "experience",
                          idx,
                          "location",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <label className="text-tiny text-text-muted font-medium">
                      START DATE
                    </label>
                    <input
                      value={exp.start_date ?? ""}
                      onChange={(e) =>
                        handlePrimitiveChange(
                          "experience",
                          idx,
                          "start_date",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <label className="text-tiny text-text-muted font-medium">
                      END DATE
                    </label>
                    <input
                      value={exp.end_date ?? ""}
                      placeholder="Present"
                      onChange={(e) =>
                        handlePrimitiveChange(
                          "experience",
                          idx,
                          "end_date",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                    />
                  </fieldset>

                  <fieldset className="flex flex-col col-span-2">
                    <FieldLabel
                      label="POSITION"
                      status={exp.position?.status}
                    />
                    <AiDiffField
                      fieldData={exp.position}
                      onUpdateValue={(val) =>
                        handleAiFieldUpdate("experience", idx, "position", val)
                      }
                    />
                  </fieldset>

                  <fieldset className="flex flex-col col-span-2">
                    <FieldLabel
                      label="DESCRIPTION"
                      status={exp.description?.status}
                    />
                    <AiDiffField
                      fieldData={exp.description}
                      onUpdateValue={(val) =>
                        handleAiFieldUpdate(
                          "experience",
                          idx,
                          "description",
                          val,
                        )
                      }
                    />
                  </fieldset>
                </div>
              ))}
            </section>

            <section
              className="w-full flex-col border border-black/10 bg-white rounded-3xl overflow-clip pb-4"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="Projects"
                entriesCount={projects.entries?.length}
                sectionIcon="famicons:cube-outline"
              />

              {projects.entries?.map((project: any, idx: number) => (
                <div
                  key={idx}
                  className="w-full grid grid-cols-2 p-5 gap-3 border-b last:border-b-0 border-black/5"
                >
                  <div className="col-span-2 text-xs font-medium text-text-primary">
                    #{idx + 1}
                  </div>

                  <fieldset className="flex flex-col">
                    <label className="text-tiny text-text-muted font-medium">
                      TITLE
                    </label>
                    <input
                      value={project.title ?? ""}
                      onChange={(e) =>
                        handlePrimitiveChange(
                          "projects",
                          idx,
                          "title",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <label className="text-tiny text-text-muted font-medium">
                      START DATE
                    </label>
                    <input
                      value={project.start_date ?? ""}
                      onChange={(e) =>
                        handlePrimitiveChange(
                          "projects",
                          idx,
                          "start_date",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <label className="text-tiny text-text-muted font-medium">
                      END DATE
                    </label>
                    <input
                      value={project.end_date ?? ""}
                      onChange={(e) =>
                        handlePrimitiveChange(
                          "projects",
                          idx,
                          "end_date",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                    />
                  </fieldset>

                  <fieldset className="flex flex-col col-span-2">
                    <FieldLabel
                      label="SUBTITLE"
                      status={project.subtitle?.status}
                    />
                    <AiDiffField
                      fieldData={project.subtitle}
                      onUpdateValue={(val) =>
                        handleAiFieldUpdate("projects", idx, "subtitle", val)
                      }
                    />
                  </fieldset>

                  <fieldset className="flex flex-col col-span-2">
                    <FieldLabel
                      label="DESCRIPTION"
                      status={project.description?.status}
                    />
                    <AiDiffField
                      fieldData={project.description}
                      onUpdateValue={(val) =>
                        handleAiFieldUpdate("projects", idx, "description", val)
                      }
                    />
                  </fieldset>
                </div>
              ))}
            </section>

            <section
              className="w-full flex-col border border-black/10 bg-white rounded-3xl overflow-clip pb-4"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="Skills"
                entriesCount={skills.entries?.length}
                sectionIcon="hugeicons:compass-01"
              />

              {skills.entries?.map((skill: any, idx: number) => (
                <div
                  key={idx}
                  className="w-full grid grid-cols-2 p-5 gap-3 border-b last:border-b-0 border-black/5"
                >
                  <fieldset className="flex flex-col">
                    <FieldLabel
                      label="SKILL"
                      status={
                        skill.name?.old_value ? skill.name?.status : undefined
                      }
                    />
                    {skill.name?.old_value ? (
                      <AiDiffField
                        fieldData={skill.name}
                        onUpdateValue={(val) =>
                          handleAiFieldUpdate("skills", idx, "name", val)
                        }
                      />
                    ) : (
                      <input
                        value={skill.name ?? ""}
                        onChange={(e) =>
                          handlePrimitiveChange(
                            "skills",
                            idx,
                            "name",
                            e.target.value,
                          )
                        }
                        className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                      />
                    )}
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <label className="text-tiny text-text-muted font-medium">
                      LEVEL
                    </label>
                    <input
                      value={skill.level ?? ""}
                      onChange={(e) =>
                        handlePrimitiveChange(
                          "skills",
                          idx,
                          "level",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                    />
                  </fieldset>
                </div>
              ))}
            </section>

            <section
              className="w-full flex-col border border-black/10 bg-white rounded-3xl overflow-clip pb-4"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="Certificates"
                entriesCount={certificates.entries?.length}
                sectionIcon="ph:certificate"
              />

              {certificates.entries?.map((cert: any, idx: number) => (
                <div
                  key={idx}
                  className="w-full grid grid-cols-2 p-5 gap-3 border-b last:border-b-0 border-black/5"
                >
                  <fieldset className="flex flex-col col-span-2">
                    <FieldLabel label="NAME" status={cert.name?.status} />
                    <AiDiffField
                      fieldData={cert.name}
                      onUpdateValue={(val) =>
                        handleAiFieldUpdate("certificates", idx, "name", val)
                      }
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <label className="text-tiny text-text-muted font-medium">
                      ISSUER
                    </label>
                    <input
                      value={cert.issuer ?? ""}
                      onChange={(e) =>
                        handlePrimitiveChange(
                          "certificates",
                          idx,
                          "issuer",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <label className="text-tiny text-text-muted font-medium">
                      ISSUE DATE
                    </label>
                    <input
                      value={cert.issue_date ?? ""}
                      onChange={(e) =>
                        handlePrimitiveChange(
                          "certificates",
                          idx,
                          "issue_date",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <label className="text-tiny text-text-muted font-medium">
                      EXPIRY DATE
                    </label>
                    <input
                      value={cert.expiry_date ?? ""}
                      onChange={(e) =>
                        handlePrimitiveChange(
                          "certificates",
                          idx,
                          "expiry_date",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                    />
                  </fieldset>

                  <fieldset className="flex flex-col col-span-2">
                    <FieldLabel
                      label="DESCRIPTION"
                      status={cert.description?.status}
                    />
                    <AiDiffField
                      fieldData={cert.description}
                      onUpdateValue={(val) =>
                        handleAiFieldUpdate(
                          "certificates",
                          idx,
                          "description",
                          val,
                        )
                      }
                    />
                  </fieldset>
                </div>
              ))}
            </section>

            <section
              className="w-full flex-col border border-black/10 bg-white rounded-3xl overflow-clip pb-4"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="Languages"
                entriesCount={languages.entries?.length}
                sectionIcon="heroicons:language-solid"
              />

              {languages.entries?.map((lang: any, idx: number) => (
                <div
                  key={idx}
                  className="w-full grid grid-cols-2 p-5 gap-3 border-b last:border-b-0 border-black/5"
                >
                  <fieldset className="flex flex-col">
                    <label className="text-tiny text-text-muted font-medium">
                      LANGUAGE
                    </label>
                    <input
                      value={lang.name ?? ""}
                      onChange={(e) =>
                        handlePrimitiveChange(
                          "languages",
                          idx,
                          "name",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <label className="text-tiny text-text-muted font-medium">
                      LEVEL
                    </label>
                    <input
                      value={lang.level ?? ""}
                      onChange={(e) =>
                        handlePrimitiveChange(
                          "languages",
                          idx,
                          "level",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                    />
                  </fieldset>
                </div>
              ))}
            </section>

            <section
              className="w-full flex-col border border-black/10 bg-white rounded-3xl overflow-clip pb-4"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="Interests"
                entriesCount={interests.entries?.length}
                sectionIcon="solar:gamepad-linear"
              />

              <div className="w-full flex flex-wrap p-5 gap-2">
                {interests.entries?.map((interest: any, idx: number) => (
                  <input
                    key={idx}
                    value={interest.name ?? ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "interests",
                        idx,
                        "name",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF] px-2"
                  />
                ))}
              </div>
            </section>

            <section
              className="w-full flex-col border border-black/10 bg-white rounded-3xl overflow-clip pb-4"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="Awards"
                entriesCount={awards.entries?.length}
                sectionIcon="hugeicons:award-01"
              />

              {awards.entries?.map((award: any, idx: number) => (
                <div
                  key={idx}
                  className="w-full grid grid-cols-2 p-5 gap-3 border-b last:border-b-0 border-black/5"
                >
                  <fieldset className="flex flex-col col-span-2">
                    <FieldLabel label="TITLE" status={award.title?.status} />
                    <AiDiffField
                      fieldData={award.title}
                      onUpdateValue={(val) =>
                        handleAiFieldUpdate("awards", idx, "title", val)
                      }
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <label className="text-tiny text-text-muted font-medium">
                      AWARDER
                    </label>
                    <input
                      value={award.awarder ?? ""}
                      onChange={(e) =>
                        handlePrimitiveChange(
                          "awards",
                          idx,
                          "awarder",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <label className="text-tiny text-text-muted font-medium">
                      DATE
                    </label>
                    <input
                      value={award.date ?? ""}
                      onChange={(e) =>
                        handlePrimitiveChange(
                          "awards",
                          idx,
                          "date",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                    />
                  </fieldset>

                  <fieldset className="flex flex-col col-span-2">
                    <FieldLabel
                      label="DESCRIPTION"
                      status={award.description?.status}
                    />
                    <AiDiffField
                      fieldData={award.description}
                      onUpdateValue={(val) =>
                        handleAiFieldUpdate("awards", idx, "description", val)
                      }
                    />
                  </fieldset>
                </div>
              ))}
            </section>

            <section
              className="w-full flex-col border border-black/10 bg-white rounded-3xl overflow-clip pb-4"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="Publications"
                entriesCount={publications.entries?.length}
                sectionIcon="ph:books-light"
              />

              {publications.entries?.map((pub: any, idx: number) => (
                <div
                  key={idx}
                  className="w-full grid grid-cols-2 p-5 gap-3 border-b last:border-b-0 border-black/5"
                >
                  <fieldset className="flex flex-col col-span-2">
                    <FieldLabel label="TITLE" status={pub.title?.status} />
                    <AiDiffField
                      fieldData={pub.title}
                      onUpdateValue={(val) =>
                        handleAiFieldUpdate("publications", idx, "title", val)
                      }
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <label className="text-tiny text-text-muted font-medium">
                      PUBLISHER
                    </label>
                    <input
                      value={pub.publisher ?? ""}
                      onChange={(e) =>
                        handlePrimitiveChange(
                          "publications",
                          idx,
                          "publisher",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <label className="text-tiny text-text-muted font-medium">
                      DATE
                    </label>
                    <input
                      value={pub.date ?? ""}
                      onChange={(e) =>
                        handlePrimitiveChange(
                          "publications",
                          idx,
                          "date",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                    />
                  </fieldset>

                  <fieldset className="flex flex-col col-span-2">
                    <label className="text-tiny text-text-muted font-medium">
                      LINK
                    </label>
                    <input
                      value={pub.link ?? ""}
                      onChange={(e) =>
                        handlePrimitiveChange(
                          "publications",
                          idx,
                          "link",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                    />
                  </fieldset>

                  <fieldset className="flex flex-col col-span-2">
                    <FieldLabel
                      label="DESCRIPTION"
                      status={pub.description?.status}
                    />
                    <AiDiffField
                      fieldData={pub.description}
                      onUpdateValue={(val) =>
                        handleAiFieldUpdate(
                          "publications",
                          idx,
                          "description",
                          val,
                        )
                      }
                    />
                  </fieldset>
                </div>
              ))}
            </section>

            <section
              className="w-full flex-col border border-black/10 bg-white rounded-3xl overflow-clip pb-4"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="References"
                entriesCount={references.entries?.length}
                sectionIcon="bi:people"
              />

              {references.entries?.map((ref: any, idx: number) => (
                <div
                  key={idx}
                  className="w-full grid grid-cols-2 p-5 gap-3 border-b last:border-b-0 border-black/5"
                >
                  <fieldset className="flex flex-col">
                    <label className="text-tiny text-text-muted font-medium">
                      NAME
                    </label>
                    <input
                      value={ref.name ?? ""}
                      onChange={(e) =>
                        handlePrimitiveChange(
                          "references",
                          idx,
                          "name",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <label className="text-tiny text-text-muted font-medium">
                      POSITION
                    </label>
                    <input
                      value={ref.position ?? ""}
                      onChange={(e) =>
                        handlePrimitiveChange(
                          "references",
                          idx,
                          "position",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <label className="text-tiny text-text-muted font-medium">
                      ORGANIZATION
                    </label>
                    <input
                      value={ref.organization ?? ""}
                      onChange={(e) =>
                        handlePrimitiveChange(
                          "references",
                          idx,
                          "organization",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <label className="text-tiny text-text-muted font-medium">
                      EMAIL
                    </label>
                    <input
                      value={ref.email ?? ""}
                      onChange={(e) =>
                        handlePrimitiveChange(
                          "references",
                          idx,
                          "email",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <label className="text-tiny text-text-muted font-medium">
                      PHONE
                    </label>
                    <input
                      value={ref.phone ?? ""}
                      onChange={(e) =>
                        handlePrimitiveChange(
                          "references",
                          idx,
                          "phone",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                    />
                  </fieldset>
                </div>
              ))}
            </section>
          </div>
        </div>
      </main>

      <ScorePanel />
    </div>
  );
}
