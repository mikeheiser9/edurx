
import Link from "next/link";
import React, { ComponentProps } from "react";
const CodeLink = ({
  children,
  href,
  className,
  onClick,
  refrance,
  ...others
}: Omit<ComponentProps<typeof Link>, "href"> & {
  children?: any;
  href: string|{
                pathname: string,
                query: {}
              }
  className?: any;
  onClick?: any;
  refrance?: any;
  others?: any;
}) => {
  return (
    <Link
      href={href}
      className={className}
      onClick={onClick}
      {...others}
      ref={refrance ? refrance : null}
    >
      {children}
    </Link>
  );
};

export default CodeLink;
