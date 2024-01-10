import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";
import { HiInformationCircle } from "react-icons/hi";
import { Placement } from "@floating-ui/react";

const CustomTooltip = ({
  placement,
  children,
}: {
  placement: Placement;
  children: React.ReactNode | string;
}) => {
  return (
    <Tooltip placement={placement}>
      <TooltipTrigger className="relative">
        <HiInformationCircle className="text-primary text-base cursor-help" />
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  );
};

export default CustomTooltip;
