import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface props {
  onClear?: () => void;
  onSelect?: () => void;
  className?: string;
  activeClass?: string;
  label: string;
  isSelected?: boolean;
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
      {props.isSelected && (
        <FontAwesomeIcon
          className="animate-scale-in cursor-pointer mr-1"
          icon={faX}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            props?.onClear && props?.onClear();
          }}
        />
      )}
      {props.label}
    </span>
  );
};
