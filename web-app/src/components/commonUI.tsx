import { BackArrowIcon } from "@/app/signup/commonBlocks";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

interface propsType {
  type: string;
  title: string;
  button?: string;
  clickHandle?: (a: string) => void;
  fields: JSX.Element;
  accountCreationSucceedScreenOpen: boolean;
  isVerificationPending: boolean;
  setIsVerificationPending: Dispatch<SetStateAction<boolean>>
}
export default function CommonUI(props: propsType): React.JSX.Element {
  const {
    type,
    title,
    button,
    clickHandle,
    fields,
    accountCreationSucceedScreenOpen,
    isVerificationPending,
    setIsVerificationPending
  } = props;
  const router = useRouter();
  return (
    <div className="flex justify-center bg-white lg:w-1/4 rounded-2xl overflow-hidden">
      <div className="w-full flex flex-col">
        <div className="flex p-4 bg-eduDarkGray font-body">
          {!accountCreationSucceedScreenOpen && (
            <button
              onClick={() => {
                if(isVerificationPending)
                {
                  setIsVerificationPending(false)
                }
                else
                {
                  router.back();
                }
              }}
              className={`text-2xl px-2 self-center opacity-100`}
            >
              <BackArrowIcon />
            </button>
          )}
          <label className="text-[16px] text-eduBlack flex-1 text-center font-body self-center">
            Log into EduRx
          </label>
        </div>
        <div className="flex flex-col text-eduBlack items-center p-4 gap-2">
          <h1 className="text-eduBlack text-center tracking-wider text-4xl my-4 font-serif font-semibold">
            {title}
          </h1>
        </div>
        {fields}
        {button}
      </div>
    </div>
  );
}
