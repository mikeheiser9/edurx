import { Button } from "@/components/button";
import { faComments } from "@fortawesome/free-regular-svg-icons";
import {
  faChartColumn,
  faEllipsisVertical,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { AdminActionsMenu } from "../adminActionsMenu";

interface Props {
  post: PostInterface;
  onViewClcik: () => void;
  userRole?: USER_ROLES;
  onEditClick?: () => void;
  toggleMenu?: () => void;
  isAdmin?: boolean;
  isToggle?: boolean;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  onDeletePost?: () => void;
  onFlagPost?: (flag: string) => void;
}

export const DummyPostCard = (props: Props) => {
  return (
    <div className="flex select-none w-full rounded-md bg-primary-dark gap-2 p-4 relative">
      <div className="w-full rounded-md ease-in-out duration-200 flex items-center justify-center h-full bg-[#13222A]/70 absolute -m-4 backdrop-blur-sm p-4">
        <div className="flex gap-2 items-center p-2 border border-white rounded-md w-full">
          <span className="border animate-wiggle text-white border-white rounded-md p-1 px-2">
            <FontAwesomeIcon icon={faFlag} />
          </span>
          <span className="text-white text-sm font-semibold flex-1">
            This post has been flagged for [
            <strong className="text-red-500 px-1">{props?.post?.flag}</strong>],
            however you may still view the forum
          </span>
          <div className="flex gap-2">
            <Button
              label="View"
              className="text-xs duration-200 ease-in-out hover:text-primary hover:!bg-primary/20 bg-transparent text-white outline outline-1 font-bold !p-1 !px-4 justify-center items-center flex flex-auto"
              onClick={props?.onViewClcik}
            />
            {props.isAdmin && (
              <Button
                label="Edit"
                className="text-xs duration-200 ease-in-out hover:text-primary hover:!bg-primary/20 bg-transparent text-white outline outline-1 font-bold !p-1 !px-4 justify-center items-center flex flex-auto"
                onClick={props?.onEditClick}
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 gap-4 flex-col flex">
        <span className="text-sm">Published on 29/05/1997</span>
        <span className="text-2xl">Post</span>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((category, index) => (
            <span
              key={index}
              className="text-[8px] leading-6 items-center flex justify-center px-2 border border-eduLightBlue rounded-md"
            >
              {`Category ${index + 1}`}
            </span>
          ))}

          <span className="text-[8px] leading-6 items-center flex justify-center px-2 bg-eduDarkGray rounded-md">
            tag
          </span>
        </div>
      </div>
      <div className="flex-1 flex gap-8 justify-end items-center">
        <div className="flex flex-col items-center text-sm gap-4">
          <div className="flex flex-col">
            <FontAwesomeIcon icon={faComments} />
            <span className="font-sans font-bold">16</span>
          </div>
          <div className="flex flex-col">
            <FontAwesomeIcon icon={faChartColumn} />
            <span className="font-sans font-bold">78</span>
          </div>
        </div>
      </div>
      {props?.isAdmin && (
        <div
          className="flex justify-center items-center px-6"
          // ref={toggleMenuRef}
          onClick={(e) => e.stopPropagation()}
        >
          <FontAwesomeIcon
            icon={faEllipsisVertical}
            className="text-white cursor-pointer"
            size="xl"
            onClick={props?.toggleMenu}
          />

          {props?.isToggle && (
            <AdminActionsMenu
              currentStep={props?.currentStep}
              setCurrentStep={props.setCurrentStep}
              onDeletePost={props?.onDeletePost}
              onFlagPost={props?.onFlagPost}
              currentFlag={props?.post?.flag}
            />
          )}
        </div>
      )}
    </div>
  );
};
