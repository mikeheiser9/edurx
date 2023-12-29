import React from "react";
import { IoCloseCircle } from "react-icons/io5";

interface props {
  onClear?: () => void;
  onSelect?: () => void;
  className?: string;
  activeClass?: string;
  label: string;
  isSelected?: boolean;
  disabled?: boolean;
}

export const Chip = (props: props): React.ReactElement => {
  return (
    <span
      className={`${
        props.disabled && "opacity-60 pointer-events-none select-none"
      }  capitalize py-2.5 px-3 rounded-md font-semibold text-Thirdgrey text-13 leading-5 cursor-pointer bg-yellow-500 transition-all duration-300 w-full`}
      onClick={() => {
        if (props.isSelected) return;
        props?.onSelect && props?.onSelect();
      }}
    >
      <div className="flex items-center gap-2">
        <p className="overflow-hidden whitespace-nowrap text-ellipsis">{props.label}</p> 
        <div className="h-5 w-5">
        {props.isSelected && (
          <IoCloseCircle
            className="animate-scale-in cursor-pointer h-5 w-5"
            onClick={(e: any) => {
              e.preventDefault();
              e.stopPropagation();
              props?.onClear && props?.onClear();
            }}
          />
        )}
        </div>
      </div>
    </span>
  );
};
