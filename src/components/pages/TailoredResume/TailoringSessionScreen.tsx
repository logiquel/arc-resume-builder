import type { TailoredResume } from "#/api/resume/tailor/tailor-resume.types";
import { Icon } from "@iconify/react";
import ScorePanel from "./ScorePanel";
import DiffField from "./DiffField";
import type {
  EducationEntryChange,
  ExperienceEntryChange,
} from "#/types/resume/tailorSession.types";
import PrimitiveField from "./PrimitiveField";
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

interface FieldLabelProps {
  label: string;
}

const FieldLabel: React.FC<FieldLabelProps> = ({ label }) => {
  return (
    <label className="text-tiny text-text-muted font-medium px-2">
      {label}
    </label>
  );
};

interface TailoringSessionScreenProps {
  tailorSession: TailoredResume;
}

const TailoringSessionScreen: React.FC<TailoringSessionScreenProps> = ({
  tailorSession,
}) => {
  const sections = tailorSession.changes;
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

  return (
    <div className="w-full h-full flex overflow-hidden">
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

          <div className="flex-1 overflow-y-auto hide-scrollbar space-y-4 px-3 pb-3">
            {/* Profile Section */}
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
                  <FieldLabel label="FIRST NAME" />
                  <PrimitiveField
                    value={profile.first_name ?? ""}
                    onChange={(value) => console.log(value)}
                  />
                </fieldset>

                <fieldset className="flex flex-col">
                  <FieldLabel label="LAST NAME" />
                  <PrimitiveField
                    value={profile.last_name ?? ""}
                    onChange={(value) => console.log(value)}
                  />
                </fieldset>

                <fieldset className="flex flex-col">
                  <FieldLabel label="EMAIL ADDRESS" />
                  <PrimitiveField
                    value={profile.email ?? ""}
                    onChange={(value) => console.log(value)}
                  />
                </fieldset>

                <fieldset className="flex flex-col">
                  <FieldLabel label="PHONE" />
                  <PrimitiveField
                    value={profile.phone ?? ""}
                    onChange={(value) => console.log(value)}
                  />
                </fieldset>

                <fieldset className="flex flex-col">
                  <FieldLabel label="LOCATION" />
                  <PrimitiveField
                    value={profile.location ?? ""}
                    onChange={(value) => console.log(value)}
                  />
                </fieldset>

                <fieldset className="flex flex-col col-span-3">
                  <FieldLabel label="PROFESSIONAL TITLE" />
                  {profile.professional_title.is_changed ? (
                    <DiffField field={profile.professional_title} />
                  ) : (
                    <PrimitiveField
                      value={profile.professional_title.new_value ?? ""}
                      onChange={(value) => console.log(value)}
                    />
                  )}
                </fieldset>

                <fieldset className="flex flex-col col-span-3">
                  <FieldLabel label="SUMMARY" />
                  {profile.summary.is_changed ? (
                    <DiffField field={profile.summary} />
                  ) : (
                    <PrimitiveField
                      value={profile.summary.new_value ?? ""}
                      onChange={(value) => console.log(value)}
                    />
                  )}
                </fieldset>
              </div>
            </section>

            {/* Education Section */}
            <section
              className="w-full flex-col border border-black/10 bg-white rounded-3xl overflow-clip pb-4"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="Education"
                sectionIcon="ri:graduation-cap-line"
              />
              {education.map((edu: EducationEntryChange) => (
                <div
                  key={edu.entry_id}
                  className="w-full grid grid-cols-3 gap-3 mb-4 last:mb-0 p-5"
                >
                  <fieldset className="flex flex-col">
                    <FieldLabel label="INSTITUTION" />
                    <PrimitiveField
                      value={edu.institution ?? ""}
                      onChange={(value) => console.log(value)}
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <FieldLabel label="LOCATION" />
                    <PrimitiveField
                      value={edu.location ?? ""}
                      onChange={(value) => console.log(value)}
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <FieldLabel label="LINK" />
                    <PrimitiveField
                      value={edu.link ?? ""}
                      onChange={(value) => console.log(value)}
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <FieldLabel label="START DATE" />
                    <PrimitiveField
                      value={edu.start_date ?? ""}
                      onChange={(value) => console.log(value)}
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <FieldLabel label="END DATE" />
                    <PrimitiveField
                      value={edu.end_date ?? ""}
                      onChange={(value) => console.log(value)}
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <FieldLabel label="SCORE / GPA" />
                    <PrimitiveField
                      value={edu.score ?? ""}
                      onChange={(value) => console.log(value)}
                    />
                  </fieldset>

                  <fieldset className="flex flex-col col-span-3">
                    <FieldLabel label="DEGREE" />
                    {edu.degree?.is_changed ? (
                      <DiffField field={edu.degree} />
                    ) : (
                      <PrimitiveField
                        value={edu.degree?.new_value ?? ""}
                        onChange={(value) => console.log(value)}
                      />
                    )}
                  </fieldset>

                  <fieldset className="flex flex-col col-span-3">
                    <FieldLabel label="DESCRIPTION" />
                    {edu.description?.is_changed ? (
                      <DiffField field={edu.description} />
                    ) : (
                      <PrimitiveField
                        value={edu.description?.new_value ?? ""}
                        onChange={(value) => console.log(value)}
                      />
                    )}
                  </fieldset>
                </div>
              ))}
            </section>

            {/* Work Experience Section */}
            <section
              className="w-full flex-col border border-black/10 bg-white rounded-3xl overflow-clip pb-4"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="Experience"
                sectionIcon="ri:briefcase-4-line"
              />
              {experience.map((exp: ExperienceEntryChange) => (
                <div
                  key={exp.entry_id}
                  className="w-full grid grid-cols-3 gap-3 mb-4 last:mb-0 p-5"
                >
                  <fieldset className="flex flex-col">
                    <FieldLabel label="COMPANY" />
                    <PrimitiveField
                      value={exp.company ?? ""}
                      onChange={(value) => console.log(value)}
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <FieldLabel label="LOCATION" />
                    <PrimitiveField
                      value={exp.location ?? ""}
                      onChange={(value) => console.log(value)}
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <FieldLabel label="START DATE" />
                    <PrimitiveField
                      value={exp.start_date ?? ""}
                      onChange={(value) => console.log(value)}
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <FieldLabel label="END DATE" />
                    <PrimitiveField
                      value={exp.end_date ?? ""}
                      onChange={(value) => console.log(value)}
                    />
                  </fieldset>

                  <fieldset className="flex flex-col col-span-3">
                    <FieldLabel label="POSITION" />
                    {exp.position?.is_changed ? (
                      <DiffField field={exp.position} />
                    ) : (
                      <PrimitiveField
                        value={exp.position?.new_value ?? ""}
                        onChange={(value) => console.log(value)}
                      />
                    )}
                  </fieldset>

                  <fieldset className="flex flex-col col-span-3">
                    <FieldLabel label="DESCRIPTION" />
                    {exp.description?.is_changed ? (
                      <DiffField field={exp.description} />
                    ) : (
                      <PrimitiveField
                        value={exp.description?.new_value ?? ""}
                        onChange={(value) => console.log(value)}
                      />
                    )}
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
};

export default TailoringSessionScreen;
