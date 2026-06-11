import type * as TailorTypes from "#/types/resume/tailorSession.types";
import { Icon } from "@iconify/react";
import { diffWords } from "diff";

const ActionButtons: React.FC<{
  onAccept: () => void;
  onReject: () => void;
  acceptText?: string;
  rejectText?: string;
  acceptIcon?: string;
  rejectIcon?: string;
}> = ({
  onAccept,
  onReject,
  acceptText = "Accept",
  rejectText = "Reject",
  acceptIcon = "tabler:check-filled",
  rejectIcon = "iconamoon:close-duotone",
}) => (
  <div className="flex items-center gap-2">
    <button
      type="button"
      onClick={onAccept}
      className="flex items-center gap-0.5 px-1.5 py-0.5 text-tiny text-emerald-800 bg-emerald-100 hover:bg-emerald-100 hover:text-emerald-900 active:bg-emerald-200 border border-emerald-200/60 rounded-sm transition-all duration-200 shadow-none focus:outline-none focus:ring-2 focus:ring-slate-500/20 cursor-pointer"
    >
      <Icon
        icon={acceptIcon}
        className="text-xxs text-emerald-800 opacity-90"
      />
      {acceptText}
    </button>

    <button
      type="button"
      onClick={onReject}
      className="flex items-center gap-0.5 px-1.5 py-0.5 text-tiny text-rose-800 bg-rose-100 hover:bg-rose-100 hover:text-rose-900 active:bg-rose-200 border border-rose-200/60 rounded-sm transition-all duration-200 shadow-none focus:outline-none focus:ring-2 focus:ring-slate-500/20 cursor-pointer"
    >
      <Icon icon={rejectIcon} className="text-xxs text-rose-800 opacity-90" />
      {rejectText}
    </button>
  </div>
);

interface RenderInlineDiffProps {
  oldValue: string;
  newValue: string;
}

const RenderInlineDiff = ({ oldValue, newValue }: RenderInlineDiffProps) => {
  const oldStr =
    typeof oldValue === "string" ? oldValue : String(oldValue || "");
  const newStr =
    typeof newValue === "string" ? newValue : String(newValue || "");

  const diffs = diffWords(oldStr, newStr);

  return (
    <div className="border-red-400 px-2 py-1.5">
      {diffs.map((part, i) => {
        if (part.added) {
          return (
            <span
              key={i}
              className={`text-xs bg-green-100 text-green-800 ${i === 0 ? "px-1" : "px-0.5"}`}
            >
              {part.value}
            </span>
          );
        }

        if (part.removed) {
          return (
            <span
              key={i}
              className={`text-xs bg-red-100 text-red-800 line-through ${i === 0 ? "px-1" : "px-0.5"}`}
            >
              {part.value}
            </span>
          );
        }

        return (
          <span
            key={i}
            className={`text-xs text-text-primary ${i === 0 ? "px-0" : "px-0.5"}`}
          >
            {part.value}
          </span>
        );
      })}
    </div>
  );
};

interface RenderInlineBulletsDiffProps {
  oldBullets: string[];
  newBullets: string[];
}

const RenderInlineBulletsDiff = ({
  oldBullets,
  newBullets,
}: RenderInlineBulletsDiffProps) => {
  // Find the maximum length to iterate through all bullets
  const maxLength = Math.max(oldBullets.length, newBullets.length);

  return (
    <div className="flex flex-col border-blue-400 py-1.5 px-2 gap-y-2">
      {Array.from({ length: maxLength }).map((_, index) => {
        const oldBullet = oldBullets[index] || "";
        const newBullet = newBullets[index] || "";

        // Skip if both are empty
        if (!oldBullet && !newBullet) return null;

        // Compare the two bullets using diffWords
        const diffs = diffWords(oldBullet, newBullet);

        return (
          <div
            key={index}
            className="relative leading-snug whitespace-pre-wrap flex items-start before:content-['●'] before:absolute before:-translate-x-2.5 before:text-text-muted/50 before:text-xxs before:inline-block"
          >
            <span className="flex-1 text-xs">
              {diffs.map((part, i) => {
                if (part.added) {
                  return (
                    <span key={i} className="bg-green-100 text-green-800 px-1">
                      {part.value}
                    </span>
                  );
                }
                if (part.removed) {
                  return (
                    <span
                      key={i}
                      className="bg-red-100 text-red-800 line-through px-1"
                    >
                      {part.value}
                    </span>
                  );
                }
                return (
                  <span key={i} className="text-xs text-text-primary">
                    {part.value}
                  </span>
                );
              })}
            </span>
          </div>
        );
      })}
    </div>
  );
};

interface RenderStructuralDiffProps {
  oldStr: string;
  newBullets: string[];
}

const RenderStructuralDiff = ({
  oldStr,
  newBullets,
}: RenderStructuralDiffProps) => {
  return (
    <div className="flex flex-col border-green-400 py-1.5 px-2 gap-y-2">
      <div className="relative leading-snug whitespace-pre-wrap flex items-start before:content-['-'] before:absolute before:-translate-x-2.5 before:text-red-600 before:text-xs before:inline-block">
        <span className="flex-1 bg-red-100 text-xs text-red-800 line-through px-1">
          {oldStr}
        </span>
      </div>
      <div className="flex flex-col gap-y-1.5">
        {Array.isArray(newBullets) &&
          newBullets.map((bullet, i) => (
            <div
              key={i}
              className="relative leading-snug whitespace-pre-wrap flex items-center before:content-['+'] before:absolute before:-translate-x-2.5 before:text-green-600 before:text-xs"
            >
              <span className="flex-1 bg-green-100 text-xs text-green-800 px-1">
                {bullet}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

interface DiffFieldProps {
  field: TailorTypes.DiffField<any>;
  onAccept?: () => void;
  onReject?: () => void;
}

const DiffField = ({ field, onAccept, onReject }: DiffFieldProps) => {
  const renderByMode = () => {
    switch (field.diff_mode) {
      case "inline":
        return (
          <RenderInlineDiff
            oldValue={field.old_value}
            newValue={field.new_value}
          />
        );
      case "inline_bullets":
        // Ensure values are arrays for inline_bullets mode
        const oldBullets = Array.isArray(field.old_value)
          ? field.old_value
          : [field.old_value];
        const newBullets = Array.isArray(field.new_value)
          ? field.new_value
          : [field.new_value];
        return (
          <RenderInlineBulletsDiff
            oldBullets={oldBullets}
            newBullets={newBullets}
          />
        );
      case "structural":
        return (
          <RenderStructuralDiff
            oldStr={field.old_value}
            newBullets={field.new_value}
          />
        );
      default:
        return (
          <RenderInlineDiff
            oldValue={field.old_value}
            newValue={field.new_value}
          />
        );
    }
  };

  return (
    <div className="flex flex-col">
      {renderByMode()}
      <div className="flex items-center justify-end gap-2 mt-2 px-0">
        <div className="w-3 border-t border-dashed border-black/30" />

        <ActionButtons
          onAccept={onAccept || (() => {})}
          onReject={onReject || (() => {})}
        />
        <div className="flex-1 border-t border-dashed border-black/30" />
      </div>
    </div>
  );
};

export default DiffField;
