import { useField } from "formik";
import React, { forwardRef } from "react";

interface props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  rows?: number;
  name?: string;
  className?: string;
  label?: string | React.JSX.Element;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
  isFormikField?: boolean;
}

export const TextArea = forwardRef(
  (
    {
      rows = 5,
      name,
      className,
      label,
      labelProps,
      isFormikField,
      ...restProps
    }: props,
    ref
  ) => {
    const [field, meta] = isFormikField ? useField(name ?? "") : [];

    return (
      <>
        {label && (
          <label
            htmlFor={name}
            className="block text-[16px] font-body text-eduBlack"
            {...labelProps}
          >
            {label}
          </label>
        )}
        <textarea
          id={label && name}
          className={`bg-eduLightGray text-eduBlack rounded-[10px] mt-[10px] p-2 focus-visible:border-none outline-none autofill:active:bg-black font-body placeholder:text-eduBlack/60 ${
            meta?.touched && meta.error ? "border-[1px] border-red-500" : ""
          } ${className}`}
          rows={rows}
          ref={ref as React.RefObject<HTMLTextAreaElement>}
          {...field}
          {...restProps}
        />
        {meta?.touched && meta?.error && (
          <div className="text-red-500">{meta?.error}</div>
        )}
      </>
    );
  }
);
