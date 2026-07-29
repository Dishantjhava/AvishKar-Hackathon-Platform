const StatCard = ({ label, value, subtext, badge }) => {
  const strValue = String(value ?? "0");
  const isNumber = /^\d+$/.test(strValue.trim());

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3 hover:scale-[1.01] hover:-translate-y-0.5 hover:border-[#E02567]/40 hover:shadow-lg hover:shadow-pink-500/5 transition-all duration-200 ease-out min-h-[135px] overflow-hidden cursor-pointer group">
      {/* Top Header Label */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider truncate">
          {label}
        </p>
        <span className="text-[var(--text-muted)] group-hover:text-[var(--primary-pink)] transition-colors text-xs flex-shrink-0">•••</span>
      </div>

      {/* Primary Metric Value */}
      <div className="my-0.5 overflow-hidden">
        {isNumber ? (
          <p
            title={strValue}
            className="text-3xl font-bold font-sans text-[var(--text-primary)] tracking-tight truncate"
          >
            {strValue}
          </p>
        ) : (
          <p
            title={strValue}
            className="text-base sm:text-lg font-semibold font-sans text-[var(--text-primary)] tracking-tight truncate"
          >
            {strValue}
          </p>
        )}
      </div>

      {/* Bottom Subtext / Badge */}
      {(subtext || badge) && (
        <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs gap-2 font-normal">
          {subtext && <span className="text-[var(--text-secondary)] font-normal text-[11px] truncate">{subtext}</span>}
          {badge && (
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 uppercase flex-shrink-0 tracking-wider">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
