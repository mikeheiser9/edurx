import { postFlags } from "@/util/constant";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { SetStateAction, useState } from "react";

// type PostActions = "delete" | "flag" | null;

interface Props {
  currentStep: number;
  setCurrentStep: React.Dispatch<SetStateAction<number>>;
  onDeletePost?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onFlagPost?: (value: string) => void;
  currentFlag?: PostFlags | undefined | null;
  postFlag?: PostFlags | null | undefined
}

interface TemplateProps extends Props {
  title: string;
  children: React.ReactElement;
}

const Template = (props: TemplateProps) => (
  <>
    <div className="flex gap-2 items-center">
      <FontAwesomeIcon
        icon={faChevronLeft}
        onClick={() => props?.setCurrentStep(props.currentStep === 3 ? 1 : 0)}
        size="sm"
        className="cursor-pointer"
      />
      <span className="font-sans">{props.title}</span>
    </div>
    <hr className="my-1" />
    {props.children}
  </>
);

export const AdminActionsMenu = ({
  currentStep,
  setCurrentStep,
  onDeletePost,
  onFlagPost,
  currentFlag,
}: Props) => {
  const [selectedFlag, setSelectedFlag] = useState<PostFlags | string>(
    currentFlag || ""
  );

  return (
    <div className="relative z-10">
      <div className="flex flex-col bg-slate-300 -top-3 rounded-md p-2 text-sm ipad-under:text-xs min-w-[8em] w-max absolute right-4 animate-fade-in-down">
        {currentStep === 0 ? (
          <>
            <span
              onClick={() => setCurrentStep(1)}
              className="rounded-md ease-in-out duration-200 p-1 hover:bg-slate-100"
            >
              Flag
            </span>
            <hr className="my-1" />
            <span
              onClick={() => setCurrentStep(2)} // TODO: delete post to be implemented}
              className="rounded-md text-red-500 ease-in-out duration-200 p-1 hover:bg-slate-100"
            >
              Delete
            </span>
          </>
        ) : currentStep === 1 ? (
          <Template
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            title="Flag Post As: "
          >
            <div className="flex gap-1 flex-col">
              {postFlags?.map((flag, index) => (
                <span
                  key={index}
                  className={`rounded-md ease-in-out duration-200 text-xs p-1 ${
                    selectedFlag === flag
                      ? "bg-blue-400 text-white"
                      : "hover:bg-slate-100"
                  }`}
                  onClick={() => {
                    setSelectedFlag(flag === selectedFlag ? "" : flag);
                    setCurrentStep(3);
                  }}
                >
                  {flag}
                </span>
              ))}
              <strong
                className="text-red-500 px-1 cursor-pointer"
                onClick={() => {
                  setCurrentStep(3);
                  setSelectedFlag("");
                }}
              >
                Remove Flag
              </strong>
            </div>
          </Template>
        ) : (
          <Template
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            title="Are you sure?"
          >
            <div className="flex gap-1 flex-col">
              <span
                onClick={
                  currentStep === 2
                    ? onDeletePost
                    : () => onFlagPost?.(selectedFlag)
                }
                className="rounded-md ease-in-out duration-200 p-1 hover:bg-slate-100 text-xs"
              >
                Yes
              </span>
              <span
                onClick={() => setCurrentStep(0)}
                className="rounded-md ease-in-out duration-200 p-1 hover:bg-slate-100 text-xs"
              >
                No
              </span>
            </div>
          </Template>
        )}
      </div>
    </div>
  );
};
