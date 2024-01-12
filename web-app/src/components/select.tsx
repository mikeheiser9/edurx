import { useOutsideClick } from "@/hooks";
import {
  faCheck,
  faChevronDown,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

type Value = string | number | undefined;
interface Props {
  onSelect: (selected: any) => void;
  onClear?: () => void;
  value?: Value;
  icon?: any;
  options?: { value: Value; icon?: string; label?: string }[];
  wrapperClass?: string;
  optionClass?: string;
  defaultValue?: string;
  // selectionKey?: string;
}

export const Select = ({ value, options = [], icon, ...rest }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<any>();
  const menuRef = useOutsideClick(() => setIsOpen(false));

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleChange = (e: React.MouseEvent<HTMLLIElement>, option: any) => {
    e.stopPropagation();
    e?.preventDefault();
    setIsOpen(false);
    setSelected(option);
    return rest?.onSelect(option);
  };

  const clearSelection = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setSelected(null);
    rest?.onClear?.();
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* <input type="hidden" value={value || rest?.defaultValue} /> */}
      <button
        type="button"
        className={`bg-eduDarkGray text-[12px] font-body focus:outline-none rounded-t-[5px] py-1 m-auto disabled:opacity-80 relative flex p-2 items-center gap-2 w-full bg-whiteshadow-lg text-left cursor-default sm:text-sm ${
          isOpen ? "rounded-t-md" : "rounded-md"
        } ${rest?.wrapperClass}`}
        onClick={handleClick}
      >
        <span className="flex items-center flex-1">
          <span className=" block truncate">
            {selected?.label || value || rest?.defaultValue}
          </span>
        </span>
        <span className=" inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`ease-in-out duration-500 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </span>
      </button>
      {isOpen && (
        <div className="absolute w-full z-[100] bg-eduDarkGray rounded-b-md">
          <ul className="max-h-56 rounded-md py-1 ease-in-out transition-all text-base ipad-under:text-xs ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {options?.map((option, index) => (
              <li
                className={`
                  ${
                    rest?.optionClass || ""
                  } group/option text-gray-900 cursor-default hover:bg-eduDarkBlue hover:text-white select-none relative p-2 ipad-under:py-1
                `}
                onClick={(event) => handleChange(event, option)}
                key={index}
              >
                <div className="flex items-center">
                  <span className="block flex-1 font-normal truncate">
                    {option?.label || option.value}
                  </span>
                  {value === option?.value && (
                    <>
                      <span className="absolute group-hover/option:hidden inset-y-0 right-0 flex items-center pr-4">
                        {icon ? icon : <FontAwesomeIcon icon={faCheck} />}
                      </span>
                      {rest.onClear && (
                        <span className="absolute invisible group-hover/option:visible inset-y-0 right-0 flex items-center pr-4">
                          <FontAwesomeIcon
                            icon={faXmarkCircle}
                            className="cursor-pointer"
                            onClick={clearSelection}
                          />
                        </span>
                      )}
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
