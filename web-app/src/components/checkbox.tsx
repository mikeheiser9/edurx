import React, { InputHTMLAttributes } from "react";

export const Checkbox = (props: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div className="relative flex justify-center items-center">
      <input
        type="checkbox"
        className="w-4 h-4 transition-colors duration-100 ease-in-out peer shrink-0 focus:outline-eduYellow appearance-none rounded-md bg-eduDarkGray checked:bg-eduYellow"
        {...props}
      />
      <svg
        className="absolute peer-checked:!fill-eduBlack fill-eduDarkGray transition-colors duration-100 ease-in-out left-0 inline w-4 h-4 p-0.5 pointer-events-none "
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        clip="10"
      >
        <path
          //   fill="currentColor"
          d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
        />
      </svg>
    </div>
  );
};
