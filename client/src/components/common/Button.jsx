const Button = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none whitespace-nowrap";

  const variantStyles = {
    primary: "bg-[#E02567] hover:bg-[#C81E57] text-white shadow-md shadow-[#E02567]/20 active:scale-[0.98]",
    dark: "bg-[#0F141A] hover:bg-[#1C232B] text-white active:scale-[0.98]",
    secondary: "bg-[#FDF2F5] hover:bg-[#FBE4EB] text-[#E02567] border border-[#E02567]/20 active:scale-[0.98]",
    outline: "bg-white border border-slate-900 hover:bg-slate-50 text-slate-900 active:scale-[0.98]",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-base gap-2.5",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
