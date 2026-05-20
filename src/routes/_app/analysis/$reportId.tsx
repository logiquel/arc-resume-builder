import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { diffWords } from "diff";
import {
  aiProcessedSampleData,
  type EnhancedResumePayload,
  type PostAIWorkExperience,
  type PostAIProject,
  type PostAIEducation,
  type PostAICertificate,
  type PostAISkill,
  type PostAILanguage,
  type PostAIInterest,
  type PostAIAward,
  type PostAIPublication,
  type PostAIReference,
} from "../../../../ai_process_sample_data";
import { Icon } from "@iconify/react";

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
    <div className="w-full flex justify-between px-3 py-3 border-b cursor-pointer sticky -top-2 bg-white z-10">
      <h1 className="text-xxs font-medium text-text-primary uppercase">
        {sectionLabel}
      </h1>
      <Icon icon="ic:twotone-plus" className="text-text-muted" />
    </div>
  );
};

function RouteComponent() {
  const typedPayload = aiProcessedSampleData as EnhancedResumePayload;

  // ── STATE PRIMITIVES MAPPED DIRECTLY FROM LOGICAL DATA SCHEMA ──
  const [firstName, setFirstName] = useState(
    typedPayload.profile?.first_name || "",
  );
  const [lastName, setLastName] = useState(
    typedPayload.profile?.last_name || "",
  );
  const [profTitle, setProfTitle] = useState({
    originalText: typedPayload.profile?.professional_title?.originalText || "",
    currentText: typedPayload.profile?.professional_title?.currentText || "",
  });
  const [email, setEmail] = useState(typedPayload.profile?.email || "");
  const [phone, setPhone] = useState(typedPayload.profile?.phone || "");
  const [location, setLocation] = useState(
    typedPayload.profile?.location || "",
  );
  const [summary, setSummary] = useState({
    originalText: typedPayload.profile?.summary?.originalText || "",
    currentText: typedPayload.profile?.summary?.currentText || "",
  });

  // Array Lists Structures
  const [workExperiences, setWorkExperiences] = useState<
    PostAIWorkExperience[]
  >(typedPayload.workExperience || []);
  const [projects, setProjects] = useState<PostAIProject[]>(
    typedPayload.projects || [],
  );
  const [education, setEducation] = useState<PostAIEducation[]>(
    typedPayload.education || [],
  );
  const [certificates, setCertificates] = useState<PostAICertificate[]>(
    typedPayload.certificates || [],
  );
  const [skills] = useState<PostAISkill[]>(typedPayload.skills || []);
  const [languages] = useState<PostAILanguage[]>(typedPayload.languages || []);
  const [interests] = useState<PostAIInterest[]>(typedPayload.interests || []);
  const [awards, setAwards] = useState<PostAIAward[]>(
    typedPayload.awards || [],
  );
  const [publications, setPublications] = useState<PostAIPublication[]>(
    typedPayload.publications || [],
  );
  const [references, setReferences] = useState<PostAIReference[]>(
    typedPayload.references || [],
  );

  // Focused state tracker identifier coordinate
  const [activeEditingKey, setActiveEditingKey] = useState<string | null>(null);

  // ── ACCEPT / REJECT EVENT HANDLERS ──
  const handleAcceptText = (uniqueKey: string) => {
    if (uniqueKey === "profile-title") {
      setProfTitle((prev) => ({ ...prev, originalText: prev.currentText }));
    } else if (uniqueKey === "profile-summary") {
      setSummary((prev) => ({ ...prev, originalText: prev.currentText }));
    } else if (uniqueKey.startsWith("exp-")) {
      const [, expIdx, , bIdx] = uniqueKey.split("-");
      setWorkExperiences((prev) =>
        prev.map((item, i) =>
          i === parseInt(expIdx)
            ? {
                ...item,
                highlights: item.highlights.map((b, bi) =>
                  bi === parseInt(bIdx)
                    ? { ...b, originalText: b.currentText }
                    : b,
                ),
              }
            : item,
        ),
      );
    } else if (uniqueKey.startsWith("proj-sub-")) {
      const [, , projIdx] = uniqueKey.split("-sub-");
      setProjects((prev) =>
        prev.map((item, i) =>
          i === parseInt(projIdx)
            ? {
                ...item,
                subtitle: {
                  ...item.subtitle,
                  originalText: item.subtitle.currentText,
                },
              }
            : item,
        ),
      );
    } else if (uniqueKey.startsWith("proj-")) {
      const [, projIdx, , bIdx] = uniqueKey.split("-");
      setProjects((prev) =>
        prev.map((item, i) =>
          i === parseInt(projIdx)
            ? {
                ...item,
                highlights: item.highlights.map((b, bi) =>
                  bi === parseInt(bIdx)
                    ? { ...b, originalText: b.currentText }
                    : b,
                ),
              }
            : item,
        ),
      );
    } else if (uniqueKey.startsWith("edu-deg-")) {
      const [, , eduIdx] = uniqueKey.split("-deg-");
      setEducation((prev) =>
        prev.map((item, i) =>
          i === parseInt(eduIdx)
            ? {
                ...item,
                degree: {
                  ...item.degree,
                  originalText: item.degree.currentText,
                },
              }
            : item,
        ),
      );
    } else if (uniqueKey.startsWith("edu-")) {
      const [, eduIdx, , bIdx] = uniqueKey.split("-");
      setEducation((prev) =>
        prev.map((item, i) =>
          i === parseInt(eduIdx)
            ? {
                ...item,
                highlights: item.highlights.map((b, bi) =>
                  bi === parseInt(bIdx)
                    ? { ...b, originalText: b.currentText }
                    : b,
                ),
              }
            : item,
        ),
      );
    } else if (uniqueKey.startsWith("cert-name-")) {
      const [, , certIdx] = uniqueKey.split("-name-");
      setCertificates((prev) =>
        prev.map((item, i) =>
          i === parseInt(certIdx)
            ? {
                ...item,
                name: { ...item.name, originalText: item.name.currentText },
              }
            : item,
        ),
      );
    } else if (uniqueKey.startsWith("cert-")) {
      const [, certIdx, , bIdx] = uniqueKey.split("-");
      setCertificates((prev) =>
        prev.map((item, i) =>
          i === parseInt(certIdx)
            ? {
                ...item,
                highlights: item.highlights.map((b, bi) =>
                  bi === parseInt(bIdx)
                    ? { ...b, originalText: b.currentText }
                    : b,
                ),
              }
            : item,
        ),
      );
    } else if (uniqueKey.startsWith("award-block-")) {
      const [, , id] = uniqueKey.split("-block-");
      setAwards((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                description: {
                  ...item.description,
                  originalText: item.description.currentText,
                },
              }
            : item,
        ),
      );
    } else if (uniqueKey.startsWith("pub-block-")) {
      const [, , id] = uniqueKey.split("-block-");
      setPublications((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                description: {
                  ...item.description,
                  originalText: item.description.currentText,
                },
              }
            : item,
        ),
      );
    }
  };

  const handleRejectText = (uniqueKey: string) => {
    if (uniqueKey === "profile-title") {
      setProfTitle((prev) => ({ ...prev, currentText: prev.originalText }));
    } else if (uniqueKey === "profile-summary") {
      setSummary((prev) => ({ ...prev, currentText: prev.originalText }));
    } else if (uniqueKey.startsWith("exp-")) {
      const [, expIdx, , bIdx] = uniqueKey.split("-");
      setWorkExperiences((prev) =>
        prev.map((item, i) =>
          i === parseInt(expIdx)
            ? {
                ...item,
                highlights: item.highlights.map((b, bi) =>
                  bi === parseInt(bIdx)
                    ? { ...b, currentText: b.originalText }
                    : b,
                ),
              }
            : item,
        ),
      );
    } else if (uniqueKey.startsWith("proj-sub-")) {
      const [, , projIdx] = uniqueKey.split("-sub-");
      setProjects((prev) =>
        prev.map((item, i) =>
          i === parseInt(projIdx)
            ? {
                ...item,
                subtitle: {
                  ...item.subtitle,
                  currentText: item.subtitle.originalText,
                },
              }
            : item,
        ),
      );
    } else if (uniqueKey.startsWith("proj-")) {
      const [, projIdx, , bIdx] = uniqueKey.split("-");
      setProjects((prev) =>
        prev.map((item, i) =>
          i === parseInt(projIdx)
            ? {
                ...item,
                highlights: item.highlights.map((b, bi) =>
                  bi === parseInt(bIdx)
                    ? { ...b, currentText: b.originalText }
                    : b,
                ),
              }
            : item,
        ),
      );
    } else if (uniqueKey.startsWith("edu-deg-")) {
      const [, , eduIdx] = uniqueKey.split("-deg-");
      setEducation((prev) =>
        prev.map((item, i) =>
          i === parseInt(eduIdx)
            ? {
                ...item,
                degree: {
                  ...item.degree,
                  currentText: item.degree.originalText,
                },
              }
            : item,
        ),
      );
    } else if (uniqueKey.startsWith("edu-")) {
      const [, eduIdx, , bIdx] = uniqueKey.split("-");
      setEducation((prev) =>
        prev.map((item, i) =>
          i === parseInt(eduIdx)
            ? {
                ...item,
                highlights: item.highlights.map((b, bi) =>
                  bi === parseInt(bIdx)
                    ? { ...b, currentText: b.originalText }
                    : b,
                ),
              }
            : item,
        ),
      );
    } else if (uniqueKey.startsWith("cert-name-")) {
      const [, , certIdx] = uniqueKey.split("-name-");
      setCertificates((prev) =>
        prev.map((item, i) =>
          i === parseInt(certIdx)
            ? {
                ...item,
                name: { ...item.name, currentText: item.name.originalText },
              }
            : item,
        ),
      );
    } else if (uniqueKey.startsWith("cert-")) {
      const [, certIdx, , bIdx] = uniqueKey.split("-");
      setCertificates((prev) =>
        prev.map((item, i) =>
          i === parseInt(certIdx)
            ? {
                ...item,
                highlights: item.highlights.map((b, bi) =>
                  bi === parseInt(bIdx)
                    ? { ...b, currentText: b.originalText }
                    : b,
                ),
              }
            : item,
        ),
      );
    } else if (uniqueKey.startsWith("award-block-")) {
      const [, , id] = uniqueKey.split("-block-");
      setAwards((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                description: {
                  ...item.description,
                  currentText: item.description.originalText,
                },
              }
            : item,
        ),
      );
    } else if (uniqueKey.startsWith("pub-block-")) {
      const [, , id] = uniqueKey.split("-block-");
      setPublications((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                description: {
                  ...item.description,
                  currentText: item.description.originalText,
                },
              }
            : item,
        ),
      );
    }
  };

  // ── UNIFIED SECTION PRIMITIVE FIELD CHANGE HANDLER ──
  const handleFieldChange = (
    section: "work" | "project" | "education" | "cert" | "award" | "pub",
    index: number,
    key: string,
    value: string,
  ) => {
    if (section === "work") {
      setWorkExperiences((prev) =>
        prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
      );
    } else if (section === "project") {
      setProjects((prev) =>
        prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
      );
    } else if (section === "education") {
      setEducation((prev) =>
        prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
      );
    } else if (section === "cert") {
      setCertificates((prev) =>
        prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
      );
    } else if (section === "award") {
      setAwards((prev) =>
        prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
      );
    } else if (section === "pub") {
      setPublications((prev) =>
        prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
      );
    }
  };

  // ── UNIFIED NESTED BULLET HIGHLIGHT CHANGE HANDLER ──
  const handleBulletChange = (
    section: "work" | "project" | "education" | "cert",
    itemIdx: number,
    bulletIdx: number,
    value: string,
  ) => {
    if (section === "work") {
      setWorkExperiences((prev) =>
        prev.map((item, i) =>
          i === itemIdx
            ? {
                ...item,
                highlights: item.highlights.map((b, bi) =>
                  bi === bulletIdx ? { ...b, currentText: value } : b,
                ),
              }
            : item,
        ),
      );
    } else if (section === "project") {
      setProjects((prev) =>
        prev.map((item, i) =>
          i === itemIdx
            ? {
                ...item,
                highlights: item.highlights.map((b, bi) =>
                  bi === bulletIdx ? { ...b, currentText: value } : b,
                ),
              }
            : item,
        ),
      );
    } else if (section === "education") {
      setEducation((prev) =>
        prev.map((item, i) =>
          i === itemIdx
            ? {
                ...item,
                highlights: item.highlights.map((b, bi) =>
                  bi === bulletIdx ? { ...b, currentText: value } : b,
                ),
              }
            : item,
        ),
      );
    } else if (section === "cert") {
      setCertificates((prev) =>
        prev.map((item, i) =>
          i === itemIdx
            ? {
                ...item,
                highlights: item.highlights.map((b, bi) =>
                  bi === bulletIdx ? { ...b, currentText: value } : b,
                ),
              }
            : item,
        ),
      );
    }
  };

  // ── UNIFIED NESTED INLINE TEXT HANDLER (SUBTITLES, DEGREES, NAMES) ──
  const handleInlineFieldChange = (
    section:
      | "profile-title"
      | "profile-summary"
      | "project-subtitle"
      | "education-degree"
      | "cert-name",
    index: number,
    value: string,
  ) => {
    if (section === "profile-title") {
      setProfTitle((prev) => ({ ...prev, currentText: value }));
    } else if (section === "profile-summary") {
      setSummary((prev) => ({ ...prev, currentText: value }));
    } else if (section === "project-subtitle") {
      setProjects((prev) =>
        prev.map((item, i) =>
          i === index
            ? { ...item, subtitle: { ...item.subtitle, currentText: value } }
            : item,
        ),
      );
    } else if (section === "education-degree") {
      setEducation((prev) =>
        prev.map((item, i) =>
          i === index
            ? { ...item, degree: { ...item.degree, currentText: value } }
            : item,
        ),
      );
    } else if (section === "cert-name") {
      setCertificates((prev) =>
        prev.map((item, i) =>
          i === index
            ? { ...item, name: { ...item.name, currentText: value } }
            : item,
        ),
      );
    }
  };

  // ── UNIFIED HONORS & AWARDS COMPONENT TEXT BLOCKS HANDLER ──
  const handleBlockFieldChange = (
    section: "award" | "pub",
    id: string,
    value: string,
  ) => {
    if (section === "award") {
      setAwards((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                description: { ...item.description, currentText: value },
              }
            : item,
        ),
      );
    } else if (section === "pub") {
      setPublications((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                description: { ...item.description, currentText: value },
              }
            : item,
        ),
      );
    }
  };

  function AutoResizeTextarea({
    uniqueKey,
    currentText,
    setActiveEditingKey,
    handleInlineFieldChange,
    handleBulletChange,
    handleBlockFieldChange,
  }: {
    uniqueKey: string;
    currentText: string;
    setActiveEditingKey: (key: string | null) => void;
    handleInlineFieldChange: (
      section:
        | "profile-title"
        | "profile-summary"
        | "project-subtitle"
        | "education-degree"
        | "cert-name",
      index: number,
      value: string,
    ) => void;
    handleBulletChange: (
      section: "work" | "project" | "education" | "cert",
      itemIdx: number,
      bulletIdx: number,
      value: string,
    ) => void;
    handleBlockFieldChange: (
      section: "award" | "pub",
      id: string,
      value: string,
    ) => void;
  }) {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const autoResize = () => {
      const textarea = textareaRef.current;

      if (!textarea) return;

      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    // Focus only once when mounted
    useEffect(() => {
      const textarea = textareaRef.current;

      if (textarea) {
        textarea.focus();

        // place cursor at end
        const length = textarea.value.length;
        textarea.setSelectionRange(length, length);
      }

      autoResize();
    }, []);

    // Resize whenever content changes
    useEffect(() => {
      autoResize();
    }, [currentText]);

    const handleChange = (val: string) => {
      if (uniqueKey === "profile-title") {
        handleInlineFieldChange("profile-title", 0, val);
      }

      if (uniqueKey === "profile-summary") {
        handleInlineFieldChange("profile-summary", 0, val);
      }

      if (uniqueKey.startsWith("exp-")) {
        const [, expIdx, , bIdx] = uniqueKey.split("-");

        handleBulletChange("work", parseInt(expIdx), parseInt(bIdx), val);
      }

      if (uniqueKey.startsWith("proj-sub-")) {
        const [, , projIdx] = uniqueKey.split("-sub-");

        handleInlineFieldChange("project-subtitle", parseInt(projIdx), val);
      }

      if (uniqueKey.startsWith("proj-") && !uniqueKey.includes("-sub-")) {
        const [, projIdx, , bIdx] = uniqueKey.split("-");

        handleBulletChange("project", parseInt(projIdx), parseInt(bIdx), val);
      }

      if (uniqueKey.startsWith("edu-deg-")) {
        const [, , eduIdx] = uniqueKey.split("-deg-");

        handleInlineFieldChange("education-degree", parseInt(eduIdx), val);
      }

      if (uniqueKey.startsWith("edu-") && !uniqueKey.includes("-deg-")) {
        const [, eduIdx, , bIdx] = uniqueKey.split("-");

        handleBulletChange("education", parseInt(eduIdx), parseInt(bIdx), val);
      }

      if (uniqueKey.startsWith("cert-name-")) {
        const [, , certIdx] = uniqueKey.split("-name-");

        handleInlineFieldChange("cert-name", parseInt(certIdx), val);
      }

      if (uniqueKey.startsWith("cert-") && !uniqueKey.includes("-name-")) {
        const [, certIdx, , bIdx] = uniqueKey.split("-");

        handleBulletChange("cert", parseInt(certIdx), parseInt(bIdx), val);
      }

      if (uniqueKey.startsWith("award-block-")) {
        const [, , id] = uniqueKey.split("-block-");

        handleBlockFieldChange("award", id, val);
      }

      if (uniqueKey.startsWith("pub-block-")) {
        const [, , id] = uniqueKey.split("-block-");

        handleBlockFieldChange("pub", id, val);
      }
    };

    return (
      <textarea
        ref={textareaRef}
        rows={1}
        value={currentText}
        onInput={autoResize}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={() => setActiveEditingKey(null)}
        className="w-full text-xs mt-2 py-2 px-1 border border-black/10 outline-none text-text-primary font-sans resize-none overflow-hidden"
      />
    );
  }
  // ── INTERACTIVE DIFF GENERATOR SYSTEM ──
  const renderDiffText = (
    uniqueKey: string,
    originalText: string,
    currentText: string,
    isBullet = false,
  ) => {
    if (activeEditingKey === uniqueKey) {
      return (
        <AutoResizeTextarea
          uniqueKey={uniqueKey}
          currentText={currentText}
          setActiveEditingKey={setActiveEditingKey}
          handleInlineFieldChange={handleInlineFieldChange}
          handleBulletChange={handleBulletChange}
          handleBlockFieldChange={handleBlockFieldChange}
        />
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
            ? "before:content-['●'] before:text-xxs before:mx-1 before:text-text-secondary"
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

  // ── REUSABLE RENDERING WRAPPER FOR ACCEPT/REJECT TOOLBARS ──
  const renderControlBlock = (
    uniqueKey: string,
    index: number,
    originalText: string,
    currentText: string,
    isBullet = false,
  ) => {
    return (
      <div className="w-full border border-black/5" key={uniqueKey}>
        <div className="w-full flex items-center justify-between gap-x-2 border-b px-1 py-1 bg-gray-50/50">
          <span className="text-tiny">#{index + 1}</span>
          <button
            onClick={() => handleAcceptText(uniqueKey)}
            className="ml-auto px-1 py-0.5 flex gap-x-0.5 items-center justify-center border border-green-300 bg-[#D1FADF] text-[#027A48] cursor-pointer rounded-none"
          >
            <Icon icon="ic:outline-check" className="text-tiny" />
            <span className="text-tiny">Accept</span>
          </button>
          <button
            onClick={() => handleRejectText(uniqueKey)}
            className="px-1 py-0.5 flex gap-x-0.5 items-center justify-center border border-red-300 bg-[#FECDCA] text-[#B42318] cursor-pointer rounded-none"
          >
            <Icon icon="ic:baseline-close" className="text-tiny" />
            <span className="text-tiny">Reject</span>
          </button>
        </div>
        <div className="px-2 border-blue-600">
          {renderDiffText(uniqueKey, originalText, currentText, isBullet)}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex overflow-hidden">
      {/* ── LEFT ASIDE ── */}
      <aside className="w-[20vw] h-full"></aside>

      {/* ── CENTER MAIN Workspace Panel ── */}
      <main className="h-full flex-1 overflow-y-auto hide-scrollbar space-y-3 py-2 px-0.5">
        {/* 1. PROFILE SECTION */}
        <section className="w-full flex-col bg-white border border-black/5">
          <SectionHeading sectionLabel="Profile" />
          <div className="w-full grid grid-cols-2 p-3 gap-1">
            <fieldset className="flex flex-col">
              <label className="text-tiny text-brand font-medium">
                FIRST NAME
              </label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="rounded-none py-1 border border-transparent outline-0 transition-colors focus:border-gray-300 text-text-primary text-xs"
              />
            </fieldset>
            <fieldset className="flex flex-col">
              <label className="text-tiny text-brand font-medium">
                LAST NAME
              </label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-none py-1 border border-transparent outline-0 transition-colors focus:border-gray-300 text-text-primary text-xs"
              />
            </fieldset>

            <fieldset className="flex flex-col">
              <label className="text-tiny text-brand font-medium">EMAIL</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-none py-1 border border-transparent outline-0 transition-colors focus:border-gray-300 text-text-primary text-xs"
              />
            </fieldset>
            <fieldset className="flex flex-col">
              <label className="text-tiny text-brand font-medium">PHONE</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-none py-1 border border-transparent outline-0 transition-colors focus:border-gray-300 text-text-primary text-xs"
              />
            </fieldset>
            <fieldset className="flex flex-col col-span-2">
              <label className="text-tiny text-brand font-medium">
                LOCATION
              </label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="rounded-none py-1 border border-transparent outline-0 transition-colors focus:border-gray-300 text-text-primary text-xs"
              />
            </fieldset>
            <fieldset className="flex flex-col col-span-2">
              <label className="text-tiny text-brand font-medium">
                PROFESSIONAL TITLE
              </label>
              <div className="w-full space-y-3 mt-1">
                {renderControlBlock(
                  "profile-title",
                  0,
                  profTitle.originalText,
                  profTitle.currentText,
                  false,
                )}
              </div>
            </fieldset>
            <fieldset className="flex flex-col col-span-2">
              <label className="text-tiny text-brand font-medium">
                SUMMARY
              </label>
              <div className="w-full space-y-3 mt-1">
                {renderControlBlock(
                  "profile-summary",
                  0,
                  summary.originalText,
                  summary.currentText,
                  false,
                )}
              </div>
            </fieldset>
          </div>
        </section>

        {/* 2. WORK EXPERIENCE SECTION */}
        <section className="w-full flex-col bg-white border border-black/5">
          <SectionHeading sectionLabel="Work Experience" />
          {workExperiences.map((exp, expIdx) => (
            <div
              key={exp.id || expIdx}
              className="w-full grid grid-cols-2 p-3 gap-2 border-b border-black/5 last:border-b-0"
            >
              <fieldset className="flex flex-col">
                <label className="text-tiny text-brand font-medium">
                  COMPANY
                </label>
                <input
                  value={exp.company}
                  onChange={(e) =>
                    handleFieldChange("work", expIdx, "company", e.target.value)
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col">
                <label className="text-tiny text-brand font-medium">ROLE</label>
                <input
                  value={exp.role}
                  onChange={(e) =>
                    handleFieldChange("work", expIdx, "role", e.target.value)
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col">
                <label className="text-tiny text-brand font-medium">
                  LOCATION
                </label>
                <input
                  value={exp.location}
                  onChange={(e) =>
                    handleFieldChange(
                      "work",
                      expIdx,
                      "location",
                      e.target.value,
                    )
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col">
                <label className="text-tiny text-brand font-medium">
                  START DATE
                </label>
                <input
                  value={exp.start_date || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "work",
                      expIdx,
                      "start_date",
                      e.target.value,
                    )
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col">
                <label className="text-tiny text-brand font-medium">
                  END DATE
                </label>
                <input
                  value={exp.end_date || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "work",
                      expIdx,
                      "end_date",
                      e.target.value,
                    )
                  }
                  placeholder="Present"
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col col-span-2">
                <label className="text-tiny text-brand font-medium">
                  DESCRIPTION
                </label>
                <div className="w-full space-y-3 mt-1">
                  {exp.highlights?.map((bullet, bIdx) =>
                    renderControlBlock(
                      `exp-${expIdx}-bullet-${bIdx}`,
                      bIdx,
                      bullet.originalText,
                      bullet.currentText,
                      true,
                    ),
                  )}
                </div>
              </fieldset>
            </div>
          ))}
        </section>

        {/* 3. PROJECTS SECTION */}
        <section className="w-full flex-col bg-white border border-black/5">
          <SectionHeading sectionLabel="Projects" />
          {projects.map((proj, projIdx) => (
            <div
              key={proj.id || projIdx}
              className="w-full grid grid-cols-2 p-3 gap-2 border-b border-black/5 last:border-b-0"
            >
              <fieldset className="flex flex-col col-span-2">
                <label className="text-tiny text-brand font-medium">
                  PROJECT TITLE
                </label>
                <input
                  value={proj.title}
                  onChange={(e) =>
                    handleFieldChange(
                      "project",
                      projIdx,
                      "title",
                      e.target.value,
                    )
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col">
                <label className="text-tiny text-brand font-medium">LINK</label>
                <input
                  value={proj.link || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "project",
                      projIdx,
                      "link",
                      e.target.value,
                    )
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col">
                <label className="text-tiny text-brand font-medium">
                  START DATE
                </label>
                <input
                  value={proj.start_date || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "project",
                      projIdx,
                      "start_date",
                      e.target.value,
                    )
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col">
                <label className="text-tiny text-brand font-medium">
                  END DATE
                </label>
                <input
                  value={proj.end_date || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "project",
                      projIdx,
                      "end_date",
                      e.target.value,
                    )
                  }
                  placeholder="Present"
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col col-span-2">
                <label className="text-tiny text-brand font-medium">
                  PROJECT SUBTITLE / TECH STACK
                </label>
                <div className="w-full space-y-3 mt-1">
                  {renderControlBlock(
                    `proj-sub-${projIdx}`,
                    projIdx,
                    proj.subtitle?.originalText || "",
                    proj.subtitle?.currentText || "",
                    false,
                  )}
                </div>
              </fieldset>
              <fieldset className="flex flex-col col-span-2">
                <label className="text-tiny text-brand font-medium">
                  PROJECT HIGHLIGHTS
                </label>
                <div className="w-full space-y-3 mt-1">
                  {proj.highlights?.map((bullet, bIdx) =>
                    renderControlBlock(
                      `proj-${projIdx}-bullet-${bIdx}`,
                      bIdx,
                      bullet.originalText,
                      bullet.currentText,
                      true,
                    ),
                  )}
                </div>
              </fieldset>
            </div>
          ))}
        </section>

        {/* 4. EDUCATION SECTION */}
        <section className="w-full flex-col bg-white border border-black/5">
          <SectionHeading sectionLabel="Education" />
          {education.map((edu, eduIdx) => (
            <div
              key={edu.id || eduIdx}
              className="w-full grid grid-cols-2 p-3 gap-2 border-b border-black/5 last:border-b-0"
            >
              <fieldset className="flex flex-col col-span-2">
                <label className="text-tiny text-brand font-medium">
                  INSTITUTION
                </label>
                <input
                  value={edu.institution}
                  onChange={(e) =>
                    handleFieldChange(
                      "education",
                      eduIdx,
                      "institution",
                      e.target.value,
                    )
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col">
                <label className="text-tiny text-brand font-medium">
                  SCORE
                </label>
                <input
                  value={edu.score || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "education",
                      eduIdx,
                      "score",
                      e.target.value,
                    )
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col">
                <label className="text-tiny text-brand font-medium">
                  LOCATION
                </label>
                <input
                  value={edu.location || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "education",
                      eduIdx,
                      "location",
                      e.target.value,
                    )
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col">
                <label className="text-tiny text-brand font-medium">
                  START DATE
                </label>
                <input
                  value={edu.start_date || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "education",
                      eduIdx,
                      "start_date",
                      e.target.value,
                    )
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col">
                <label className="text-tiny text-brand font-medium">
                  END DATE
                </label>
                <input
                  value={edu.end_date || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "education",
                      eduIdx,
                      "end_date",
                      e.target.value,
                    )
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col">
                <label className="text-tiny text-brand font-medium">LINK</label>
                <input
                  value={edu.link || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "education",
                      eduIdx,
                      "link",
                      e.target.value,
                    )
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col col-span-2">
                <label className="text-tiny text-brand font-medium">
                  DEGREE NOMENCLATURE
                </label>
                <div className="w-full space-y-3 mt-1">
                  {renderControlBlock(
                    `edu-deg-${eduIdx}`,
                    eduIdx,
                    edu.degree?.originalText || "",
                    edu.degree?.currentText || "",
                    false,
                  )}
                </div>
              </fieldset>
              <fieldset className="flex flex-col col-span-2">
                <label className="text-tiny text-brand font-medium">
                  EDUCATION HIGHLIGHTS
                </label>
                <div className="w-full space-y-3 mt-1">
                  {edu.highlights?.map((bullet, bIdx) =>
                    renderControlBlock(
                      `edu-${eduIdx}-bullet-${bIdx}`,
                      bIdx,
                      bullet.originalText,
                      bullet.currentText,
                      true,
                    ),
                  )}
                </div>
              </fieldset>
            </div>
          ))}
        </section>

        {/* 5. CERTIFICATES SECTION */}
        <section className="w-full flex-col bg-white border border-black/5">
          <SectionHeading sectionLabel="Certificates" />
          {certificates.map((cert, certIdx) => (
            <div
              key={cert.id || certIdx}
              className="w-full grid grid-cols-2 p-3 gap-2 border-b border-black/5 last:border-b-0"
            >
              <fieldset className="flex flex-col col-span-2">
                <label className="text-tiny text-brand font-medium">
                  ISSUER
                </label>
                <input
                  value={cert.issuer}
                  onChange={(e) =>
                    handleFieldChange("cert", certIdx, "issuer", e.target.value)
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col">
                <label className="text-tiny text-brand font-medium">
                  ISSUE DATE
                </label>
                <input
                  value={cert.issue_date || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "cert",
                      certIdx,
                      "issue_date",
                      e.target.value,
                    )
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col">
                <label className="text-tiny text-brand font-medium">
                  EXPIRY DATE
                </label>
                <input
                  value={cert.expiry_date || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "cert",
                      certIdx,
                      "expiry_date",
                      e.target.value,
                    )
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col col-span-2">
                <label className="text-tiny text-brand font-medium">LINK</label>
                <input
                  value={cert.link || ""}
                  onChange={(e) =>
                    handleFieldChange("cert", certIdx, "link", e.target.value)
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col col-span-2">
                <label className="text-tiny text-brand font-medium">
                  CERTIFICATE NAME
                </label>
                <div className="w-full space-y-3 mt-1">
                  {renderControlBlock(
                    `cert-name-${certIdx}`,
                    certIdx,
                    cert.name?.originalText || "",
                    cert.name?.currentText || "",
                    false,
                  )}
                </div>
              </fieldset>
              <fieldset className="flex flex-col col-span-2">
                <label className="text-tiny text-brand font-medium">
                  CERTIFICATE HIGHLIGHTS
                </label>
                <div className="w-full space-y-3 mt-1">
                  {cert.highlights?.map((bullet, bIdx) =>
                    renderControlBlock(
                      `cert-${certIdx}-bullet-${bIdx}`,
                      bIdx,
                      bullet.originalText,
                      bullet.currentText,
                      true,
                    ),
                  )}
                </div>
              </fieldset>
            </div>
          ))}
        </section>

        {/* 6. SKILLS SECTION */}
        <section className="w-full flex-col bg-white border border-black/5">
          <SectionHeading sectionLabel="Skills" />
          <div className="w-full p-3">
            <div className="flex flex-wrap gap-1 py-1">
              {skills.map((s) => (
                <span
                  key={s.id}
                  className="text-xxs bg-gray-100 text-text-primary px-1.5 py-0.5 rounded-none"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 7. LANGUAGES SECTION */}
        <section className="w-full flex-col bg-white border border-black/5">
          <SectionHeading sectionLabel="Languages" />
          <div className="w-full p-3">
            <div className="flex flex-wrap gap-1 py-1">
              {languages.map((l) => (
                <span
                  key={l.id}
                  className="text-xxs bg-gray-100 text-text-primary px-1.5 py-0.5 rounded-none"
                >
                  {l.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 8. INTERESTS SECTION */}
        <section className="w-full flex-col bg-white border border-black/5">
          <SectionHeading sectionLabel="Interests" />
          <div className="w-full p-3">
            <div className="flex flex-wrap gap-1 py-1">
              {interests.map((i) => (
                <span
                  key={i.id}
                  className="text-xxs bg-gray-100 text-text-primary px-1.5 py-0.5 rounded-none"
                >
                  {i.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 9. AWARDS SECTION */}
        <section className="w-full flex-col bg-white border border-black/5">
          <SectionHeading sectionLabel="Honors & Awards" />
          <div className="p-3 space-y-4">
            {awards.map((aw, awIdx) => (
              <div key={aw.id} className="text-xs space-y-2">
                <fieldset className="flex flex-col col-span-2">
                  <label className="text-tiny text-brand font-medium">
                    AWARD NAME
                  </label>
                  <input
                    value={aw.title}
                    onChange={(e) =>
                      handleFieldChange("award", awIdx, "title", e.target.value)
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 font-semibold text-brand text-tiny uppercase"
                  />
                </fieldset>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <fieldset className="flex flex-col">
                    <label className="text-tiny text-brand font-medium">
                      AWARDER
                    </label>
                    <input
                      value={aw.awarder || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          "award",
                          awIdx,
                          "awarder",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                    />
                  </fieldset>
                  <fieldset className="flex flex-col">
                    <label className="text-tiny text-brand font-medium">
                      DATE
                    </label>
                    <input
                      value={aw.date || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          "award",
                          awIdx,
                          "date",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                    />
                  </fieldset>
                </div>
                <div className="flex flex-col">
                  <label className="text-tiny text-brand font-medium mb-1">
                    DESCRIPTION
                  </label>
                  <div className="w-full space-y-3 mt-1">
                    {renderControlBlock(
                      `award-block-${aw.id}`,
                      awIdx,
                      aw.description?.originalText || "",
                      aw.description?.currentText || "",
                      false,
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 10. PUBLICATIONS SECTION */}
        <section className="w-full flex-col bg-white border border-black/5">
          <SectionHeading sectionLabel="Publications" />
          <div className="p-3 space-y-4">
            {publications.map((pub, pubIdx) => (
              <div key={pub.id} className="text-xs space-y-2">
                <fieldset className="flex flex-col col-span-2">
                  <label className="text-tiny text-brand font-medium">
                    PUBLICATION NAME
                  </label>
                  <input
                    value={pub.title}
                    onChange={(e) =>
                      handleFieldChange("pub", pubIdx, "title", e.target.value)
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 font-semibold text-tiny uppercase"
                  />
                </fieldset>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <fieldset className="flex flex-col">
                    <label className="text-tiny text-brand font-medium">
                      PUBLISHER
                    </label>
                    <input
                      value={pub.publisher || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          "pub",
                          pubIdx,
                          "publisher",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                    />
                  </fieldset>
                  <fieldset className="flex flex-col">
                    <label className="text-tiny text-brand font-medium">
                      DATE
                    </label>
                    <input
                      value={pub.date || ""}
                      onChange={(e) =>
                        handleFieldChange("pub", pubIdx, "date", e.target.value)
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                    />
                  </fieldset>
                  <fieldset className="flex flex-col col-span-2">
                    <label className="text-tiny text-brand font-medium">
                      LINK
                    </label>
                    <input
                      value={pub.link || ""}
                      onChange={(e) =>
                        handleFieldChange("pub", pubIdx, "link", e.target.value)
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                    />
                  </fieldset>
                </div>
                <div className="flex flex-col">
                  <label className="text-tiny text-brand font-medium mb-1">
                    DESCRIPTION
                  </label>
                  <div className="w-full space-y-3 mt-1">
                    {renderControlBlock(
                      `pub-block-${pub.id}`,
                      pubIdx,
                      pub.description?.originalText || "",
                      pub.description?.currentText || "",
                      false,
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 11. REFERENCES SECTION */}
        <section className="w-full flex-col bg-white border border-black/5">
          <SectionHeading sectionLabel="References" />
          {references.map((ref, refIdx) => (
            <div
              key={ref.id || refIdx}
              className="w-full grid grid-cols-2 p-4 gap-2 border-b border-black/5 last:border-b-0"
            >
              <fieldset className="flex flex-col">
                <label className="text-tiny text-brand font-medium">NAME</label>
                <input
                  value={ref.name}
                  onChange={(e) =>
                    setReferences((prev) =>
                      prev.map((r, i) =>
                        i === refIdx ? { ...r, name: e.target.value } : r,
                      ),
                    )
                  }
                  className="rounded-none py-1  text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col">
                <label className="text-tiny  text-brand font-medium">
                  POSITION
                </label>
                <input
                  value={ref.position}
                  onChange={(e) =>
                    setReferences((prev) =>
                      prev.map((r, i) =>
                        i === refIdx ? { ...r, position: e.target.value } : r,
                      ),
                    )
                  }
                  className="rounded-none py-1  text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col">
                <label className="text-tiny text-brand font-medium">
                  ORGANIZATION
                </label>
                <input
                  value={ref.organization}
                  onChange={(e) =>
                    setReferences((prev) =>
                      prev.map((r, i) =>
                        i === refIdx
                          ? { ...r, organization: e.target.value }
                          : r,
                      ),
                    )
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col">
                <label className="text-tiny text-brand font-medium">
                  EMAIL
                </label>
                <input
                  value={ref.email}
                  onChange={(e) =>
                    setReferences((prev) =>
                      prev.map((r, i) =>
                        i === refIdx ? { ...r, email: e.target.value } : r,
                      ),
                    )
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col col-span-2">
                <label className="text-tiny text-brand font-medium">
                  PHONE
                </label>
                <input
                  value={ref.phone}
                  onChange={(e) =>
                    setReferences((prev) =>
                      prev.map((r, i) =>
                        i === refIdx ? { ...r, phone: e.target.value } : r,
                      ),
                    )
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
            </div>
          ))}
        </section>
      </main>

      {/* ── RIGHT ASIDE ── */}
      <aside className="w-[20vw] h-full"></aside>
    </div>
  );
}
