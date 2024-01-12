import React from "react";

interface TypeNoDataProps {
    title : string
}

const NoDataComponent = (props:TypeNoDataProps) => {
    const { title } = props
  return (
    <div className="flex w-full p-4 rounded-[10px] bg-eduLightGray border-[1px] border-[#13222A] gap-2 justify-center">
      <span>{title}</span>
    </div>
  );
};

export default NoDataComponent;
