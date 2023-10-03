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
      className={`${className} bg-primary rounded p-2 m-auto w-1/2 text-lg hover:bg-yellow-500 disabled:opacity-60 disabled:cursor-not-allowed`}
      onClick={onClick}
      {...restProps}
    >
      {label || restProps.children}
    </button>
  );
};
