import React from "react";
import cx from "classnames";
import { HiInformationCircle, HiOutlineChevronDown } from "react-icons/hi";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";


interface InputProps {
  className?: string;
  labelClassName?: string;
  parentClassName?: string;
  label?: string;
  error?: string;
  required?: boolean;
  startIcon?: any;
  endIcon?: any;
  rounded?: any;
  size?: "sm" | "md" | "lg";
  border?: "sm" | "md";
  info?: any;
  disabled?: boolean;
}
const SimpleSelect: React.FC<InputProps> = ({
  labelClassName = "",
  parentClassName = "",
  label = "",
  error = "",
  className = "",
  required = false,
  startIcon = false,
  endIcon = <HiOutlineChevronDown />,
  rounded = false,
  size = "md",
  border = "md",
  info = false,
  disabled = false,
}) => {
  const classes = cx(
    className,
    `relative bg-white text-dark placeholder:text-dark/30 outline-none block text-sm px-4 w-full border-light hover:border-dark/30 focus:border-dark/60 appearance-none disabled:bg-light/30`,
    { [`rounded-full`]: rounded },
    { [`rounded`]: !rounded },
    { [`h-9`]: size === "sm" },
    { [`h-10`]: size === "md" },
    { [`h-11`]: size === "lg" },
    { [`border`]: border === "sm" },
    { [`border-2`]: border === "md" },
    { [`pl-10`]: startIcon },
    { [`pr-10`]: startIcon }
  );

  const iconClasses = cx(
    `absolute flex items-center justify-center text-secondary text-xl z-[1]`,
    { [`min-w-[36px]`]: size === "sm" },
    { [`min-w-[44px]`]: size === "md" || size === "lg" }
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
      <div
        className={`relative flex items-center ${
          disabled && "opacity-60 pointer-events-none select-none"
        } `}
      >
        {startIcon && (
          <span className={`left-0 ${iconClasses}`}>{startIcon}</span>
        )}
        <select className={classes}>
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="mercedes">Mercedes</option>
          <option value="audi">Audi</option>
        </select>
        {endIcon && <span className={`right-0 ${iconClasses}`}>{endIcon}</span>}
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default SimpleSelect;
