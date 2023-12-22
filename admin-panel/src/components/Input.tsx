import React from "react";
import cx from "classnames";
import { HiInformationCircle } from "react-icons/hi";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";
import { ErrorMessage, useFormikContext } from "formik";


interface InputProps {
  name: string;
  type?: string;
  className?: string;
  labelClassName?: string;
  parentClassName?: string;
  placeholder?: string;
  label?: string;
  labelIcon?: any;
  error?: string;
  required?: boolean;
  startIcon?: any;
  endIcon?: any;
  rounded?: any;
  size?: "sm" | "md" | "lg";
  border?: "sm" | "md";
  info?: any;
  items?: { title: string; is_available: boolean };
  value?: string;
  disabled?: boolean;
  step?: string;
  defaultValue?: string;
  handleKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  iconClassName?: string;
}
const Input: React.FC<InputProps> = ({
  name,
  type = "text",
  labelClassName = "",
  parentClassName = "",
  placeholder,
  label = "",
  labelIcon = false,
  error = "",
  className = "",
  required = false,
  startIcon = false,
  endIcon = false,
  rounded = false,
  size = "md",
  border = "md",
  info = false,
  items,
  value,
  disabled = false,
  step,
  defaultValue,
  handleKeyPress,
  iconClassName,
}) => {

  const { setFieldValue, values, errors} = useFormikContext<any>();

  const classes = cx(
    className,
    `relative bg-white text-dark placeholder:text-dark/30 outline-none block text-sm px-4 w-full !px-3 font-semibold border-2 rounded-lg border-Fourgrey hover:border-Fourgrey focus:border-Fourgrey disabled:bg-light/30`,
    { [`rounded-full`]: rounded },
    { [`rounded`]: !rounded },
    { [`rounded-lg`]: rounded },
    { [`h-9`]: size === "sm" },
    { [`h-10`]: size === "md" },
    { [`h-11`]: size === "lg" },
    { [`border`]: border === "sm" },
    { [`border-2`]: border === "md" },
    { [`pl-10`]: startIcon },
    { [`pr-10`]: startIcon }
  );

  const iconClasses = cx(
    `absolute flex items-center justify-center text-secondary text-xl z-[1] ${iconClassName}`,
    { [`min-w-[36px]`]: size === "sm" },
    { [`min-w-[44px]`]: size === "md" || size === "lg" }
  );

  return (
    <>
      <div
        className={`relative flex flex-col gap-2 w-full xs:mb-5 lg:mb-2 ${parentClassName} `}
      >
        {label && (
          <label
            className={`flex items-center !text-sm !text-Thirdgrey !font-semibold ${labelClassName} `}
          >
            {labelIcon && <span>{labelIcon}</span>}
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
          className={`relative flex items-center ${disabled && "opacity-60 pointer-events-none select-none"
            } `}
        >
          {startIcon && (
            <span className={`left-0 ${iconClasses}`}>{startIcon}</span>
          )}
          <input
            name={name}
            defaultValue={defaultValue}
            value={values[name]}
            type={type}
            placeholder={placeholder}
            className={classes}
            disabled={disabled}
            onChange={(e) => {
              setFieldValue(name, e.target.value);
            }}
            step={step}
            onKeyPress={handleKeyPress}
          />
          {endIcon && (
            <span className={`right-0 ${iconClasses}`}>{endIcon}</span>
          )}
        </div>
        <ErrorMessage name={name}>
          {(msg) => (
            <p className=" text-red-600 text-[12px] font-semibold">{msg}</p>
          )}
        </ErrorMessage>
           {/* <p className=" text-red-500 text-[12px] font-semibold">khasjkghasjkfhjkhsfjkhaskjhfh</p> */}
      </div>
    </>
  );
};

export default Input;
