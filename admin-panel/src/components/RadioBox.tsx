import React from "react";
import cx from "classnames";
import { HiCheck } from "react-icons/hi";

const RadioBox = ({
  label = false,
  isSwitch = false,
  parentClassName,
  labelClassName,
  size = "md",
  border = "md",
  error,
  value,
  labelFirst = false,
  required = false,
  disabled = false,
  name = "",
  onChange,
  isChecked,
}: {
  label?: any;
  isSwitch?: any;
  parentClassName?: any;
  labelClassName?: any;
  size?: "sm" | "md" | "lg";
  border?: "sm" | "md";
  value?: string;
  error?: any;
  required?: boolean;
  labelFirst?: any;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  isChecked?: boolean
}) => {
  const checkWrapClass = cx(
    `relative flex items-center border border-dark/20 bg-white rounded-full transition-all duration-300 overflow-hidden `,
    { [`h-4 w-4`]: size === "sm" },
    { [`h-5 w-5`]: size === "md" },
    { [`h-6 w-6`]: size === "lg" },
    { [`border`]: border === "sm" },
    { [`border-2`]: border === "md" }
  );
  const checkClass = cx(
    `absolute flex items-center justify-center inset-0 peer-checked:bg-primary rounded-full scale-0 peer-checked:scale-100 transition-all text-white peer-disabled:grayscale`,
    { [`text-xs`]: size === "sm" },
    { [`text-sm`]: size === "md" || size === "lg" }
  );

  return (
    <div
      className={`checkWrap relative flex flex-col gap-2 mb-2 ${parentClassName}`}
    >
      <label
        className={`flex items-center gap-2 ${isSwitch ? "isSwitch" : ""}`}
      >
        {labelFirst && label ? (
          <p className={`${labelClassName} font-hauora font-semibold`}>{label}</p>
        ) : (
          ""
        )}
        <span
          className={`relative flex items-center ${
            disabled && "opacity-60 pointer-events-none select-none"
          } `}
        >
          <input
            type="radio"
            className={`peer rounded-full appearance-none absolute inset-0 opacity-0 ${size}`}
            name={name}
            id=""
            onChange={onChange}
            value={value}
            checked={isChecked}
            disabled={disabled}
          />
          <span className={checkWrapClass}></span>
          <span className={checkClass}>
            <HiCheck />
          </span>
        </span>
        {!labelFirst && label ? (
          <p className={`${labelClassName} font-hauora font-normal`}>{label} {required && <span className="text-red-500 font-medium">*</span>}</p>
        ) : (
          ""
        )}
      </label>
      {error && (
        <div className={`flex w-full`}>
          <p className="text-red-500 text-xs">{error}</p>
        </div>
      )}
    </div>
  );
};

export default RadioBox;
