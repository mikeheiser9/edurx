"use client";

import React, { useRef, useState } from "react";
import DefaultImg from "../../public/assets/images/default-user.png";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import SectionLoader from "./SectionLoader";
import ConfirmationDialog from "./ConfirmationDialog";
import { BsSendExclamation } from "react-icons/bs";

const AvatarUpload = ({
  src,
  size,
  alt,
  className,
  loading = false,
  rounded = false,
  handleImageChange,
  handleEditImage,
  handleDeleteImage,
}: {
  src: string | File;
  size: string;
  alt: string;
  className?: string;
  rounded?: boolean;
  loading?: boolean;
  handleImageChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditImage?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteImage?: () => void;
}) => {
  const [error, setError] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const imageRef = useRef<any | null>(null);
  return (
    <div className={`relative w-max ${className}`}>
      <div className={`group relative ${size}`}>
        {loading && <SectionLoader size="h-10 w-10" className="rounded-full" />}

        <img
          //@ts-ignore
          src={src ? src : "/assets/images/default-user.png"}
          className={` bg-light object-cover object-center w-full h-full ${
            rounded ? "rounded-full" : "rounded"
          } `}
          onError={() => {
            imageRef.current.src = DefaultImg.src;
          }}
          ref={imageRef}
          // alt={alt}
          // fill
          // decoding="async"
        />
        {!loading && src && (
          <div className="absolute group-hover:scale-100 scale-0 transition-all inset-0 bg-[#fcdada]/80 flex items-center justify-center rounded-full">
            <button
              type="button"
              className="text-red-500 text-2xl"
              onClick={() => {
                setShowDialog(true);
              }}
            >
              <HiOutlineTrash />
            </button>
          </div>
        )}
      </div>
      {!loading && (
        <button
          type="button"
          className="absolute bottom-1 right-1 h-8 w-8 bg-white flex items-center justify-center rounded-full border border-light z-[1]"
        >
          <HiOutlinePencil />
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer w-32 rounded"
            onChange={
              (e) =>
                src
                  ? handleEditImage && handleEditImage(e) // for updating image
                  : handleImageChange && handleImageChange(e) // for insert image
            }
            title=""
            accept="image/*"
          />
        </button>
      )}

      <ConfirmationDialog
        onConfirm={() => {
          setShowDialog(false);
          handleDeleteImage && handleDeleteImage();
        }}
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        icon={<BsSendExclamation className="drop-shadow-lg" />}
        title="Confirm"
        message="Are you sure you want to remove profile image?"
      />
    </div>
  );
};

export default AvatarUpload;
