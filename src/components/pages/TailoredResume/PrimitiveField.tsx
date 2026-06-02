import { useEffect, useRef } from "react";

const PrimitiveField: React.FC<{
  value: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
}> = ({ value, onChange }) => {
  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

  const adjustHeight = (index: number) => {
    const textarea = textareaRefs.current[index];
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (Array.isArray(value)) {
      value.forEach((_, index) => adjustHeight(index));
    } else {
      adjustHeight(0);
    }
  }, [value]);

  // Handle single string value
  if (!Array.isArray(value)) {
    return (
      <textarea
        ref={(el) => {
          textareaRefs.current[0] = el;
        }}
        value={value ?? ""}
        onChange={(e) => {
          onChange(e.target.value);
          adjustHeight(0);
        }}
        rows={1}
        className="py-1.5 px-2 rounded text-text-primary text-xs border border-transparent resize-none overflow-hidden outline-0 transition-colors focus:bg-gray-100"
      />
    );
  }

  // Handle string array value
  return (
    <div className="flex flex-col">
      {value.map((bullet, index) => (
        <div
          className="relative flex items-center before:content-['●'] before:absolute before:-translate-x-1 before:text-text-muted/50 before:text-xxs before:inline-block before:transition-opacity focus-within:before:opacity-0"
          key={index}
        >
          <textarea
            ref={(el) => {
              textareaRefs.current[index] = el;
            }}
            value={bullet}
            onChange={(e) => {
              const newArray = [...value];
              newArray[index] = e.target.value;
              onChange(newArray);
              adjustHeight(index);
            }}
            rows={1}
            className="flex-1 py-1.5 px-2 rounded text-text-primary text-xs border border-transparent resize-none overflow-hidden outline-0 transition-colors focus:bg-gray-100"
          />
        </div>
      ))}
    </div>
  );
};

export default PrimitiveField;
