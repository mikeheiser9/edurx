import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";

const TextTooltip = ({
  text,
  length,
  className,
}: {
  text: string;
  length: number;
  className?: string;
}) => {
  return (
    <Tooltip placement="top">
      <TooltipTrigger>
        <div
          className={`${
            className ?? "text-base text-lightBlack font-hauora "
          } flex items-center gap-2.5 `}
        >
          {text}
        </div>
      </TooltipTrigger>
      {text.length > length && <TooltipContent>{text}</TooltipContent>}
    </Tooltip>
  );
};

export default TextTooltip;
