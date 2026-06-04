import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

interface ReferenceFormData {
  name: string;
  position: string;
  organization: string;
  email: string;
  phone: string;
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

const ReferenceForm = () => {
  const [formData, setFormData] = useState<ReferenceFormData>({
    name: "",
    position: "",
    organization: "",
    email: "",
    phone: "",
  });

  const updateField = (field: keyof ReferenceFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const payload = {
      ...formData,
      name: formData.name.trim(),
      position: formData.position.trim(),
      organization: formData.organization.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
    };

    console.log("Reference Entry:", payload);
  };

  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center z-30">
      <div className="w-120 flex flex-col bg-white border border-black/10 shadow-2xl rounded-3xl ring-4 ring-white/50">
        <header className="w-full flex gap-2 p-3 justify-between shrink-0">
          <div className="flex items-center">
            <Icon icon="ri:user-star-line" className="text-brand" />
            <h2 className="text-base font-medium text-text-primary pl-2">
              Add New Reference Entry
            </h2>
          </div>
          <button className="self-start flex items-center justify-center border rounded-full p-2 cursor-pointer shadow">
            <Icon icon="iconamoon:close" />
          </button>
        </header>

        <div className="w-full grid grid-cols-2 gap-x-5 gap-y-4 p-4 overflow-hidden">
          <fieldset className="min-w-0 flex flex-col gap-y-1.5 col-span-2">
            <label className="text-tiny text-text-muted font-medium tracking-[0.08em]">
              NAME
            </label>
            <AutoTextarea
              value={formData.name}
              onChange={(v) => updateField("name", v)}
              placeholder="e.g. Sarah Johnson"
            />
          </fieldset>

          <fieldset className="min-w-0 flex flex-col gap-y-1.5">
            <label className="text-tiny text-text-muted font-medium tracking-[0.08em]">
              POSITION
            </label>
            <AutoTextarea
              value={formData.position}
              onChange={(v) => updateField("position", v)}
              placeholder="e.g. Engineering Manager"
            />
          </fieldset>

          <fieldset className="min-w-0 flex flex-col gap-y-1.5">
            <label className="text-tiny text-text-muted font-medium tracking-[0.08em]">
              ORGANIZATION
            </label>
            <AutoTextarea
              value={formData.organization}
              onChange={(v) => updateField("organization", v)}
              placeholder="e.g. Acme Corp"
            />
          </fieldset>

          <fieldset className="min-w-0 flex flex-col gap-y-1.5">
            <label className="text-tiny text-text-muted font-medium tracking-[0.08em]">
              EMAIL
            </label>
            <div className="relative">
              <AutoTextarea
                value={formData.email}
                onChange={(v) => updateField("email", v)}
                placeholder="e.g. sarah@example.com"
                className={textareaClass + " pr-9"}
              />
              <Icon
                icon="mdi:email-outline"
                className="absolute right-3 top-3 text-text-muted/45 text-xs pointer-events-none"
              />
            </div>
          </fieldset>

          <fieldset className="min-w-0 flex flex-col gap-y-1.5">
            <label className="text-tiny text-text-muted font-medium tracking-[0.08em]">
              PHONE
            </label>
            <div className="relative">
              <AutoTextarea
                value={formData.phone}
                onChange={(v) => updateField("phone", v)}
                placeholder="e.g. +1 234 567 8901"
                className={textareaClass + " pr-9"}
              />
              <Icon
                icon="mdi:phone-outline"
                className="absolute right-3 top-3 text-text-muted/45 text-xs pointer-events-none"
              />
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

export default ReferenceForm;
