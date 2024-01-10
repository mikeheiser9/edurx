interface buttonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export const Button = ({
  onClick,
  label,
  className,
  ...restProps
}: buttonProps) => {
  return (
    <button
      className={`${className} bg-transparent border-eduBlack border-[1.5px] my-3 md:rounded-[5px] rounded py-1 md:w-[150px] w-[100px] m-auto md:text-[16px] md:leading-normal text-xs font-body transition-colors duration-500 hover:bg-eduBlack hover:text-white disabled:opacity-70`}
      onClick={onClick}
      {...restProps}
    >
      {label || restProps.children}
    </button>
  );
};
