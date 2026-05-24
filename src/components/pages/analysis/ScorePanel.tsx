import ResumeStackMock from "#/components/common/Icons/ResumeStackMock";
import { Link, useParams } from "@tanstack/react-router";
import ResumeScoreCard from "./ResumeScoreCard";

const matchedKeywords = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "REST APIs",
  "SQL",
  "Git",
  "Responsive Design",
];

const missingKeywords = [
  "Next.js",
  "Redux",
  "GraphQL",
  "Unit Testing",
  "CI/CD",
  "AWS",
  "Docker",
  "Agile",
];

const ScorePanel = () => {
  const { sessionId } = useParams({
    from: "/_app/tailored-resumes/$sessionId/",
  });

  return (
    <aside className="w-[23vw] h-full flex flex-col border-l border-black/10">
      <div className="w-full flex-1  min-h-0 flex flex-col space-y-4 p-4 bg-white border-black/10  shadow-[0_8px_32px_0_rgba(14,165,233,0.04),inset_0_1px_1px_0_rgba(255,255,255,0.3)] relative overflow-y-scroll custom-scrollbar before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:pointer-events-none">
        <div className="relative z-10 w-full flex items-center justify-center">
          <ResumeScoreCard score={75} />
        </div>
        <div className="w-full flex flex-col space-y-4 mt-4">
          <div className="w-full flex flex-col space-y-4">
            {/* MATCHED KEYWORDS */}
            <div className="w-full flex flex-col space-y-3">
              <h2 className="text-tiny font-medium text-brand">
                MATCHED KEYWORDS
              </h2>
              <div className="w-full flex-1 flex flex-wrap gap-2">
                {matchedKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="w-fit h-fit text-tiny font-medium text-[#05603A] flex items-center justify-center rounded-md px-3 py-1 bg-[#ECFDF3] border border-[#A6F4C5]"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* MISSING KEYWORDS */}
            <div className="w-full flex flex-col space-y-3">
              <h2 className="text-tiny font-medium text-brand">
                MISSING KEYWORDS
              </h2>
              <div className="w-full flex-1 flex flex-wrap gap-2">
                {missingKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="w-fit h-fit text-tiny font-medium text-[#B54708] flex items-center justify-center rounded-md px-3 py-1 bg-[#FEF0C7] border border-[#FECDCA]"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex aspect-[2/0.8] p-4 bg-white">
        <div
          className="flex-1 w-full flex rounded-2xl border border-black/10 bg-white"
          style={{
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
          }}
        >
          <div className="flex-1 h-full flex flex-col justify-between pl-3 py-3">
            <div className="flex flex-col">
              <h2 className="text-sm font-semibold text-text-primary tracking-tight">
                Ready to Download?
              </h2>
              <p className="text-tiny text-text-muted mt-1">
                Select template & preview
              </p>
            </div>

            <Link
              to="/tailored-resumes/$sessionId/preview"
              params={{ sessionId }}
              type="button"
              className="hover:border-brand/30 self-start mt-2 px-3.5 py-1.5 text-tiny font-medium text-white bg-brand rounded-xl shadow-xs transition-all duration-300 group-hover:bg-brand/90 group-hover:scale-[1.02] cursor-pointer"
            >
              Preview & Edit
            </Link>
          </div>

          <div className="h-full aspect-square flex items-center justify-center overflow-visible">
            <div className="w-full h-full flex justify-center items-center overflow-clip">
              <ResumeStackMock />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ScorePanel;
