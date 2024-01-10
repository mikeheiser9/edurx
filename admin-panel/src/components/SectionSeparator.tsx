import React from "react";

const SectionSeparator = ({
  title,
  className = " ",
  titleClassName = " ",
  showLine,
}: {
  className?: string;
  title?: string;
  titleClassName?: string;
  showLine?: boolean;
}) => {
  return (
    <>
      <div className={`relative flex items-center ${className}`}>
        <p className={`relative block z-[1] pr-5 bg-white ${titleClassName}`}>
          {title}
        </p>
        {showLine && (
          <span className="absolute h-[1px] w-full left-0 bg-light" />
        )}
      </div>
    </>
  );
};

export default SectionSeparator;
