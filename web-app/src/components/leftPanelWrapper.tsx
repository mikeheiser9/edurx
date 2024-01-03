import React from "react";


interface LeftPanelWrapperProps extends React.HtmlHTMLAttributes<HTMLElement> {
  isSidebarOpen:boolean;
}

export const LeftPanelWrapper = ({
  className,
  isSidebarOpen,
  ...rest
}: LeftPanelWrapperProps) => {
  return (
    <aside
      {...rest}
      className={
        className ||
        `bg-eduLightGray flex flex-col h-full md:rounded-[10px] py-[24px] px-[24px] w-[320px] justify-start gap-3 overflow-y-auto no-scrollbar ipad-under:fixed ${isSidebarOpen ? "ipad-under:left-0" : "ipad-under:-left-full"} ipad-under:top-0 ipad-under:bottom-0  ipad-under:w-[300px]  ipad-under:z-50 ipad-under:p-4 transition-all  duration-500`
      }
    />
  );
};
