import React from "react";
import cx from "classnames";

const Switch = ({
  label = false,
  parentClassName,
  labelClassName,
  size = "md",
  border = "md",
  register,
  error,
  labelFirst = false,
  isSwitch = false,
  disabled = false,
  onChange,
  watch_register = false,
  checkWrapClassName
}: {
  label?: any;
  parentClassName?: any;
  labelClassName?: any;
  size?: "sm" | "md" | "lg";
  border?: "sm" | "md";
  register?: any;
  error?: any;
  labelFirst?: any;
  isSwitch?: boolean;
  disabled?: boolean;
  onChange?: (...event: any[]) => void;
    watch_register?: boolean;
    checkWrapClassName?:string
}) => {
  const checkWrapClass = cx(
    `relative flex items-center border border-light bg-white rounded-full peer-checked:bg-primary peer-checked:border-primary transition-all duration-300 ${checkWrapClassName}  `,
    { [`h-4 w-8`]: size === "sm" },
    { [`h-5 w-9`]: size === "md" },
    { [`h-6 w-11`]: size === "lg" },
    { [`border`]: border === "sm" },
    { [`border-2`]: border === "md" }
  );
  const checkClass = cx(
    `absolute left-1 right-auto bg-secondary/60 rounded-full peer-checked:bg-white peer-checked:left-auto peer-checked:right-1 z-[1] transition-all duration-300`,
    { [`h-2.5 w-2.5`]: size === "sm" },
    { [`h-3 w-3`]: size === "md" },
    { [`h-4 w-4`]: size === "lg" }
  );

  return (
    <div className={`relative inline-block gap-2 ${parentClassName}`}>
      <label
        className={`flex items-center gap-3 ${
          disabled ? "cursor-not-allowed":"cursor-pointer"
        } `}
      >
        {labelFirst && label ? (
          <p className={`${labelClassName} font-hauora font-bold`}>{label}</p>
        ) : (
          ""
        )}
        <span
          className={`relative flex items-center ${
            disabled && "pointer-events-none select-none"
          } `}
        >
          {watch_register ? (
            <input
              type="checkbox"
              className={` peer rounded appearance-none  absolute inset-0 opacity-0 ${size}`}
              name=""
              id=""
              {...register}
              defaultChecked={isSwitch}
              disabled={disabled}
            />
          ) : (
            <input
              type="checkbox"
              className={`peer rounded appearance-none  absolute inset-0 opacity-0 ${size}`}
              name=""
              id=""
              {...register}
              onChange={onChange}
              defaultChecked={isSwitch}
              disabled={disabled}
            />
          )}
          <span className={checkWrapClass}></span>
          <span className={checkClass}></span>
        </span>
        {!labelFirst && label ? (
          <p className={`${labelClassName} font-hauora font-bold`}>{label}</p>
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

export default Switch;
