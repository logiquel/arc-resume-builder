import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

interface EducationFormData {
  degree: string;
  institution: string;
  score: string;
  location: string;
  start_date: string;
  end_date: string;
  link: string;
  description: string[];
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
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const AutoTextarea: React.FC<AutoTextareaProps> = ({
  value,
  onChange,
  placeholder,
  className,
  textareaRef,
  onKeyDown,
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
      onKeyDown={onKeyDown}
      className={className ?? textareaClass}
    />
  );
};

const EducationForm = () => {
  const [formData, setFormData] = useState<EducationFormData>({
    degree: "",
    institution: "",
    score: "",
    location: "",
    start_date: "",
    end_date: "",
    link: "",
    description: [""],
  });

  const bulletRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

  const updateField = (
    field: keyof Omit<EducationFormData, "description">,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBulletChange = (index: number, value: string) => {
    setFormData((prev) => {
      const description = [...prev.description];
      description[index] = value;
      return { ...prev, description };
    });
  };

  const handleBulletKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    index: number,
  ) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      setFormData((prev) => {
        const description = [...prev.description];
        description.splice(index + 1, 0, "");
        return { ...prev, description };
      });
      requestAnimationFrame(() => {
        bulletRefs.current[index + 1]?.focus();
      });
    }

    if (
      e.key === "Backspace" &&
      formData.description[index] === "" &&
      formData.description.length > 1
    ) {
      e.preventDefault();
      setFormData((prev) => {
        const description = [...prev.description];
        description.splice(index, 1);
        return { ...prev, description };
      });
      requestAnimationFrame(() => {
        bulletRefs.current[Math.max(index - 1, 0)]?.focus();
      });
    }
  };

  const handleSave = () => {
    const payload = {
      ...formData,
      start_date: formData.start_date.trim() || null,
      end_date: formData.end_date.trim() || null,
      link: formData.link.trim(),
      description: formData.description.filter((b) => b.trim().length > 0),
    };

    console.log("Education Entry:", payload);
  };

  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center z-30">
      <div className="w-120 flex flex-col bg-white border border-black/10 shadow-2xl rounded-3xl ring-4 ring-white/50">
        <header className="w-full flex gap-2 p-3 justify-between shrink-0">
          <div className="flex items-center">
            <Icon icon="ri:graduation-cap-line" className="text-brand" />
            <h2 className="text-base font-medium text-text-primary pl-2">
              Add New Education Entry
            </h2>
          </div>
          <button className="self-start flex items-center justify-center border rounded-full p-2 cursor-pointer shadow">
            <Icon icon="iconamoon:close" />
          </button>
        </header>

        <div className="w-full grid grid-cols-4 gap-x-5 gap-y-4 p-4 overflow-hidden">
          <fieldset className="min-w-0 flex flex-col gap-y-1.5 col-span-4">
            <label className="text-tiny text-text-muted font-medium tracking-[0.08em]">
              DEGREE
            </label>
            <AutoTextarea
              value={formData.degree}
              onChange={(v) => updateField("degree", v)}
              placeholder="e.g. Bachelor of Technology in Computer Science"
            />
          </fieldset>

          <fieldset className="min-w-0 flex flex-col gap-y-1.5 col-span-2">
            <label className="text-tiny text-text-muted font-medium tracking-[0.08em]">
              INSTITUTION
            </label>
            <AutoTextarea
              value={formData.institution}
              onChange={(v) => updateField("institution", v)}
              placeholder="e.g. Stanford University"
            />
          </fieldset>

          <fieldset className="min-w-0 flex flex-col gap-y-1.5 col-span-2">
            <label className="text-tiny text-text-muted font-medium tracking-[0.08em]">
              LOCATION
            </label>
            <AutoTextarea
              value={formData.location}
              onChange={(v) => updateField("location", v)}
              placeholder="e.g. California, USA"
            />
          </fieldset>

          <fieldset className="min-w-0 flex flex-col gap-y-1.5 col-span-2">
            <label className="text-tiny text-text-muted font-medium tracking-[0.08em]">
              START DATE
            </label>
            <div className="relative">
              <AutoTextarea
                value={formData.start_date}
                onChange={(v) => updateField("start_date", v)}
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
              END DATE
            </label>
            <div className="relative">
              <AutoTextarea
                value={formData.end_date}
                onChange={(v) => updateField("end_date", v)}
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
              SCORE / GPA
            </label>
            <AutoTextarea
              value={formData.score}
              onChange={(v) => updateField("score", v)}
              placeholder="e.g. 3.9 / 4.0"
            />
          </fieldset>

          <fieldset className="min-w-0 flex flex-col gap-y-1.5 col-span-2">
            <label className="text-tiny text-text-muted font-medium tracking-[0.08em]">
              LINK
            </label>
            <div className="relative">
              <AutoTextarea
                value={formData.link}
                onChange={(v) => updateField("link", v)}
                placeholder="https://institution-or-credential-link.com"
                className={textareaClass + " pr-9"}
              />
              <Icon
                icon="mdi:link-variant"
                className="absolute right-3 top-3 text-text-muted/45 text-xs pointer-events-none"
              />
            </div>
          </fieldset>

          <fieldset className="min-w-0 flex flex-col gap-y-1.5 col-span-4">
            <label className="text-tiny text-text-muted font-medium tracking-[0.08em]">
              DESCRIPTION
            </label>

            <div className="flex flex-col gap-1.5 rounded-md border border-black/5 bg-white p-2.5 transition-all duration-200 focus-within:border-[#0A65CC]/35 focus-within:shadow-[0_0_0_4px_rgba(10,101,204,0.08),0_4px_14px_rgba(10,101,204,0.10),inset_0_1px_0_rgba(255,255,255,0.9)]">
              {formData.description.map((bullet, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="mt-[0.6rem] w-[0.24rem] h-[0.24rem] rounded-full bg-text-muted/40 shrink-0" />
                  <textarea
                    ref={(el) => {
                      bulletRefs.current[index] = el;
                    }}
                    rows={1}
                    value={bullet}
                    placeholder="Describe coursework, achievements, or highlights…"
                    onChange={(e) => {
                      handleBulletChange(index, e.target.value);
                      autoResize(e.target);
                    }}
                    onKeyDown={(e) => handleBulletKeyDown(e, index)}
                    className="flex-1 bg-transparent text-text-primary text-xs resize-none overflow-hidden outline-none placeholder:text-text-muted/35 leading-relaxed"
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1 mt-3">
              <div className="flex items-center text-tiny">
                <span className="mr-1">Press </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="min-w-5 h-5 px-1.5 inline-flex items-center justify-center rounded border border-black/10 bg-white text-tiny font-medium text-text-secondary shadow-[0_0_16px_rgba(59,130,246,0.10)]">
                    Shift
                  </kbd>
                  <span>+</span>
                  <kbd className="min-w-5 h-5 px-1.5 inline-flex items-center justify-center gap-1 rounded border border-black/10 bg-white text-tiny font-medium text-text-secondary shadow-[0_0_16px_rgba(59,130,246,0.10)]">
                    <span>Enter</span>
                    <span className="text-tiny leading-none">↲</span>
                  </kbd>
                </span>
                <span className="ml-1">to add a new bullet.</span>
              </div>
              <div className="flex items-center text-tiny">
                <span className="block items-center gap-1 mr-1">
                  <kbd className="min-w-5 h-5 px-1.5 inline-flex items-center justify-center rounded border border-black/10 bg-white text-tiny font-medium text-text-secondary shadow-[0_0_16px_rgba(59,130,246,0.10)]">
                    Backspace
                  </kbd>
                </span>
                <span>on empty line to remove.</span>
              </div>
            </div>
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

export default EducationForm;
