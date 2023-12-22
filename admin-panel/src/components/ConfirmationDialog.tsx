"use client";

import React from "react";
import Button from "./Button";

const ConfirmationDialog = ({
  width,
  className,
  isOpen,
  onClose,
  title,
  icon,
  message,
  onConfirm,
  isLoading = false,
  confirmText = "CONFIRM",
  buttonsClassName = "grid grid-cols-2 gap-4"
}: {
  title: string;
  icon?: any;
  message: string;
  width?: string;
  children?: React.ReactNode;
  className?: string;
  isOpen?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  confirmText?:string;
  buttonsClassName?:string
}) => {

  return (
    <>
      {isOpen ? (
        <>
          <div className="fixed inset-0 overflow-x-hidden overflow-y-auto z-[1000] ">
            <div
              className={`relative w-full flex justify-between min-h-screen items-center py-10 z-[1]  px-4 mx-auto ${
                width ? width : "max-w-lg"
              }`}
            >
              <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
              <div className="rounded-[20px] relative flex flex-col w-full bg-[#A5A5A8] p-8 ">
                <div className={`relative ${className}`}>
                  <div className="relative flex flex-col gap-3 items-center text-center mb-8">
                    {icon && (
                      <div className="h-28 w-28 rounded-full bg-primary/10 flex items-center justify-center text-5xl text-primary mb-2 ">
                        {icon}
                      </div>
                    )}
                    <h2 className="font-semibold text-2xl">{title}</h2>
                    <p className="text-sm text-secondary max-w-[60%]">
                      {message}
                    </p>
                  </div>
                  <div className="flex justify-center items-center">
                  <div className={` ${buttonsClassName} `}>
                    <Button
                      onClick={() => {
                        onConfirm();
                      }}
                      title={confirmText}
                      type="button"
                      variant="filled"
                      isLoading={isLoading}
                      bg="bg-[#254661]"
                    />
                    <Button
                      onClick={onClose}
                      title={"CANCEL"}
                      type="button"
                      variant="outline"
                      bg="transparent"
                      hoverBg="dark"
                      text="white"
                      hoverText="white"
                      border="dark"
                      hoverBorder="dark"
                    />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default ConfirmationDialog;
