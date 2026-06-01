import type { TailoredResume } from "#/api/resume/tailor/tailor-resume.types";
import { Icon } from "@iconify/react";
import ScorePanel from "./ScorePanel";

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
                    onChange={(e) => console.log(e.target.value)}
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                  />
                </fieldset>

                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium">
                    LAST NAME
                  </label>
                  <input
                    value={profile.last_name ?? ""}
                    onChange={(e) => console.log(e.target.value)}
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                  />
                </fieldset>

                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium">
                    EMAIL
                  </label>
                  <input
                    value={profile.email ?? ""}
                    onChange={(e) => console.log(e.target.value)}
                    className="rounded-none py-1 border border-transparent outline-0 transition-colors focus:border-gray-300 text-text-primary text-xs"
                  />
                </fieldset>

                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium">
                    PHONE
                  </label>
                  <input
                    value={profile.phone ?? ""}
                    onChange={(e) => console.log(e.target.value)}
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                  />
                </fieldset>

                <fieldset className="flex flex-col">
                  <label className="text-tiny text-text-muted font-medium">
                    LOCATION
                  </label>
                  <input
                    value={profile.location ?? ""}
                    onChange={(e) => console.log(e.target.value)}
                    className="rounded-none py-1 text-text-primary text-xs border border-transparent focus:border-gray-300 outline-0 focus:bg-[#F5FBFF]"
                  />
                </fieldset>

                <fieldset className="flex flex-col col-span-3"></fieldset>

                <fieldset className="flex flex-col col-span-3"></fieldset>
              </div>
            </section>
          </div>
        </div>
      </main>
      <ScorePanel />
    </div>
  );
};

export default TailoringSessionScreen;
