import React from "react";
import cx from "classnames";

const Chip = ({
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
  isNotSwitch = false,
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
  isNotSwitch?: boolean;
}) => {
  const checkWrapClass = cx(
    `relative flex items-center border border-light bg-white rounded-full peer-checked:bg-primary peer-checked:border-primary transition-all duration-300 peer-disabled:grayscale`,
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
    <>
      {isNotSwitch ? (
        <div
          className={`relative w-fit h-fit ${parentClassName ? parentClassName : ""}`}
        >
          <input
            type="checkbox"
            className={`peer rounded appearance-none  absolute inset-0 opacity-0 cursor-pointer ${size}`}
            name=""
            id=""
            {...register}
            defaultChecked={isSwitch}
            disabled={disabled}
          />
          <span className="inline-block py-6px px-3 border-2 border-solid border-Fourgrey font-semibold w-fit text-Thirdgrey text-13 leading-5 rounded-full cursor-pointer peer-checked:text-white peer-checked:bg-lightBlack peer-checked:border-lightBlack transition-all duration-300">
            {label ? label : 'no label'}
          </span>
        </div>
      ) : (
        <div className={`relative flex flex-col  gap-2 ${parentClassName ? parentClassName : ''}`}>
          <label className={`flex items-center gap-3 cursor-pointer`}>
            {labelFirst && label ? (
              <p className={`${labelClassName} font-hauora font-bold`}>
                {label}
              </p>
            ) : (
              ""
            )}
            <span
              className={`relative flex items-center ${
                disabled && "opacity-60 pointer-events-none select-none"
              } `}
            >
              <input
                type="checkbox"
                className={` peer rounded appearance-none  absolute inset-0 opacity-0 ${size}`}
                name=""
                id=""
                {...register}
                defaultChecked={isSwitch}
                disabled={disabled}
              />
              <span className={checkWrapClass}></span>
              <span className={checkClass}></span>
            </span>
            {!labelFirst && label ? (
              <p className={`${labelClassName} font-hauora font-bold`}>
                {label}
              </p>
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
      )}
    </>
  );
};

export default Chip;
