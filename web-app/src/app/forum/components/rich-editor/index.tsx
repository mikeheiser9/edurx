import React from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import "./style.css";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export const TextEditor = ({
  setFieldValue,
  value,
}: {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  value: string;
}) => {
  return (
    <ReactQuill
      className="bg-eduDarkGray text-eduBlack rounded-lg min-h-[10rem] my-4 font-body"
      theme="snow"
      placeholder="Text (optional)"
      modules={{
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, 7] }],
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
  );
};
