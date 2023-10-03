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
      className="flex w-full p-4 rounded-md bg-primary-dark gap-2"
      onClick={props.onPostClick}
    >
      <div className="flex-1 gap-4 flex-col flex">
        <span className="text-white text-sm">
          Published on {moment(props?.post?.createdAt).format("DD/MM/YYYY")}
        </span>
        <span className="text-2xl text-white">{props.post.title}</span>
        <div className="flex flex-wrap gap-2">
          {props?.post?.categories?.map((category) => (
            <span
              key={category._id}
              className="text-xs p-1 px-2 bg-primary/25 text-white/50 rounded-md"
            >
              {category.name}
            </span>
          ))}
          {props?.post?.tags?.map((tag) => (
            <span
              key={tag._id}
              className="text-xs p-1 px-2 bg-[#0F366D] text-white/50 rounded-md"
            >
              {tag?.name}
            </span>
          ))}
        </div>
      </div>
      <div className="flex-1 flex gap-8 justify-end items-center">
        {/* <Button
          className="w-auto !m-0 text-sm px-4"
          label="Follow"
          onClick={(e) => e.stopPropagation()}
        /> */}
        <div className="flex flex-col items-center text-sm text-white/80 gap-4">
          <div className="flex flex-col">
            <FontAwesomeIcon icon={faComments} />
            <span className="font-sans font-bold">
              {props?.post?.commentCount}
            </span>
          </div>
          <div className="flex flex-col">
            <FontAwesomeIcon icon={faChartColumn} />
            <span className="font-sans font-bold">{props?.post?.views}</span>
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
