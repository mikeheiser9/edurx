import { postFlags, roleAccess } from "@/util/constant";
import { faComments } from "@fortawesome/free-regular-svg-icons";
import {
  faChartColumn,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import React, { useState } from "react";
import { AdminActionsMenu } from "./adminActionsMenu";
import { DummyPostCard } from "./dummyComps/dummyPostCard";
import { Button } from "@/components/button";
// import { useOutsideClick } from "@/hooks";

interface Props {
  post: PostInterface;
  onPostClick: () => void;
  userRole?: USER_ROLES;
  onDeletePost?: () => void;
  onFlagPost?: (postId: string, flag: PostFlags) => void;
}

export const PostCard = (props: Props) => {
  const isAdmin = props?.userRole === roleAccess.ADMIN;
  const [isToggle, setIsToggle] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const isFlagged: boolean =
    props?.post?.flag && postFlags?.includes(props?.post?.flag) ? true : false;
  // const toggleMenuRef = useOutsideClick(() => setIsToggle(false));

  const handleAdminActions = (event: React.MouseEvent<SVGSVGElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setIsToggle(!isToggle);
    // toggleMenuRef?.current?.scrollIntoView({
    //   behavior: "smooth",
    // });
  };

  const flagPost = (flag: string) => {
    props?.onFlagPost?.(props?.post?._id, flag as PostFlags);
    setCurrentStep(0);
    setIsToggle(false);
  };

  if (isFlagged)
    return (
      <DummyPostCard
        post={props.post}
        onViewClcik={props.onPostClick}
        isAdmin={isAdmin}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        isToggle={isToggle}
        onDeletePost={props.onDeletePost}
        onFlagPost={flagPost}
        onEditClick={handleAdminActions as any}
      />
    );

  return (
    <div
      className="flex w-full p-4 rounded-[10px] bg-eduLightGray gap-2 !cursor-pointer"
      onClick={props.onPostClick}
    >
      <div className="flex-1 gap-4 flex-col flex">
        <span className="text-eduDarkBlue text-[12px] font-body">
          Published on {moment(props?.post?.createdAt).format("DD/MM/YYYY")}
        </span>
        <span className="text-[22px] text-eduBlack font-headers">
          {" "}
          {props.post.title}
        </span>
        <div className="flex flex-wrap gap-2">
          {props?.post?.categories?.map((category) => (
            <span
              key={category._id}
              className="text-[8px] py-2 px-4 bg-white text-eduDarkBlue rounded-[5px] border border-eduDarkBlue"
            >
              {category.name}
            </span>
          ))}
          {props?.post?.tags?.map((tag) => (
            <span
              key={tag._id}
              className="text-[8px] py-2 px-4 bg-eduDarkGray text-eduDarkBlue rounded-[5px]"
            >
              {tag?.name}
            </span>
          ))}
        </div>
      </div>
      <div className="flex-1 flex gap-8 justify-end items-center">
        <Button
          className="w-auto rounded-md font-medium !m-0 text-sm px-4"
          label="Follow"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="flex flex-col items-center justify-center text-[12px] text-eduBlack gap-4">
          <div className="flex flex-col text-[12px]">
            <FontAwesomeIcon icon={faComments} className="text-[18px]" />
            <span className="font-sans font-semibold text-center mt-[5px]">
              {props?.post?.commentCount}
            </span>
          </div>
          <div className="flex flex-col">
            <FontAwesomeIcon icon={faChartColumn} className="text-[18px]" />
            <span className="font-sans font-semibold text-center mt-[5px]">
              {props?.post?.views}
            </span>
          </div>
        </div>
      </div>
      {isAdmin && (
        <div
          className="flex justify-center items-center px-6"
          // ref={toggleMenuRef}
          onClick={(e) => e.stopPropagation()}
        >
          <FontAwesomeIcon
            icon={faEllipsisVertical}
            className="text-white cursor-pointer"
            size="xl"
            onClick={handleAdminActions}
          />

          {isToggle && (
            <AdminActionsMenu
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              onDeletePost={props?.onDeletePost}
              onFlagPost={flagPost}
              currentFlag={props?.post?.flag}
            />
          )}
        </div>
      )}
    </div>
  );
};
