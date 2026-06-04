import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export interface CertificateFormData {
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date: string;
  link: string;
  description: string;
}

interface CertificateFormProps {
  onClose: () => void;
  onSave: (data: CertificateFormData) => void;
  initialData?: CertificateFormData;
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

const CertificateForm: React.FC<CertificateFormProps> = ({
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState<CertificateFormData>(
    initialData || {
      name: "",
      issuer: "",
      issue_date: "",
      expiry_date: "",
      link: "",
      description: "",
    },
  );

  const updateField = (field: keyof CertificateFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const payload = {
      ...formData,
      issue_date: formData.issue_date.trim() || "",
      expiry_date: formData.expiry_date.trim() || "",
      link: formData.link.trim(),
      description: formData.description.trim(),
    };

    onSave(payload);
  };

  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center z-30 bg-black/20 backdrop-blur-sm">
      <div className="w-120 flex flex-col bg-white border border-black/10 shadow-2xl rounded-3xl ring-4 ring-white/50">
        <header className="w-full flex gap-2 p-3 justify-between shrink-0">
          <div className="flex items-center">
            <Icon icon="ri:certificate-line" className="text-brand" />
            <h2 className="text-base font-medium text-text-primary pl-2">
              Add New Certificate Entry
            </h2>
          </div>
          <button
            onClick={onClose}
            className="self-start flex items-center justify-center border rounded-full p-2 cursor-pointer shadow"
          >
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
              placeholder="e.g. AWS Certified Solutions Architect"
            />
          </fieldset>

          <fieldset className="min-w-0 flex flex-col gap-y-1.5 col-span-1">
            <label className="text-tiny text-text-muted font-medium tracking-[0.08em]">
              ISSUER
            </label>
            <AutoTextarea
              value={formData.issuer}
              onChange={(v) => updateField("issuer", v)}
              placeholder="e.g. Amazon Web Services"
            />
          </fieldset>

          <fieldset className="min-w-0 flex flex-col gap-y-1.5 col-span-1">
            <label className="text-tiny text-text-muted font-medium tracking-[0.08em]">
              LINK
            </label>
            <div className="relative">
              <AutoTextarea
                value={formData.link}
                onChange={(v) => updateField("link", v)}
                placeholder="https://credential-url.com"
                className={textareaClass + " pr-9"}
              />
              <Icon
                icon="mdi:link-variant"
                className="absolute right-3 top-3 text-text-muted/45 text-xs pointer-events-none"
              />
            </div>
          </fieldset>

          <fieldset className="min-w-0 flex flex-col gap-y-1.5">
            <label className="text-tiny text-text-muted font-medium tracking-[0.08em]">
              ISSUE DATE
            </label>
            <div className="relative">
              <AutoTextarea
                value={formData.issue_date}
                onChange={(v) => updateField("issue_date", v)}
                placeholder="MM / YYYY"
                className={textareaClass + " pr-9"}
              />
              <Icon
                icon="mdi:calendar-outline"
                className="absolute right-3 top-3 text-text-muted/45 text-xs pointer-events-none"
              />
            </div>
          </fieldset>

          <fieldset className="min-w-0 flex flex-col gap-y-1.5">
            <label className="text-tiny text-text-muted font-medium tracking-[0.08em]">
              EXPIRY DATE
            </label>
            <div className="relative">
              <AutoTextarea
                value={formData.expiry_date}
                onChange={(v) => updateField("expiry_date", v)}
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
              placeholder="Add a short note about the certification, specialization, or credential..."
              className={clsx(textareaClass, "min-h-24")}
            />
          </fieldset>
        </div>

        <footer className="w-full flex items-center justify-end gap-2 p-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs rounded-full bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
          >
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

export default CertificateForm;
