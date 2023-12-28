import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import SectionLoader from "./SectionLoader";

const Dialog = ({
  width,
  children,
  className,
  isOpen,
  closeIcon = true,
  onClose,
  title,
  minHight = "h-auto",
  isLoading,
  showDivisonLine = true,
}: {
  width?: string;
  children?: any;
  className?: string;
  minHight?: string;
  isOpen?: boolean;
  closeIcon?: boolean;
  onClose: () => void;
  title?: string;
  isLoading?: boolean;
  showDivisonLine?: boolean;
}) => {
  return (
    <>
      {isOpen ? (
        <>
          <div className="fixed inset-0 overflow-x-hidden overflow-y-auto z-[99] ">
            <div
              className={`relative w-full flex justify-between min-h-screen items-center py-10 z-[1]  px-4 mx-auto ${
                width ? width : "max-w-3xl"
              }`}
            >
              <div
                className="fixed inset-0 bg-white/50 backdrop-blur-sm"
                onClick={onClose}
              />
              <div
                className={`${
                  isLoading && minHight
                } rounded-2xl relative flex flex-col w-full bg-[#A5A5A8] p-8 shadow-[0px_8px_28px_0px_rgba(0,0,0,0.10)]`}
              >
                {isLoading ? (
                  <SectionLoader
                    size="h-10 w-10"
                    className="inset-[unset] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  />
                ) : (
                  <>
                    {title || closeIcon ? (
                      <div className="relative  flex items-center pr-6 ">
                        {title && (
                          <h3 className="font-semibold text-dark text-xl uppercase text-ellipsis whitespace-nowrap overflow-hidden mr-5">
                            {title}
                          </h3>
                        )}
                        {closeIcon && (
                          <button
                            className="absolute right-0 text-dark text-xl hover:text-primary hover:rotate-180 transition-all duration-500 p-2 bg-gray-300 rounded-md"
                            onClick={onClose}
                          >
                            <AiOutlineClose />
                          </button>
                        )}
                      </div>
                    ) : null}
                    {showDivisonLine && (
                      <hr className="my-5 w-full h-0.5 bg-eightgrey"></hr>
                    )}
                    <div className={`relative ${className}`}>{children}</div>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* <div className="fixed inset-0 overflow-x-hidden overflow-y-auto z-[99] ">
            <div
              className={`relative w-full flex justify-between min-h-screen items-center py-10 z-[1]  px-4 mx-auto ${
                width ? width : "max-w-3xl"
              }`}
            >
              <div
                className="fixed inset-0 bg-white/50 backdrop-blur-sm"
                onClick={onClose}
              />
              <div className="rounded-[20px] relative flex flex-col w-full bg-white p-8 shadow-[0px_8px_28px_0px_rgba(0,0,0,0.10)] ">
                {title || closeIcon ? (
                  <div className="relative  flex items-center mb-7 pr-6">
                    {title && (
                      <h3 className="font-semibold text-dark text-xl">
                        {title}
                      </h3>
                    )}
                    {closeIcon && (
                      <button
                        className="absolute right-0 text-dark text-xl hover:text-primary hover:rotate-180 transition-all duration-500"
                        onClick={onClose}
                      >
                        <AiOutlineClose />
                      </button>
                    )}
                  </div>
                ) : null}
                <div className={`relative ${className}`}>{children}</div>
              </div>
            </div>
          </div>
          <div>
            <SectionLoader size="h-10 w-10" />
          </div> */}
        </>
      ) : null}
    </>
  );
};

export default Dialog;
