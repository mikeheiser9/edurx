import { Button } from "@/components/button";
import { useOutsideClick } from "@/hooks";
import { roleAccess, roles } from "@/util/constant";
import { faComments } from "@fortawesome/free-regular-svg-icons";
import {
  faChartColumn,
  faEllipsisVertical,
  faL,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import React, { Ref, useState } from "react";

interface Props {
  post: any;
  onPostClick: () => void;
  userRole?: USER_ROLES;
}

export const PostCard = (props: Props) => {
  const isAdmin = props?.userRole === roleAccess.ADMIN;
  const [isToggle, setIsToggle] = useState<boolean>(false);
  const toggleMenuRef: Ref<SVGSVGElement> = useOutsideClick(() =>
    setIsToggle(false)
  );
  const handleAdminActions = (event: React.MouseEvent<SVGSVGElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setIsToggle(!isToggle);
    // toggleMenuRef?.current?.scrollIntoView({
    //   behavior: "smooth",
    // });
  };
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
          {props?.post?.categories?.map((category: any) => (
            <span
              key={category._id}
              className="text-xs p-1 px-2 bg-primary/25 text-white/50 rounded-md"
            >
              {category.name}
            </span>
          ))}
          {props?.post?.tags?.map((tag: any) => (
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
            <span className="font-sans font-bold">{props?.post?.comments}</span>
          </div>
          <div className="flex flex-col">
            <FontAwesomeIcon icon={faChartColumn} />
            <span className="font-sans font-bold">{props?.post?.views}</span>
          </div>
        </div>
      </div>
      {isAdmin && (
        <div className="flex justify-center items-center px-6">
          <FontAwesomeIcon
            icon={faEllipsisVertical}
            className="text-white cursor-pointer"
            size="xl"
            onClick={handleAdminActions}
            ref={toggleMenuRef}
          />
          {isToggle && (
            <div className="relative">
              <div className="flex flex-col gap-2 bg-slate-300 -top-9 rounded-md p-2 text-sm min-w-[8em] absolute right-4 animate-fade-in-down">
                <span>Flag</span>
                <hr />
                <span className="text-red-500">Delete</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
