"use client";

import React, { useEffect, useState } from "react";
import cx from "classnames";
import { HiInformationCircle } from "react-icons/hi";
import ReactSelect, { StylesConfig } from "react-select";

import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";
import { ErrorMessage } from "formik";
type valueType = {
  value: string | boolean;
  label?: string;
};

const Select = ({
  label = false,
  placeholder,
  parentClassName = "",
  labelClassName = "",
  error = false,
  components,
  required = false,
  options,
  className,
  filled = false,
  showIndicator = false,
  darkPlaceholder = false,
  register,
  name,
  info,
  size = "md",
  border = "md",
  onChange,
  value,
  defaultValue,
  isMulti = false,
  disabled = false,
  isClearable = false,
  isSearchable = true,
}: {
  label?: any;
  placeholder?: any;
  parentClassName?: any;
  labelClassName?: any;
  error?: any;
  components?: any;
  required?: any;
  options?: any;
  className?: any;
  filled?: any;
  showIndicator?: any;
  darkPlaceholder?: any;
  info?: any;
  size?: "sm" | "md" | "lg";
  border?: "sm" | "md";
  register?: any;
  name: string;
  onChange?: (...event: any[]) => void;
  value?: valueType | valueType[];
  defaultValue?: valueType | valueType[] | null;
  isMulti?: boolean;
  isCreateble?: boolean;
  disabled?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
}) => {
  const [selectedValue, setSelectedValue] = useState("");

  const sSize = cx(
    { [`36px`]: size === "sm" },
    { [`40px`]: size === "md" },
    { [`44px`]: size === "lg" }
  );
  const sBorder = cx(
    { [`1px`]: border === "sm" },
    { [`2px`]: border === "md" }
  );

  const customStyles: StylesConfig = {
    control: (base: any, state: any) => ({
      ...base,
      minHeight: sSize,
      fontSize: "14px",
      padding: "0 10px",
      borderRadius: "8px",
      display: "flex",
      flexWrap: "wrap",
      backgroundColor: disabled ? "#DBDBDC" : "#ffffff",
      borderWidth: sBorder,
      // borderColor: state.isFocused
      //   ? "rgba(231, 231, 231, 100)"
      //   : "rgba(231, 231, 231, 100)",
      // "&:hover": {
      //   borderColor: "rgba(231, 231, 231, 100)",
      // },
      borderColor: "#CBCBD0",
      outline: "none !important",
      boxShadow: "none !important",
    }),
    placeholder: (base: any) => {
      return {
        ...base,
        color: "rgba(52, 45, 59, 0.5)",
        textOverflow: "ellipsis",
        maxWidth: "100%",
        whiteSpace: "nowrap",
        overflow: "hidden",
        display: "initial",
        fontWeight: "bold",
      };
    },
    valueContainer: (base: any) => ({
      ...base,
      padding: "0",
      marginRight: "8px",
    }),
    indicatorSeparator: (base: any) => ({
      ...base,
      display: "none",
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      padding: "0",
      color: "#747474",
    }),
    menu: (base: any) => ({
      ...base,
      marginBottom: "-4px",
      padding: "10px",
      backgroundColor: "#ffffff",
      borderRadius: "4px",
      border: "1px solid rgba(52, 45, 59, 0.3)",
      boxShadow: "0px 0px 50px rgba(0, 0, 0, 0.07)",
      zIndex: 99,
    }),
    option: (base: any, state: any) => ({
      ...base,
      padding: "10px 16px",
      fontSize: "14px",
      marginBottom: "4px",
      borderRadius: "4px",
      cursor: "pointer",
      backgroundColor: state.isSelected
        ? "rgba(253, 205, 38,0.7) !important"
        : "#ffffff",
      color: state.isSelected ? "#d41414" : "#342D3B",
      "&:hover": {
        backgroundColor: "rgba(253, 205, 38,0.3)",
      },
    }),
    noOptionsMessage: (base: any) => ({
      ...base,
      borderRadius: "0",
      color: "#092540",
      fontSize: "16px",
    }),
    multiValue: (base: any) => ({
      ...base,
      background: "#FDCD27",
      color: "#ffffff",
      fontWeight: 500,
      padding: "6px 8px",
      borderRadius: "0.25rem",
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: "#000",
      padding: "0 !important",
      fontSize: 10,
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      padding: "0 !important",
      marginLeft: "5px",
      background: "#cfb046 !important",
    }),
  };

  useEffect(() => {
    if (value && !Array.isArray(value) && value.value) {
      const tempValue = options.filter(
        (op: { value: string }) => op.value === value.value
      );
      setSelectedValue(tempValue[0]);
    } else {
      setSelectedValue("");
    }
  });

  return (
    <div className={`relative flex flex-col gap-2 mb-2 ${parentClassName} `}>
      {label && (
        <label
          className={`flex items-center gap-1 text-black-800 !text-sm !text-Thirdgrey !font-bold ${labelClassName} `}
        >
          {label}
          {required && <span className="text-red-500 font-medium">*</span>}
          {info && (
            <Tooltip placement="top">
              <TooltipTrigger className="relative">
                <HiInformationCircle className="text-primary text-base cursor-help" />
              </TooltipTrigger>
              <TooltipContent>{info && "Information Here"}</TooltipContent>
            </Tooltip>
          )}
        </label>
      )}
      <ReactSelect
        placeholder={placeholder || "Select"}
        styles={customStyles}
        options={options}
        menuPlacement="auto"
        {...register}
        isMulti={isMulti}
        name={name}
        components={components}
        onChange={onChange}
        value={selectedValue || (value as valueType)}
        defaultValue={defaultValue}
        isDisabled={disabled}
        isClearable={isClearable}
        noOptionsMessage={() => "No Option"}
        isSearchable={isSearchable}
      />

      <ErrorMessage name={name}>
        {(msg) => (
          <p className=" text-red-600 text-[12px] font-semibold">{msg}</p>
        )}
      </ErrorMessage>
    </div>
  );
};

export default Select;
