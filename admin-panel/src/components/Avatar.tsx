"use client";

import React, { SyntheticEvent } from "react";
import DefaultImg from "../../public/assets/images/default_restaurant_logo_view.png";
import NextImage from "./NextImage";

const Avatar = ({
  src,
  size,
  alt,
  className,
  rounded = false,
  verifiedIcon,
  defaultImgProp,
  imageClassName,
}: {
  src: string;
  size: string;
  alt: string;
  className?: string;
  rounded?: boolean;
  verifiedIcon?: any;
  defaultImgProp?: string;
  imageClassName?: string;
}) => {
  return (
    <div className={`relative ${size} ${className} `}>
      {verifiedIcon && (
        <NextImage
          src={verifiedIcon}
          alt="test"
          className="h-3 w-3 absolute z-10 bottom-0 right-0"
        />
      )}
      <NextImage
        src={src ? src : DefaultImg.src}
        className={`bg-light object-cover object-center w-full h-full ${
          rounded ? "rounded-full" : "rounded"
        } ${imageClassName}`}
        onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
          e.currentTarget.src = defaultImgProp || DefaultImg.src;
          e.currentTarget.srcset = "";
        }}
        alt={alt}
      />
    </div>
  );
};

export default Avatar;
