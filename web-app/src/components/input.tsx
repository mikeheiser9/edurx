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
          className="block mt-4 mb-2 text-[16px] text-eduBlack font-body"
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
              : "absolute self-end px-2 mt-[5px]"
          }
        >
          {icon}
        </div>
        <input
          id={label && props.name}
          {...props}
          className={`bg-eduLightGray text-eduBlack rounded-lg p-2 focus-visible:border-none outline-none placeholder:text-eduBlack/60 font-body ${
            meta?.touched && meta.error ? "border-[1px] border-red-500" : ""
          } ${props.className}`}
          {...field}
        />
        {meta?.touched && meta.error ? (
          <span className="text-eduBlack/50 text-xs font-body first-letter:capitalize flex-auto flex flex-wrap mt-[3px]">
            {meta.error}
          </span>
        ) : null}
      </div>
    </>
  );
}
