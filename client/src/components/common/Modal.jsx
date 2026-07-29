import { useEffect } from "react";

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeMap = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div
        className={`w-full ${sizeMap[size]} bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] rounded-3xl p-6 shadow-2xl border border-[var(--border-color)] animate-in fade-in zoom-in-95 duration-150`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)] mb-4">
          <h3 className="text-xl font-bold font-heading text-[var(--text-primary)]">{title}</h3>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
