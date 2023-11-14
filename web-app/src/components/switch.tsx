import React, { InputHTMLAttributes } from "react";

export const Switch = (inputProps: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" {...inputProps} />
      <div className="w-[3.6rem] h-6 bg-transparent peer-focus:outline-none 
      rounded-full peer border-2 border-eduYellow peer-checked:after:translate-x-full
       before:text-white after:absolute peer-checked:after:left-[17px] 
       after:left-[1px] after:bg-eduYellow after:rounded-full after:h-5
        after:w-5 after:transition-all peer-checked:bg-eduBlack" />
    </label>
  );
};
