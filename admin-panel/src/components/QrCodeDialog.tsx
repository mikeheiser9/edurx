import React, { useEffect, useState } from "react";
import Dialog from "./Dialog";
import Button from "./Button";
import { HiOutlineFolderDownload } from "react-icons/hi";
import { getQrCodeLogoWithBase64 } from "./Icons";
import SectionLoader from "./SectionLoader";
import { RiLink } from "react-icons/ri";

interface QRCodeProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  divref: React.RefObject<HTMLDivElement>;
  size?: number;
  DialogWidth?: string;
  btnTitle?: string;
  btnIcon?: any;
  value: string;
  btnClick?: any;
  isLoading?: boolean;
}

export const QrCodeDialog = (props: QRCodeProps) => {
  const {
    isOpen,
    onClose,
    title,
    divref,
    size,
    DialogWidth,
    btnTitle,
    btnIcon,
    value,
    btnClick,
    isLoading,
  } = props;

  let [copied , setCopied] = useState(false)
  useEffect(()=>{
    let timeOut:NodeJS.Timeout;
    if(copied){
      timeOut = setTimeout(() => {
        setCopied(false);
      }, 2000)
    }

    return ()=>{
      clearTimeout(timeOut)
    }
  },[copied])

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      width={`sm:!w-[413px] xs:!w-[350px] ${DialogWidth}`}
      className="min-h-[300px] min-w-full"
    >
      {isLoading ? (
        <SectionLoader
          size="h-10 w-10"
          className="inset-[unset] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      ) : (
        <div className="flex flex-col justify-center items-center" ref={divref}>
          {/* <QRCodeSVG
          size={size || 300}
          value={value}
          level="H"
          imageSettings={{
            src: getQrCodeLogoWithBase64(),
            height: 60,
            width: 60,
            excavate: true,
          }}
          className="max-w-full h-full"
        /> */}

          <img
            src={value}
            alt="Qr Image"
            className="max-w-full h-full min-h-[310px] min-w-[310px]"
          />
          <div className="flex flex-col w-full gap-2 items-center">
              <div className="flex items-center w-full border border-slate-200 rounded-xl gap-2">
                <div className="border-0 border-r-[1px] border-slate-200 min-w-[50px] min-h-[40px] flex justify-center items-center rounded-l-xl text-slate-200 text-2xl">
                  <RiLink/>
                </div>
                <div className="whitespace-nowrap min-h[30px] flex items-center overflow-auto w-[58%]">
                  <p className="text-gray-50 text-base">{value?.substring?.(0,18)+'...'}</p>
                </div>
                <div className="p-1">
                  <Button
                  variant="filled"
                  className={'!h-8 !w-16 !p-1'}
                  title={!copied ? "Copy" : "Copied!"}
                  onClick={()=>{
                    navigator.clipboard.writeText(value).then(()=>setCopied(true));
                  }}
                  />
                </div>
              </div>
              <Button
              variant="filled"
              className={
                "flex w-full justify-between p-2.5 bg-gray-300 rounded-[10px]"
              }
              title={btnTitle}
              onClick={btnClick}
              bg="[##F4F4F4]"
              text="dark"
              hoverBg="[#f4f4f4]"
              hoverText="text-qrtext"
              icon={btnIcon ?? <HiOutlineFolderDownload className="text-xl" />}
              />
          </div>
        </div>
      )}
    </Dialog>
  );
};
