import React, { useEffect, useState } from "react";
import { Button } from "./button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  showHeader?: boolean;
  showFooter?: boolean;
  headerTitle?: string;
  children: React.ReactElement;
  customHeader?: React.ReactElement;
  customFooter?: React.ReactElement;
  maskClassName?: string;
  modalClassName?: string;
  modalBodyClassName?: string;
  closeOnOutsideClick?: boolean;
  showCloseIcon?: boolean;
  closeOnEscape?: boolean;
}

export const Modal = ({
  showHeader = true,
  showFooter = true,
  showCloseIcon = true,
  ...props
}: ModalProps) => {
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        props.onClose();
      }
    };
    if (props.visible) {
      document.body.style.overflowY = "hidden";
      setAnimationClass("opacity-100 pointer-events-auto");
      props.closeOnEscape && document.addEventListener("keydown", handleEscape);
    } else {
      document.body.style.overflowY = "auto";
      setAnimationClass("opacity-0 pointer-events-none");
    }
    return () => {
      props.closeOnEscape &&
        document.removeEventListener("keydown", handleEscape);
    };
  }, [props.visible]);

  const handleMaskClick = () => {
    if (props.closeOnOutsideClick) {
      props.onClose();
    }
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (props.closeOnOutsideClick) {
      e.stopPropagation();
    }
  };

  const Header = () => {
    if (props.customHeader) {
      return props.customHeader;
    }
    return (
      <div className="flex p-3 items-center bg-primary">
        <span className="text-xl font-medium justify-self-start">
          {props.headerTitle}
        </span>
        {showCloseIcon && (
          <FontAwesomeIcon
            icon={faXmark}
            onClick={props.onClose}
            className="cursor-pointer ml-auto"
          />
        )}
      </div>
    );
  };

  const Footer = () => {
    if (props.customFooter) {
      return props.customFooter;
    }
    return (
      <div className="flex self-end justify-end p-3 bg-primary-dark">
        <Button label="Close" onClick={props.onClose} />
      </div>
    );
  };

  return (
    <>
      {props.visible && (
        <div
          className={`fixed top-0 left-0 w-full h-full bg-eduBlack/60 z-50 flex justify-center items-center transition-opacity duration-300 ease-in-out backdrop-filter backdrop-blur-sm backdrop-brightness-50 ${animationClass} ${props.maskClassName}`}
          onClick={handleMaskClick}
        >
          <div
            onClick={handleModalClick}
            className={`flex flex-col bg-white rounded-[10px] w-3/4 max-w-[1000px] shadow-lg  h-auto xl:max-h-[80vh] lg:max-h-[80vh] md:max-h-[80vh] sm:max-h-[80vh] max-h-[80vh] overflow-hidden transition-opacity duration-300 ease-in-out ${props.modalClassName}`}
          >
            {showHeader && <Header />}
            <div
              className={
                props.modalBodyClassName ||
                "relative p-4 overflow-y-auto overflow-hidden bg-eduDarkGray"
              }
            >
              {props.children}
            </div>
            {showFooter && <Footer />}
          </div>
        </div>
      )}
    </>
  );
};
