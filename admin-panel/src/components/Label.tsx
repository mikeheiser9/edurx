import React from "react";
import { HiInformationCircle } from "react-icons/hi";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";


const Label = ({
  className = "",
  title = "",
  required = false,
  info = false,
}: {
  className?: any;
  title?: any;
  required?: any;
  info?: any;
}) => {
  return (
    <label
      className={`flex items-center gap-1 text-dark text-xs ${className} `}
    >
      {title}
      {required && <span className="text-red-500 font-medium">*</span>}
      {info && (
        <Tooltip placement="top">
          <TooltipTrigger className="relative">
            <HiInformationCircle className="text-primary text-base cursor-help" />
          </TooltipTrigger>
          <TooltipContent>{info && "Information Here"}</TooltipContent>
        </Tooltip>
      )}
    </label>
  );
};

export default Label;
