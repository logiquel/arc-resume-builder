import { useCreateBaseResumeMutation } from "#/api/resume/base/base-resume.mutations";
import FormIcon from "#/components/common/FormIcon";
import PaperIcon from "#/components/common/PaperIcon";
import { Icon } from "@iconify/react";
import { useRef, useState } from "react";

interface AddBaseResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddBaseResumeModal: React.FC<AddBaseResumeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedOption, setSelectedOption] = useState<
    "form" | "upload" | null
  >(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: createBaseResume, isPending } = useCreateBaseResumeMutation();

  if (!isOpen) {
    return null;
  }

  const handleOptionSelect = (option: "form" | "upload") => {
    setSelectedOption(option);
    if (option === "upload") {
      setUploadedFile(null);
      setResumeName("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setResumeName(nameWithoutExt);
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile) {
      return;
    }

    createBaseResume(
      {
        name: resumeName || uploadedFile.name,
        file: uploadedFile,
      },
      {
        onSuccess: () => {
          setSelectedOption(null);
          setUploadedFile(null);
          setResumeName("");
          onClose();
        },
      },
    );
  };

  const handleBack = () => {
    setSelectedOption(null);
    setUploadedFile(null);
    setResumeName("");
  };

  const handleNext = () => {
    if (selectedOption === "upload") {
      handleUpload();
    }
  };

  const isNextDisabled = () => {
    if (selectedOption === "upload") {
      return !uploadedFile || isPending;
    }
    return true; // Form option is disabled
  };

  return (
    <div className="absolute inset-0 z-50 flex justify-center">
      <div className="w-100 h-fit mt-[10%] flex flex-col gap-1 p-1 bg-white shadow-2xl border border-black/10 rounded-4xl overflow-hidden transition-all duration-300">
        <header className="w-full flex gap-2 p-3 justify-between shrink-0">
          <div className="flex flex-col">
            <h2 className="text-base font-medium leading-snug">
              Select how you want to add Base Resume
            </h2>
            <p className="text-text-muted text-xxs tracking-[0.2px]">
              Choose a base resume to begin tailoring it for specific job
              applications
            </p>
          </div>
          <button
            onClick={() => {
              onClose();
              setSelectedOption(null);
              setUploadedFile(null);
              setResumeName("");
            }}
            className="self-start flex items-center justify-center border rounded-full p-2 cursor-pointer shadow"
          >
            <Icon icon="iconamoon:close" />
          </button>
        </header>

        <div className="transition-all duration-300 ease-in-out">
          {selectedOption === "upload" ? (
            <div className="w-full px-3 py-1">
              <div className="w-full aspect-4/1.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-full flex flex-col items-center p-5 border-2 border-dashed border-brand-100 rounded-3xl bg-linear-to-b from-blue-50 to-white hover:from-blue-50 hover:to-blue-50 shadow-[0_0_30px_rgba(59,130,246,0.08)] hover:border-black/30 transition-all duration-300 cursor-pointer"
                >
                  <Icon
                    icon="lets-icons:upload-light"
                    className="text-text-muted text-xl"
                  />

                  <p className="text-text-muted text-xxs text-center font-normal mt-2">
                    Upload your resume in{" "}
                    <span className="font-medium text-brand font-mono">
                      PDF
                    </span>{" "}
                    or{" "}
                    <span className="font-medium text-brand font-mono">
                      DOCX
                    </span>{" "}
                    format to use as the base for AI tailoring.
                  </p>

                  {uploadedFile && (
                    <p className="mt-3 text-xxs font-medium text-brand">
                      {uploadedFile.name}
                    </p>
                  )}
                </div>
              </div>
              {/* Show input whenever a file is uploaded, regardless of resumeName value */}
              {uploadedFile && (
                <div className="mt-3 px-1 py-1">
                  <label className="text-tiny text-brand font-medium block px-1 mb-1 uppercase">
                    Resume Name
                  </label>
                  <input
                    type="text"
                    value={resumeName}
                    onChange={(e) => setResumeName(e.target.value)}
                    placeholder="Enter resume name"
                    className="w-full px-3 py-3 text-xs bg-gray-50 rounded-lg focus:outline-none focus:border-brand"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="w-full flex flex-col gap-2 p-2">
              <button
                onClick={() => handleOptionSelect("upload")}
                className="w-full aspect-[1/0.3] flex border rounded-2xl cursor-pointer hover:border-black/20 bg-linear-to-b hover:from-blue-50 hover:to-white overflow-clip p-1 group"
              >
                <div className="h-full aspect-square flex items-end overflow-clip bg-linear-to-b from-brand/20 to-brand/10 rounded-[inherit]">
                  <div className="w-full h-[80%] translate-y-2 flex justify-center group-hover:translate-y-0 transition-all duration-300">
                    <PaperIcon />
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center items-start gap-y-1 px-3">
                  <p className="text-sm text-text-primary font-medium">
                    Upload File
                  </p>

                  <p className="text-tiny text-text-muted text-start">
                    Upload your resume in{" "}
                    <span className="font-medium text-brand">PDF</span> or{" "}
                    <span className="font-medium text-brand">DOCX</span> format
                    to use as a base for AI tailoring.
                  </p>
                </div>
              </button>

              <button
                disabled
                className="w-full aspect-[1/0.3] flex border rounded-2xl cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 hover:border-black/20 bg-linear-to-b hover:from-blue-50 hover:to-white overflow-clip p-1 group"
              >
                <div className="h-full aspect-square flex items-end overflow-clip bg-linear-to-b from-brand/20 to-brand/10 rounded-[inherit]">
                  <div className="w-full h-[80%] translate-y-2 flex justify-center group-hover:translate-y-0 transition-all duration-300">
                    <FormIcon />
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center items-start gap-y-1 px-3">
                  <p className="text-sm text-text-primary font-medium">
                    Fill Form
                  </p>

                  <p className="text-tiny text-text-muted text-start">
                    Manually input your resume details in a structured form.
                  </p>

                  <p className="text-tiny text-text-secondary text-start bg-gray-100/80 px-3 py-1 rounded-full mt-1">
                    Coming Soon!
                  </p>
                </div>
              </button>
            </div>
          )}
        </div>

        <footer className="w-full flex items-center p-2 shrink-0">
          <div className="flex items-center gap-1 p-2">
            <div
              className={`h-[0.35rem] rounded-full transition-all duration-200 ${
                selectedOption === null
                  ? "w-6 bg-brand"
                  : "w-[0.35rem] bg-gray-100"
              }`}
            ></div>
            <div
              className={`h-[0.35rem] rounded-full transition-all duration-200 ${
                selectedOption !== null
                  ? "w-6 bg-brand"
                  : "w-[0.35rem] bg-gray-100"
              }`}
            ></div>
          </div>
          <div className="flex-1 flex items-center justify-end gap-2">
            {selectedOption !== null && (
              <button
                onClick={handleBack}
                className="px-5 py-2 text-xxs bg-gray-100 rounded-full cursor-pointer"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={isNextDisabled()}
              className="px-5 py-2 text-xxs text-white bg-brand rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending
                ? "Uploading..."
                : selectedOption === null
                  ? "Next"
                  : "Upload"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AddBaseResumeModal;
