import React from "react";

const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-[999999] flex items-center  justify-center ">
      <span className=" relative h-14 w-14 border-[8px] border-primary border-b-primary/30 rounded-full block animate-spin " />
    </div>
  );
};

export default FullScreenLoader;