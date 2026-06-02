import ResumeStackMock from "#/components/common/Icons/ResumeStackMock";
import { Link, useParams } from "@tanstack/react-router";
import ResumeScoreCard from "./ResumeScoreCard";
import { Icon } from "@iconify/react";
import type { TailoringSessionAnalysis } from "#/types/resume/tailorSession.types";

interface ScorePanelProps {
  analysis: TailoringSessionAnalysis;
}
const ScorePanel: React.FC<ScorePanelProps> = ({ analysis }) => {
  const { sessionId } = useParams({
    from: "/_app/tailored-resumes/$sessionId/",
  });

  return (
    <aside className="w-[23vw] h-full flex flex-col border-l border-black/10">
      <div className="w-full flex-1  min-h-0 flex flex-col space-y-4 bg-white border-black/10 relative overflow-y-scroll custom-scrollbar before:absolute before:inset-0 before:bg-linear-to-b before:from-white/20 before:to-transparent before:pointer-events-none">
        <div className="relative z-10 w-full flex items-center justify-center">
          <ResumeScoreCard
            baseScore={analysis.base_score || 0}
            score={analysis.current_score || 0}
          />
        </div>
        <div className="w-full flex flex-col space-y-4 mt-4 px-4">
          <div className="w-full flex flex-col space-y-4">
            {/* MATCHED KEYWORDS */}
            <div className="w-full flex flex-col space-y-3">
              <h2 className="flex items-center gap-x-0.5 text-tiny font-medium text-brand">
                <Icon icon="lucide:list-check" className="text-xs" />
                MATCHED KEYWORDS
              </h2>
              <div className="w-full flex-1 flex flex-wrap gap-2">
                {analysis.matched_keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="w-fit h-fit text-tiny font-medium text-[#05603A] flex items-center justify-center rounded-md px-3 py-1 bg-[#ECFDF3] border border-[#A6F4C5]"
                  >
                    # {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* MISSING KEYWORDS */}
            <div className="w-full flex flex-col space-y-3">
              <h2 className="flex items-center gap-x-0.5 text-tiny font-medium text-brand">
                <Icon icon="lucide:list-x" className="text-xs" />
                MISSING KEYWORDS
              </h2>
              <div className="w-full flex-1 flex flex-wrap gap-2">
                {analysis.missing_keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="w-fit h-fit text-tiny font-medium text-[#B54708] flex items-center justify-center rounded-md px-3 py-1 bg-[#FEF0C7] border border-[#FECDCA]"
                  >
                    # {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex aspect-2/1 p-3.5 bg-white">
        <div
          className="flex-1 w-full flex rounded-2xl border border-black/10 bg-white"
          style={{
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
          }}
        >
          <div className="flex-1 h-full flex flex-col justify-center px-3">
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
