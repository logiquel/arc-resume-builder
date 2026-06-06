// Update the DeleteModal component to accept props
import { Icon } from "@iconify/react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  resumeName?: string;
  isDeleting?: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  resumeName = "this resume",
  isDeleting = false,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      <div className="relative w-90 max-w-[90vw] rounded-4xl bg-white border border-black/10 shadow-2xl p-5 overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-24 before:bg-linear-to-b before:from-red-500/10 before:to-transparent before:pointer-events-none">
        <div className="relative flex flex-col gap-2">
          <Icon
            icon="duo-icons:alert-octagon"
            className="text-[#E22324] text-2xl mx-auto"
          />
          <div className="w-full flex justify-center">
            <h2 className="text-base text-text-primary font-medium leading-snug">
              Are you sure you want to delete?
            </h2>
          </div>
          <p className="text-xxs text-text-muted leading-relaxed mx-auto text-center">
            This action is permanent and cannot be undone.{" "}
            <span className="font-medium text-brand">{resumeName}</span> will be
            deleted forever.
          </p>
        </div>
        <div className="relative w-full flex items-center justify-center gap-2 mt-5">
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-[#d01b1b] text-xxs text-white rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isDeleting && (
              <Icon icon="svg-spinners:3-dots-fade" className="text-white" />
            )}
            {isDeleting ? "Deleting..." : "Confirm"}
          </button>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 bg-gray-100 text-xxs rounded-md cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
