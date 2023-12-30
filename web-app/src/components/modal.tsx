import React, { useEffect, useState } from "react";
import { Button } from "./button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { resetModalState } from "@/redux/ducks/modal.duck";

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
  resetReduxModalOnClose?: boolean;
  modalHedaerClassName?: string
}

export const Modal = ({
  showHeader = true,
  showFooter = true,
  showCloseIcon = true,
  ...props
}: ModalProps) => {
  const dispatch = useDispatch();
  const [animationClass, setAnimationClass] = useState("");

  const closeModal = () => {
    if (props.resetReduxModalOnClose) {
      dispatch(resetModalState());
    }
    props.onClose();
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
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
      closeModal();
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
      <div className={`flex p-3 items-center bg-eduDarkGray w-full  ${props.modalHedaerClassName}`}>
        <span className="text-lg ipad-under:text-sm font-medium justify-self-start text-eduLightBlue">
          {props.headerTitle}
        </span>
        {showCloseIcon && (
          <FontAwesomeIcon
            icon={faX}
            onClick={closeModal}
            className="ml-auto font-bold self-center cursor-pointer text-eduBlack"
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
        <Button label="Close" onClick={closeModal} />
      </div>
    );
  };

  return (
    <>
      {props.visible && (
        <div
          className={`fixed top-0 left-0 w-full h-full bg-eduBlack/60 z-50 flex justify-center items-center transition-opacity duration-200 ease-in-out backdrop-filter backdrop-blur-sm backdrop-brightness-50 ${animationClass} ${props.maskClassName}`}
          onClick={handleMaskClick}
        >
          <div
            onClick={handleModalClick}
            className={`flex flex-col bg-white rounded-[10px] md:w-3/4 w-[90%] max-w-[1000px] shadow-lg  h-auto xl:max-h-[80vh] lg:max-h-[80vh] md:max-h-[80vh] sm:max-h-[80vh] max-h-[80vh] overflow-hidden transition-opacity duration-300 ease-in-out ${props.modalClassName}`}
          >
            {showHeader && <Header />}
            <div
              className={
                props.modalBodyClassName ||
                "relative p-4 overflow-y-auto font-body overflow-hidden bg-eduLightGray"
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
