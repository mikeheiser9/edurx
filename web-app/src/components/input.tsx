"use client";
import { useField } from "formik";

interface InputFieldType {
  label?: string;
  name: string;
  type: string;
  placeholder: string;
  className?: string;
}
export default function InputField({ label, ...props }: InputFieldType) {
  const [field, meta] = useField(props);
  return (
    <>
      {label && <label>{label}</label>}
      <div className="flex flex-col">
        <input
          {...props}
          className={`bg-[#3A3A3A] text-white rounded-lg p-2 focus-visible:border-none outline-none ${
            meta.touched && meta.error ? "border-[1px] border-red-500" : ""
          } ${props.className}`}
          {...field}
        />
        {meta.touched && meta.error ? (
          <span className="text-white text-xs first-letter:capitalize flex-shrink-0 opacity-50">
            {meta.error}
          </span>
        ) : null}
      </div>
    </>
  );
}
