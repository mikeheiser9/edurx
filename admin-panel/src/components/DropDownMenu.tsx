"use client";
import React, { useState, ReactNode } from "react";

export default function DropdownMenu({
  show,
  children,
  scrollPixel,
  parentHeight,
}: {
  show: boolean;
  children: ReactNode;
  scrollPixel: number;
  parentHeight: number;
}) {
  const [isDropDownHover, setIsDropDownHover] = useState(false);
  const calc = parentHeight - 16 - scrollPixel;
  const dynamicTransform = `translate(58px, ${calc}px)`;
  return (
    <div
      className={`absolute z-[99999]  top-0 translate-x-[58px] translate-y-[512px] bg-white rounded-md shadow-tippy text-dark text-sm font-medium max-w-md break-all ease-in-out origin-[-8px_26px] ${
        scrollPixel !== 0 ? "duration-0" : "duration-250"
      } transition-transform  ${
        scrollPixel === 0
          ? show
            ? "!scale-100"
            : "!scale-0"
          : show
          ? "scale-100"
          : "!scale-0"
      }`}
      style={{
        transform: dynamicTransform, // Corrected style attribute
      }}
      onMouseEnter={() => setIsDropDownHover(true)}
      onMouseLeave={() => setIsDropDownHover(false)}
    >
      <ul className="px-4 py-3">{children}</ul>
      <svg
        className="fill-white absolute -left-4 rotate-90 top-2/4 -translate-y-2/4"
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 16 16"
      >
        <path stroke="none" d="M0,0 H16 L10,6 Q8,8 6,6 Z"></path>
        <clipPath id=":r1h:">
          <rect x="0" y="0" width="16" height="16"></rect>
        </clipPath>
      </svg>
    </div>
  );
}
