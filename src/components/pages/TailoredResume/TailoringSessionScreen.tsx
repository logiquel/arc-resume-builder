import type { TailoredResume } from "#/api/resume/tailor/tailor-resume.types";
import { Icon } from "@iconify/react";
import type {
  AwardEntryChange,
  CertificateEntryChange,
  EducationEntryChange,
  ExperienceEntryChange,
  InterestEntryChange,
  LanguageEntryChange,
  ProjectEntryChange,
  PublicationEntryChange,
  ReferenceEntryChange,
  SkillEntryChange,
} from "#/types/resume/tailorSession.types";
import { useState, useCallback, useRef, useEffect } from "react";
import { produce } from "immer";
import { useAutoSaveTailoredResumeMutation } from "#/api/resume/tailor/tailor-resume.mutations";
import PrimitiveField from "./PrimitiveField";
import DiffField from "./DiffField";
import ScorePanel from "./ScorePanel";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/components/addons/tooltip";
import ExperienceForm from "./Forms/ExperienceForm";
import AwardForm from "./Forms/AwardForm";
import ProjectForm from "./Forms/ProjectForm";
import EducationForm from "./Forms/EducationForm";
import CertificateForm from "./Forms/CertificateForm";
import PublicationForm from "./Forms/PublicationForm";
import ReferenceForm from "./Forms/ReferenceForm";
import SkillForm from "./Forms/SkillForm";

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
  <div className="w-full flex items-center px-5 py-4 border-b border-black/5 top-0 bg-white z-10 shadow-[0_8px_16px_-8px_rgba(0,0,0,0.06),0_4px_8px_-4px_rgba(0,0,0,0.03)]">
    <Icon icon={sectionIcon} className="text-xs text-text-muted mr-1.5" />

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
          className={`flex items-center text-tiny font-medium uppercase before:content-[''] before:block before:w-[0.035rem] before:h-2 before:bg-current before:mr-2 cursor-pointer ${isAccepted ? "text-emerald-700" : "text-red-600"}`}
        >
          <Icon
            icon="akar-icons:info"
            className="text-text-muted text-tiny mr-1"
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

interface FieldLabelProps {
  label: string;
  status?: DiffStatus;
}

const FieldLabel: React.FC<FieldLabelProps> = ({ label, status }) => {
  return (
    <div className="flex items-center">
      <label className="text-tiny text-text-muted font-medium px-2">
        {label}
      </label>
      <FieldStatusBadge status={status} />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Auto-save pill
// ---------------------------------------------------------------------------
type SaveStatus = "idle" | "saving" | "saved";
const AutoSavePill: React.FC<{ status: SaveStatus }> = ({ status }) => {
  const isVisible = status !== "idle";

  return (
    <div
      className={[
        "absolute w-fit py-2 px-3 gap-x-1.5 flex items-center border border-black/10 mx-auto left-0 right-0 mt-2 bg-white rounded-lg",
        "transition-all duration-300 ease-in-out",
        status === "saving"
          ? "shadow-[0_0_20px_rgba(251,191,36,0.2)]"
          : "shadow-[0_0_20px_rgba(59,130,246,0.15)]",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-1 pointer-events-none",
      ].join(" ")}
    >
      {status === "saving" ? (
        <Icon
          icon="si:spinner-fill"
          className="text-amber-400 text-xs animate-spin"
        />
      ) : (
        <Icon icon="line-md:check-all" className="text-green-500 text-xs" />
      )}
      <span className="text-xxs text-text-secondary font-medium">
        {status === "saving" ? "Saving…" : "Changes Saved"}
      </span>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Type guard: checks if object is a DiffField
// ---------------------------------------------------------------------------
function isDiffField(field: unknown): field is {
  old_value: unknown;
  new_value: unknown;
  status: string;
  resolved_value?: unknown;
} {
  return (
    field !== null &&
    typeof field === "object" &&
    "old_value" in (field as object) &&
    "new_value" in (field as object) &&
    "status" in (field as object)
  );
}

// ---------------------------------------------------------------------------
// Helpers for rendering
// ---------------------------------------------------------------------------
function isFieldResolved(field: unknown): boolean {
  if (!isDiffField(field)) return true;
  return field.resolved_value !== undefined || field.status !== "pending";
}

function resolvedDisplayValue(field: unknown): unknown {
  if (!isDiffField(field)) return field ?? "";
  return field.resolved_value ?? field.new_value ?? "";
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
interface TailoringSessionScreenProps {
  tailorSession: TailoredResume;
  sessionId: string;
}

const TailoringSessionScreen: React.FC<TailoringSessionScreenProps> = ({
  tailorSession,
  sessionId,
}) => {
  const [changes, setChanges] = useState<TailoredResume["changes"]>(
    () =>
      JSON.parse(
        JSON.stringify(tailorSession.changes ?? {}),
      ) as TailoredResume["changes"],
  );

  // Keep a ref in sync so the debounced save always reads the latest state
  const changesRef = useRef(changes);
  changesRef.current = changes;

  // ── Auto-save ────────────────────────────────────────────────────────────
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track whether this is the very first render (skip auto-save on mount)
  const isFirstRender = useRef(true);

  const autoSave = useAutoSaveTailoredResumeMutation(sessionId);

  // Trigger debounced save whenever `changes` updates (except on mount)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Clear any pending timers
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);

    // Show saving pill immediately when the user makes a change
    setSaveStatus("saving");

    // Debounce the actual network call by 1.5s
    debounceTimer.current = setTimeout(() => {
      autoSave.mutate(
        { changes: changesRef.current },
        {
          onSuccess: () => {
            setSaveStatus("saved");
            // Slide the pill away after 2s
            hideTimer.current = setTimeout(() => {
              setSaveStatus("idle");
            }, 2000);
          },
          onError: () => {
            // On error just hide the pill — the mutation already logs silently
            setSaveStatus("idle");
          },
        },
      );
    }, 1500);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [changes]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  // ── Update any field (Primitive or resolved DiffField) ─────────────────
  const updateField = useCallback(
    (path: (string | number)[], value: unknown) => {
      setChanges(
        produce((draft) => {
          let node: any = draft;

          for (let i = 0; i < path.length - 1; i++) {
            node = node[path[i]];
          }

          const lastKey = path[path.length - 1];
          const target = node[lastKey];

          if (isDiffField(target)) {
            target.resolved_value = value;
            target.status = "accepted";
          } else {
            node[lastKey] = value;
          }
        }),
      );
    },
    [],
  );

  // ── Resolve a DiffField (Accept/Reject) ────────────────────────────────
  const handleResolveField = useCallback(
    (path: (string | number)[], isAccepted: boolean) => {
      setChanges(
        produce((draft) => {
          let node: any = draft;

          for (let i = 0; i < path.length; i++) {
            node = node[path[i]];
          }

          if (!isDiffField(node)) return;

          node.resolved_value = isAccepted ? node.new_value : node.old_value;
          node.status = isAccepted ? "accepted" : "rejected";
        }),
      );
    },
    [],
  );

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
  } = changes ?? {};

  return (
    <div className="w-full h-full flex overflow-hidden">
      <main className="relative h-full min-h-0 flex-1 flex flex-col">
        <AutoSavePill status={saveStatus} />
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
            {/* Auto-save pill */}
          </div>

          <div className="flex-1 overflow-y-auto hide-scrollbar space-y-4 px-3 pb-3">
            {/* Profile Section */}
            <section
              className="w-full min-h-50 flex-col border border-black/10 bg-white rounded-3xl overflow-clip pb-4"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="Profile"
                sectionIcon="ri:user-6-line"
              />
              <div className="w-full grid grid-cols-3 p-5 gap-3">
                <fieldset className="flex flex-col">
                  <FieldLabel label="FIRST NAME" />
                  <PrimitiveField
                    value={profile?.first_name ?? ""}
                    onChange={(value) =>
                      updateField(["profile", "first_name"], value)
                    }
                  />
                </fieldset>

                <fieldset className="flex flex-col">
                  <FieldLabel label="LAST NAME" />
                  <PrimitiveField
                    value={profile?.last_name ?? ""}
                    onChange={(value) =>
                      updateField(["profile", "last_name"], value)
                    }
                  />
                </fieldset>

                <fieldset className="flex flex-col">
                  <FieldLabel label="EMAIL ADDRESS" />
                  <PrimitiveField
                    value={profile?.email ?? ""}
                    onChange={(value) =>
                      updateField(["profile", "email"], value)
                    }
                  />
                </fieldset>

                <fieldset className="flex flex-col">
                  <FieldLabel label="PHONE" />
                  <PrimitiveField
                    value={profile?.phone ?? ""}
                    onChange={(value) =>
                      updateField(["profile", "phone"], value)
                    }
                  />
                </fieldset>

                <fieldset className="flex flex-col">
                  <FieldLabel label="LOCATION" />
                  <PrimitiveField
                    value={profile?.location ?? ""}
                    onChange={(value) =>
                      updateField(["profile", "location"], value)
                    }
                  />
                </fieldset>

                <fieldset className="flex flex-col col-span-3">
                  <FieldLabel
                    label="PROFESSIONAL TITLE"
                    status={profile?.professional_title?.status}
                  />
                  {profile?.professional_title?.is_changed &&
                  !isFieldResolved(profile.professional_title) ? (
                    <DiffField
                      field={profile.professional_title}
                      onAccept={() =>
                        handleResolveField(
                          ["profile", "professional_title"],
                          true,
                        )
                      }
                      onReject={() =>
                        handleResolveField(
                          ["profile", "professional_title"],
                          false,
                        )
                      }
                    />
                  ) : (
                    <PrimitiveField
                      value={
                        resolvedDisplayValue(
                          profile?.professional_title,
                        ) as string
                      }
                      onChange={(value) =>
                        updateField(["profile", "professional_title"], value)
                      }
                    />
                  )}
                </fieldset>

                <fieldset className="flex flex-col col-span-3">
                  <FieldLabel
                    label="SUMMARY"
                    status={profile?.summary?.status}
                  />
                  {profile?.summary?.is_changed &&
                  !isFieldResolved(profile.summary) ? (
                    <DiffField
                      field={profile.summary}
                      onAccept={() =>
                        handleResolveField(["profile", "summary"], true)
                      }
                      onReject={() =>
                        handleResolveField(["profile", "summary"], false)
                      }
                    />
                  ) : (
                    <PrimitiveField
                      value={resolvedDisplayValue(profile?.summary) as string}
                      onChange={(value) =>
                        updateField(["profile", "summary"], value)
                      }
                    />
                  )}
                </fieldset>
              </div>
            </section>

            {/* Education Section */}
            <section
              className="w-full min-h-50 flex-col border border-black/10 bg-white rounded-3xl overflow-clip"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="Education"
                sectionIcon="ri:graduation-cap-line"
              />
              {education?.map((edu: EducationEntryChange, edIndex: number) => (
                <div className="w-full flex-col" key={edu.entry_id}>
                  <div
                    className={`bg-gray-50 px-6 py-2 flex items-center col-span-3 gap-x-3 text-tiny font-medium text-text-secondary border-black/5 ${
                      edIndex === 0 ? "border-b" : "border-y"
                    }`}
                  >
                    #{edIndex + 1}
                  </div>
                  <div className="w-full grid grid-cols-3 gap-3 p-5">
                    <fieldset className="flex flex-col">
                      <FieldLabel label="INSTITUTION" />
                      <PrimitiveField
                        value={edu.institution ?? ""}
                        onChange={(value) =>
                          updateField(
                            ["education", edIndex, "institution"],
                            value,
                          )
                        }
                      />
                    </fieldset>

                    <fieldset className="flex flex-col">
                      <FieldLabel label="LOCATION" />
                      <PrimitiveField
                        value={edu.location ?? ""}
                        onChange={(value) =>
                          updateField(["education", edIndex, "location"], value)
                        }
                      />
                    </fieldset>

                    <fieldset className="flex flex-col">
                      <FieldLabel label="LINK" />
                      <PrimitiveField
                        value={edu.link ?? ""}
                        onChange={(value) =>
                          updateField(["education", edIndex, "link"], value)
                        }
                      />
                    </fieldset>

                    <fieldset className="flex flex-col">
                      <FieldLabel label="START DATE" />
                      <PrimitiveField
                        value={edu.start_date ?? ""}
                        onChange={(value) =>
                          updateField(
                            ["education", edIndex, "start_date"],
                            value,
                          )
                        }
                      />
                    </fieldset>

                    <fieldset className="flex flex-col">
                      <FieldLabel label="END DATE" />
                      <PrimitiveField
                        value={edu.end_date ?? ""}
                        onChange={(value) =>
                          updateField(["education", edIndex, "end_date"], value)
                        }
                      />
                    </fieldset>

                    <fieldset className="flex flex-col">
                      <FieldLabel label="SCORE / GPA" />
                      <PrimitiveField
                        value={edu.score ?? ""}
                        onChange={(value) =>
                          updateField(["education", edIndex, "score"], value)
                        }
                      />
                    </fieldset>

                    <fieldset className="flex flex-col col-span-3">
                      <FieldLabel label="DEGREE" status={edu.degree?.status} />
                      {edu.degree?.is_changed &&
                      !isFieldResolved(edu.degree) ? (
                        <DiffField
                          field={edu.degree}
                          onAccept={() =>
                            handleResolveField(
                              ["education", edIndex, "degree"],
                              true,
                            )
                          }
                          onReject={() =>
                            handleResolveField(
                              ["education", edIndex, "degree"],
                              false,
                            )
                          }
                        />
                      ) : (
                        <PrimitiveField
                          value={resolvedDisplayValue(edu.degree) as string}
                          onChange={(value) =>
                            updateField(["education", edIndex, "degree"], value)
                          }
                        />
                      )}
                    </fieldset>

                    <fieldset className="flex flex-col col-span-3">
                      <FieldLabel
                        label="DESCRIPTION"
                        status={edu.description?.status}
                      />
                      {edu.description?.is_changed &&
                      !isFieldResolved(edu.description) ? (
                        <DiffField
                          field={edu.description}
                          onAccept={() =>
                            handleResolveField(
                              ["education", edIndex, "description"],
                              true,
                            )
                          }
                          onReject={() =>
                            handleResolveField(
                              ["education", edIndex, "description"],
                              false,
                            )
                          }
                        />
                      ) : (
                        <PrimitiveField
                          value={
                            resolvedDisplayValue(edu.description) as
                              | string
                              | string[]
                          }
                          onChange={(value) =>
                            updateField(
                              ["education", edIndex, "description"],
                              value,
                            )
                          }
                        />
                      )}
                    </fieldset>
                  </div>
                </div>
              ))}
              <div className="w-full px-2 py-3">
                <div className="w-full flex items-center border-2 border-dashed border-brand/10 bg-gray-50 py-3 rounded-md">
                  <span className="text-xxs text-text-muted mx-auto">
                    Add a new education entry
                  </span>
                </div>
              </div>
            </section>

            {/* Work Experience Section */}
            <section
              className="w-full min-h-50 flex-col border border-black/10 bg-white rounded-3xl overflow-clip pb-4"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="Experience"
                sectionIcon="famicons:briefcase-outline"
              />

              {experience?.map(
                (exp: ExperienceEntryChange, exIndex: number) => (
                  <div className="w-full flex-col" key={exp.entry_id}>
                    <div
                      className={`bg-gray-50 px-6 py-2 flex items-center col-span-3 gap-x-3 text-tiny font-medium text-text-secondary border-black/5 ${
                        exIndex === 0 ? "border-b" : "border-y"
                      }`}
                    >
                      #{exIndex + 1}
                    </div>
                    <div className="w-full grid grid-cols-3 gap-3 mb-4 last:mb-0 p-5">
                      <fieldset className="flex flex-col">
                        <FieldLabel label="COMPANY" />
                        <PrimitiveField
                          value={exp.company ?? ""}
                          onChange={(value) =>
                            updateField(
                              ["experience", exIndex, "company"],
                              value,
                            )
                          }
                        />
                      </fieldset>

                      <fieldset className="flex flex-col">
                        <FieldLabel label="LOCATION" />
                        <PrimitiveField
                          value={exp.location ?? ""}
                          onChange={(value) =>
                            updateField(
                              ["experience", exIndex, "location"],
                              value,
                            )
                          }
                        />
                      </fieldset>

                      <fieldset className="flex flex-col">
                        <FieldLabel label="START DATE" />
                        <PrimitiveField
                          value={exp.start_date ?? ""}
                          onChange={(value) =>
                            updateField(
                              ["experience", exIndex, "start_date"],
                              value,
                            )
                          }
                        />
                      </fieldset>

                      <fieldset className="flex flex-col">
                        <FieldLabel label="END DATE" />
                        <PrimitiveField
                          value={exp.end_date ?? ""}
                          onChange={(value) =>
                            updateField(
                              ["experience", exIndex, "end_date"],
                              value,
                            )
                          }
                        />
                      </fieldset>

                      <fieldset className="flex flex-col col-span-3">
                        <FieldLabel
                          label="POSITION"
                          status={exp.position?.status}
                        />
                        {exp.position?.is_changed &&
                        !isFieldResolved(exp.position) ? (
                          <DiffField
                            field={exp.position}
                            onAccept={() =>
                              handleResolveField(
                                ["experience", exIndex, "position"],
                                true,
                              )
                            }
                            onReject={() =>
                              handleResolveField(
                                ["experience", exIndex, "position"],
                                false,
                              )
                            }
                          />
                        ) : (
                          <PrimitiveField
                            value={resolvedDisplayValue(exp.position) as string}
                            onChange={(value) =>
                              updateField(
                                ["experience", exIndex, "position"],
                                value,
                              )
                            }
                          />
                        )}
                      </fieldset>

                      <fieldset className="flex flex-col col-span-3">
                        <FieldLabel
                          label="DESCRIPTION"
                          status={exp.description?.status}
                        />
                        {exp.description?.is_changed &&
                        !isFieldResolved(exp.description) ? (
                          <DiffField
                            field={exp.description}
                            onAccept={() =>
                              handleResolveField(
                                ["experience", exIndex, "description"],
                                true,
                              )
                            }
                            onReject={() =>
                              handleResolveField(
                                ["experience", exIndex, "description"],
                                false,
                              )
                            }
                          />
                        ) : (
                          <PrimitiveField
                            value={
                              resolvedDisplayValue(exp.description) as
                                | string
                                | string[]
                            }
                            onChange={(value) =>
                              updateField(
                                ["experience", exIndex, "description"],
                                value,
                              )
                            }
                          />
                        )}
                      </fieldset>
                    </div>
                  </div>
                ),
              )}
              <div className="w-full px-2 py-3">
                <div className="w-full flex items-center border-2 border-dashed border-brand/10 bg-gray-50 py-3 rounded-md">
                  <span className="text-xxs text-text-muted mx-auto">
                    Add a new experience entry
                  </span>
                </div>
              </div>
            </section>

            {/* Projects Section */}
            <section
              className="w-full min-h-50 flex-col border border-black/10 bg-white rounded-3xl overflow-clip pb-4"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="Projects"
                sectionIcon="famicons:cube-outline"
              />
              {projects?.map((project: ProjectEntryChange, pjIndex: number) => (
                <div className="w-full flex-col" key={project.entry_id}>
                  <div
                    className={`bg-gray-50 px-6 py-2 flex items-center col-span-3 gap-x-3 text-tiny font-medium text-text-secondary border-black/5 ${
                      pjIndex === 0 ? "border-b" : "border-y"
                    }`}
                  >
                    #{pjIndex + 1}
                  </div>
                  <div className="w-full grid grid-cols-3 gap-3 mb-4 last:mb-0 p-5">
                    <fieldset className="flex flex-col">
                      <FieldLabel label="TITLE" />
                      <PrimitiveField
                        value={project.title ?? ""}
                        onChange={(value) =>
                          updateField(["projects", pjIndex, "title"], value)
                        }
                      />
                    </fieldset>

                    <fieldset className="flex flex-col">
                      <FieldLabel label="LINK" />
                      <PrimitiveField
                        value={project.link ?? ""}
                        onChange={(value) =>
                          updateField(["projects", pjIndex, "link"], value)
                        }
                      />
                    </fieldset>

                    <fieldset className="flex flex-col">
                      <FieldLabel label="START DATE" />
                      <PrimitiveField
                        value={project.start_date ?? ""}
                        onChange={(value) =>
                          updateField(
                            ["projects", pjIndex, "start_date"],
                            value,
                          )
                        }
                      />
                    </fieldset>

                    <fieldset className="flex flex-col">
                      <FieldLabel label="END DATE" />
                      <PrimitiveField
                        value={project.end_date ?? ""}
                        onChange={(value) =>
                          updateField(["projects", pjIndex, "end_date"], value)
                        }
                      />
                    </fieldset>

                    <fieldset className="flex flex-col col-span-3">
                      <FieldLabel
                        label="SUBTITLE"
                        status={project.subtitle?.status}
                      />
                      {project.subtitle?.is_changed &&
                      !isFieldResolved(project.subtitle) ? (
                        <DiffField
                          field={project.subtitle}
                          onAccept={() =>
                            handleResolveField(
                              ["projects", pjIndex, "subtitle"],
                              true,
                            )
                          }
                          onReject={() =>
                            handleResolveField(
                              ["projects", pjIndex, "subtitle"],
                              false,
                            )
                          }
                        />
                      ) : (
                        <PrimitiveField
                          value={
                            resolvedDisplayValue(project.subtitle) as string
                          }
                          onChange={(value) =>
                            updateField(
                              ["projects", pjIndex, "subtitle"],
                              value,
                            )
                          }
                        />
                      )}
                    </fieldset>

                    <fieldset className="flex flex-col col-span-3">
                      <FieldLabel
                        label="DESCRIPTION"
                        status={project.description?.status}
                      />
                      {project.description?.is_changed &&
                      !isFieldResolved(project.description) ? (
                        <DiffField
                          field={project.description}
                          onAccept={() =>
                            handleResolveField(
                              ["projects", pjIndex, "description"],
                              true,
                            )
                          }
                          onReject={() =>
                            handleResolveField(
                              ["projects", pjIndex, "description"],
                              false,
                            )
                          }
                        />
                      ) : (
                        <PrimitiveField
                          value={
                            resolvedDisplayValue(project.description) as
                              | string
                              | string[]
                          }
                          onChange={(value) =>
                            updateField(
                              ["projects", pjIndex, "description"],
                              value,
                            )
                          }
                        />
                      )}
                    </fieldset>
                  </div>
                </div>
              ))}
            </section>

            {/* Skills Section */}
            <section
              className="w-full min-h-50 flex-col border border-black/10 bg-white rounded-3xl overflow-clip pb-4"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="Skills"
                sectionIcon="hugeicons:compass-01"
              />
              <div className="w-full grid grid-cols-3 gap-3 p-5">
                {skills?.map((skill: SkillEntryChange, skIndex: number) => (
                  <fieldset key={skill.entry_id} className="flex flex-col">
                    <FieldLabel
                      label={`SKILL ${skIndex + 1}`}
                      status={skill.name?.status}
                    />
                    {skill.name.is_changed && !isFieldResolved(skill.name) ? (
                      <DiffField
                        field={skill.name}
                        onAccept={() =>
                          handleResolveField(["skills", skIndex, "name"], true)
                        }
                        onReject={() =>
                          handleResolveField(["skills", skIndex, "name"], false)
                        }
                      />
                    ) : (
                      <PrimitiveField
                        value={resolvedDisplayValue(skill.name) as string}
                        onChange={(value) =>
                          updateField(["skills", skIndex, "name"], value)
                        }
                      />
                    )}
                  </fieldset>
                ))}
              </div>
            </section>

            {/* Certificates Section */}
            <section
              className="w-full min-h-50 flex-col border border-black/10 bg-white rounded-3xl overflow-clip pb-4"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="Certificates"
                sectionIcon="ri:certificate-line"
              />
              {certificates?.map(
                (cert: CertificateEntryChange, cfIndex: number) => (
                  <div className="w-full flex-col" key={cert.entry_id}>
                    <div
                      className={`bg-gray-50 px-6 py-2 flex items-center col-span-3 gap-x-3 text-tiny font-medium text-text-secondary border-black/5 ${
                        cfIndex === 0 ? "border-b" : "border-y"
                      }`}
                    >
                      #{cfIndex + 1}
                    </div>
                    <div className="w-full grid grid-cols-3 gap-3 mb-4 last:mb-0 p-5">
                      <fieldset className="flex flex-col">
                        <FieldLabel label="ISSUER" />
                        <PrimitiveField
                          value={cert.issuer ?? ""}
                          onChange={(value) =>
                            updateField(
                              ["certificates", cfIndex, "issuer"],
                              value,
                            )
                          }
                        />
                      </fieldset>

                      <fieldset className="flex flex-col">
                        <FieldLabel label="ISSUE DATE" />
                        <PrimitiveField
                          value={cert.issue_date ?? ""}
                          onChange={(value) =>
                            updateField(
                              ["certificates", cfIndex, "issue_date"],
                              value,
                            )
                          }
                        />
                      </fieldset>

                      <fieldset className="flex flex-col">
                        <FieldLabel label="EXPIRY DATE" />
                        <PrimitiveField
                          value={cert.expiry_date ?? ""}
                          onChange={(value) =>
                            updateField(
                              ["certificates", cfIndex, "expiry_date"],
                              value,
                            )
                          }
                        />
                      </fieldset>

                      <fieldset className="flex flex-col col-span-3">
                        <FieldLabel label="LINK" />
                        <PrimitiveField
                          value={cert.link ?? ""}
                          onChange={(value) =>
                            updateField(
                              ["certificates", cfIndex, "link"],
                              value,
                            )
                          }
                        />
                      </fieldset>

                      <fieldset className="flex flex-col col-span-3">
                        <FieldLabel label="NAME" status={cert.name?.status} />
                        {cert.name?.is_changed &&
                        !isFieldResolved(cert.name) ? (
                          <DiffField
                            field={cert.name}
                            onAccept={() =>
                              handleResolveField(
                                ["certificates", cfIndex, "name"],
                                true,
                              )
                            }
                            onReject={() =>
                              handleResolveField(
                                ["certificates", cfIndex, "name"],
                                false,
                              )
                            }
                          />
                        ) : (
                          <PrimitiveField
                            value={resolvedDisplayValue(cert.name) as string}
                            onChange={(value) =>
                              updateField(
                                ["certificates", cfIndex, "name"],
                                value,
                              )
                            }
                          />
                        )}
                      </fieldset>

                      <fieldset className="flex flex-col col-span-3">
                        <FieldLabel
                          label="DESCRIPTION"
                          status={cert.description?.status}
                        />
                        {cert.description?.is_changed &&
                        !isFieldResolved(cert.description) ? (
                          <DiffField
                            field={cert.description}
                            onAccept={() =>
                              handleResolveField(
                                ["certificates", cfIndex, "description"],
                                true,
                              )
                            }
                            onReject={() =>
                              handleResolveField(
                                ["certificates", cfIndex, "description"],
                                false,
                              )
                            }
                          />
                        ) : (
                          <PrimitiveField
                            value={
                              resolvedDisplayValue(cert.description) as
                                | string
                                | string[]
                            }
                            onChange={(value) =>
                              updateField(
                                ["certificates", cfIndex, "description"],
                                value,
                              )
                            }
                          />
                        )}
                      </fieldset>
                    </div>
                  </div>
                ),
              )}
            </section>

            {/* Languages Section */}
            <section
              className="w-full min-h-50 flex-col border border-black/10 bg-white rounded-3xl overflow-clip pb-4"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="Languages"
                sectionIcon="heroicons:language-solid"
              />
              <div className="w-full grid grid-cols-2 gap-3 p-5">
                {languages?.map(
                  (lang: LanguageEntryChange, lgIndex: number) => (
                    <div key={lang.entry_id} className="flex flex-col gap-2">
                      <fieldset className="flex flex-col">
                        <FieldLabel label="LANGUAGE" />
                        <PrimitiveField
                          value={lang.name ?? ""}
                          onChange={(value) =>
                            updateField(["languages", lgIndex, "name"], value)
                          }
                        />
                      </fieldset>
                      <fieldset className="flex flex-col">
                        <FieldLabel label="LEVEL" />
                        <PrimitiveField
                          value={lang.level ?? ""}
                          onChange={(value) =>
                            updateField(["languages", lgIndex, "level"], value)
                          }
                        />
                      </fieldset>
                    </div>
                  ),
                )}
              </div>
            </section>

            {/* Interests Section */}
            <section
              className="w-full min-h-50 flex-col border border-black/10 bg-white rounded-3xl overflow-clip pb-4"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="Interests"
                sectionIcon="solar:gamepad-linear"
              />
              <div className="w-full grid grid-cols-2 gap-3 p-5">
                {interests?.map(
                  (interest: InterestEntryChange, intIndex: number) => (
                    <fieldset key={interest.entry_id} className="flex flex-col">
                      <FieldLabel label="INTEREST" />
                      <PrimitiveField
                        value={interest.name ?? ""}
                        onChange={(value) =>
                          updateField(["interests", intIndex, "name"], value)
                        }
                      />
                    </fieldset>
                  ),
                )}
              </div>
            </section>

            {/* Awards Section */}
            <section
              className="w-full min-h-50 flex-col border border-black/10 bg-white rounded-3xl overflow-clip pb-4"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="Awards"
                sectionIcon="ri:trophy-line"
              />
              {awards?.map((award: AwardEntryChange, awIndex: number) => (
                <div className="w-full flex-col" key={award.entry_id}>
                  <div
                    className={`bg-gray-50 px-6 py-2 flex items-center col-span-3 gap-x-3 text-tiny font-medium text-text-secondary border-black/5 ${
                      awIndex === 0 ? "border-b" : "border-y"
                    }`}
                  >
                    #{awIndex + 1}
                  </div>
                  <div className="w-full grid grid-cols-3 gap-3 mb-4 last:mb-0 p-5">
                    <fieldset className="flex flex-col">
                      <FieldLabel label="AWARDER" />
                      <PrimitiveField
                        value={award.awarder ?? ""}
                        onChange={(value) =>
                          updateField(["awards", awIndex, "awarder"], value)
                        }
                      />
                    </fieldset>

                    <fieldset className="flex flex-col">
                      <FieldLabel label="DATE" />
                      <PrimitiveField
                        value={award.date ?? ""}
                        onChange={(value) =>
                          updateField(["awards", awIndex, "date"], value)
                        }
                      />
                    </fieldset>

                    <fieldset className="flex flex-col col-span-3">
                      <FieldLabel label="TITLE" status={award.title?.status} />
                      {award.title?.is_changed &&
                      !isFieldResolved(award.title) ? (
                        <DiffField
                          field={award.title}
                          onAccept={() =>
                            handleResolveField(
                              ["awards", awIndex, "title"],
                              true,
                            )
                          }
                          onReject={() =>
                            handleResolveField(
                              ["awards", awIndex, "title"],
                              false,
                            )
                          }
                        />
                      ) : (
                        <PrimitiveField
                          value={resolvedDisplayValue(award.title) as string}
                          onChange={(value) =>
                            updateField(["awards", awIndex, "title"], value)
                          }
                        />
                      )}
                    </fieldset>

                    <fieldset className="flex flex-col col-span-3">
                      <FieldLabel
                        label="DESCRIPTION"
                        status={award.description?.status}
                      />
                      {award.description?.is_changed &&
                      !isFieldResolved(award.description) ? (
                        <DiffField
                          field={award.description}
                          onAccept={() =>
                            handleResolveField(
                              ["awards", awIndex, "description"],
                              true,
                            )
                          }
                          onReject={() =>
                            handleResolveField(
                              ["awards", awIndex, "description"],
                              false,
                            )
                          }
                        />
                      ) : (
                        <PrimitiveField
                          value={
                            resolvedDisplayValue(award.description) as
                              | string
                              | string[]
                          }
                          onChange={(value) =>
                            updateField(
                              ["awards", awIndex, "description"],
                              value,
                            )
                          }
                        />
                      )}
                    </fieldset>
                  </div>
                </div>
              ))}
            </section>

            {/* Publications Section */}
            <section
              className="w-full min-h-50 flex-col border border-black/10 bg-white rounded-3xl overflow-clip pb-4"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="Publications"
                sectionIcon="ri:article-line"
              />
              {publications?.map(
                (pub: PublicationEntryChange, pbIndex: number) => (
                  <div className="w-full flex-col" key={pub.entry_id}>
                    <div
                      className={`bg-gray-50 px-6 py-2 flex items-center col-span-3 gap-x-3 text-tiny font-medium text-text-secondary border-black/5 ${
                        pbIndex === 0 ? "border-b" : "border-y"
                      }`}
                    >
                      #{pbIndex + 1}
                    </div>
                    <div className="w-full grid grid-cols-3 gap-3 mb-4 last:mb-0 p-5">
                      <fieldset className="flex flex-col">
                        <FieldLabel label="PUBLISHER" />
                        <PrimitiveField
                          value={pub.publisher ?? ""}
                          onChange={(value) =>
                            updateField(
                              ["publications", pbIndex, "publisher"],
                              value,
                            )
                          }
                        />
                      </fieldset>

                      <fieldset className="flex flex-col">
                        <FieldLabel label="DATE" />
                        <PrimitiveField
                          value={pub.date ?? ""}
                          onChange={(value) =>
                            updateField(
                              ["publications", pbIndex, "date"],
                              value,
                            )
                          }
                        />
                      </fieldset>

                      <fieldset className="flex flex-col col-span-3">
                        <FieldLabel label="LINK" />
                        <PrimitiveField
                          value={pub.link ?? ""}
                          onChange={(value) =>
                            updateField(
                              ["publications", pbIndex, "link"],
                              value,
                            )
                          }
                        />
                      </fieldset>

                      <fieldset className="flex flex-col col-span-3">
                        <FieldLabel label="TITLE" status={pub.title?.status} />
                        {pub.title?.is_changed &&
                        !isFieldResolved(pub.title) ? (
                          <DiffField
                            field={pub.title}
                            onAccept={() =>
                              handleResolveField(
                                ["publications", pbIndex, "title"],
                                true,
                              )
                            }
                            onReject={() =>
                              handleResolveField(
                                ["publications", pbIndex, "title"],
                                false,
                              )
                            }
                          />
                        ) : (
                          <PrimitiveField
                            value={resolvedDisplayValue(pub.title) as string}
                            onChange={(value) =>
                              updateField(
                                ["publications", pbIndex, "title"],
                                value,
                              )
                            }
                          />
                        )}
                      </fieldset>

                      <fieldset className="flex flex-col col-span-3">
                        <FieldLabel
                          label="DESCRIPTION"
                          status={pub.description?.status}
                        />
                        {pub.description?.is_changed &&
                        !isFieldResolved(pub.description) ? (
                          <DiffField
                            field={pub.description}
                            onAccept={() =>
                              handleResolveField(
                                ["publications", pbIndex, "description"],
                                true,
                              )
                            }
                            onReject={() =>
                              handleResolveField(
                                ["publications", pbIndex, "description"],
                                false,
                              )
                            }
                          />
                        ) : (
                          <PrimitiveField
                            value={
                              resolvedDisplayValue(pub.description) as
                                | string
                                | string[]
                            }
                            onChange={(value) =>
                              updateField(
                                ["publications", pbIndex, "description"],
                                value,
                              )
                            }
                          />
                        )}
                      </fieldset>
                    </div>
                  </div>
                ),
              )}
            </section>

            {/* References Section */}
            <section
              className="w-full min-h-50 flex-col border border-black/10 bg-white rounded-3xl overflow-clip pb-4"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="References"
                sectionIcon="ri:user-star-line"
              />
              {references?.map((ref: ReferenceEntryChange, rfIndex: number) => (
                <div className="w-full flex-col" key={ref.entry_id}>
                  <div
                    className={`bg-gray-50 px-6 py-2 flex items-center col-span-3 gap-x-3 text-tiny font-medium text-text-secondary border-black/5 ${
                      rfIndex === 0 ? "border-b" : "border-y"
                    }`}
                  >
                    #{rfIndex + 1}
                  </div>
                  <div className="w-full grid grid-cols-2 gap-3 mb-4 last:mb-0 p-5">
                    <fieldset className="flex flex-col">
                      <FieldLabel label="NAME" />
                      <PrimitiveField
                        value={ref.name ?? ""}
                        onChange={(value) =>
                          updateField(["references", rfIndex, "name"], value)
                        }
                      />
                    </fieldset>

                    <fieldset className="flex flex-col">
                      <FieldLabel label="POSITION" />
                      <PrimitiveField
                        value={ref.position ?? ""}
                        onChange={(value) =>
                          updateField(
                            ["references", rfIndex, "position"],
                            value,
                          )
                        }
                      />
                    </fieldset>

                    <fieldset className="flex flex-col">
                      <FieldLabel label="ORGANIZATION" />
                      <PrimitiveField
                        value={ref.organization ?? ""}
                        onChange={(value) =>
                          updateField(
                            ["references", rfIndex, "organization"],
                            value,
                          )
                        }
                      />
                    </fieldset>

                    <fieldset className="flex flex-col">
                      <FieldLabel label="EMAIL" />
                      <PrimitiveField
                        value={ref.email ?? ""}
                        onChange={(value) =>
                          updateField(["references", rfIndex, "email"], value)
                        }
                      />
                    </fieldset>

                    <fieldset className="flex flex-col">
                      <FieldLabel label="PHONE" />
                      <PrimitiveField
                        value={ref.phone ?? ""}
                        onChange={(value) =>
                          updateField(["references", rfIndex, "phone"], value)
                        }
                      />
                    </fieldset>
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>
      </main>
      <SkillForm />
      <ScorePanel analysis={tailorSession.analysis} />
    </div>
  );
};

export default TailoringSessionScreen;
