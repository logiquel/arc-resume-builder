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

// Auto-resizing textarea component
const AutoTextarea: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  className?: string;
}> = ({ value, onChange, onSave, onCancel, className = "" }) => {
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
      autoFocus
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
        adjustHeight();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          onSave();
        }
        if (e.key === "Escape") {
          onCancel();
        }
      }}
      onBlur={onSave}
      rows={1}
      className={`resize-none overflow-hidden ${className}`}
    />
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
    Record<number, { resolved: boolean; value: string }>
  >({});

  // Editing state
  const [editingBulletIndex, setEditingBulletIndex] = useState<number | null>(
    null,
  );
  const [editingBulletValue, setEditingBulletValue] = useState<string>("");
  const [editingText, setEditingText] = useState<boolean>(false);
  const [editingTextValue, setEditingTextValue] = useState<string>("");

  useEffect(() => {
    if (resolution === "resolved") {
      onUpdateValue(currentValue);
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

  // Handle editing a resolved bullet point
  const startEditingBullet = (index: number, value: string) => {
    setEditingBulletIndex(index);
    setEditingBulletValue(value);
  };

  const saveBulletEdit = (index: number) => {
    if (Array.isArray(currentValue)) {
      const updated = [...currentValue];
      updated[index] = editingBulletValue;
      setCurrentValue(updated);

      setResolvedBullets((prev) => ({
        ...prev,
        [index]: { ...prev[index], value: editingBulletValue },
      }));
    }
    setEditingBulletIndex(null);
    setEditingBulletValue("");
  };

  const cancelBulletEdit = () => {
    setEditingBulletIndex(null);
    setEditingBulletValue("");
  };

  // Handle editing resolved paragraph/text
  const startEditingText = () => {
    setEditingText(true);
    setEditingTextValue(typeof currentValue === "string" ? currentValue : "");
  };

  const saveTextEdit = () => {
    setCurrentValue(editingTextValue);
    setEditingText(false);
    setEditingTextValue("");
  };

  const cancelTextEdit = () => {
    setEditingText(false);
    setEditingTextValue("");
  };

  // Handle resolving individual bullet
  const resolveBullet = (index: number, value: string) => {
    if (Array.isArray(currentValue)) {
      const updated = [...currentValue];
      updated[index] = value;
      setCurrentValue(updated);
    }

    setResolvedBullets((prev) => ({
      ...prev,
      [index]: { resolved: true, value },
    }));

    const totalBullets = Array.isArray(fieldData.new_value)
      ? fieldData.new_value.length
      : 0;
    const allResolved =
      Object.keys({ ...resolvedBullets, [index]: { resolved: true, value } })
        .length === totalBullets;

    if (allResolved) {
      setResolution("resolved");
    }
  };

  // --- DIFF RENDERING ENGINE ---

  const renderInlineDiff = (oldStr: string, newStr: string) => {
    const diffs = diffWords(oldStr || "", newStr || "");
    return (
      <div className="leading-relaxed whitespace-pre-wrap">
        {diffs.map((part, i) => {
          if (part.added)
            return (
              <span
                key={i}
                className="bg-green-100 text-green-800 rounded px-0.5"
              >
                {part.value}
              </span>
            );
          if (part.removed)
            return (
              <span
                key={i}
                className="bg-red-100 text-red-800 line-through rounded px-0.5"
              >
                {part.value}
              </span>
            );
          return <span key={i}>{part.value}</span>;
        })}
      </div>
    );
  };

  const renderStructuralDiff = (oldStr: string, newBullets: string[]) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        <div className="p-2 bg-red-50 text-red-800 line-through text-xs rounded border border-red-100">
          {oldStr}
        </div>
        <ul className="p-2 bg-green-50 text-green-800 text-xs rounded border border-green-100 list-disc pl-6 space-y-1">
          {newBullets.map((bullet, i) => (
            <li key={i}>{bullet}</li>
          ))}
        </ul>
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
      <div className="space-y-3">
        {bullets.map((_, i) => {
          const isResolved = resolvedBullets[i]?.resolved;
          const resolvedValue = resolvedBullets[i]?.value;

          if (isResolved) {
            const displayValue =
              resolvedValue ||
              (Array.isArray(currentValue) ? currentValue[i] : "");

            // Show as normal bullet point (like resolved view)
            return (
              <div key={i} className="group relative">
                {editingBulletIndex === i ? (
                  <AutoTextarea
                    value={editingBulletValue}
                    onChange={setEditingBulletValue}
                    onSave={() => saveBulletEdit(i)}
                    onCancel={cancelBulletEdit}
                    className="w-full text-xs p-1 border border-brand rounded focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                ) : (
                  <div
                    onClick={() => startEditingBullet(i, displayValue)}
                    className="cursor-text hover:bg-gray-50 -ml-1 pl-1 pr-6 py-0.5 rounded relative group-hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xs text-text-primary">
                      • {displayValue}
                    </span>
                    <Icon
                      icon="lucide:pencil"
                      className="absolute right-0 top-1 opacity-0 group-hover:opacity-40 text-gray-400 w-3 h-3 transition-opacity"
                    />
                  </div>
                )}
              </div>
            );
          }

          // Show diff for unresolved bullet
          return (
            <div
              key={i}
              className="p-2 bg-gray-50 rounded border border-gray-200"
            >
              <div className="whitespace-pre-wrap text-xs leading-relaxed mb-2">
                {renderInlineDiff(oldBullets[i] || "", newBullets[i] || "")}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => resolveBullet(i, newBullets[i])}
                  className="px-2 py-0.5 text-xxs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={() => resolveBullet(i, oldBullets[i])}
                  className="px-2 py-0.5 text-xxs bg-white border border-red-200 text-red-600 rounded hover:bg-red-50 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ==========================================
  // RESOLVED VIEW - Show final value with edit capability
  // ==========================================
  if (resolution === "resolved") {
    // Array case (bullet points)
    if (Array.isArray(currentValue)) {
      return (
        <ul className="list-disc pl-4 w-full text-xs text-text-primary space-y-1.5">
          {currentValue.map((bullet, i) => (
            <li key={i} className="group relative">
              {editingBulletIndex === i ? (
                <AutoTextarea
                  value={editingBulletValue}
                  onChange={setEditingBulletValue}
                  onSave={() => saveBulletEdit(i)}
                  onCancel={cancelBulletEdit}
                  className="w-full text-xs p-1 border border-brand rounded focus:outline-none focus:ring-1 focus:ring-brand"
                />
              ) : (
                <div
                  onClick={() => startEditingBullet(i, bullet)}
                  className="cursor-text hover:bg-gray-50 -ml-1 pl-1 pr-6 py-0.5 rounded relative group-hover:bg-gray-50 transition-colors"
                >
                  <span>{bullet}</span>
                  <Icon
                    icon="lucide:pencil"
                    className="absolute right-0 top-1 opacity-0 group-hover:opacity-40 text-gray-400 w-3 h-3 transition-opacity"
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      );
    }

    // String case (paragraph/text)
    if (editingText) {
      return (
        <div className="flex flex-col gap-1 w-full">
          <AutoTextarea
            value={editingTextValue}
            onChange={setEditingTextValue}
            onSave={saveTextEdit}
            onCancel={cancelTextEdit}
            className="w-full text-xs p-2 border border-brand rounded focus:outline-none focus:ring-1 focus:ring-brand"
          />
          <div className="flex gap-1 text-xxs text-gray-400">
            <span>Click outside or press Escape to save</span>
          </div>
        </div>
      );
    }

    return (
      <div
        onClick={startEditingText}
        className="w-full text-xs text-text-primary leading-relaxed whitespace-pre-wrap cursor-text hover:bg-gray-50 p-1.5 -ml-1.5 rounded relative group transition-colors"
      >
        <span>{currentValue}</span>
        <Icon
          icon="lucide:pencil"
          className="absolute right-1 top-2 opacity-0 group-hover:opacity-40 text-gray-400 w-3 h-3 transition-opacity"
        />
      </div>
    );
  }

  // ==========================================
  // UNRESOLVED DIFF LAYOUT PIPELINE
  // ==========================================

  // 1. Structural View Layout (para -> bullets)
  if (fieldData.diff_mode === "structural") {
    return (
      <div className="flex flex-col gap-2 w-full p-2 border border-blue-100 bg-blue-50/30 rounded-lg relative">
        {renderStructuralDiff(
          fieldData.old_value as string,
          fieldData.new_value as string[],
        )}
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={handleAcceptField}
            className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xxs font-semibold rounded shadow-sm transition-colors"
          >
            <Icon icon="lucide:check" className="w-3 h-3" /> Accept
          </button>
          <button
            onClick={handleRejectField}
            className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xxs font-semibold rounded shadow-sm transition-colors"
          >
            <Icon icon="lucide:x" className="w-3 h-3" /> Reject
          </button>
        </div>
      </div>
    );
  }

  // 2. Inline View Layout Container
  if (fieldData.diff_mode === "inline") {
    // Condition A: bullet -> bullet
    if (
      Array.isArray(fieldData.old_value) &&
      Array.isArray(fieldData.new_value)
    ) {
      return (
        <div className="flex flex-col gap-2 w-full p-2 border border-blue-100 bg-blue-50/30 rounded-lg relative">
          {renderBulletToBulletDiff(
            fieldData.old_value as string[],
            fieldData.new_value as string[],
          )}
        </div>
      );
    }

    // Condition B: para -> para
    return (
      <div className="flex flex-col gap-2 w-full p-2 border border-blue-100 bg-blue-50/30 rounded-lg relative">
        <div className="w-full text-xs text-text-primary">
          {renderInlineDiff(
            fieldData.old_value as string,
            fieldData.new_value as string,
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={handleAcceptField}
            className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xxs font-semibold rounded shadow-sm transition-colors"
          >
            <Icon icon="lucide:check" className="w-3 h-3" /> Accept
          </button>
          <button
            onClick={handleRejectField}
            className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xxs font-semibold rounded shadow-sm transition-colors"
          >
            <Icon icon="lucide:x" className="w-3 h-3" /> Reject
          </button>
        </div>
      </div>
    );
  }

  return null;
};

//DEEPSEEK
