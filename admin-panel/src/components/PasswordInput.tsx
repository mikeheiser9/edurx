import React, { useState } from "react";
import cx from "classnames";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { HiInformationCircle } from "react-icons/hi";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";
import { ErrorMessage, useFormikContext } from "formik";


const PasswordInput = ({
  className,
  parentClassName,
  placeholder,
  label = false,
  error = false,
  required = false,
  rounded = false,
  info = false,
  size = "md",
  border = "md",
  disabled = false,
  startIcon = false,
  iconClassName,
  name
}: {
  name: string;
  className?: any;
  parentClassName?: any;
  placeholder?: any;
  label?: any;
  error?: any;
  endIcon?: any;
  icon?: any;
  required?: any;
  rounded?: any;
  info?: any;
  size?: "sm" | "md" | "lg";
  border?: "sm" | "md";
  disabled?: boolean;
  startIcon?: any,
  iconClassName?: string
}) => {

  const { setFieldValue, values, errors } = useFormikContext<any>();


  const classes = cx(
    className,
    `relative bg-white text-dark placeholder:text-dark/30 pl-4 !pr-10 outline-none block text-sm w-full rounded-lg border border-light disabled:bg-light/30`,
    { [`rounded-full`]: rounded },
    { [`rounded`]: !rounded },
    { [`h-9`]: size === "sm" },
    { [`h-10`]: size === "md" },
    { [`h-11`]: size === "lg" },
    { [`border`]: border === "sm" },
    { [`border-2`]: border === "md" }
  );

  const [pwd, setPwd] = useState(false);

  const iconClasses = cx(
    `absolute flex items-center justify-center text-secondary text-xl z-[1] ${iconClassName}`,
    { [`min-w-[36px]`]: size === "sm" },
    { [`min-w-[44px]`]: size === "md" || size === "lg" }
  );



  return (
    <div className={`relative flex flex-col gap-2 w-full xs:mb-5 lg:mb-0 ${parentClassName} `}>
      {label && (
        <label className="flex items-center !text-sm !text-Thirdgrey !font-semibold">
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
        className={`relative flex items-center ${disabled && "opacity-60 pointer-events-none select-none"
          } `}
      >
        {startIcon && (
          <span className={`left-0 ${iconClasses}`}>{startIcon}</span>
        )}
        <input
          type={pwd ? "text" : "password"}
          placeholder={placeholder}
          className={classes}
          disabled={disabled}
          name={name}
          value={values[name]}
          onChange={(e) => {
            setFieldValue(name, e.target.value);
          }}
          autoComplete="new-password" // to restrict auto fill value by browser

        />
        <button
          type="button"
          onClick={() => setPwd(!pwd)}
          className="absolute right-0 text-secondary text-xl z-[1] px-3.5"
        >
          {pwd ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
        </button>
      </div>
      <ErrorMessage name={name}>
        {(msg) => (
          <p className=" text-red-500 text-[12px] font-semibold">{msg}</p>
        )}
      </ErrorMessage>
    </div>
  );
};

export default PasswordInput;
