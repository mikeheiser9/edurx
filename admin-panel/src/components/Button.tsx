import React from "react";
import cx from "classnames";
import CodeLink from "./CodeLink";

const Button = ({
  isLink = false,
  href,
  className = "",
  title,
  icon = false,
  iconFirst = false,
  variant,
  size = "md",
  borderSize = "sm",
  onClick,
  active = false,
  isSquare = false,
  titleClassName,
  type,
  disabled,
  isLoading = false,
  rounded = false,
  text = "white",
  hoverText = "white",
  bg = "primary",
  hoverBg = "dark",
  border = "primary",
  hoverBorder = "dark",
}: {
  isLink?: any;
  href?: any;
  className?: any;
  title?: any;
  icon?: any;
  iconFirst?: any;
  onClick?: any;
  active?: any;
  isSquare?: boolean;
  titleClassName?: any;
  type?: "submit" | "reset" | "button";
  variant: "filled" | "outline" | "none";
  size?: "xs" | "sm" | "md" | "lg";
  borderSize?: "sm" | "md";
  disabled?: boolean;
  isLoading?: boolean;
  rounded?: boolean;
  text?: string;
  hoverText?: string;
  bg?: string;
  hoverBg?: string;
  border?: string;
  hoverBorder?: string;
}) => {
  const classes = cx(
    className,
    `group font-hauora font-bold outline-none inline-flex items-center  justify-center  transit leading-none rounded transition-all ${
      size === "xs" ? "text-xs gap-1" : "text-sm gap-1.5"
    }`,
    { [`pointer-events-none select-none`]: active || isLoading },
    { [`rounded-full`]: rounded },
    { [`rounded`]: !rounded },
    { [`aspect-square`]: isSquare },
    { [`h-6 px-1.5`]: size === "xs" },
    { [`h-9 px-3`]: size === "sm" },
    { [`h-10 px-4`]: size === "md" },
    { [`h-11 px-5`]: size === "lg" },
    {
      [`${bg} hover:${hoverBg} text-${text} hover:text-${hoverText} `]:
        variant === "filled",
    },
    {
      [` ${
        borderSize === "md" ? "border-2" : "border"
      } border-${border} hover:border-${hoverBorder} ${bg} hover:${hoverBg} text-${text} hover:text-${hoverText} `]:
        variant === "outline",
    }
  );

  return isLink ? (
    <CodeLink href={href} onClick={onClick} className={classes}>
      {isLoading ? (
        <span className="relative h-4 w-4 border-[3px] border-current border-b-dark/20 rounded-full block animate-spin" />
      ) : iconFirst && icon ? (
        <span className="text-lg">{icon}</span>
      ) : null}
      {title && <span className={titleClassName}>{title}</span>}
      {!iconFirst && icon ? <span className="text-lg">{icon}</span> : null}
    </CodeLink>
  ) : (
    <button
      onClick={onClick}
      type={type}
      className={classes}
      disabled={disabled}
    >
      {isLoading ? (
        <span className="relative h-4 w-4 border-[3px] border-current border-b-slate-500 rounded-full block animate-spin" />
      ) : iconFirst && icon ? (
        <span className="text-lg">{icon}</span>
      ) : null}
      {title && <span className={titleClassName}>{title}</span>}
      {!iconFirst && icon ? <span className="text-lg">{icon}</span> : null}
    </button>
  );
};

export default Button;
{
  /* <span className="border-2 rounded-full border-black p-1 border-b-white"></span> */
}
