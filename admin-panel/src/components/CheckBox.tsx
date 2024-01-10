import React from "react";
import cx from "classnames";
import { HiCheck } from "react-icons/hi";
import { DotFilled } from "./Icons";

const CheckBox = ({
  label = false,
  isSwitch = false,
  parentClassName,
  labelClassName,
  size = "md",
  border = "md",
  register,
  error,
  labelFirst = false,
  disabled = false,
  onChange,
  checked = false,
  defaultChecked = false,
  checkboxKey,
  with_register = true,
  value = false,
  with_value = false,
  rounded = false,
  name,
  errorClass,
  labelClassNameWithCheckBox,
  
}: {
  label?: any;
  isSwitch?: any;
  parentClassName?: any;
  labelClassName?: any;
  size?: "sm" | "md" | "lg";
  border?: "sm" | "md";
  register?: any;
  error?: any;
  labelFirst?: any;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
  defaultChecked?: boolean;
  checkboxKey?: string;
  with_register?: boolean;
  value?: boolean | string;
  with_value?: boolean;
  rounded?: boolean;
  name?: string;
    errorClass?: string;
    labelClassNameWithCheckBox?: string;
}) => {
  const checkWrapClass = cx(
    `relative flex items-center border border-bor-light/90 bg-white rounded transition-all duration-300 overflow-hidden `,
    { [`h-4 w-4`]: size === "sm" },
    { [`h-5 w-5`]: size === "md" },
    { [`h-6 w-6`]: size === "lg" },
    { [`border`]: border === "sm" },
    { [`border-2`]: border === "md" },
    { [`rounded-full`]: rounded },
    { [`rounded`]: !rounded }
  );
  const checkClass = cx(
    `absolute flex items-center justify-center inset-0 peer-checked:bg-primary rounded scale-0 peer-checked:scale-100 transition-all text-white peer-disabled:grayscale`,
    { [`text-xs`]: size === "sm" },
    { [`text-sm`]: size === "md" || size === "lg" },
    { [`rounded-full`]: rounded },
    { [`rounded`]: !rounded }
  );

  return (
    <div
      className={`checkWrap relative flex justify-center flex-col gap-2 ${parentClassName}`}
    >
      <label
        className={`flex items-center gap-2 ${
          isSwitch ? "isSwitch" : ""
        }  ${labelClassNameWithCheckBox}`}
      >
        {labelFirst && label ? (
          <p className={`${labelClassName} font-hauora font-bold`}>{label}</p>
        ) : (
          ""
        )}
        <span
          className={`relative flex items-center ${
            disabled && "opacity-60 pointer-events-none select-none"
          } `}
        >
          {with_register ? (
            <>
              <input
                type="checkbox"
                className={`peer rounded appearance-none absolute inset-0 opacity-0 ${size}`}
                name=""
                id=""
                onClick={onChange}
                {...register}
                // value={with_value ? !!value : label}
                value={name || label}
                disabled={disabled}
                defaultChecked={!!checked}
                // checked={with_value ? value == ("true" || true) : checked}
                key={checkboxKey}
              />
            </>
          ) : (
            <>
              <input
                type="checkbox"
                className={`peer rounded appearance-none absolute inset-0 opacity-0 ${size}`}
                name=""
                id=""
                onChange={onChange}
                {...register}
                value={name || label}
                disabled={disabled}
                checked={checked || defaultChecked}
                // defaultChecked={defaultChecked}
                key={checkboxKey}
              />
            </>
          )}

          <span className={checkWrapClass}></span>
          <span className={checkClass}>
            {!rounded ? <HiCheck /> : <DotFilled />}
          </span>
        </span>
        {!labelFirst && label ? (
          <p className={`${labelClassName} font-hauora font-bold`}>{label}</p>
        ) : (
          ""
        )}
      </label>
      {error && (
        <div className={`flex w-full ${errorClass}`}>
          <p className="text-red-500 text-xs">{error}</p>
        </div>
      )}
    </div>
  );
};

export default CheckBox;
