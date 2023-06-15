"use client";
import Image from "next/image";

interface componentProps {
  icon: string;
  title: string;
  isDisabled: boolean;
  onClick: () => void;
}

export const AccountCard = (props: componentProps) => {
  return (
    <div
      className={`flex flex-col items-center bg-[#FDCD26] p-4 ${
        props.isDisabled ? "cursor-not-allowed opacity-60" : ""
      }`}
      onClick={() => {
        if (props.isDisabled) return;
        props.onClick();
      }}
      role="button"
      aria-disabled={props.isDisabled}
    >
      <Image className="h-10 w-10 my-2" src={props.icon} alt={"icon"} />
      <div className="flex flex-col">
        <label className="font-bold">{props.title}</label>
      </div>
    </div>
  );
};
