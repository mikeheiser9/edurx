import {
  faArrowDown,
  faArrowUp,
  faChartColumn,
  faChevronDown,
  faCommentDots,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dynamic from "next/dynamic";
import React from "react";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Comment = ({
  showBorder,
  comment,
}: {
  showBorder?: boolean;
  comment: any;
}) => (
  <div>
    <div className="flex gap-2">
      <div className="flex flex-col items-center">
        <span className="w-6 overflow-hidden h-6 justify-center items-center flex bg-white/80 rounded-full">
          <FontAwesomeIcon icon={faUserAlt} />
        </span>
        {showBorder && <span className="bg-white h-full w-[1px] rounded-sm" />}
      </div>
      <div className="flex-1 flex flex-col gap-2 pb-2">
        <span className="text-sm font-semibold lowercase">
          user_name <span className="text-white/60">• Few minutes ago</span>
        </span>
        <div className="py-2">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magnam ab
          libero et dolorem sunt quaerat!
        </div>
        <div className="flex gap-6 text-sm items-center text-white/60">
          <span className="flex gap-2 justify-center items-center">
            <FontAwesomeIcon
              icon={faArrowUp}
              className="text-primary cursor-default"
            />
            &nbsp; 2 &nbsp;
            <FontAwesomeIcon
              icon={faArrowDown}
              className="text-primary cursor-default"
            />
          </span>
          <span className="cursor-default">
            <FontAwesomeIcon icon={faCommentDots} />
            &nbsp;Reply
          </span>
          {comment?.replies && comment?.replies?.length > 0 && (
            <span className="p-1 cursor-default px-2 rounded-md border border-primary text-xs text-primary">
              {comment?.replies?.length} Replies{" "}
              <FontAwesomeIcon icon={faChevronDown} />
            </span>
          )}
        </div>
        {comment?.replies?.map((reply: any) => (
          <Comment comment={reply} showBorder={false} key={reply?._id} />
        ))}
      </div>
    </div>
  </div>
);

export const DummyPost = () => {
  return (
    <div className="select-none cursor-default blur-md rounded-md mt-6 p-4">
      <ReactQuill
        className="text-eduBlack -mx-3 post-body cursor-default"
        readOnly
        value={`<pre class="ql-syntax" spellcheck="false">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odit culpa alias velit rerum recusandae eos vitae vel repudiandae officia? Deleniti est accusamus, ea in reiciendis adipisci porro voluptas maiores quaerat libero magni sequi vel, enim voluptatem quibusdam optio ex esse.
          </pre>`}
        theme="bubble"
      />

      <div className="flex gap-2 py-4 text-sm">
        <span>
          <FontAwesomeIcon icon={faCommentDots} /> 29 Comments
        </span>
        <span>
          <FontAwesomeIcon icon={faChartColumn} /> 101 Views
        </span>
      </div>
      <textarea
        className="bg-eduDarkGray text-eduBlack rounded-[10px] mt-[10px] p-2 focus-visible:border-none outline-none autofill:active:bg-black font-body placeholder:text-eduBlack/60  text-[16px] w-full rounded-t-md cursor-default"
        placeholder="Comment as @username"
        rows={4}
        readOnly
      />
      <span className="bg-eduLightBlue rounded-md -mt-1.5 p-1 flex justify-end rounded-t-none">
        <button
          className="!m-0 w-[150px] !rounded-[10px] text-white self-end border-white hover:!bg-eduBlack hover:text-white ease-in-out duration-300 bg-transparent border-[1.5px] my-3 py-1 text-[16px] font-body"
          disabled
        >
          Comment
        </button>
      </span>
      <hr className="my-6 border-white/60 border rounded-md" />
      <div className="flex">
        <span className="text-xl">2 Responses</span>
      </div>
      {Array.from({ length: 3 }).map((comment, index) => (
        <Comment
          key={index}
          showBorder
          comment={{
            _id: index,
            replies:
              index == 1
                ? [
                    {
                      _id: index,
                    },
                  ]
                : [],
          }}
        />
      ))}
    </div>
  );
};
