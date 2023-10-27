import React from "react";

export const LeftPanelWrapper = ({
  className,
  ...rest
}: React.HtmlHTMLAttributes<HTMLElement>) => {
  return (
    <aside
      {...rest}
      className={
        className ||
        "bg-eduLightGray flex flex-col h-full rounded-md py-[30px] px-[30px] w-1/5 justify-start gap-3 overflow-y-auto no-scrollbar"
      }
    />
  );
};
