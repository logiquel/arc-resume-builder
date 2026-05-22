// AiDiffField.tsx
import React, { useState, useEffect, useRef } from "react";
import { diffWords } from "diff";
import { Icon } from "@iconify/react";

export interface AiFieldData {
  old_value: string | string[];
  new_value: string | string[];
  old_format: "text" | "para" | "bullet_points" | string;
  new_format: "text" | "para" | "bullet_points" | string;
  diff_mode: "inline" | "structural" | string;
  final_value?: string | string[];
}

interface AiDiffFieldProps {
  fieldData: AiFieldData;
  onUpdateValue: (newValue: string | string[]) => void;
}

type ResolutionState = "unresolved" | "resolved";

// Auto-resizing textarea component - used only for resolved state
const AutoTextarea: React.FC<{
  value: string;
  onChange: (value: string) => void;
  className?: string;
}> = ({ value, onChange, className = "" }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
        adjustHeight();
      }}
      rows={1}
      className={`text-xs py-1 resize-none overflow-hidden border border-transparent focus:border-gray-300 rounded-none outline-0 transition-colors focus:bg-[#F5FBFF] ${className}`}
    />
  );
};

// Common Action Buttons Component
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
      onClick={onReject}
      className="flex items-center gap-0.5 px-1.5 py-0.5 text-tiny text-rose-800 bg-rose-100 hover:bg-rose-100 hover:text-rose-900 active:bg-rose-200 border border-rose-200/60 rounded-sm transition-all duration-200 shadow-none focus:outline-none focus:ring-2 focus:ring-slate-500/20 cursor-pointer"
    >
      <Icon icon={rejectIcon} className="text-xxs text-rose-800 opacity-90" />
      {rejectText}
    </button>
  </div>
);

// Shared inline diff renderer - used only for unresolved state
const renderInlineDiff = (oldStr: string, newStr: string) => {
  const diffs = diffWords(oldStr || "", newStr || "");
  return (
    <div className="leading-snug py-1 whitespace-pre-wrap text-xs text-text-primary">
      {diffs.map((part, i) => {
        if (part.added)
          return (
            <span key={i} className="bg-green-100 text-green-800 px-1">
              {part.value}
            </span>
          );
        if (part.removed)
          return (
            <span key={i} className="bg-red-100 text-red-800 line-through px-1">
              {part.value}
            </span>
          );
        return <span key={i}>{part.value}</span>;
      })}
    </div>
  );
};

// Resolved Bullet component - shows bullet with input
const ResolvedBullet: React.FC<{
  value: string;
  index: number;
  onChange: (index: number, value: string) => void;
}> = ({ value, index, onChange }) => {
  return (
    <div className="relative">
      <div className="text-xs text-text-primary flex items-start before:content-['●'] before:text-text-muted before:text-tiny before:inline-block before:mr-1 before:mt-1.5">
        <AutoTextarea
          value={value}
          onChange={(val) => onChange(index, val)}
          className="flex-1"
        />
      </div>
    </div>
  );
};

// Unresolved Bullet component - shows bullet with inline diff (no input)
const UnresolvedBullet: React.FC<{
  oldValue: string;
  newValue: string;
  onResolve: (value: string) => void;
}> = ({ oldValue, newValue, onResolve }) => {
  return (
    <div className="relative w-full flex flex-col">
      <div className="flex items-start before:content-['●'] before:text-text-muted before:text-tiny before:inline-block before:mr-1 before:mt-1">
        <div className="flex-1">{renderInlineDiff(oldValue, newValue)}</div>
      </div>
      <div className="flex items-center gap-2 mt-2 ml-2.5">
        <ActionButtons
          onAccept={() => onResolve(newValue)}
          onReject={() => onResolve(oldValue)}
        />
      </div>
    </div>
  );
};

export const AiDiffField: React.FC<AiDiffFieldProps> = ({
  fieldData,
  onUpdateValue,
}) => {
  const [resolution, setResolution] = useState<ResolutionState>(
    fieldData.final_value ? "resolved" : "unresolved",
  );

  const [currentValue, setCurrentValue] = useState<string | string[]>(() => {
    if (fieldData.final_value) return fieldData.final_value;
    return Array.isArray(fieldData.new_value)
      ? [...fieldData.new_value]
      : fieldData.new_value || "";
  });

  const [resolvedBullets, setResolvedBullets] = useState<
    Record<number, boolean>
  >({});

  // Keeps track of values already sent to parent to prevent loop updates
  const lastNotifiedValueRef = useRef<string | string[] | null>(null);

  useEffect(() => {
    if (resolution === "resolved") {
      // Direct deep reference equality check to prevent recursive infinite loop updates
      const stringifiedCurrent = JSON.stringify(currentValue);
      const stringifiedLast = JSON.stringify(lastNotifiedValueRef.current);
      
      if (stringifiedCurrent !== stringifiedLast) {
        lastNotifiedValueRef.current = currentValue;
        onUpdateValue(currentValue);
      }
    }
  }, [currentValue, resolution, onUpdateValue]);

  // Handle field-level accept/reject
  const handleAcceptField = () => {
    setCurrentValue(fieldData.new_value);
    setResolution("resolved");
  };

  const handleRejectField = () => {
    setCurrentValue(fieldData.old_value);
    setResolution("resolved");
  };

  // Handle bullet value change (for resolved bullets)
  const handleBulletChange = (index: number, value: string) => {
    if (Array.isArray(currentValue)) {
      const updated = [...currentValue];
      updated[index] = value;
      setCurrentValue(updated);
    }
  };

  // Handle text value change (for resolved text)
  const handleTextChange = (value: string) => {
    setCurrentValue(value);
  };

  // Handle resolving individual bullet
  const resolveBullet = (index: number, value: string) => {
    let updated: string[] = [];
    if (Array.isArray(currentValue)) {
      updated = [...currentValue];
      updated[index] = value;
      setCurrentValue(updated);
    }

    setResolvedBullets((prev) => {
      const nextResolved = { ...prev, [index]: true };
      
      const totalBullets = Array.isArray(fieldData.new_value)
        ? fieldData.new_value.length
        : 0;
        
      const allResolved = Object.keys(nextResolved).length === totalBullets;

      if (allResolved) {
        // Safe state update inside callback execution block
        setResolution("resolved");
      }
      return nextResolved;
    });
  };

  // --- DIFF RENDERING ENGINE ---
  const renderStructuralDiff = (oldStr: string, newBullets: string[]) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {/* Old value with - prefix using before: */}
        <div className="leading-snug py-1 whitespace-pre-wrap flex items-start before:content-['-'] before:text-red-600 before:text-xs before:inline-block before:mr-1">
          <span className="flex-1 px-1 bg-red-100 text-xs text-red-800 line-through">
            {oldStr}
          </span>
        </div>

        {/* New bullets with + prefix using before: */}
        <div className="flex flex-col gap-y-1">
          {newBullets.map((bullet, i) => (
            <div
              key={i}
              className="leading-snug py-1 whitespace-pre-wrap flex items-center before:content-['+'] before:text-green-600 before:text-xs before:inline-block before:mr-1"
            >
              <span className="flex-1 px-1 bg-green-100 text-xs text-green-800">
                {bullet}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBulletToBulletDiff = (
    oldBullets: string[],
    newBullets: string[],
  ) => {
    const maxLen = Math.max(oldBullets.length, newBullets.length);
    const bullets = Array.from({ length: maxLen });

    return (
      <div className="w-full flex flex-col gap-y-3">
        {bullets.map((_, i) => {
          const isResolved = resolvedBullets[i];
          const currentBulletValue = Array.isArray(currentValue)
            ? currentValue[i]
            : "";

          if (isResolved) {
            // Resolved: Show bullet with input
            return (
              <ResolvedBullet
                key={i}
                index={i}
                value={currentBulletValue}
                onChange={handleBulletChange}
              />
            );
          }

          // Unresolved: Show bullet with inline diff (rich text)
          return (
            <UnresolvedBullet
              key={i}
              oldValue={oldBullets[i] || ""}
              newValue={newBullets[i] || ""}
              onResolve={(value) => resolveBullet(i, value)}
            />
          );
        })}
      </div>
    );
  };

  // ==========================================
  // RESOLVED VIEW - Show actual inputs
  // ==========================================
  if (resolution === "resolved") {
    // Array case (bullet points) - show bullets with inputs
    if (Array.isArray(currentValue)) {
      return (
        <div className="w-full space-y-1.5">
          {currentValue.map((bullet, i) => (
            <ResolvedBullet
              key={i}
              index={i}
              value={bullet}
              onChange={handleBulletChange}
            />
          ))}
        </div>
      );
    }

    // String case (paragraph/text) - show input (no bullet)
    return (
      <AutoTextarea
        value={currentValue as string}
        onChange={handleTextChange}
        className="w-full"
      />
    );
  }

  // ==========================================
  // UNRESOLVED VIEW - Show diff (rich text, no inputs)
  // ==========================================

  // 1. Structural View Layout (para -> bullets)
  if (fieldData.diff_mode === "structural") {
    return (
      <div className="relative flex flex-col w-full">
        {renderStructuralDiff(
          fieldData.old_value as string,
          fieldData.new_value as string[],
        )}
        <div className="flex items-center gap-2 pt-2">
          <ActionButtons
            onAccept={handleAcceptField}
            onReject={handleRejectField}
          />
        </div>
      </div>
    );
  }

  // 2. Inline View Layout Container
  if (fieldData.diff_mode === "inline") {
    // Condition A: bullet -> bullet - show bullets with inline diff
    if (
      Array.isArray(fieldData.old_value) &&
      Array.isArray(fieldData.new_value)
    ) {
      return (
        <>
          {renderBulletToBulletDiff(
            fieldData.old_value as string[],
            fieldData.new_value as string[],
          )}
        </>
      );
    }

    // Condition B: para -> para - show inline diff block (no bullet)
    return (
      <div className="relative w-full flex flex-col">
        {renderInlineDiff(
          fieldData.old_value as string,
          fieldData.new_value as string,
        )}
        <div className="flex items-center gap-2 mt-2">
          <ActionButtons
            onAccept={handleAcceptField}
            onReject={handleRejectField}
          />
        </div>
      </div>
    );
  }

  return null;
};
// GEMINI FIXED