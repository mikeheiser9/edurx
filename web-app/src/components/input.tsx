"use client";
import { useField } from "formik";
import React, { LabelHTMLAttributes, InputHTMLAttributes } from "react";
interface InputFieldType extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  className?: string;
  icon?: React.JSX.Element;
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
  mandatory?: boolean;
  iconContainerClass?: string;
  isFormikField?: boolean;
}

export default function InputField({
  label,
  icon,
  labelProps,
  mandatory,
  iconContainerClass,
  isFormikField = true,
  ...props
}: InputFieldType): React.JSX.Element {
  const [field, meta] = isFormikField ? useField(props) : [];

  return (
    <>
      {label && (
        <label
          htmlFor={props.name}
          className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white/50"
          {...labelProps}
        >
          {label}
          {mandatory && <sup>&nbsp;*</sup>}
        </label>
      )}
      <div className="flex flex-col">
        <div
          className={
            iconContainerClass
              ? iconContainerClass
              : "absolute self-end px-2 mt-[.65rem]"
          }
        >
          {icon}
        </div>
        <input
          id={label && props.name}
          {...props}
          className={`bg-[#3A3A3A] text-white rounded-lg p-2 focus-visible:border-none outline-none autofill:active:bg-black ${
            meta?.touched && meta.error ? "border-[1px] border-red-500" : ""
          } ${props.className}`}
          {...field}
        />
        {meta?.touched && meta.error ? (
          <span className="text-white text-xs first-letter:capitalize flex-auto flex flex-wrap opacity-50">
            {meta.error}
          </span>
        ) : null}
      </div>
    </>
  );
}
