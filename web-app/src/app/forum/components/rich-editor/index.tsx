import React from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import "./style.css";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export const TextEditor = ({
  setFieldValue,
  value,
  error,
  isTouched,
}: {
  setFieldValue: (
    field: string,
    value: string,
    shouldValidate?: boolean
  ) => void;
  value: string;
  error: string | undefined;
  isTouched: boolean | undefined;
}) => {
  return (
    <>
      <ReactQuill
        className="bg-eduLightGray text-eduBlack rounded-lg min-h-[10rem] my-4 font-body relative"
        theme="snow"
        placeholder="Text (optional)"
        modules={{
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [
              "bold",
              "italic",
              "underline",
              "strike", // "blockquote"
            ],
            [
              { list: "ordered" },
              { list: "bullet" },
              { indent: "-1" },
              { indent: "+1" },
            ],
            ["image", "code-block", "align"],
            ["clean"],
          ],
        }}
        value={value}
        onChange={(value) => setFieldValue("content", value)}
      />
      {error && isTouched ? (
        <span className="ml-1 relative top-[-10px] text-xs font-body first-letter:capitalize flex-shrink-0 opacity-50 text-[#FF0000] font-[500]">
          {error}
        </span>
      ) : null}
    </>
  );
};


