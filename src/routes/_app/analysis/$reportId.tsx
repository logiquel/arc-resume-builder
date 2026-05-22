// RouteComponent.tsx
import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { aiProcessedSampleData } from "../../../../ai_process_sample_dataV2";
import ScorePanel from "#/components/pages/analysis/ScorePanel";
import { AiDiffField } from "#/components/pages/analysis/AiDiffField";

export const Route = createFileRoute("/_app/analysis/$reportId")({
  loader: async ({ params }) => ({
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: params.reportId, href: "#" },
      { label: "Report", href: "#" },
    ],
  }),
  component: RouteComponent,
});

interface SectionHeadingProps {
  sectionLabel: string;
  entriesCount?: number;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  sectionLabel,
  entriesCount,
}) => (
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

function RouteComponent() {
  const initialData = aiProcessedSampleData[0].resume_review.sections;

  // State for all sections
  const [profile, setProfile] = useState(initialData.profile);
  const [education, setEducation] = useState(initialData.education);
  const [experience, setExperience] = useState(initialData.experience);
  const [projects, setProjects] = useState(initialData.projects);
  const [skills, setSkills] = useState(initialData.skills);
  const [certificates, setCertificates] = useState(initialData.certificates);
  const [languages, setLanguages] = useState(initialData.languages);
  const [interests, setInterests] = useState(initialData.interests);
  const [awards, setAwards] = useState(initialData.awards);
  const [publications, setPublications] = useState(initialData.publications);
  const [references, setReferences] = useState(initialData.references);

  // Handler for normal input fields (non-AI fields)
  const handlePrimitiveChange = (
    section: string,
    index: number | null,
    field: string,
    value: string,
  ) => {
    switch (section) {
      case "profile":
        setProfile((prev) => ({ ...prev, [field]: value }));
        break;
      case "education":
        if (index !== null) {
          setEducation((prev) => {
            const newEntries = [...prev.entries];
            newEntries[index] = { ...newEntries[index], [field]: value };
            return { ...prev, entries: newEntries };
          });
        }
        break;
      case "experience":
        if (index !== null) {
          setExperience((prev) => {
            const newEntries = [...prev.entries];
            newEntries[index] = { ...newEntries[index], [field]: value };
            return { ...prev, entries: newEntries };
          });
        }
        break;
      case "projects":
        if (index !== null) {
          setProjects((prev) => {
            const newEntries = [...prev.entries];
            newEntries[index] = { ...newEntries[index], [field]: value };
            return { ...prev, entries: newEntries };
          });
        }
        break;
      case "skills":
        if (index !== null) {
          setSkills((prev) => {
            const newEntries = [...prev.entries];
            newEntries[index] = { ...newEntries[index], [field]: value };
            return { ...prev, entries: newEntries };
          });
        }
        break;
      case "certificates":
        if (index !== null) {
          setCertificates((prev) => {
            const newEntries = [...prev.entries];
            newEntries[index] = { ...newEntries[index], [field]: value };
            return { ...prev, entries: newEntries };
          });
        }
        break;
      case "languages":
        if (index !== null) {
          setLanguages((prev) => {
            const newEntries = [...prev.entries];
            newEntries[index] = { ...newEntries[index], [field]: value };
            return { ...prev, entries: newEntries };
          });
        }
        break;
      case "interests":
        if (index !== null) {
          setInterests((prev) => {
            const newEntries = [...prev.entries];
            newEntries[index] = { ...newEntries[index], [field]: value };
            return { ...prev, entries: newEntries };
          });
        }
        break;
      case "awards":
        if (index !== null) {
          setAwards((prev) => {
            const newEntries = [...prev.entries];
            newEntries[index] = { ...newEntries[index], [field]: value };
            return { ...prev, entries: newEntries };
          });
        }
        break;
      case "publications":
        if (index !== null) {
          setPublications((prev) => {
            const newEntries = [...prev.entries];
            newEntries[index] = { ...newEntries[index], [field]: value };
            return { ...prev, entries: newEntries };
          });
        }
        break;
      case "references":
        if (index !== null) {
          setReferences((prev) => {
            const newEntries = [...prev.entries];
            newEntries[index] = { ...newEntries[index], [field]: value };
            return { ...prev, entries: newEntries };
          });
        }
        break;
    }
  };

  // Handler for AI diff field updates
  const handleAiFieldUpdate = (
    section: string,
    index: number | null,
    field: string,
    newValue: string | string[],
  ) => {
    const updateFunction = (prev: any) => {
      if (index === null) {
        return { ...prev, [field]: { ...prev[field], final_value: newValue } };
      } else {
        const newEntries = [...prev.entries];
        newEntries[index] = {
          ...newEntries[index],
          [field]: { ...newEntries[index][field], final_value: newValue },
        };
        return { ...prev, entries: newEntries };
      }
    };

    switch (section) {
      case "profile":
        setProfile(updateFunction);
        break;
      case "education":
        setEducation(updateFunction);
        break;
      case "experience":
        setExperience(updateFunction);
        break;
      case "projects":
        setProjects(updateFunction);
        break;
      case "skills":
        setSkills(updateFunction);
        break;
      case "certificates":
        setCertificates(updateFunction);
        break;
      case "awards":
        setAwards(updateFunction);
        break;
      case "publications":
        setPublications(updateFunction);
        break;
    }
  };

  return (
    <div className="w-full h-full flex overflow-hidden bg-gray-50">
      <aside className="w-[20vw] h-full border-r border-black/5 bg-white" />

      <main className="h-full flex-1 overflow-y-auto hide-scrollbar space-y-4 py-4 px-6">
        {/* PROFILE SECTION */}
        <section className="w-full flex-col border border-black/10 bg-white rounded-2xl overflow-clip shadow-sm">
          <SectionHeading sectionLabel="Profile" />
          <div className="w-full grid grid-cols-3 p-4 gap-4">
            <fieldset className="flex flex-col">
              <label className="text-tiny text-text-muted font-medium mb-1">
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
              <label className="text-tiny text-text-muted font-medium mb-1">
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
              <label className="text-tiny text-text-muted font-medium mb-1">
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
              <label className="text-tiny text-text-muted font-medium mb-1">
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
              <label className="text-tiny text-text-muted font-medium mb-1">
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
              <label className="text-tiny text-text-muted font-medium mb-1">
                PROFESSIONAL TITLE
              </label>
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
              <label className="text-tiny text-text-muted font-medium mb-1">
                SUMMARY
              </label>
              <AiDiffField
                fieldData={profile.summary}
                onUpdateValue={(val) =>
                  handleAiFieldUpdate("profile", null, "summary", val)
                }
              />
            </fieldset>
          </div>
        </section>

        {/* EDUCATION SECTION */}
        <section className="w-full flex-col border border-black/10 bg-white rounded-2xl overflow-clip shadow-sm">
          <SectionHeading
            sectionLabel="Education"
            entriesCount={education.entries?.length || 0}
          />
          {education.entries?.map((edu: any, idx: number) => (
            <React.Fragment key={edu.entry_id}>
              <div className="w-full col-span-3 px-3 py-1 border-b border-black/5 bg-gray-50 flex items-center">
                <span className="text-xxs text-text-secondary font-semibold font-mono">
                  #{idx + 1}
                </span>
              </div>
              <div className="w-full grid grid-cols-4 p-4 gap-4 border-b border-black/5 last:border-0 bg-white">
                <fieldset className="flex flex-col col-span-2">
                  <label className="text-tiny text-text-muted font-medium mb-1">
                    INSTITUTION
                  </label>
                  <input
                    value={edu.institution || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "education",
                        idx,
                        "institution",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col col-span-2">
                  <label className="text-tiny text-text-muted font-medium mb-1">
                    LOCATION
                  </label>
                  <input
                    value={edu.location || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "education",
                        idx,
                        "location",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium mb-1">
                    START DATE
                  </label>
                  <input
                    value={edu.start_date || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "education",
                        idx,
                        "start_date",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium mb-1">
                    END DATE
                  </label>
                  <input
                    value={edu.end_date || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "education",
                        idx,
                        "end_date",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col col-span-4">
                  <label className="text-tiny text-text-muted font-medium mb-1">
                    DEGREE
                  </label>
                  <AiDiffField
                    fieldData={edu.degree}
                    onUpdateValue={(val) =>
                      handleAiFieldUpdate("education", idx, "degree", val)
                    }
                  />
                </fieldset>
                <fieldset className="flex flex-col col-span-4">
                  <label className="text-tiny text-text-muted font-medium mb-1">
                    DESCRIPTION
                  </label>
                  <AiDiffField
                    fieldData={edu.description}
                    onUpdateValue={(val) =>
                      handleAiFieldUpdate("education", idx, "description", val)
                    }
                  />
                </fieldset>
              </div>
            </React.Fragment>
          ))}
        </section>

        {/* WORK EXPERIENCE SECTION */}
        <section className="w-full flex-col border border-black/10 bg-white rounded-2xl overflow-clip shadow-sm">
          <SectionHeading
            sectionLabel="Work Experience"
            entriesCount={experience.entries?.length || 0}
          />
          {experience.entries?.map((exp: any, idx: number) => (
            <React.Fragment key={exp.entry_id}>
              <div className="w-full col-span-3 px-3 py-1 border-b border-black/5 bg-gray-50 flex items-center">
                <span className="text-xxs text-text-secondary font-semibold font-mono">
                  #{idx + 1}
                </span>
              </div>
              <div className="w-full grid grid-cols-4 p-4 gap-4 border-b border-black/5 last:border-0 bg-white">
                <fieldset className="flex flex-col col-span-2">
                  <label className="text-tiny text-text-muted font-medium mb-1">
                    COMPANY
                  </label>
                  <input
                    value={exp.company || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "experience",
                        idx,
                        "company",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col col-span-2">
                  <label className="text-tiny text-text-muted font-medium mb-1">
                    LOCATION
                  </label>
                  <input
                    value={exp.location || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "experience",
                        idx,
                        "location",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium mb-1">
                    START DATE
                  </label>
                  <input
                    value={exp.start_date || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "experience",
                        idx,
                        "start_date",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium mb-1">
                    END DATE
                  </label>
                  <input
                    value={exp.end_date || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "experience",
                        idx,
                        "end_date",
                        e.target.value,
                      )
                    }
                    placeholder="Present"
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col col-span-4">
                  <label className="text-tiny text-text-muted font-medium mb-1">
                    POSITION
                  </label>
                  <AiDiffField
                    fieldData={exp.position}
                    onUpdateValue={(val) =>
                      handleAiFieldUpdate("experience", idx, "position", val)
                    }
                  />
                </fieldset>
                <fieldset className="flex flex-col col-span-4">
                  <label className="text-tiny text-text-muted font-medium mb-1">
                    DESCRIPTION
                  </label>
                  <AiDiffField
                    fieldData={exp.description}
                    onUpdateValue={(val) =>
                      handleAiFieldUpdate("experience", idx, "description", val)
                    }
                  />
                </fieldset>
              </div>
            </React.Fragment>
          ))}
        </section>

        {/* PROJECTS SECTION */}
        <section className="w-full flex-col border border-black/10 bg-white rounded-2xl overflow-clip shadow-sm">
          <SectionHeading
            sectionLabel="Projects"
            entriesCount={projects.entries?.length || 0}
          />
          {projects.entries?.map((project: any, idx: number) => (
            <React.Fragment key={project.entry_id}>
              <div className="w-full col-span-3 px-3 py-1 border-b border-black/5 bg-gray-50 flex items-center">
                <span className="text-xxs text-text-secondary font-semibold font-mono">
                  #{idx + 1}
                </span>
              </div>
              <div className="w-full grid grid-cols-4 p-4 gap-4 border-b border-black/5 last:border-0 bg-white">
                <fieldset className="flex flex-col col-span-4">
                  <label className="text-tiny text-text-muted font-medium mb-1">
                    TITLE
                  </label>
                  <input
                    value={project.title || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "projects",
                        idx,
                        "title",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col col-span-4">
                  <label className="text-tiny text-text-muted font-medium mb-1">
                    SUBTITLE
                  </label>
                  <AiDiffField
                    fieldData={project.subtitle}
                    onUpdateValue={(val) =>
                      handleAiFieldUpdate("projects", idx, "subtitle", val)
                    }
                  />
                </fieldset>
                <fieldset className="flex flex-col col-span-2">
                  <label className="text-tiny text-text-muted font-medium mb-1">
                    START DATE
                  </label>
                  <input
                    value={project.start_date || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "projects",
                        idx,
                        "start_date",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col col-span-2">
                  <label className="text-tiny text-text-muted font-medium mb-1">
                    END DATE
                  </label>
                  <input
                    value={project.end_date || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "projects",
                        idx,
                        "end_date",
                        e.target.value,
                      )
                    }
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                  />
                </fieldset>
                <fieldset className="flex flex-col col-span-4">
                  <label className="text-tiny text-text-muted font-medium mb-1">
                    DESCRIPTION
                  </label>
                  <AiDiffField
                    fieldData={project.description}
                    onUpdateValue={(val) =>
                      handleAiFieldUpdate("projects", idx, "description", val)
                    }
                  />
                </fieldset>
              </div>
            </React.Fragment>
          ))}
        </section>

        {/* SKILLS SECTION */}
        <section className="w-full flex-col border border-black/10 bg-white rounded-2xl overflow-clip shadow-sm">
          <SectionHeading
            sectionLabel="Skills"
            entriesCount={skills.entries?.length || 0}
          />
          <div className="w-full p-4">
            <div className="grid grid-cols-2 gap-4">
              {skills.entries?.map((skill: any, idx: number) => (
                <div
                  key={skill.entry_id}
                  className="flex items-center gap-2 border-b border-black/5 pb-2"
                >
                  <fieldset className="flex-1 flex flex-col">
                    <label className="text-tiny text-text-muted font-medium mb-1">
                      SKILL
                    </label>
                    {skill.name?.old_value ? (
                      <AiDiffField
                        fieldData={skill.name}
                        onUpdateValue={(val) =>
                          handleAiFieldUpdate("skills", idx, "name", val)
                        }
                      />
                    ) : (
                      <input
                        value={skill.name || ""}
                        onChange={(e) =>
                          handlePrimitiveChange(
                            "skills",
                            idx,
                            "name",
                            e.target.value,
                          )
                        }
                        className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                      />
                    )}
                  </fieldset>
                  <fieldset className="flex-1 flex flex-col">
                    <label className="text-tiny text-text-muted font-medium mb-1">
                      LEVEL
                    </label>
                    <input
                      value={skill.level || ""}
                      onChange={(e) =>
                        handlePrimitiveChange(
                          "skills",
                          idx,
                          "level",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                    />
                  </fieldset>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CERTIFICATES SECTION */}
        <section className="w-full flex-col border border-black/10 bg-white rounded-2xl overflow-clip shadow-sm">
          <SectionHeading
            sectionLabel="Certificates"
            entriesCount={certificates.entries?.length || 0}
          />
          {certificates.entries?.map((cert: any, idx: number) => (
            <div
              key={cert.entry_id}
              className="w-full grid grid-cols-4 p-4 gap-4 border-b border-black/5 last:border-0 bg-white"
            >
              <fieldset className="flex flex-col col-span-4">
                <label className="text-tiny text-text-muted font-medium mb-1">
                  NAME
                </label>
                <AiDiffField
                  fieldData={cert.name}
                  onUpdateValue={(val) =>
                    handleAiFieldUpdate("certificates", idx, "name", val)
                  }
                />
              </fieldset>
              <fieldset className="flex flex-col col-span-2">
                <label className="text-tiny text-text-muted font-medium mb-1">
                  ISSUER
                </label>
                <input
                  value={cert.issuer || ""}
                  onChange={(e) =>
                    handlePrimitiveChange(
                      "certificates",
                      idx,
                      "issuer",
                      e.target.value,
                    )
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col">
                <label className="text-tiny text-text-muted font-medium mb-1">
                  ISSUE DATE
                </label>
                <input
                  value={cert.issue_date || ""}
                  onChange={(e) =>
                    handlePrimitiveChange(
                      "certificates",
                      idx,
                      "issue_date",
                      e.target.value,
                    )
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col">
                <label className="text-tiny text-text-muted font-medium mb-1">
                  EXPIRY DATE
                </label>
                <input
                  value={cert.expiry_date || ""}
                  onChange={(e) =>
                    handlePrimitiveChange(
                      "certificates",
                      idx,
                      "expiry_date",
                      e.target.value,
                    )
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col col-span-4">
                <label className="text-tiny text-text-muted font-medium mb-1">
                  DESCRIPTION
                </label>
                <AiDiffField
                  fieldData={cert.description}
                  onUpdateValue={(val) =>
                    handleAiFieldUpdate("certificates", idx, "description", val)
                  }
                />
              </fieldset>
            </div>
          ))}
        </section>

        {/* LANGUAGES SECTION */}
        <section className="w-full flex-col border border-black/10 bg-white rounded-2xl overflow-clip shadow-sm">
          <SectionHeading
            sectionLabel="Languages"
            entriesCount={languages.entries?.length || 0}
          />
          <div className="w-full p-4">
            <div className="grid grid-cols-2 gap-4">
              {languages.entries?.map((lang: any, idx: number) => (
                <div
                  key={lang.entry_id}
                  className="flex items-center gap-4 border-b border-black/5 pb-2"
                >
                  <fieldset className="flex-1 flex flex-col">
                    <label className="text-tiny text-text-muted font-medium mb-1">
                      LANGUAGE
                    </label>
                    <input
                      value={lang.name || ""}
                      onChange={(e) =>
                        handlePrimitiveChange(
                          "languages",
                          idx,
                          "name",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                    />
                  </fieldset>
                  <fieldset className="flex-1 flex flex-col">
                    <label className="text-tiny text-text-muted font-medium mb-1">
                      LEVEL
                    </label>
                    <input
                      value={lang.level || ""}
                      onChange={(e) =>
                        handlePrimitiveChange(
                          "languages",
                          idx,
                          "level",
                          e.target.value,
                        )
                      }
                      className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                    />
                  </fieldset>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INTERESTS SECTION */}
        <section className="w-full flex-col border border-black/10 bg-white rounded-2xl overflow-clip shadow-sm">
          <SectionHeading
            sectionLabel="Interests"
            entriesCount={interests.entries?.length || 0}
          />
          <div className="w-full p-4">
            <div className="flex flex-wrap gap-2">
              {interests.entries?.map((interest: any, idx: number) => (
                <fieldset key={interest.entry_id} className="flex flex-col">
                  <input
                    value={interest.name || ""}
                    onChange={(e) =>
                      handlePrimitiveChange(
                        "interests",
                        idx,
                        "name",
                        e.target.value,
                      )
                    }
                    className="rounded-full py-1.5 px-3 text-text-primary text-xs border border-gray-200 focus:border-gray-300 outline-0 bg-gray-50"
                  />
                </fieldset>
              ))}
            </div>
          </div>
        </section>

        {/* AWARDS SECTION */}
        <section className="w-full flex-col border border-black/10 bg-white rounded-2xl overflow-clip shadow-sm">
          <SectionHeading
            sectionLabel="Awards"
            entriesCount={awards.entries?.length || 0}
          />
          {awards.entries?.map((award: any, idx: number) => (
            <div
              key={award.entry_id}
              className="w-full grid grid-cols-4 p-4 gap-4 border-b border-black/5 last:border-0 bg-white"
            >
              <fieldset className="flex flex-col col-span-4">
                <label className="text-tiny text-text-muted font-medium mb-1">
                  TITLE
                </label>
                <AiDiffField
                  fieldData={award.title}
                  onUpdateValue={(val) =>
                    handleAiFieldUpdate("awards", idx, "title", val)
                  }
                />
              </fieldset>
              <fieldset className="flex flex-col col-span-2">
                <label className="text-tiny text-text-muted font-medium mb-1">
                  AWARDER
                </label>
                <input
                  value={award.awarder || ""}
                  onChange={(e) =>
                    handlePrimitiveChange(
                      "awards",
                      idx,
                      "awarder",
                      e.target.value,
                    )
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col col-span-2">
                <label className="text-tiny text-text-muted font-medium mb-1">
                  DATE
                </label>
                <input
                  value={award.date || ""}
                  onChange={(e) =>
                    handlePrimitiveChange("awards", idx, "date", e.target.value)
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col col-span-4">
                <label className="text-tiny text-text-muted font-medium mb-1">
                  DESCRIPTION
                </label>
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

        {/* PUBLICATIONS SECTION */}
        <section className="w-full flex-col border border-black/10 bg-white rounded-2xl overflow-clip shadow-sm">
          <SectionHeading
            sectionLabel="Publications"
            entriesCount={publications.entries?.length || 0}
          />
          {publications.entries?.map((pub: any, idx: number) => (
            <div
              key={pub.entry_id}
              className="w-full grid grid-cols-4 p-4 gap-4 border-b border-black/5 last:border-0 bg-white"
            >
              <fieldset className="flex flex-col col-span-4">
                <label className="text-tiny text-text-muted font-medium mb-1">
                  TITLE
                </label>
                <AiDiffField
                  fieldData={pub.title}
                  onUpdateValue={(val) =>
                    handleAiFieldUpdate("publications", idx, "title", val)
                  }
                />
              </fieldset>
              <fieldset className="flex flex-col col-span-2">
                <label className="text-tiny text-text-muted font-medium mb-1">
                  PUBLISHER
                </label>
                <input
                  value={pub.publisher || ""}
                  onChange={(e) =>
                    handlePrimitiveChange(
                      "publications",
                      idx,
                      "publisher",
                      e.target.value,
                    )
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col">
                <label className="text-tiny text-text-muted font-medium mb-1">
                  DATE
                </label>
                <input
                  value={pub.date || ""}
                  onChange={(e) =>
                    handlePrimitiveChange(
                      "publications",
                      idx,
                      "date",
                      e.target.value,
                    )
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col">
                <label className="text-tiny text-text-muted font-medium mb-1">
                  LINK
                </label>
                <input
                  value={pub.link || ""}
                  onChange={(e) =>
                    handlePrimitiveChange(
                      "publications",
                      idx,
                      "link",
                      e.target.value,
                    )
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col col-span-4">
                <label className="text-tiny text-text-muted font-medium mb-1">
                  DESCRIPTION
                </label>
                <AiDiffField
                  fieldData={pub.description}
                  onUpdateValue={(val) =>
                    handleAiFieldUpdate("publications", idx, "description", val)
                  }
                />
              </fieldset>
            </div>
          ))}
        </section>

        {/* REFERENCES SECTION */}
        <section className="w-full flex-col border border-black/10 bg-white rounded-2xl overflow-clip shadow-sm">
          <SectionHeading
            sectionLabel="References"
            entriesCount={references.entries?.length || 0}
          />
          {references.entries?.map((ref: any, idx: number) => (
            <div
              key={ref.entry_id}
              className="w-full grid grid-cols-4 p-4 gap-4 border-b border-black/5 last:border-0 bg-white"
            >
              <fieldset className="flex flex-col">
                <label className="text-tiny text-text-muted font-medium mb-1">
                  NAME
                </label>
                <input
                  value={ref.name || ""}
                  onChange={(e) =>
                    handlePrimitiveChange(
                      "references",
                      idx,
                      "name",
                      e.target.value,
                    )
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col col-span-2">
                <label className="text-tiny text-text-muted font-medium mb-1">
                  POSITION
                </label>
                <input
                  value={ref.position || ""}
                  onChange={(e) =>
                    handlePrimitiveChange(
                      "references",
                      idx,
                      "position",
                      e.target.value,
                    )
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col">
                <label className="text-tiny text-text-muted font-medium mb-1">
                  ORGANIZATION
                </label>
                <input
                  value={ref.organization || ""}
                  onChange={(e) =>
                    handlePrimitiveChange(
                      "references",
                      idx,
                      "organization",
                      e.target.value,
                    )
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col">
                <label className="text-tiny text-text-muted font-medium mb-1">
                  EMAIL
                </label>
                <input
                  value={ref.email || ""}
                  onChange={(e) =>
                    handlePrimitiveChange(
                      "references",
                      idx,
                      "email",
                      e.target.value,
                    )
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
              <fieldset className="flex flex-col">
                <label className="text-tiny text-text-muted font-medium mb-1">
                  PHONE
                </label>
                <input
                  value={ref.phone || ""}
                  onChange={(e) =>
                    handlePrimitiveChange(
                      "references",
                      idx,
                      "phone",
                      e.target.value,
                    )
                  }
                  className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0"
                />
              </fieldset>
            </div>
          ))}
        </section>
      </main>

      <ScorePanel />
    </div>
  );
}
