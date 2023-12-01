import React from "react";

interface UnFollowPostConfirmationPropsType {
  unFollowPost: () => Promise<void>;
  modelClosingFunction: () => void;
  confirmationLabel:string
}
export default function UnFollowConfirmation(
  props: UnFollowPostConfirmationPropsType
) {
  const { unFollowPost, modelClosingFunction,confirmationLabel } = props;
  return (
    <div className="mt-5 flex flex-col text-center">
      <label className="p-2">
          {confirmationLabel}
      </label>
      <div className="flex justify-center gap-3 p-2 mt-6">
        <button
          className="text-xs rounded-md !border-2 font-medium border-eduLightBlue !text-eduLightBlue w-auto mb-2 justify-end !px-8 hover:!text-white hover:bg-eduLightBlue duration-200 transition-colors p-1"
          onClick={unFollowPost}
        >
          Yes
        </button>
        <button
          className="text-xs rounded-md !border-2 font-medium border-eduLightBlue !text-eduLightBlue w-auto mb-2 justify-end !px-8 hover:!text-white hover:bg-eduLightBlue duration-200 transition-colors"
          onClick={modelClosingFunction}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
