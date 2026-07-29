
const Input = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder = "",
  error = "",
  required = false,
  disabled = false,
  rows = 0,
  className = "",
}) => {
  const hasError = Boolean(error && String(error).trim().length > 0);

  return (
    <div className="flex flex-col gap-1.5 w-full font-normal">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-[var(--text-primary)]">
          {label} {required && <span className="text-[var(--primary-pink)]">*</span>}
        </label>
      )}

      {rows > 0 ? (
        <textarea
          id={id}
          rows={rows}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`px-4 py-2.5 rounded-xl border text-sm transition-all outline-none bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] ${
            hasError
              ? "border-red-500 bg-red-50/20"
              : "border-[var(--border-color)] focus:border-[var(--primary-pink)]"
          } ${className}`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`px-4 py-2.5 rounded-xl border text-sm transition-all outline-none bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] ${
            hasError
              ? "border-red-500 bg-red-50/20"
              : "border-[var(--border-color)] focus:border-[var(--primary-pink)]"
          } ${className}`}
        />
      )}

      {hasError && <span className="text-xs text-red-600 font-normal">{error}</span>}
    </div>
  );
};

export default Input;
