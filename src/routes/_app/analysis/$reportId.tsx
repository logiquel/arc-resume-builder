import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useRef, useState } from "react";
import { diffWords } from "diff";
import { aiProcessedSampleData } from "../../../../ai_process_sample_dataV2";
import { Icon } from "@iconify/react";
import ScorePanel from "#/components/pages/analysis/ScorePanel";

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
  entriesCount?: number;
}
const SectionHeading: React.FC<SectionHeadingProps> = ({
  sectionLabel,
  entriesCount,
}) => {
  return (
    <div className="w-full flex items-center px-3 py-3 border-b border-black/5 cursor-pointer sticky -top-2 bg-white z-10">
      <h1 className="text-xxs font-medium text-brand uppercase">
        {sectionLabel}
      </h1>
      {entriesCount !== undefined && (
        <span className="w-5 h-5 flex items-center justify-center text-tiny font-medium text-muted-foreground ml-1 rounded-full bg-gray-100 border">
          {entriesCount}
        </span>
      )}
    </div>
  );
};

function RouteComponent() {
  // Initialize state with the new data format (sections object)
  const [resumeData, setResumeData] = useState<any>(
    aiProcessedSampleData[0].resume_review.sections,
  );
  const [activeEditingKey, setActiveEditingKey] = useState<string | null>(null);

  // --- KEY PARSER ---
  // Coordinates format: sectionId:entryId:field[:bulletIndex]
  const parseKey = (key: string) => {
    const parts = key.split(":");
    return {
      sectionId: parts[0],
      entryId: parts[1] === "none" ? null : parts[1],
      field: parts[2],
      bIdx: parts.length > 3 ? parseInt(parts[3]) : undefined,
    };
  };

  // --- HANDLERS ---
  const handlePrimitiveChange = (
    sectionId: string,
    entryId: string | null,
    field: string,
    val: string,
  ) => {
    setResumeData((prev: any) => {
      const newSec = { ...prev[sectionId] };
      if (!entryId) {
        newSec[field] = val;
      } else {
        newSec.entries = newSec.entries.map((e: any) =>
          e.entry_id === entryId ? { ...e, [field]: val } : e,
        );
      }
      return { ...prev, [sectionId]: newSec };
    });
  };

  const handleTextChange = (uniqueKey: string, val: string) => {
    const { sectionId, entryId, field, bIdx } = parseKey(uniqueKey);
    setResumeData((prev: any) => {
      const newSec = { ...prev[sectionId] };
      const updateField = (targetObj: any) => {
        const fieldData = { ...targetObj[field] };
        if (bIdx !== undefined) {
          const newArr = [...(fieldData.new_value || [])];
          newArr[bIdx] = val;
          fieldData.new_value = newArr;
        } else {
          fieldData.new_value = val;
        }
        targetObj[field] = fieldData;
      };

      if (!entryId) {
        updateField(newSec);
      } else {
        newSec.entries = newSec.entries.map((e: any) => {
          if (e.entry_id === entryId) {
            const newE = { ...e };
            updateField(newE);
            return newE;
          }
          return e;
        });
      }
      return { ...prev, [sectionId]: newSec };
    });
  };

  const handleAcceptText = (uniqueKey: string) => {
    const { sectionId, entryId, field, bIdx } = parseKey(uniqueKey);
    setResumeData((prev: any) => {
      const newSec = { ...prev[sectionId] };
      const updateField = (targetObj: any) => {
        const fieldData = { ...targetObj[field] };
        if (bIdx !== undefined) {
          const oldArr = Array.isArray(fieldData.old_value)
            ? [...fieldData.old_value]
            : [];
          oldArr[bIdx] = fieldData.new_value[bIdx];
          fieldData.old_value = oldArr;
        } else {
          fieldData.old_value = fieldData.new_value;
          fieldData.old_format = fieldData.new_format;
        }
        targetObj[field] = fieldData;
      };

      if (!entryId) {
        updateField(newSec);
      } else {
        newSec.entries = newSec.entries.map((e: any) => {
          if (e.entry_id === entryId) {
            const newE = { ...e };
            updateField(newE);
            return newE;
          }
          return e;
        });
      }
      return { ...prev, [sectionId]: newSec };
    });
  };

  const handleRejectText = (uniqueKey: string) => {
    const { sectionId, entryId, field, bIdx } = parseKey(uniqueKey);
    setResumeData((prev: any) => {
      const newSec = { ...prev[sectionId] };
      const updateField = (targetObj: any) => {
        const fieldData = { ...targetObj[field] };
        if (bIdx !== undefined) {
          const newArr = Array.isArray(fieldData.new_value)
            ? [...fieldData.new_value]
            : [];
          newArr[bIdx] = Array.isArray(fieldData.old_value)
            ? fieldData.old_value[bIdx] || ""
            : "";
          fieldData.new_value = newArr;
        } else {
          fieldData.new_value = fieldData.old_value;
          fieldData.new_format = fieldData.old_format;
        }
        targetObj[field] = fieldData;
      };

      if (!entryId) {
        updateField(newSec);
      } else {
        newSec.entries = newSec.entries.map((e: any) => {
          if (e.entry_id === entryId) {
            const newE = { ...e };
            updateField(newE);
            return newE;
          }
          return e;
        });
      }
      return { ...prev, [sectionId]: newSec };
    });
  };

  // --- AUTO RESIZE TEXTAREA ---
  function AutoResizeTextarea({
    currentText,
    onTextChange,
    onBlur,
  }: {
    currentText: string;
    onTextChange: (val: string) => void;
    onBlur: () => void;
  }) {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const autoResize = () => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    useEffect(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.focus();
        const length = textarea.value.length;
        textarea.setSelectionRange(length, length);
      }
      autoResize();
    }, []);

    useEffect(() => {
      autoResize();
    }, [currentText]);

    return (
      <textarea
        ref={textareaRef}
        rows={1}
        value={currentText}
        onInput={autoResize}
        onChange={(e) => onTextChange(e.target.value)}
        onBlur={onBlur}
        className="w-full text-xs mt-2 py-2 px-1 border border-black/10 outline-none text-text-primary font-sans resize-none overflow-hidden"
      />
    );
  }

  // --- RENDER TEXT DIFFING (WORD-LEVEL) ---
  const renderDiffText = (
    uniqueKey: string,
    originalText: string,
    currentText: string,
    isBullet = false,
  ) => {
    if (activeEditingKey === uniqueKey) {
      return (
        <AutoResizeTextarea
          currentText={currentText}
          onTextChange={(val) => handleTextChange(uniqueKey, val)}
          onBlur={() => setActiveEditingKey(null)}
        />
      );
    }

    const normalizedOriginal = (originalText || "").trim();
    const normalizedCurrent = (currentText || "").trim();
    const isResolved = normalizedOriginal === normalizedCurrent;

    if (isResolved) {
      return (
        <p
          onClick={() => setActiveEditingKey(uniqueKey)}
          className={`relative text-xs cursor-text py-0 flex ${
            isBullet
              ? "before:content-['●'] before:text-tiny before:mx-1 before:text-text-muted"
              : "px-0"
          }`}
        >
          {normalizedCurrent}
        </p>
      );
    }

    const currentDiff = diffWords(originalText || "", currentText || "");
    const wordsRemoved = (originalText || "").split(/\s+/).length;
    const isCompleteBlockDiff =
      wordsRemoved > 8 &&
      currentDiff.filter((p) => !p.added && !p.removed).length < 2;

    if (isCompleteBlockDiff) {
      return (
        <div
          onClick={() => setActiveEditingKey(uniqueKey)}
          className="cursor-text space-y-2 py-2"
        >
          {originalText && (
            <p className="bg-[#FECDCA] line-through text-[#B42318] relative flex text-xs before:content-['-'] before:text-xxs before:mx-1 before:text-[#B42318]">
              {originalText}
            </p>
          )}
          {currentText && (
            <p className="bg-[#D1FADF] text-[#027A48] relative flex text-xs before:content-['+'] before:text-xxs before:mx-1 before:text-[#027A48]">
              {currentText}
            </p>
          )}
        </div>
      );
    }

    return (
      <p
        onClick={() => setActiveEditingKey(uniqueKey)}
        className={`relative text-xs cursor-text py-2 ${
          isBullet
            ? "before:content-['●'] before:text-tiny before:mx-1 before:text-text-muted"
            : "px-0"
        }`}
      >
        {currentDiff.map((part, idx) => {
          if (part.removed) {
            return (
              <span
                key={idx}
                className="bg-[#FECDCA] text-[#B42318] line-through px-1 inline"
              >
                {part.value}
              </span>
            );
          }
          if (part.added) {
            return (
              <span
                key={idx}
                className="bg-[#D1FADF] text-[#027A48] px-1 inline mx-0"
              >
                {part.value}
              </span>
            );
          }
          return <span key={idx}>{part.value}</span>;
        })}
      </p>
    );
  };

  // --- RENDER INLINE ROW ---
  const renderInlineDiffRow = (
    uniqueKey: string,
    oldText: string,
    newText: string,
    isBullet = false,
  ) => {
    const isResolved = (oldText || "").trim() === (newText || "").trim();

    return (
      <div className="w-full border-black/5" key={uniqueKey}>
        <div
          className={`px-0 ${!isResolved ? "border-blue-600 border py-2" : ""}`}
        >
          {renderDiffText(uniqueKey, oldText, newText, isBullet)}
        </div>

        {!isResolved && (
          <div className="w-full flex items-center justify-between gap-x-2 px-1 py-1">
            <button
              onClick={() => handleAcceptText(uniqueKey)}
              className="ml-auto px-2 py-1 flex gap-x-0.5 items-center justify-center bg-[#039855] text-white cursor-pointer rounded-sm"
            >
              <Icon icon="ic:outline-check" className="text-tiny" />
              <span className="text-tiny">Accept</span>
            </button>
            <button
              onClick={() => handleRejectText(uniqueKey)}
              className="px-2 py-1 flex gap-x-0.5 items-center justify-center border border-red-300 bg-[#FEF3F2] text-[#B42318] cursor-pointer rounded-sm"
            >
              <Icon
                icon="material-symbols:close-rounded"
                className="text-tiny"
              />
              <span className="text-tiny">Reject</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  // --- DISPATCHER: RENDER DYNAMIC FIELD BASED ON DIFF MODE ---
  const renderDescriptionBlock = (
    sectionId: string,
    entryId: string | null,
    fieldName: string,
    fieldData: any,
  ) => {
    if (
      !fieldData ||
      typeof fieldData !== "object" ||
      !("old_value" in fieldData)
    )
      return null;

    const { old_value, new_value, old_format, new_format, diff_mode } =
      fieldData;
    const baseKey = `${sectionId}:${entryId || "none"}:${fieldName}`;

    // Verify if the change is resolved
    const isResolved =
      old_format === new_format &&
      JSON.stringify(old_value) === JSON.stringify(new_value);

    // CASE 1: STRUCTURAL MIGRATION (Para -> Bullets) - PENDING RESOLUTION
    if (diff_mode === "structural" && !isResolved) {
      return (
        <div
          key={baseKey}
          className="w-full space-y-2 py-2 pl-2 border border-dashed border-slate-200 rounded-lg bg-slate-50/50"
        >
          {/* Full Red Strikethrough Box */}
          <p className="relative before:content-['-'] before:absolute before:left-0 before:-translate-x-2 before:text-[#B42318]">
            <mark className="bg-[#FECDCA] text-[#B42318] line-through px-1 text-xxs">
              {old_value}
            </mark>
          </p>

          <div className="space-y-1">
            {Array.isArray(new_value) &&
              new_value.map((bullet: string, idx: number) => (
                <p
                  key={idx}
                  className="px-1 relative text-xs before:content-['+'] before:absolute before:left-0 before:-translate-x-2 before:text-[#027A48]"
                >
                  <mark className="bg-[#D1FADF] text-[#027A48] px-1 text-xxs">
                    {bullet}
                  </mark>
                </p>
              ))}
          </div>

          {/* Master Controls */}
          <div className="w-full flex items-center justify-end gap-x-2 pt-1">
            <button
              onClick={() => handleAcceptText(baseKey)}
              className="px-2 py-1 flex gap-x-0.5 items-center justify-center bg-[#039855] text-white cursor-pointer rounded-sm"
            >
              <Icon icon="ic:outline-check" className="text-tiny" />
              <span className="text-tiny">Accept Format</span>
            </button>
            <button
              onClick={() => handleRejectText(baseKey)}
              className="px-2 py-1 flex gap-x-0.5 items-center justify-center border border-red-300 bg-[#FEF3F2] text-[#B42318] cursor-pointer rounded-sm"
            >
              <Icon
                icon="material-symbols:close-rounded"
                className="text-tiny"
              />
              <span className="text-tiny">Reject Format</span>
            </button>
          </div>
        </div>
      );
    }

    // CASE 2: INLINE DIFF OR RESOLVED STRUCTURAL MIGRATION
    if (new_format === "bullet_points") {
      return (
        <div className="w-full space-y-0">
          {Array.isArray(new_value) &&
            new_value.map((bullet: string, bIdx: number) => {
              // Safety: Ensure oldBullet aligns properly even if the original array is shorter
              const oldBullet = Array.isArray(old_value)
                ? old_value[bIdx] || ""
                : old_value === new_value
                  ? bullet
                  : "";
              const itemKey = `${baseKey}:${bIdx}`;
              return renderInlineDiffRow(itemKey, oldBullet, bullet, true);
            })}
        </div>
      );
    } else {
      // Handles 'text' and 'para' safely
      return renderInlineDiffRow(
        baseKey,
        old_value as string,
        new_value as string,
        false,
      );
    }
  };

  // --- EXTRACTORS ---
  const profile = resumeData.profile || {};
  const expSection = resumeData.experience || { entries: [] };
  const projSection = resumeData.projects || { entries: [] };
  const eduSection = resumeData.education || { entries: [] };
  const certSection = resumeData.certificates || { entries: [] };
  const awardsSection = resumeData.awards || { entries: [] };
  const pubSection = resumeData.publications || { entries: [] };
  const refSection = resumeData.references || { entries: [] };
  const skillsSection = resumeData.skills || { entries: [] };
  const langSection = resumeData.languages || { entries: [] };
  const intSection = resumeData.interests || { entries: [] };

  return (
    <div className="w-full h-full flex overflow-hidden">
      <aside className="w-[20vw] h-full"></aside>

      <main className="h-full flex-1 overflow-y-auto hide-scrollbar space-y-3 py-2 px-0.5">
        {/* 1. PROFILE SECTION */}
        <section className="w-full flex-col border border-black/10 bg-white rounded-2xl overflow-clip">
          <SectionHeading sectionLabel="Profile" />
          <div className="w-full grid grid-cols-3 p-3 gap-1">
            <fieldset className="flex flex-col">
              <label className="text-tiny text-text-muted font-medium">
                FIRST NAME
              </label>
              <input
                value={profile.first_name || ""}
                onChange={(e) =>
                  handlePrimitiveChange(
                    "profile",
                    null,
                    "first_name",
                    e.target.value,
                  )
                }
                className="rounded-none py-1 border border-transparent outline-0 transition-colors focus:border-gray-300 text-text-primary text-xs"
              />
            </fieldset>
            <fieldset className="flex flex-col">
              <label className="text-tiny text-text-muted font-medium">
                LAST NAME
              </label>
              <input
                value={profile.last_name || ""}
                onChange={(e) =>
                  handlePrimitiveChange(
                    "profile",
                    null,
                    "last_name",
                    e.target.value,
                  )
                }
                className="rounded-none py-1 border border-transparent outline-0 transition-colors focus:border-gray-300 text-text-primary text-xs"
              />
            </fieldset>

            <fieldset className="flex flex-col">
              <label className="text-tiny text-text-muted font-medium">
                EMAIL
              </label>
              <input
                value={profile.email || ""}
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
                value={profile.phone || ""}
                onChange={(e) =>
                  handlePrimitiveChange(
                    "profile",
                    null,
                    "phone",
                    e.target.value,
                  )
                }
                className="rounded-none py-1 border border-transparent outline-0 transition-colors focus:border-gray-300 text-text-primary text-xs"
              />
            </fieldset>
            <fieldset className="flex flex-col">
              <label className="text-tiny text-text-muted font-medium">
                LOCATION
              </label>
              <input
                value={profile.location || ""}
                onChange={(e) =>
                  handlePrimitiveChange(
                    "profile",
                    null,
                    "location",
                    e.target.value,
                  )
                }
                className="rounded-none py-1 border border-transparent outline-0 transition-colors focus:border-gray-300 text-text-primary text-xs"
              />
            </fieldset>
            <fieldset className="flex flex-col col-span-3">
              <label className="text-tiny text-text-muted font-medium">
                PROFESSIONAL TITLE
              </label>
              <div className="w-full space-y-3">
                {renderDescriptionBlock(
                  "profile",
                  null,
                  "professional_title",
                  profile.professional_title,
                )}
              </div>
            </fieldset>
            <fieldset className="flex flex-col col-span-3">
              <label className="text-tiny text-text-muted font-medium">
                SUMMARY
              </label>
              <div className="w-full space-y-3">
                {renderDescriptionBlock(
                  "profile",
                  null,
                  "summary",
                  profile.summary,
                )}
              </div>
            </fieldset>
          </div>
        </section>

        {/* 2. WORK EXPERIENCE SECTION */}
        <section className="w-full flex-col border border-black/10 bg-white rounded-2xl overflow-clip">
          <SectionHeading
            sectionLabel="Work Experience"
            entriesCount={expSection.entries.length}
          />
          {expSection.entries.map((exp: any, expIdx: number) => (
            <React.Fragment key={exp.entry_id}>
              <div className="w-full col-span-3 px-3 py-1 border-b border-black/5 bg-gray-50 flex items-center">
                <span className="text-xxs text-text-secondary font-semibold font-mono">
                  #{expIdx + 1}
                </span>
              </div>
              <div className="w-full grid grid-cols-4 p-3 gap-2 border-b border-black/5 last:border-b-0 bg-white">
                <fieldset className="flex flex-col col-span-2">
                  <label className="text-tiny text-text-muted font-medium">
                    COMPANY
                  </label>
                  <input
                    value={exp.company || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "experience",
                        exp.entry_id,
                        "company",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col col-span-2">
                  <label className="text-tiny text-text-muted font-medium">
                    LOCATION
                  </label>
                  <input
                    value={exp.location || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "experience",
                        exp.entry_id,
                        "location",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col col-span-2">
                  <label className="text-tiny text-text-muted font-medium">
                    START DATE
                  </label>
                  <input
                    value={exp.start_date || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "experience",
                        exp.entry_id,
                        "start_date",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col col-span-2">
                  <label className="text-tiny text-text-muted font-medium">
                    END DATE
                  </label>
                  <input
                    value={exp.end_date || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "experience",
                        exp.entry_id,
                        "end_date",
                        e.target.value,
                      )
                    }
                    placeholder="Present"
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col col-span-4">
                  <label className="text-tiny text-text-muted font-medium">
                    ROLE
                  </label>
                  <div className="w-full">
                    {renderDescriptionBlock(
                      "experience",
                      exp.entry_id,
                      "position",
                      exp.position,
                    )}
                  </div>
                </fieldset>
                <fieldset className="flex flex-col col-span-4">
                  <label className="text-tiny text-text-muted font-medium">
                    DESCRIPTION
                  </label>
                  <div className="w-full space-y-0">
                    {renderDescriptionBlock(
                      "experience",
                      exp.entry_id,
                      "description",
                      exp.description,
                    )}
                  </div>
                </fieldset>
              </div>
            </React.Fragment>
          ))}
        </section>

        {/* 3. PROJECTS SECTION */}
        <section className="w-full flex-col border border-black/10 bg-white rounded-2xl overflow-clip">
          <SectionHeading
            sectionLabel="Projects"
            entriesCount={projSection.entries.length}
          />
          {projSection.entries.map((proj: any, projIdx: number) => (
            <React.Fragment key={proj.entry_id}>
              <div className="w-full col-span-3 px-3 py-1 border-b border-black/5 bg-gray-50 flex items-center">
                <span className="text-xxs text-text-secondary font-semibold font-mono">
                  #{projIdx + 1}
                </span>
              </div>
              <div className="w-full grid grid-cols-4 p-3 gap-2 border-b border-black/5 last:border-b-0 bg-white">
                <fieldset className="flex flex-col col-span-2">
                  <label className="text-tiny text-text-muted font-medium">
                    PROJECT TITLE
                  </label>
                  <input
                    value={proj.title || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "projects",
                        proj.entry_id,
                        "title",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col col-span-2">
                  <label className="text-tiny text-text-muted font-medium">
                    LINK
                  </label>
                  <input
                    value={proj.link || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "projects",
                        proj.entry_id,
                        "link",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col col-span-2">
                  <label className="text-tiny text-text-muted font-medium">
                    START DATE
                  </label>
                  <input
                    value={proj.start_date || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "projects",
                        proj.entry_id,
                        "start_date",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col col-span-2">
                  <label className="text-tiny text-text-muted font-medium">
                    END DATE
                  </label>
                  <input
                    value={proj.end_date || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "projects",
                        proj.entry_id,
                        "end_date",
                        e.target.value,
                      )
                    }
                    placeholder="Present"
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col col-span-4">
                  <label className="text-tiny text-text-muted font-medium">
                    PROJECT SUBTITLE / TECH STACK
                  </label>
                  <div className="w-full space-y-3">
                    {renderDescriptionBlock(
                      "projects",
                      proj.entry_id,
                      "subtitle",
                      proj.subtitle,
                    )}
                  </div>
                </fieldset>
                <fieldset className="flex flex-col col-span-4">
                  <label className="text-tiny text-text-muted font-medium">
                    DESCRIPTION
                  </label>
                  <div className="w-full">
                    {renderDescriptionBlock(
                      "projects",
                      proj.entry_id,
                      "description",
                      proj.description,
                    )}
                  </div>
                </fieldset>
              </div>
            </React.Fragment>
          ))}
        </section>

        {/* 4. EDUCATION SECTION */}
        <section className="w-full flex-col border border-black/10 bg-white rounded-2xl overflow-clip">
          <SectionHeading
            sectionLabel="Education"
            entriesCount={eduSection.entries.length}
          />
          {eduSection.entries.map((edu: any, eduIdx: number) => (
            <React.Fragment key={edu.entry_id}>
              <div className="w-full col-span-3 px-3 py-1 border-b border-black/5 bg-gray-50 flex items-center">
                <span className="text-xxs text-text-secondary font-semibold font-mono">
                  #{eduIdx + 1}
                </span>
              </div>
              <div className="w-full grid grid-cols-3 p-3 gap-2 border-b border-black/5 last:border-b-0">
                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium">
                    INSTITUTION
                  </label>
                  <input
                    value={edu.institution || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "education",
                        edu.entry_id,
                        "institution",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium">
                    SCORE
                  </label>
                  <input
                    value={edu.score || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "education",
                        edu.entry_id,
                        "score",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium">
                    LOCATION
                  </label>
                  <input
                    value={edu.location || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "education",
                        edu.entry_id,
                        "location",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium">
                    START DATE
                  </label>
                  <input
                    value={edu.start_date || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "education",
                        edu.entry_id,
                        "start_date",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium">
                    END DATE
                  </label>
                  <input
                    value={edu.end_date || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "education",
                        edu.entry_id,
                        "end_date",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium">
                    LINK
                  </label>
                  <input
                    value={edu.link || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "education",
                        edu.entry_id,
                        "link",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col col-span-3">
                  <label className="text-tiny text-text-muted font-medium">
                    DEGREE / COURSE
                  </label>
                  <div className="w-full space-y-3">
                    {renderDescriptionBlock(
                      "education",
                      edu.entry_id,
                      "degree",
                      edu.degree,
                    )}
                  </div>
                </fieldset>
                <fieldset className="flex flex-col col-span-3">
                  <label className="text-tiny text-text-muted font-medium">
                    DESCRIPTION
                  </label>
                  <div className="w-full">
                    {renderDescriptionBlock(
                      "education",
                      edu.entry_id,
                      "description",
                      edu.description,
                    )}
                  </div>
                </fieldset>
              </div>
            </React.Fragment>
          ))}
        </section>

        {/* 5. CERTIFICATES SECTION */}
        <section className="w-full flex-col border border-black/10 bg-white rounded-2xl overflow-clip">
          <SectionHeading
            sectionLabel="Certificates"
            entriesCount={certSection.entries.length}
          />
          {certSection.entries.map((cert: any, certIdx: number) => (
            <React.Fragment key={cert.entry_id}>
              <div className="w-full col-span-3 px-3 py-1 border-b border-black/5 bg-gray-50 flex items-center">
                <span className="text-xxs text-text-secondary font-semibold font-mono">
                  #{certIdx + 1}
                </span>
              </div>
              <div className="w-full grid grid-cols-3 p-3 gap-2 border-b border-black/5 last:border-b-0">
                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium">
                    ISSUER
                  </label>
                  <input
                    value={cert.issuer || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "certificates",
                        cert.entry_id,
                        "issuer",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium">
                    ISSUE DATE
                  </label>
                  <input
                    value={cert.issue_date || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "certificates",
                        cert.entry_id,
                        "issue_date",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium">
                    EXPIRY DATE
                  </label>
                  <input
                    value={cert.expiry_date || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "certificates",
                        cert.entry_id,
                        "expiry_date",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium">
                    LINK
                  </label>
                  <input
                    value={cert.link || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "certificates",
                        cert.entry_id,
                        "link",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col col-span-3">
                  <label className="text-tiny text-text-muted font-medium">
                    CERTIFICATE NAME
                  </label>
                  <div className="w-full space-y-3">
                    {renderDescriptionBlock(
                      "certificates",
                      cert.entry_id,
                      "name",
                      cert.name,
                    )}
                  </div>
                </fieldset>
                <fieldset className="flex flex-col col-span-3">
                  <label className="text-tiny text-text-muted font-medium">
                    DESCRIPTION
                  </label>
                  <div className="w-full">
                    {renderDescriptionBlock(
                      "certificates",
                      cert.entry_id,
                      "description",
                      cert.description,
                    )}
                  </div>
                </fieldset>
              </div>
            </React.Fragment>
          ))}
        </section>

        {/* 6. SKILLS SECTION */}
        <section className="w-full flex-col border border-black/10 bg-white rounded-2xl overflow-clip">
          <SectionHeading
            sectionLabel="Skills"
            entriesCount={skillsSection.entries.length}
          />
          <div className="w-full p-3">
            <div className="flex flex-wrap gap-1 py-1">
              {skillsSection.entries.map((s: any) => (
                <span
                  key={s.entry_id}
                  className="text-xxs bg-gray-100 text-text-primary px-1.5 py-0.5 rounded-none"
                >
                  {typeof s.name === "object" ? s.name.new_value : s.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 7. LANGUAGES SECTION */}
        <section className="w-full flex-col border border-black/10 bg-white rounded-2xl overflow-clip">
          <SectionHeading
            sectionLabel="Languages"
            entriesCount={langSection.entries.length}
          />
          <div className="w-full p-3">
            <div className="flex flex-wrap gap-1 py-1">
              {langSection.entries.map((l: any) => (
                <span
                  key={l.entry_id}
                  className="text-xxs bg-gray-100 text-text-primary px-1.5 py-0.5 rounded-none"
                >
                  {l.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 8. INTERESTS SECTION */}
        <section className="w-full flex-col border border-black/10 bg-white rounded-2xl overflow-clip">
          <SectionHeading
            sectionLabel="Interests"
            entriesCount={intSection.entries.length}
          />
          <div className="w-full p-3">
            <div className="flex flex-wrap gap-1 py-1">
              {intSection.entries.map((i: any) => (
                <span
                  key={i.entry_id}
                  className="text-xxs bg-gray-100 text-text-primary px-1.5 py-0.5 rounded-none"
                >
                  {i.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 9. AWARDS SECTION */}
        <section className="w-full flex-col border border-black/10 bg-white rounded-2xl overflow-clip">
          <SectionHeading
            sectionLabel="Honors & Awards"
            entriesCount={awardsSection.entries.length}
          />
          {awardsSection.entries.map((aw: any, awIdx: number) => (
            <React.Fragment key={aw.entry_id}>
              <div className="w-full col-span-3 px-3 py-1 border-b border-black/5 bg-gray-50 flex items-center">
                <span className="text-xxs text-text-secondary font-semibold font-mono">
                  #{awIdx + 1}
                </span>
              </div>
              <div className="w-full grid grid-cols-3 p-3 gap-2 border-b border-black/5 last:border-b-0">
                <fieldset className="flex flex-col col-span-3">
                  <label className="text-tiny text-text-muted font-medium">
                    AWARD NAME
                  </label>
                  <div className="w-full">
                    {renderDescriptionBlock(
                      "awards",
                      aw.entry_id,
                      "title",
                      aw.title,
                    )}
                  </div>
                </fieldset>
                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium">
                    DATE
                  </label>
                  <input
                    value={aw.date || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "awards",
                        aw.entry_id,
                        "date",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium">
                    AWARDER
                  </label>
                  <input
                    value={aw.awarder || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "awards",
                        aw.entry_id,
                        "awarder",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col col-span-3">
                  <label className="text-tiny text-text-muted font-medium">
                    DESCRIPTION
                  </label>
                  <div className="w-full">
                    {renderDescriptionBlock(
                      "awards",
                      aw.entry_id,
                      "description",
                      aw.description,
                    )}
                  </div>
                </fieldset>
              </div>
            </React.Fragment>
          ))}
        </section>

        {/* 10. PUBLICATIONS SECTION */}
        <section className="w-full flex-col border border-black/10 bg-white rounded-2xl overflow-clip">
          <SectionHeading
            sectionLabel="Publications"
            entriesCount={pubSection.entries.length}
          />
          {pubSection.entries.map((pub: any, pubIdx: number) => (
            <React.Fragment key={pub.entry_id}>
              <div className="w-full col-span-3 px-3 py-1 border-b border-black/5 bg-gray-50 flex items-center">
                <span className="text-xxs text-text-secondary font-semibold font-mono">
                  #{pubIdx + 1}
                </span>
              </div>
              <div className="w-full grid grid-cols-3 p-3 gap-2 border-b border-black/5 last:border-b-0">
                <fieldset className="flex flex-col col-span-3">
                  <label className="text-tiny text-text-muted font-medium">
                    PUBLICATION NAME
                  </label>
                  <div className="w-full">
                    {renderDescriptionBlock(
                      "publications",
                      pub.entry_id,
                      "title",
                      pub.title,
                    )}
                  </div>
                </fieldset>
                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium">
                    DATE
                  </label>
                  <input
                    value={pub.date || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "publications",
                        pub.entry_id,
                        "date",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium">
                    PUBLISHER
                  </label>
                  <input
                    value={pub.publisher || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "publications",
                        pub.entry_id,
                        "publisher",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium">
                    LINK
                  </label>
                  <input
                    value={pub.link || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "publications",
                        pub.entry_id,
                        "link",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col col-span-3">
                  <label className="text-tiny text-text-muted font-medium">
                    DESCRIPTION
                  </label>
                  <div className="w-full">
                    {renderDescriptionBlock(
                      "publications",
                      pub.entry_id,
                      "description",
                      pub.description,
                    )}
                  </div>
                </fieldset>
              </div>
            </React.Fragment>
          ))}
        </section>

        {/* 11. REFERENCES SECTION */}
        <section className="w-full flex-col border border-black/10 bg-white rounded-2xl overflow-clip">
          <SectionHeading
            sectionLabel="References"
            entriesCount={refSection.entries.length}
          />
          {refSection.entries.map((ref: any, refIdx: number) => (
            <React.Fragment key={ref.entry_id}>
              <div className="w-full col-span-3 px-3 py-1 border-b border-black/5 bg-gray-50 flex items-center">
                <span className="text-xxs text-text-secondary font-semibold font-mono">
                  #{refIdx + 1}
                </span>
              </div>
              <div className="w-full grid grid-cols-3 p-3 gap-2 border-b border-black/5 last:border-b-0">
                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium">
                    NAME
                  </label>
                  <input
                    value={ref.name || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "references",
                        ref.entry_id,
                        "name",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium">
                    EMAIL
                  </label>
                  <input
                    value={ref.email || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "references",
                        ref.entry_id,
                        "email",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium">
                    ORGANIZATION
                  </label>
                  <input
                    value={ref.organization || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "references",
                        ref.entry_id,
                        "organization",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium">
                    PHONE
                  </label>
                  <input
                    value={ref.phone || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "references",
                        ref.entry_id,
                        "phone",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium">
                    POSITION
                  </label>
                  <input
                    value={ref.position || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "references",
                        ref.entry_id,
                        "position",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
              </div>
            </React.Fragment>
          ))}
        </section>
      </main>

      <ScorePanel />
    </div>
  );
}

// GEMINI PRO
