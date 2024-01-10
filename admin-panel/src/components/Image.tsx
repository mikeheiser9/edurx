"use client";

import Image from "next/image";
import React, { useState } from "react";
import DefaultImg from "../../public/assets/images/default-img.svg";

const CommonImage = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;

}) => {
  const [error, setError] = useState(false);

  return (
      <Image
        src={!error ? src : DefaultImg}
        className={className}
        height={10}
        width={10}
        onError={() => setError(true)}
        alt={alt}
      />
  );
};

export default CommonImage;