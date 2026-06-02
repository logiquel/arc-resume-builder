import type { TailoredResume } from "#/api/resume/tailor/tailor-resume.types";
import { Icon } from "@iconify/react";
import ScorePanel from "./ScorePanel";
import DiffField from "./DiffField";
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
  const sections =
    tailorSession.changes ??
    ({} as NonNullable<
      TailoringSessionScreenProps["tailorSession"]["changes"]
    >);
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
                  {profile.professional_title?.is_changed ? (
                    <DiffField field={profile.professional_title} />
                  ) : (
                    <PrimitiveField
                      value={profile.professional_title?.new_value ?? ""}
                      onChange={(value) => console.log(value)}
                    />
                  )}
                </fieldset>

                <fieldset className="flex flex-col col-span-3">
                  <FieldLabel label="SUMMARY" />
                  {profile.summary?.is_changed ? (
                    <DiffField field={profile.summary} />
                  ) : (
                    <PrimitiveField
                      value={profile.summary?.new_value ?? ""}
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
              {education.map((edu: EducationEntryChange, edIndex: number) => (
                <div
                  key={edu.entry_id}
                  className="w-full grid grid-cols-3 gap-3 mb-4 last:mb-0 p-5"
                >
                  <div className="flex items-center col-span-3 gap-x-3 px-1 text-xxs font-medium text-text-secondary">
                    #{edIndex + 1}
                    <span className="flex-1 h-[0.025rem] bg-black/15"></span>
                  </div>
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
                sectionIcon="famicons:briefcase-outline"
              />
              {experience.map((exp: ExperienceEntryChange, exIndex: number) => (
                <div
                  key={exp.entry_id}
                  className="w-full grid grid-cols-3 gap-3 mb-4 last:mb-0 p-5"
                >
                  <div className="flex items-center col-span-3 gap-x-3 px-1 text-xxs font-medium text-text-secondary">
                    #{exIndex + 1}
                    <span className="flex-1 h-[0.025rem] bg-black/15"></span>
                  </div>
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

            {/* Projects Section */}
            <section
              className="w-full flex-col border border-black/10 bg-white rounded-3xl overflow-clip pb-4"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="Projects"
                sectionIcon="famicons:cube-outline"
              />
              {projects.map((project: ProjectEntryChange, pjIndex: number) => (
                <div
                  key={project.entry_id}
                  className="w-full grid grid-cols-3 gap-3 mb-4 last:mb-0 p-5"
                >
                  <div className="flex items-center col-span-3 gap-x-3 px-1 text-xxs font-medium text-text-secondary">
                    #{pjIndex + 1}
                    <span className="flex-1 h-[0.025rem] bg-black/15"></span>
                  </div>
                  <fieldset className="flex flex-col">
                    <FieldLabel label="TITLE" />
                    <PrimitiveField
                      value={project.title ?? ""}
                      onChange={(value) => console.log(value)}
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <FieldLabel label="LINK" />
                    <PrimitiveField
                      value={project.link ?? ""}
                      onChange={(value) => console.log(value)}
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <FieldLabel label="START DATE" />
                    <PrimitiveField
                      value={project.start_date ?? ""}
                      onChange={(value) => console.log(value)}
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <FieldLabel label="END DATE" />
                    <PrimitiveField
                      value={project.end_date ?? ""}
                      onChange={(value) => console.log(value)}
                    />
                  </fieldset>

                  <fieldset className="flex flex-col col-span-3">
                    <FieldLabel label="SUBTITLE" />
                    {project.subtitle?.is_changed ? (
                      <DiffField field={project.subtitle} />
                    ) : (
                      <PrimitiveField
                        value={project.subtitle?.new_value ?? ""}
                        onChange={(value) => console.log(value)}
                      />
                    )}
                  </fieldset>

                  <fieldset className="flex flex-col col-span-3">
                    <FieldLabel label="DESCRIPTION" />
                    {project.description?.is_changed ? (
                      <DiffField field={project.description} />
                    ) : (
                      <PrimitiveField
                        value={project.description?.new_value ?? ""}
                        onChange={(value) => console.log(value)}
                      />
                    )}
                  </fieldset>
                </div>
              ))}
            </section>

            {/* Skills Section */}
            <section
              className="w-full flex-col border border-black/10 bg-white rounded-3xl overflow-clip pb-4"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="Skills"
                sectionIcon="hugeicons:compass-01"
              />
              <div className="w-full grid grid-cols-2 gap-3 p-5">
                {skills.map((skill: SkillEntryChange) => (
                  <fieldset key={skill.entry_id} className="flex flex-col">
                    <FieldLabel
                      label={`SKILL ${skill.entry_id.replace("skill", "")}`}
                    />
                    {skill.name.is_changed ? (
                      <DiffField field={skill.name} />
                    ) : (
                      <PrimitiveField
                        value={skill.name.new_value ?? ""}
                        onChange={(value) => console.log(value)}
                      />
                    )}
                  </fieldset>
                ))}
              </div>
            </section>

            {/* Certificates Section */}
            <section
              className="w-full flex-col border border-black/10 bg-white rounded-3xl overflow-clip pb-4"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="Certificates"
                sectionIcon="ri:certificate-line"
              />
              {certificates.map(
                (cert: CertificateEntryChange, cfIndex: number) => (
                  <div
                    key={cert.entry_id}
                    className="w-full grid grid-cols-3 gap-3 mb-4 last:mb-0 p-5"
                  >
                    <div className="flex items-center col-span-3 gap-x-3 px-1 text-xxs font-medium text-text-secondary">
                      #{cfIndex + 1}
                      <span className="flex-1 h-[0.025rem] bg-black/15"></span>
                    </div>
                    <fieldset className="flex flex-col">
                      <FieldLabel label="ISSUER" />
                      <PrimitiveField
                        value={cert.issuer ?? ""}
                        onChange={(value) => console.log(value)}
                      />
                    </fieldset>

                    <fieldset className="flex flex-col">
                      <FieldLabel label="ISSUE DATE" />
                      <PrimitiveField
                        value={cert.issue_date ?? ""}
                        onChange={(value) => console.log(value)}
                      />
                    </fieldset>

                    <fieldset className="flex flex-col">
                      <FieldLabel label="EXPIRY DATE" />
                      <PrimitiveField
                        value={cert.expiry_date ?? ""}
                        onChange={(value) => console.log(value)}
                      />
                    </fieldset>

                    <fieldset className="flex flex-col col-span-3">
                      <FieldLabel label="LINK" />
                      <PrimitiveField
                        value={cert.link ?? ""}
                        onChange={(value) => console.log(value)}
                      />
                    </fieldset>

                    <fieldset className="flex flex-col col-span-3">
                      <FieldLabel label="NAME" />
                      {cert.name?.is_changed ? (
                        <DiffField field={cert.name} />
                      ) : (
                        <PrimitiveField
                          value={cert.name?.new_value ?? ""}
                          onChange={(value) => console.log(value)}
                        />
                      )}
                    </fieldset>

                    <fieldset className="flex flex-col col-span-3">
                      <FieldLabel label="DESCRIPTION" />
                      {cert.description?.is_changed ? (
                        <DiffField field={cert.description} />
                      ) : (
                        <PrimitiveField
                          value={cert.description?.new_value ?? ""}
                          onChange={(value) => console.log(value)}
                        />
                      )}
                    </fieldset>
                  </div>
                ),
              )}
            </section>

            {/* Languages Section */}
            <section
              className="w-full flex-col border border-black/10 bg-white rounded-3xl overflow-clip pb-4"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="Languages"
                sectionIcon="heroicons:language-solid"
              />
              <div className="w-full grid grid-cols-2 gap-3 p-5">
                {languages.map((lang: LanguageEntryChange) => (
                  <div key={lang.entry_id} className="flex flex-col gap-2">
                    <fieldset className="flex flex-col">
                      <FieldLabel label="LANGUAGE" />
                      <PrimitiveField
                        value={lang.name ?? ""}
                        onChange={(value) => console.log(value)}
                      />
                    </fieldset>
                    <fieldset className="flex flex-col">
                      <FieldLabel label="LEVEL" />
                      <PrimitiveField
                        value={lang.level ?? ""}
                        onChange={(value) => console.log(value)}
                      />
                    </fieldset>
                  </div>
                ))}
              </div>
            </section>

            {/* Interests Section */}
            <section
              className="w-full flex-col border border-black/10 bg-white rounded-3xl overflow-clip pb-4"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="Interests"
                sectionIcon="solar:gamepad-linear"
              />
              <div className="w-full grid grid-cols-2 gap-3 p-5">
                {interests.map((interest: InterestEntryChange) => (
                  <fieldset key={interest.entry_id} className="flex flex-col">
                    <FieldLabel label="INTEREST" />
                    <PrimitiveField
                      value={interest.name ?? ""}
                      onChange={(value) => console.log(value)}
                    />
                  </fieldset>
                ))}
              </div>
            </section>

            {/* Awards Section */}
            <section
              className="w-full flex-col border border-black/10 bg-white rounded-3xl overflow-clip pb-4"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="Awards"
                sectionIcon="ri:trophy-line"
              />
              {awards.map((award: AwardEntryChange, awIndex: number) => (
                <div
                  key={award.entry_id}
                  className="w-full grid grid-cols-3 gap-3 mb-4 last:mb-0 p-5"
                >
                  <div className="flex items-center col-span-3 gap-x-3 px-1 text-xxs font-medium text-text-secondary">
                    #{awIndex + 1}
                    <span className="flex-1 h-[0.025rem] bg-black/15"></span>
                  </div>
                  <fieldset className="flex flex-col">
                    <FieldLabel label="AWARDER" />
                    <PrimitiveField
                      value={award.awarder ?? ""}
                      onChange={(value) => console.log(value)}
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <FieldLabel label="DATE" />
                    <PrimitiveField
                      value={award.date ?? ""}
                      onChange={(value) => console.log(value)}
                    />
                  </fieldset>

                  <fieldset className="flex flex-col col-span-3">
                    <FieldLabel label="TITLE" />
                    {award.title?.is_changed ? (
                      <DiffField field={award.title} />
                    ) : (
                      <PrimitiveField
                        value={award.title?.new_value ?? ""}
                        onChange={(value) => console.log(value)}
                      />
                    )}
                  </fieldset>

                  <fieldset className="flex flex-col col-span-3">
                    <FieldLabel label="DESCRIPTION" />
                    {award.description?.is_changed ? (
                      <DiffField field={award.description} />
                    ) : (
                      <PrimitiveField
                        value={award.description?.new_value ?? ""}
                        onChange={(value) => console.log(value)}
                      />
                    )}
                  </fieldset>
                </div>
              ))}
            </section>

            {/* Publications Section */}
            <section
              className="w-full flex-col border border-black/10 bg-white rounded-3xl overflow-clip pb-4"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="Publications"
                sectionIcon="ri:article-line"
              />
              {publications.map(
                (pub: PublicationEntryChange, pdIndex: number) => (
                  <div
                    key={pub.entry_id}
                    className="w-full grid grid-cols-3 gap-3 mb-4 last:mb-0 p-5"
                  >
                    <div className="flex items-center col-span-3 gap-x-3 px-1 text-xxs font-medium text-text-secondary">
                      #{pdIndex + 1}
                      <span className="flex-1 h-[0.025rem] bg-black/15"></span>
                    </div>
                    <fieldset className="flex flex-col">
                      <FieldLabel label="PUBLISHER" />
                      <PrimitiveField
                        value={pub.publisher ?? ""}
                        onChange={(value) => console.log(value)}
                      />
                    </fieldset>

                    <fieldset className="flex flex-col">
                      <FieldLabel label="DATE" />
                      <PrimitiveField
                        value={pub.date ?? ""}
                        onChange={(value) => console.log(value)}
                      />
                    </fieldset>

                    <fieldset className="flex flex-col col-span-3">
                      <FieldLabel label="LINK" />
                      <PrimitiveField
                        value={pub.link ?? ""}
                        onChange={(value) => console.log(value)}
                      />
                    </fieldset>

                    <fieldset className="flex flex-col col-span-3">
                      <FieldLabel label="TITLE" />
                      {pub.title?.is_changed ? (
                        <DiffField field={pub.title} />
                      ) : (
                        <PrimitiveField
                          value={pub.title?.new_value ?? ""}
                          onChange={(value) => console.log(value)}
                        />
                      )}
                    </fieldset>

                    <fieldset className="flex flex-col col-span-3">
                      <FieldLabel label="DESCRIPTION" />
                      {pub.description?.is_changed ? (
                        <DiffField field={pub.description} />
                      ) : (
                        <PrimitiveField
                          value={pub.description?.new_value ?? ""}
                          onChange={(value) => console.log(value)}
                        />
                      )}
                    </fieldset>
                  </div>
                ),
              )}
            </section>

            {/* References Section */}
            <section
              className="w-full flex-col border border-black/10 bg-white rounded-3xl overflow-clip pb-4"
              style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
            >
              <SectionHeading
                sectionLabel="References"
                sectionIcon="ri:user-star-line"
              />
              {references.map((ref: ReferenceEntryChange, rfIndex: number) => (
                <div
                  key={ref.entry_id}
                  className="w-full grid grid-cols-2 gap-3 mb-4 last:mb-0 p-5"
                >
                  <div className="flex items-center col-span-2 gap-x-3 px-1 text-xxs font-medium text-text-secondary">
                    #{rfIndex + 1}
                    <span className="flex-1 h-[0.025rem] bg-black/15"></span>
                  </div>
                  <fieldset className="flex flex-col">
                    <FieldLabel label="NAME" />
                    <PrimitiveField
                      value={ref.name ?? ""}
                      onChange={(value) => console.log(value)}
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <FieldLabel label="POSITION" />
                    <PrimitiveField
                      value={ref.position ?? ""}
                      onChange={(value) => console.log(value)}
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <FieldLabel label="ORGANIZATION" />
                    <PrimitiveField
                      value={ref.organization ?? ""}
                      onChange={(value) => console.log(value)}
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <FieldLabel label="EMAIL" />
                    <PrimitiveField
                      value={ref.email ?? ""}
                      onChange={(value) => console.log(value)}
                    />
                  </fieldset>

                  <fieldset className="flex flex-col">
                    <FieldLabel label="PHONE" />
                    <PrimitiveField
                      value={ref.phone ?? ""}
                      onChange={(value) => console.log(value)}
                    />
                  </fieldset>
                </div>
              ))}
            </section>
          </div>
        </div>
      </main>
      <ScorePanel analysis={tailorSession.analysis} />
    </div>
  );
};

export default TailoringSessionScreen;
