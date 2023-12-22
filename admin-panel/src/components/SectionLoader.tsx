import React from "react";

const SectionLoader = ({
  className,
  size = "h-14 w-14",
}: {
  className?: string;
  size?: string;
}) => {
  return (
    <div
      className={`absolute inset-0 bg-[#A5A5A8] backdrop-blur-sm z-[9] flex items-center justify-center ${className} `}
    >
      <span
        className={`relative ${size} border-[8px] border-gray-200 border-b-gray-600 rounded-full block animate-spin`}
      />
    </div>
  );
};

export default SectionLoader;
