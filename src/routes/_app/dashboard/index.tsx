import { createFileRoute } from "@tanstack/react-router";
import resumeMock1 from "../../../../public/sample_resume_image.jpg";
import resumeMock2 from "../../../../public/sample_resume_image_2.jpg";
import resumeMock3 from "../../../../public/sample_resume_image_3.jpg";
import resumeMock4 from "../../../../public/sample_resume_image_4.jpg";
import { sampleResume } from "../../../../sample_resume_data";
import FileFolderIcon from "#/components/common/Icons/FileFolderIcon";
import { Icon } from "@iconify/react";
import { useState } from "react";

const mockImages = [resumeMock1, resumeMock2, resumeMock3, resumeMock4];
export const Route = createFileRoute("/_app/dashboard/")({
  component: RouteComponent,
});

interface SectionHeadingProps {
  label: string;
}
const SectionHeading: React.FC<SectionHeadingProps> = ({ label }) => {
  return (
    <div className="w-full flex items-center p-4 sticky top-0 bg-[#F9FBFC]">
      <h1 className="text-xs uppercase text-brand font-medium">{label}</h1>
    </div>
  );
};

interface ResumeSectionHeadingProps {
  label: string;
  className?: string;
}
const ResumeSectionHeading: React.FC<ResumeSectionHeadingProps> = ({
  label,
  className,
}) => {
  return (
    <div
      className={`w-full flex items-center p-2 sticky top-0 gap-x-2 ${className}`}
    >
      <h1 className="text-xs uppercase text-brand font-medium">{label}</h1>
      <span className="flex-1 h-[0.025rem] bg-black/10"></span>
    </div>
  );
};

// ── Field primitives ──────────────────────────────────────────────────────────

const Field = ({
  label,
  value,
  span = 1,
}: {
  label: string;
  value: string;
  span?: 1 | 2 | 3;
}) => {
  if (!value) return null;
  const colClass = span === 3 ? "col-span-3" : span === 2 ? "col-span-2" : "";
  return (
    <div className={`w-full flex flex-col ${colClass}`}>
      <span className="text-tiny uppercase text-text-muted font-medium">
        {label}
      </span>
      <span className="text-xxs text-text-primary">{value}</span>
    </div>
  );
};

const ChipField = ({ label, values }: { label: string; values: string[] }) => {
  if (!values.length) return null;
  return (
    <div className="w-full flex flex-col col-span-3">
      <span className="text-tiny uppercase text-brand font-medium">
        {label}
      </span>
      <div className="flex flex-wrap gap-1 mt-0.5">
        {values.map((v, i) => (
          <span
            key={i}
            className="inline-flex items-center px-1.5 py-0.5 rounded text-tiny bg-gray-100 text-text-muted border border-black/5"
          >
            {v}
          </span>
        ))}
      </div>
    </div>
  );
};

// ── All parse sections ────────────────────────────────────────────────────────
const EntryNumber = ({ index }: { index: number }) => (
  <div className="col-span-3 flex items-center gap-2 mt-1 first:mt-0">
    <span className="text-tiny font-mono font-bold text-text-muted">
      #{index + 1}
    </span>
    <span className="flex-1 h-[0.025rem] bg-black/8" />
  </div>
);

const ParseResults = () => {
  const {
    profile,
    education,
    experience,
    projects,
    certificates,
    skills,
    languages,
    interests,
    awards,
    publications,
    references,
  } = sampleResume;

  return (
    <div className="w-full flex flex-col gap-y-5 bg-white p-3">
      {/* Profile — single entry, no number */}
      <section className="w-full h-auto flex flex-col">
        <ResumeSectionHeading label="Profile" />
        <div className="w-full flex-1 grid grid-cols-3 gap-2 items-start px-2">
          <Field label="First Name" value={profile.first_name} />
          <Field label="Last Name" value={profile.last_name} />
          <Field
            label="Professional Title"
            value={profile.professional_title}
          />
          <Field label="Email" value={profile.email} />
          <Field label="Phone" value={profile.phone} />
          <Field label="Location" value={profile.location} />
          <Field label="Summary" value={profile.summary} span={3} />

          {/* Links Row — Displays full, parsed URLs sequentially instead of UI chips */}
          {profile.links && profile.links.length > 0 && (
            <div className="w-full flex flex-col col-span-3 gap-y-1">
              <span className="text-tiny uppercase text-brand font-medium">
                Links
              </span>
              <div className="w-full flex flex-col gap-y-1 pl-0.5">
                {profile.links.map((link, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-tiny text-text-muted uppercase font-medium">
                      {link.name || "URL"}
                    </span>
                    <span className="text-xxs text-brand break-all font-mono">
                      {link.value || "No link path resolved"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Experience */}
      <section className="w-full h-auto flex flex-col">
        <ResumeSectionHeading label="Experience" />
        <div className="w-full flex flex-col gap-y-3">
          {experience.map((exp, i) => (
            <div
              key={exp.id}
              className="w-full grid grid-cols-3 gap-2 items-start px-2"
            >
              <EntryNumber index={i} />
              <Field label="Position" value={exp.position} />
              <Field label="Company" value={exp.company} />
              <Field label="Location" value={exp.location} />
              <Field label="From" value={exp.start_date?.slice(0, 7) ?? ""} />
              <Field
                label="To"
                value={exp.end_date?.slice(0, 7) ?? "Present"}
              />
              <Field label="Description" value={exp.description} span={3} />
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="w-full h-auto flex flex-col">
        <ResumeSectionHeading label="Education" />
        <div className="w-full flex flex-col gap-y-3">
          {education.map((edu, i) => (
            <div
              key={edu.id}
              className="w-full grid grid-cols-3 gap-2 items-start px-2"
            >
              <EntryNumber index={i} />
              <Field label="Degree" value={edu.degree} span={2} />
              <Field label="Score" value={edu.score} />
              <Field label="Institution" value={edu.institution} span={2} />
              <Field label="Location" value={edu.location} />
              <Field label="From" value={edu.start_date?.slice(0, 7) ?? ""} />
              <Field
                label="To"
                value={edu.end_date?.slice(0, 7) ?? "Present"}
              />
              <Field label="Description" value={edu.description} span={3} />
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="w-full h-auto flex flex-col">
        <ResumeSectionHeading label="Projects" />
        <div className="w-full flex flex-col gap-y-3">
          {projects.map((proj, i) => (
            <div
              key={proj.id}
              className="w-full grid grid-cols-3 gap-2 items-start px-2"
            >
              <EntryNumber index={i} />
              <Field label="Title" value={proj.title} />
              <Field label="Subtitle" value={proj.subtitle} span={2} />
              <Field label="Link" value={proj.link} span={2} />
              <Field label="From" value={proj.start_date?.slice(0, 7) ?? ""} />
              <Field
                label="To"
                value={proj.end_date?.slice(0, 7) ?? "Present"}
              />
              <Field label="Description" value={proj.description} span={3} />
            </div>
          ))}
        </div>
      </section>

      {/* Certificates */}
      <section className="w-full h-auto flex flex-col">
        <ResumeSectionHeading label="Certificates" />
        <div className="w-full flex flex-col gap-y-3">
          {certificates.map((cert, i) => (
            <div
              key={cert.id}
              className="w-full grid grid-cols-3 gap-2 items-start px-2"
            >
              <EntryNumber index={i} />
              <Field label="Name" value={cert.name} span={2} />
              <Field label="Issuer" value={cert.issuer} />
              <Field
                label="Issued"
                value={cert.issue_date?.slice(0, 7) ?? ""}
              />
              <Field
                label="Expires"
                value={cert.expiry_date?.slice(0, 7) ?? "No Expiry"}
              />
              <Field label="Link" value={cert.link} />
              <Field label="Description" value={cert.description} span={3} />
            </div>
          ))}
        </div>
      </section>

      {/* Skills — chips, no number */}
      <section className="w-full h-auto flex flex-col">
        <ResumeSectionHeading label="Skills" />
        <div className="w-full px-2">
          <ChipField
            label="Skills"
            values={skills.map((s) => `${s.name} · ${s.level}`)}
          />
        </div>
      </section>

      {/* Languages — chips, no number */}
      <section className="w-full h-auto flex flex-col">
        <ResumeSectionHeading label="Languages" />
        <div className="w-full px-2">
          <ChipField
            label="Languages"
            values={languages.map((l) => `${l.name} · ${l.level}`)}
          />
        </div>
      </section>

      {/* Interests — chips, no number */}
      <section className="w-full h-auto flex flex-col">
        <ResumeSectionHeading label="Interests" />
        <div className="w-full px-2">
          <ChipField label="Interests" values={interests.map((i) => i.name)} />
        </div>
      </section>

      {/* Awards */}
      <section className="w-full h-auto flex flex-col">
        <ResumeSectionHeading label="Awards" />
        <div className="w-full flex flex-col gap-y-3">
          {awards.map((a, i) => (
            <div
              key={a.id}
              className="w-full grid grid-cols-3 gap-2 items-start px-2"
            >
              <EntryNumber index={i} />
              <Field label="Title" value={a.title} span={2} />
              <Field label="Awarder" value={a.awarder} />
              <Field label="Date" value={a.date?.slice(0, 7) ?? ""} />
              <Field label="Description" value={a.description} span={3} />
            </div>
          ))}
        </div>
      </section>

      {/* Publications */}
      <section className="w-full h-auto flex flex-col">
        <ResumeSectionHeading label="Publications" />
        <div className="w-full flex flex-col gap-y-3">
          {publications.map((p, i) => (
            <div
              key={p.id}
              className="w-full grid grid-cols-3 gap-2 items-start px-2"
            >
              <EntryNumber index={i} />
              <Field label="Title" value={p.title} span={2} />
              <Field label="Publisher" value={p.publisher} />
              <Field label="Date" value={p.date?.slice(0, 7) ?? ""} />
              <Field label="Link" value={p.link} span={2} />
              <Field label="Description" value={p.description} span={3} />
            </div>
          ))}
        </div>
      </section>

      {/* References */}
      <section className="w-full h-auto flex flex-col">
        <ResumeSectionHeading label="References" />
        <div className="w-full flex flex-col gap-y-3">
          {references.map((r, i) => (
            <div
              key={r.id}
              className="w-full grid grid-cols-3 gap-2 items-start px-2"
            >
              <EntryNumber index={i} />
              <Field label="Name" value={r.name} />
              <Field label="Position" value={r.position} />
              <Field label="Organization" value={r.organization} />
              <Field label="Email" value={r.email} />
              <Field label="Phone" value={r.phone} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// ── Route ────────────────────────────────────────────────────────────────────

function RouteComponent() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full h-full overflow-y-scroll custom-scrollbar pb-5">
      <section className="w-full flex flex-col pb-5">
        <SectionHeading label="BASE RESUME" />
        <div className="w-full flex-1 flex px-4 gap-x-10">
          {/* Mock Resume */}
          <aside className="flex flex-col gap-y-4">
            <div className="self-start h-40 aspect-12/15 border bg-[#E7E8F1] rounded-xl border-black/10 p-0.5 shadow-lg">
              <div className="bg-white h-full flex-1 rounded-[inherit] border border-black/20 overflow-clip cursor-pointer hover:border-brand transition-all duration-300">
                <img src={resumeMock1} className="h-full" />
              </div>
            </div>
            <button
              type="button"
              className="relative h-20 aspect-21/8 p-2 flex items-center rounded-2xl border bg-white border-black/12 backdrop-blur-md cursor-pointer hover:border-brand"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <Icon
                icon="ic:twotone-plus"
                className="absolute top-3 right-3 text-text-muted"
              />
              <div className="h-[90%] aspect-square flex items-center justify-center bg-white/40 rounded-lg p-1">
                <FileFolderIcon />
              </div>
              <div className="relative flex-1 h-full flex flex-col items-start justify-center pr-1">
                <span className="text-tiny text-text-primary flex justify-between items-center font-medium">
                  UPLOAD NEW BASE
                </span>
                <span className="text-tiny text-brand mt-0.5 font-mono font-medium">
                  PDF<span className="text-text-muted">, </span>DOCX
                </span>
              </div>
            </button>
          </aside>

          {/* Base Parse result */}
          <div className="flex-1 flex flex-col h-auto min-h-[30vh] gap-y-2">
            <div
              className="relative w-full flex-1 overflow-hidden"
              style={{ maxHeight: expanded ? "max-content" : "30vh" }}
            >
              <ParseResults />
              {!expanded && (
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F9FBFC] to-transparent pointer-events-none" />
              )}
            </div>

            <div className="w-full flex items-center gap-x-2">
              <span className="flex-1 h-[0.025rem] bg-black/20" />
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className="flex items-center justify-center gap-1 border text-xxs px-3 py-1 rounded-full cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {expanded ? "See Less" : "See More"}
                <Icon
                  icon="mdi:chevron-down"
                  className={`text-xs ${expanded ? "rotate-180" : "rotate-0"}`}
                />
              </button>
              <span className="flex-1 h-[0.025rem] bg-black/20" />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full flex flex-col">
        <SectionHeading label="RECENTS" />
        <div className="w-full flex-1 grid grid-cols-6 px-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="relative flex-1 border border-black/15 flex flex-col items-center bg-[#FAFAFA] rounded-xl overflow-clip cursor-pointer hover:border-brand transition-all duration-300"
            >
              <div
                className="h-40 aspect-12/15 border bg-[#E7E8F1] rounded border-black/10 translate-y-4 transition-all duration-300"
                style={{
                  boxShadow:
                    "0 15px 30px -5px rgba(14, 165, 233, 0.5), 0 10px 15px -6px rgba(14, 165, 233, 0.4)",
                }}
              >
                <div className="bg-white h-full flex-1 rounded-[inherit] border border-black/20 overflow-clip">
                  <img
                    src={mockImages[i % mockImages.length]}
                    className="h-full object-cover"
                  />
                </div>
              </div>
              <div
                className="absolute bottom-0 w-full flex flex-col bg-white/70 backdrop-blur-md px-3 py-2 pt-6 rounded-b-[inherit]"
                style={{
                  maskImage:
                    "linear-gradient(to top, black 60%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to top, black 60%, transparent 100%)",
                }}
              >
                <h2 className="text-tiny text-text-primary font-medium">
                  Praveen's SDE Resume
                </h2>
                <h3 className="text-tiny text-text-muted font-mono">
                  Last edited 2m ago
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
