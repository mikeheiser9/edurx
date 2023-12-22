import React from "react";
import cx from "classnames";
import { HiInformationCircle } from "react-icons/hi";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";


const Textarea = ({
  register,
  height,
  labelClassName = "",
  parentClassName = "",
  placeholder,
  label = "",
  error = "",
  className = "",
  required = false,
  border = "md",
  info = false,
  disabled = false,
  defaultValue,
}: {
  className?: any;
  height?: string;
  register?: any;
  labelClassName?: any;
  parentClassName?: any;
  placeholder?: any;
  label?: any;
  error?: any;
  required?: any;
  info?: any;
  disabled?: boolean;
  border?: "sm" | "md";
  defaultValue?: string;
}) => {
  const classes = cx(
    className,
    `relative bg-white text-dark placeholder:text-dark/30 outline-none block text-sm p-4 w-full rounded-lg font-semibold border border-Fourgrey hover:border-dark/30 focus:border-dark/60 disabled:bg-light/30 disabled:opacity-60 disabled:pointer-events-none disabled:select-none ${
      height && "h-32"
    }`,
    { [`border`]: border === "sm" },
    { [`border-2`]: border === "md" }
  );

  return (
    <div className={`relative flex flex-col gap-2 ${parentClassName} `}>
      {label && (
        <label
          className={`flex items-center gap-1 text-dark text-xs ${labelClassName} `}
        >
          {label}
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
      )}
      <textarea
        placeholder={placeholder}
        className={classes}
        {...register} // Register the input with RHF
        disabled={disabled}
        defaultValue={defaultValue}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default Textarea;
