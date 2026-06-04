import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

interface AwardFormData {
  title: string;
  awarder: string;
  date: string;
  description: string;
}

const autoResize = (el: HTMLTextAreaElement | null) => {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
};

const textareaClass = clsx(
  "w-full px-3 py-2 rounded-md",
  "bg-white text-text-primary text-xs",
  "border border-black/5",
  "outline-none resize-none overflow-hidden",
  "leading-relaxed",
  "placeholder:text-text-muted/35",
  "transition-all duration-200",
  "hover:border-black/12",
  "focus:border-[#0A65CC]/40",
  "focus:shadow-[0_0_0_4px_rgba(10,101,204,0.08),0_4px_14px_rgba(10,101,204,0.10),inset_0_1px_0_rgba(255,255,255,0.9)]",
  "placeholder:text-xxs",
);

interface AutoTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  textareaRef?: (el: HTMLTextAreaElement | null) => void;
}

const AutoTextarea: React.FC<AutoTextareaProps> = ({
  value,
  onChange,
  placeholder,
  className,
  textareaRef,
}) => {
  const innerRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    autoResize(innerRef.current);
  }, [value]);

  return (
    <textarea
      ref={(el) => {
        innerRef.current = el;
        textareaRef?.(el);
      }}
      rows={1}
      value={value}
      placeholder={placeholder}
      onChange={(e) => {
        onChange(e.target.value);
        autoResize(e.target);
      }}
      className={className ?? textareaClass}
    />
  );
};

const AwardForm = () => {
  const [formData, setFormData] = useState<AwardFormData>({
    title: "",
    awarder: "",
    date: "",
    description: "",
  });

  const updateField = (field: keyof AwardFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const payload = {
      ...formData,
      date: formData.date.trim() || null,
      description: formData.description.trim(),
    };

    console.log("Award Entry:", payload);
  };

  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center z-30">
      <div className="w-120 flex flex-col bg-white border border-black/10 shadow-2xl rounded-3xl ring-4 ring-white/50">
        <header className="w-full flex gap-2 p-3 justify-between shrink-0">
          <div className="flex items-center">
            <Icon icon="ri:trophy-line" className="text-brand" />
            <h2 className="text-base font-medium text-text-primary pl-2">
              Add New Award Entry
            </h2>
          </div>
          <button className="self-start flex items-center justify-center border rounded-full p-2 cursor-pointer shadow">
            <Icon icon="iconamoon:close" />
          </button>
        </header>

        <div className="w-full grid grid-cols-2 gap-x-5 gap-y-4 p-4 overflow-hidden">
          <fieldset className="min-w-0 flex flex-col gap-y-1.5 col-span-2">
            <label className="text-tiny text-text-muted font-medium tracking-[0.08em]">
              TITLE
            </label>
            <AutoTextarea
              value={formData.title}
              onChange={(v) => updateField("title", v)}
              placeholder="e.g. Best Innovation Award"
            />
          </fieldset>

          <fieldset className="min-w-0 flex flex-col gap-y-1.5">
            <label className="text-tiny text-text-muted font-medium tracking-[0.08em]">
              AWARDER
            </label>
            <AutoTextarea
              value={formData.awarder}
              onChange={(v) => updateField("awarder", v)}
              placeholder="e.g. Google Developer Group"
            />
          </fieldset>

          <fieldset className="min-w-0 flex flex-col gap-y-1.5">
            <label className="text-tiny text-text-muted font-medium tracking-[0.08em]">
              DATE
            </label>
            <div className="relative">
              <AutoTextarea
                value={formData.date}
                onChange={(v) => updateField("date", v)}
                placeholder="MM / YYYY"
                className={textareaClass + " pr-9"}
              />
              <Icon
                icon="mdi:calendar-outline"
                className="absolute right-3 top-3 text-text-muted/45 text-xs pointer-events-none"
              />
            </div>
          </fieldset>

          <fieldset className="min-w-0 flex flex-col gap-y-1.5 col-span-2">
            <label className="text-tiny text-text-muted font-medium tracking-[0.08em]">
              DESCRIPTION
            </label>
            <AutoTextarea
              value={formData.description}
              onChange={(v) => updateField("description", v)}
              placeholder="Briefly describe the award, recognition, or achievement..."
              className={clsx(textareaClass, "min-h-24")}
            />
          </fieldset>
        </div>

        <footer className="w-full flex items-center justify-end gap-2 p-3 shrink-0">
          <button className="px-4 py-2 text-xs rounded-full bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs rounded-full bg-brand text-white cursor-pointer hover:opacity-90 transition-opacity"
          >
            Save
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AwardForm;
