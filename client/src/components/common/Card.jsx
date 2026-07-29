const Card = ({
  children,
  className = "",
  variant = "light",
  hover = false,
  padding = "md",
}) => {
  const paddingMap = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const variantMap = {
    light: "bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] shadow-sm",
    dark: "bg-[var(--dark-card)] border border-[var(--border-color)] text-[var(--text-primary)] shadow-xl",
    pink: "bg-[var(--pink-tint)] border border-pink-100 dark:border-pink-900/30 text-[var(--text-primary)] shadow-sm",
  };

  return (
    <div
      className={`
        rounded-2xl transition-all duration-300
        ${variantMap[variant]}
        ${paddingMap[padding]}
        ${hover ? "hover:-translate-y-1 hover:shadow-md hover:border-[#E02567]/50" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

Card.Header = ({ title, subtitle, action, className = "" }) => (
  <div className={`flex items-start justify-between gap-4 mb-4 ${className}`}>
    <div>
      <h3 className="font-heading text-lg font-semibold tracking-tight text-[var(--text-primary)]">{title}</h3>
      {subtitle && <p className="text-sm text-[var(--text-secondary)] mt-0.5 font-normal">{subtitle}</p>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);

export default Card;
