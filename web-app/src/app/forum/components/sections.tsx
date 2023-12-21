import { Button } from "@/components/button";
import { setModalState } from "@/redux/ducks/modal.duck";
import { selectDraftCount } from "@/redux/ducks/user.duck";
import { postStatus } from "@/util/constant";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface NavOption {
  // link: string;
  onClick?: () => void;
  icon: IconProp;
  label: string;
}

interface Option {
  label: string;
  onClick?: () => void;
  icon?: IconProp | React.JSX.Element;
  isDisabled?: boolean;
  isDefault?: boolean;
}

const ModalHeader = ({
  onClose,
  mode="New"
}: {
  onClose: () => void;
  mode?:"Edit"|"New"|undefined
}): React.ReactElement => {
  const userPostDraftCount = useSelector(selectDraftCount);
  const dispatch = useDispatch();
  return (
    <div className="flex p-3 px-7  items-center  justify-start bg-eduDarkGray gap-3 ">
      <span className="text-xl font-medium  ">{mode=="Edit"? 'Edit Draft' : 'New Post'} </span>
      <span></span>
      <span
        className="border-l-2 border-solid border-l-eduBlack text-xl pl-5 font-light underline cursor-pointer"
        onClick={() => {
          onClose()
          setTimeout(()=>{
            dispatch(setModalState({isOpen:true}));
          },200)
        }}
      >
        Drafts&nbsp;
        <b className="font-medium">{userPostDraftCount}</b>
      </span>
      <FontAwesomeIcon
        icon={faX}
        size="sm"
        onClick={onClose}
        className="ml-auto text-xl self-center cursor-pointer text-gray-500"
      />
    </div>
  );
};

const ModalFooter = ({
  setFieldValue,
  disable,
}: {
  setFieldValue: (field: string, value: string) => void;
  disable: boolean | undefined;
}): React.ReactElement => {
  return (
    <div className="flex flex-col gap-2 py-3 bg-primary-dark">
      <div className="flex justify-center gap-4">
        <Button
          label="Save Draft"
          type="submit"
          className={`!m-0 !bg-eduBlack text-white ${
            disable && "!cursor-not-allowed"
          }`}
          onMouseEnter={() => setFieldValue("postStatus", postStatus[0])}
          disabled={disable}
        />
        <Button
          label="Post"
          type="submit"
          className={`!m-0 ${disable && "!cursor-not-allowed"}`}
          onMouseEnter={() => setFieldValue("postStatus", postStatus[1])}
          disabled={disable}
        />
      </div>
    </div>
  );
};

const DropDownPopover = ({
  options,
  isVisible,
  itemClassName,
  wrapperClass = "",
}: {
  options: NavOption[];
  isVisible: boolean;
  itemClassName?: string;
  wrapperClass?: string;
}): React.ReactElement => {
  return (
    <ul
      className={`${wrapperClass} flex p-2 relative rounded-md gap-2 bg-eduDarkGray text-eduBlack flex-col ease-in-out ${
        isVisible ? "animate-fade-in-down" : "hidden"
      }`}
    >
      {options?.map((item: NavOption, index: number) => (
        <li
          className={itemClassName || "px-1 text-sm flex items-center gap-2"}
          key={index}
          onClick={item?.onClick}
        >
          {item?.icon && <FontAwesomeIcon icon={item.icon} />} {item.label}
        </li>
      ))}
    </ul>
  );
};

const ReviewRequestButton = ({
  onClick,
  count = 0,
}: {
  onClick?: () => void;
  count: number;
}) => (
  <div className="m-auto relative">
    <span className="w-5 font-semibold text-white z-10 text-xs h-5 flex absolute right-0 -m-1.5 justify-center items-center rounded-full bg-eduBlack">
      {count}
    </span>
    <button
      type="button"
      onClick={() => count && onClick?.()}
      className="p-2 px-4 text-sm text-black bg-white rounded-md w-auto font-medium bg-transparent border-eduBlack border-[1.5px] py-1 m-auto font-body transition-colors duration-500 hover:bg-eduBlack hover:text-white disabled:opacity-70"
      disabled={!count}
    >
      Review Requests
    </button>
  </div>
);

const NavList = ({ options }: { options: Option[] }) => {
  const [selectedTab, setSelectedTab] = useState<string>(
    options?.find((option) => option?.isDefault)?.label || ""
  );
  const onClick = (item: Option) => {
    setSelectedTab(item?.label);
    item?.onClick?.();
  };

  return (
    <ul className="flex gap-2 flex-auto flex-col">
      {options?.map((item, index) => {
        return (
          <li
            key={index}
            onClick={() => onClick(item)}
            className={`${
              item?.label === selectedTab
                ? "decoration-primary"
                : "decoration-transparent"
            } underline duration-300 decoration-2 ease-in-out animate-fade-in-down touch-pinch-zoom text-sm transition-colors text-eduBlack underline-offset-4 cursor-pointer`}
          >
            {item?.label}
            {item?.icon &&
              (typeof item?.icon === "object" ? (
                <FontAwesomeIcon icon={item.icon as IconProp} />
              ) : (
                item.icon
              ))}
          </li>
        );
      })}
    </ul>
  );
};

export {
  ModalHeader,
  ModalFooter,
  DropDownPopover,
  ReviewRequestButton,
  NavList,
};
