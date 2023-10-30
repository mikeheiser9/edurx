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
      className={`${className} bg-transparent border-eduBlack border-[1.5px] my-3 rounded-[10px] py-1 w-[150px] m-auto text-[16px] font-body transition-colors duration-500 hover:bg-eduBlack hover:text-white disabled:opacity-70`}
      onClick={onClick}
      {...restProps}
    >
      {label || restProps.children}
    </button>
  );
};
