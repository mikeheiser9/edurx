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
  parentClass?:string;
}

export default function InputField({
  label,
  icon,
  labelProps,
  mandatory,
  iconContainerClass,
  isFormikField = true,
  parentClass,
  ...props
}: InputFieldType): React.JSX.Element {
  // const [field, meta] = isFormikField ? useField(props) : [];
  const [field, meta] = isFormikField ? useField(props) : [{}, {}];

  return (
    <div className={
      parentClass
        ? parentClass
        : ""
    }>
      {label && (
        <label
          htmlFor={props.name}
          className="block mt-4 mb-2 md:text-[16px] md:leading-normal text-xs text-eduBlack font-body"
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
          className={`bg-eduLightGray font-body text-eduBlack rounded-lg p-2 focus-visible:border-none outline-none autofill:active:bg-black ${
            meta && meta.touched && meta.error
              ? "border-[1px] border-[#FF0000]"
              : ""
          } ${props.className}`}
          // className={`bg-eduLightGray text-eduBlack rounded-lg p-2 focus-visible:border-none outline-none autofill:active:bg-black ${
          //   meta.touched && meta.error ? "border-[1px] border-red-500" : ""
          // } ${props.className}`}
          {...field}
        />
        {meta?.touched && meta.error ? (
          <span className="text-xs ipad-under:text-10px font-body mt-1 first-letter:capitalize flex-shrink-0 opacity-50 text-[#FF0000] font-[500]">
            {meta.error}
          </span>
        ) : null}
      </div>
    </div>
  );
}
