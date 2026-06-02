import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

interface ResumeScoreCard {
  score: number;
  baseScore: number;
}

const ResumeScoreCard: React.FC<ResumeScoreCard> = ({ score, baseScore }) => {
  const [currentScore, setCurrentScore] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const clampedTargetScore = Math.max(0, Math.min(100, score));

  useEffect(() => {
    // Delay animation by 500ms after component mounts
    const delayTimeout = setTimeout(() => {
      setHasAnimated(true);

      const duration = 3000; // 3 seconds animation
      const startTime = performance.now();
      const startScore = 0;
      const endScore = clampedTargetScore;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);

        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const newScore = Math.floor(
          startScore + (endScore - startScore) * easeOutCubic,
        );

        setCurrentScore(newScore);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, 1000); // 1000ms delay before animation starts

    return () => clearTimeout(delayTimeout);
  }, [clampedTargetScore]);

  let statusText = "Needs Improvement";
  let statusColor = "text-red-500";
  let statusPillClass = "bg-red-50 text-red-600 border-red-200";

  if (currentScore > 25) {
    statusText = "Fair";
    statusColor = "text-amber-500";
    statusPillClass = "bg-amber-50 text-amber-600 border-amber-200";
  }
  if (currentScore > 50) {
    statusText = "Average";
    statusColor = "text-orange-400";
    statusPillClass = "bg-orange-50 text-orange-600 border-orange-200";
  }
  if (currentScore > 75) {
    statusText = "Good";
    statusColor = "text-emerald-500";
    statusPillClass = "bg-emerald-50 text-emerald-600 border-emerald-200";
  }

  const cx = 50,
    cy = 50,
    r = 38;

  const arcPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;

  const arcLen = Math.PI * r;
  const gap = 3;
  const vis = (arcLen - 3 * gap) / 4;
  const unit = vis + gap;

  const segments = [
    { color: "#E55353", offset: 0 },
    { color: "#F2C16D", offset: -unit },
    { color: "#E28739", offset: -(unit * 2) },
    { color: "#63C27C", offset: -(unit * 3) },
  ];

  const innerR = 28;
  const innerArcPath = `M ${cx - innerR} ${cy} A ${innerR} ${innerR} 0 0 1 ${cx + innerR} ${cy}`;

  const angle = Math.PI - (currentScore / 100) * Math.PI;
  const needleX = cx + innerR * Math.cos(angle);
  const needleY = cy - innerR * Math.sin(angle);

  return (
    <div className="relative z-10 w-full flex flex-col items-center justify-center">
      <svg viewBox="0 0 100 54" className="w-[60%] overflow-visible">
        {segments.map((seg, i) => (
          <path
            key={i}
            d={arcPath}
            fill="none"
            stroke={seg.color}
            strokeWidth={3}
            strokeLinecap="butt"
            strokeDasharray={`${vis} ${arcLen}`}
            strokeDashoffset={seg.offset}
          />
        ))}

        <path
          d={innerArcPath}
          fill="none"
          stroke="#9CA3AF"
          strokeWidth={0.9}
          strokeLinecap="round"
          strokeDasharray="0.01 4"
          opacity={0.75}
        />

        <line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke="#0a8cff"
          strokeWidth={1}
          strokeLinecap="round"
        />

        <circle cx={cx} cy={cy} r={1.8} fill="#0a8cff" />
        <rect
          x={needleX - 4}
          y={needleY - 2}
          width={8}
          height={4}
          rx={2}
          ry={2}
          fill="#ffffff"
          stroke="#0a8cff"
          strokeWidth={1}
          transform={`rotate(${(-angle * 180) / Math.PI} ${needleX} ${needleY})`}
        />
      </svg>
      <div className="w-full mt-3 flex flex-col items-center justify-center text-center">
        <div className="text-lg font-mono tracking-tight text-text-primary leading-none">
          {currentScore}
          <span className="ml-0.5 text-base font-sans font-medium text-slate-400">
            %
          </span>
        </div>

        <p className="text-xxs text-text-secondary mt-1">
          Your resume score is{" "}
          <span className={`ml-0.5 font-semibold ${statusColor}`}>
            {statusText}
          </span>
        </p>

        <div className="mt-1 flex items-center gap-x-1.5 text-xxs">
          <div className="gap-x-1 text-text-secondary">
            <span>Up from Base score</span>
          </div>
          <span className="font-semibold text-text-secondary">
            {baseScore}%
          </span>
          <div className="flex items-center gap-x-0.5">
            <span className="text-emerald-600 text-tiny">+</span>
            <span className="font-medium text-emerald-600">
              {currentScore - baseScore}
            </span>
            <Icon icon="ph:trend-up" className="text-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeScoreCard;
