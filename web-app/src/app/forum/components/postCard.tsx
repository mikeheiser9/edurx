import { Button } from "@/components/button";
import { faComments } from "@fortawesome/free-regular-svg-icons";
import { faChartColumn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import React from "react";

interface Props {
  post: any;
  onPostClick: () => void;
}

export const PostCard = (props: Props) => {
  return (
    <div
      className="flex w-full p-4 rounded-md bg-eduDarkGray gap-2"
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
        <Button
          className="w-auto !m-0 text-sm px-4"
          label="Follow"
          onClick={(e) => e.stopPropagation()}
        />
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
    </div>
  );
};
