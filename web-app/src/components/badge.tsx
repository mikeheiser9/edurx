import React, { ReactElement } from "react";

const badgeClasses = {
  default:
    "bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300",
  dark: "bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300",
  danger:
    "bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-500 dark:text-white",
  success:
    "bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300",
  warning:
    "bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300",
  alert:
    "bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300",
};

type Badges =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "alert"
  | "dark"
  | "custom";

interface BadgeProps {
  type?: Badges | keyof typeof badgeClasses;
  label?: string;
  class?: string;
  children?: ReactElement | string;
}

export const Badge = ({ type = "default", ...props }: BadgeProps) => {
  return (
    <span
      className={`${props.class} ${
        type !== "custom"
          ? badgeClasses[type as keyof typeof badgeClasses]
          : props.class
      } ${type === "custom" && props.class}`}
    >
      {props.label || props?.children}
    </span>
  );
};
