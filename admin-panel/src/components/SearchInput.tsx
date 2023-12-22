"use client";
import React from "react";
import cx from "classnames";
import { RiSearch2Line } from "react-icons/ri";
import { HiInformationCircle } from "react-icons/hi";
import { Tooltip ,
  TooltipTrigger,
  TooltipContent, } from "./Tooltip";

interface InputProps {
  className?: any;
  type?: any;
  parentClassName?: any;
  placeholder?: any;
  label?: any;
  error?: any;
  startIcon?: any;
  endIcon?: any;
  icon?: any;
  required?: any;
  value?: any;
  rounded?: any;
  info?: any;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  size?: "sm" | "md" | "lg";
  border?: "sm" | "md";
  disabled?: boolean;
}

const SearchInput: React.FC<InputProps> = ({
  className,
  type = "text",
  parentClassName,
  placeholder,
  label = false,
  error = false,
  startIcon = false,
  endIcon = false,
  required = false,
  value,
  rounded = false,
  info = false,
  handleChange,
  size = "md",
  border = "md",
  disabled = false,
}) => {
  const classes = cx(
    className,
    `relative bg-white text-dark placeholder:text-dark/50 font-medium outline-none block text-sm w-full rounded border border-light hover:border-dark/30 focus:border-dark/60 px-4 disabled:bg-light/30`,
    { [`rounded-full`]: rounded },
    { [`rounded`]: !rounded },
    { [`h-9`]: size === "sm" },
    { [`h-10`]: size === "md" },
    { [`h-11`]: size === "lg" },
    { [`border`]: border === "sm" },
    { [`border-2`]: border === "md" },
    { [`pl-10`]: startIcon },
    { [`pr-10`]: endIcon }
  );

  const iconClasses = cx(
    `absolute flex items-center justify-center text-secondary text-xl z-[1]`,
    { [`min-w-[36px]`]: size === "sm" },
    { [`min-w-[44px]`]: size === "md" || size === "lg" }
  );

  return (
    <div className={`relative flex flex-col gap-2 ${parentClassName} `}>
      {label && (
        <label className="flex items-center gap-1 text-dark text-xs">
          {label}{" "}
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
      <div
        className={`relative flex items-center ${
          disabled && "opacity-60 pointer-events-none select-none"
        } `}
      >
        {startIcon && (
          <span className={`left-0 ${iconClasses}`}>{startIcon}</span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className={classes}
          disabled={disabled}
        />
        {endIcon && <span className={`right-0 ${iconClasses}`}>{endIcon}</span>}
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default SearchInput;
