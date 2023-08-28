import { useField } from "formik";
import React from "react";

interface props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  rows?: number;
  name?: string;
  className?: string;
  label?: string | React.JSX.Element;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
  isFormikField?: boolean;
}

export const TextArea = ({
  rows = 5,
  name,
  className,
  label,
  labelProps,
  isFormikField,
  ...restProps
}: props) => {
  const [field, meta] = isFormikField ? useField(name ?? "") : [];

  return (
    <>
      {label && (
        <label
          htmlFor={name}
          className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white/50"
          {...labelProps}
        >
          {label}
        </label>
      )}
      <textarea
        id={label && name}
        className={`bg-[#3A3A3A] text-white rounded-lg p-2 focus-visible:border-none outline-none autofill:active:bg-black ${
          meta?.touched && meta.error ? "border-[1px] border-red-500" : ""
        } ${className}`}
        rows={rows}
        {...field}
        {...restProps}
      />
      {meta?.touched && meta?.error && (
        <div className="text-red-500">{meta?.error}</div>
      )}
    </>
  );
};
