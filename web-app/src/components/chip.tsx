import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface props {
  onClear?: () => void;
  onSelect?: () => void;
  className?: string;
  activeClass?: string;
  label: string;
  isSelected: boolean;
}

export const Chip = (props: props): React.ReactElement => {
  return (
    <span
      className={`${props.className || "p-1 text-sm text-white rounded-md"} ${
        props.isSelected
          ? props.activeClass || "bg-primary/50"
          : "bg-primary/25"
      }`}
      onClick={() => {
        if (props.isSelected) return;
        props?.onSelect && props?.onSelect();
      }}
    >
      <FontAwesomeIcon
        className={`${
          props.isSelected ? "visible" : "hidden"
        } animate-scale-in cursor-pointer`}
        icon={faXmarkCircle}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          props?.onClear && props?.onClear();
        }}
      />
      {props.label}
    </span>
  );
};
