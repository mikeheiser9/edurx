import React from "react";

const Skeleton = ({ className }: { className?: any }) => {
  return (
    <div
      className={`relative bg-[#f6f4f6] rounded overflow-hidden ${className}`}
    >
      <span className="absolute top-2/4 -translate-y-2/4 h-[200%] w-24 bg-white/70 blur-lg animate-skeleton -skew-x-[25deg] "></span>
    </div>
  );
};

export default Skeleton;
