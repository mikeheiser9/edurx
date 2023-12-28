import React from "react";
import { IoCloseCircle } from "react-icons/io5";

interface props {
  onClear?: () => void;
  onSelect?: () => void;
  className?: string;
  activeClass?: string;
  label: string;
  isSelected?: boolean;
  disabled?:boolean
}

export const Chip = (props: props): React.ReactElement => {
  return (
    <span
      className={`${props.disabled && "opacity-60 pointer-events-none select-none"}  capitalize flex gap-2 py-2 mb-2 px-3 font-semibold w-fit text-Thirdgrey text-13 leading-5 cursor-pointer bg-yellow-500 transition-all duration-300"`}
      onClick={() => {
        if (props.isSelected) return;
        props?.onSelect && props?.onSelect();
      }}
    >
      {props.label}
      {props.isSelected && (
        <IoCloseCircle
          className="animate-scale-in cursor-pointer mr-1 h-5 w-5"
          onClick={(e:any) => {
            e.preventDefault();
            e.stopPropagation();
            props?.onClear && props?.onClear();
          }}
        />
      )}
      
    </span>
  );
};
