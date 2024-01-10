import Image, { ImageProps } from "next/image";
import React from "react";

const NextImage = (imageProps: ImageProps) => {
  const { src, alt, height = 1000, width = 1000, ...props } = imageProps;
  return <Image src={src} alt={alt} height={height} width={width} {...props} />;
};

export default NextImage;
