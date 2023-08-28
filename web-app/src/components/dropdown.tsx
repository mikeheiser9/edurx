import React, { useState } from "react";

interface option {
  value: string;
  label: string;
}
interface DropDownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: option[];
  optionClassName?: string;
  label: string;
}

export const DropDown = ({
  options,
  optionClassName = "",
  label,
  ...restProps
}: DropDownProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <>
      {/* <select
        {...restProps}
        className="bg-primary rounded p-2 m-auto disabled:opacity-80 "
      >
        {options?.map((option: option) => (
          <option className={`${optionClassName} active:bg-red-50 focus:bg-red-50 selection:bg-red-50 p-2`} key={option.value}>
            {option.label}
          </option>
        ))}
      </select> */}

      <button
        className={`${
          visible ? "rounded-t" : "rounded"
        } focus:outline-none focus:ring-blue-300 text-sm p-2.5 text-center inline-flex items-center bg-primary`}
        type="button"
        onClick={() => setVisible(!visible)}
      >
        {label}
        <svg
          className="w-2.5 h-2.5 ml-2.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      <div
        className={`${
          visible ? "visible rounded-b" : "hidden"
        } z-10 absolute divide-y divide-gray-100 bg-primary`}
      >
        <ul className="py-2 text-sm">
          {options?.map((option: option) => (
            <li className={`${optionClassName}`} key={option.value}>
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
