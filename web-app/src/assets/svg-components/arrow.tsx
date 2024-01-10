import React, { useRef } from "react";

const Arrow = (props: React.SVGAttributes<SVGSVGElement>) => {
  return (
    <>
      <svg
        width="36"
        height="37"
        viewBox="0 0 36 37"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="z-20"
        {...props}
      >
        <ellipse cx="18" cy="18.5" rx="18" ry="18.5" fill="#FDCD26" />
        <path
          d="M26.0605 12.2656C26.1008 11.7148 25.687 11.2356 25.1361 11.1953L16.1601 10.5385C15.6093 10.4982 15.1301 10.912 15.0898 11.4629C15.0495 12.0137 15.4634 12.4929 16.0142 12.5332L23.9929 13.117L23.409 21.0956C23.3687 21.6464 23.7826 22.1256 24.3334 22.1659C24.8842 22.2063 25.3634 21.7924 25.4037 21.2416L26.0605 12.2656ZM11.1224 25.5537L25.7168 12.9494L24.4095 11.4358L9.81513 24.0401L11.1224 25.5537Z"
          fill="#13222A"
        />
      </svg>
    </>
  );
};

export default Arrow;
