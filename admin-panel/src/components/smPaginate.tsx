import React from "react";

import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";

const SmPaginate = () => {
  const btnClass = `relative rounded h-8 w-8 border border-bor-light hover:border-primary/10 text-dark hover:text-primary hover:bg-primary/10 font-medium uppercase flex items-center justify-center text-center transition-all`;

  const activeBtnClass = `!bg-primary !border-primary !text-white`;

  return (
    <div className="flex items-end gap-2 text-sm">
      <button className={`${btnClass}`}>
        <AiOutlineLeft />
      </button>
      <button className={`${btnClass} ${activeBtnClass} `}>1</button>
      <button className={`${btnClass}`}>2</button>
      <button className={`${btnClass}`}>3</button>
      <span className="text-dark">...</span>
      <button className={`${btnClass}`}>99</button>
      <button className={`${btnClass}`}>
        <AiOutlineRight />
      </button>
    </div>
  );
};

export default SmPaginate;
