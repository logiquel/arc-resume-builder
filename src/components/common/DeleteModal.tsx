import { Icon } from "@iconify/react";

const DeleteModal = () => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      <div className="relative w-90 max-w-[90vw] rounded-4xl bg-white border border-black/10 shadow-2xl p-5 overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-24 before:bg-gradient-to-b before:from-red-500/10 before:to-transparent before:pointer-events-none">
        <div className="relative flex flex-col gap-2">
          <Icon
            icon="duo-icons:alert-octagon"
            className="text-[#E22324] text-2xl mx-auto"
          />
          <div className="w-full flex justify-between">
            <h2 className="text-base text-text-primary font-medium leading-snug">
              Are you sure you want to delete?
            </h2>
          </div>
          <p className=" text-xxs text-text-muted leading-relaxed">
            This action is permanent and cannot be undone. Deleted items cannot
            be recovered.
          </p>
        </div>
        <div className="relative w-full flex items-center justify-center gap-2 mt-5">
          <button className="px-3 py-2 bg-[#E22324] text-xxs text-white rounded-md  cursor-pointer">
            Confirm
          </button>
          <button className="px-3 py-2 bg-gray-100 text-xxs rounded-md cursor-pointer">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
