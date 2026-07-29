import { useNavigate } from "react-router-dom";

const HackathonCard = ({
  id,
  _id,
  title,
  theme,
  mode,
  prize,
  deadline,
  teamSize,
  status = "Open",
  onClick,
}) => {
  const navigate = useNavigate();
  const targetId = id || _id;

  const handleCardClick = (e) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    } else if (targetId) {
      navigate(`/hackathons/${targetId}`);
    } else {
      navigate("/hackathons");
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)] p-6 shadow-sm hover:shadow-xl hover:shadow-pink-500/10 hover:border-[#E02567]/50 hover:scale-[1.02] hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between group cursor-pointer relative overflow-hidden"
    >
      {/* Subtle edge hover glow backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E02567]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 font-normal">
            {status?.toLowerCase() === "ongoing" || status?.toLowerCase() === "open" || status?.toLowerCase() === "live" ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {status}
              </span>
            ) : status?.toLowerCase() === "upcoming" ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {status}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-color)] uppercase tracking-wider">
                {status}
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-color)]">
              {mode}
            </span>
          </div>
          <span className="text-xs text-[var(--text-muted)] font-normal">Max {teamSize} per team</span>
        </div>

        <h3 className="font-heading text-xl font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary-pink)] transition-colors duration-150 mb-2">
          {title}
        </h3>

        <div className="flex flex-wrap gap-1.5 mb-4 font-normal">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--pink-tint)] text-[var(--primary-pink)]">
            {theme}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-color)]">
            Prize: {prize}
          </span>
        </div>
      </div>

      <div className="relative z-10 pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-secondary)] font-normal">
        <span>Deadline: <strong className="text-[var(--text-primary)] font-semibold">{deadline}</strong></span>
        <button
          type="button"
          onClick={handleCardClick}
          className="font-semibold text-[var(--primary-pink)] flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer bg-transparent border-none p-0"
        >
          View details →
        </button>
      </div>
    </div>
  );
};

export default HackathonCard;
