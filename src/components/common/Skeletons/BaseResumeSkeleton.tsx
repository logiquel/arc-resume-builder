const BaseResumeSkeleton = () => {
  return (
    <div className="w-full flex flex-col border-red-400">
      <div className="relative flex-1 flex gap-x-3">
        {/* Single Card Skeleton */}
        <div className="relative w-[95%] h-20">
          <div className="absolute inset-0 flex flex-col justify-evenly p-5 gap-y-1 rounded-2xl shadow-lg border border-black/12 bg-gray-100 animate-pulse">
            <div className="flex items-center gap-x-2">
              <div className="h-3 w-6 bg-gray-300 rounded"></div>
              <div className="h-3 w-32 bg-gray-300 rounded"></div>
            </div>
            <div className="w-full flex items-center gap-x-1 ml-5">
              <div className="h-3 w-3 bg-gray-300 rounded"></div>
              <div className="h-3 w-24 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>

        {/* Dots Indicator Skeleton */}
        <div className="h-full w-5 flex flex-col gap-y-1 justify-center items-center">
          {[1, 2, 3, 4].map((_, idx) => (
            <div
              key={idx}
              className={`rounded-full transition-all duration-200 w-[4.2px] aspect-square bg-gray-300 ${
                idx === 0 ? "scale-110" : ""
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BaseResumeSkeleton;
