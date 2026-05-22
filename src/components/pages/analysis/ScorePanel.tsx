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
  return (
    <aside className="w-[23vw] h-full bg-white border-l border-black/10">
      <div className="w-full flex flex-col space-y-4 p-4 border-black/10  shadow-[0_8px_32px_0_rgba(14,165,233,0.04),inset_0_1px_1px_0_rgba(255,255,255,0.3)] relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:pointer-events-none">
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
                    className="w-fit h-fit text-tiny text-[#05603A] flex items-center justify-center rounded-md px-3 py-1 bg-[#ECFDF3] border border-[#A6F4C5]"
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
                    className="w-fit h-fit text-tiny text-[#B54708] flex items-center justify-center rounded-md px-3 py-1 bg-[#FEF0C7] border border-[#FECDCA]"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ScorePanel;
