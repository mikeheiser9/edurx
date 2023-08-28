import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field } from "formik";
import React from "react";

interface option {
  value: string | number;
  label: string;
}
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: option[];
  optionClassName?: string;
  label?: string;
  isClearable?: boolean;
  onClear?: () => void;
  useAsFormikField?: boolean;
}

export const Select = ({
  options,
  optionClassName = "",
  label,
  isClearable,
  onClear,
  useAsFormikField,
  className = "bg-primary text-sm focus:outline-none rounded p-2 py-1 m-auto disabled:opacity-80",
  ...restProps
}: SelectProps) => {
  const OptionTemplate = () => (
    <>
      <option disabled hidden value={label}>
        {label}
      </option>
      {options?.map((option: option) => (
        <option className={`${optionClassName} text-sm p-2`} key={option.value}>
          {option.label}
        </option>
      ))}
    </>
  );
  return (
    <div>
      {isClearable && (
        <div className="flex relative">
          <FontAwesomeIcon
            className="text-white self-center"
            icon={faClose}
            onClick={onClear}
          />
        </div>
      )}
      {useAsFormikField ? (
        <Field {...restProps} className={className} as="select">
          <OptionTemplate />
        </Field>
      ) : (
        <select {...restProps} className={className}>
          <OptionTemplate />
        </select>
      )}
    </div>
  );
};
