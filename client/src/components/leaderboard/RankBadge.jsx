const RankBadge = ({ rank }) => {
  if (rank === 1) {
    return <span className="text-xl" title="1st Place Gold">🥇</span>;
  }
  if (rank === 2) {
    return <span className="text-xl" title="2nd Place Silver">🥈</span>;
  }
  if (rank === 3) {
    return <span className="text-xl" title="3rd Place Bronze">🥉</span>;
  }

  return (
    <span className="w-7 h-7 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] text-[var(--text-secondary)] font-bold text-xs flex items-center justify-center shadow-2xs">
      #{rank}
    </span>
  );
};

export default RankBadge;
