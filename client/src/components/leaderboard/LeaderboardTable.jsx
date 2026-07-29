import RankBadge from "./RankBadge";

const LeaderboardTable = ({ entries = [] }) => {
  if (!entries.length) {
    return (
      <div className="text-center py-16 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl text-[var(--text-secondary)]">
        <p className="text-4xl mb-3">🏆</p>
        <p className="font-heading font-semibold text-[var(--text-primary)] mb-1">No scores published yet</p>
        <p className="text-xs text-[var(--text-secondary)] font-normal">Check back once judges complete evaluations!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-sm hover:border-[#E02567]/30 transition-all">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="bg-[var(--bg-surface-elevated)] border-b border-[var(--border-color)] text-[var(--text-muted)] text-xs uppercase tracking-wider font-semibold">
            <th className="px-6 py-4 w-20">Rank</th>
            <th className="px-6 py-4">Team</th>
            <th className="px-6 py-4">Project</th>
            <th className="px-6 py-4 text-right">Score</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)] font-normal text-[var(--text-primary)]">
          {entries.map((entry, index) => (
            <tr
              key={entry.teamName || index}
              className={`transition-all hover:bg-[var(--bg-surface-elevated)] ${
                index === 0 ? "bg-[var(--pink-tint)]/60" : ""
              }`}
            >
              <td className="px-6 py-4">
                <RankBadge rank={entry.rank || index + 1} />
              </td>

              <td className="px-6 py-4 font-heading font-semibold text-[var(--text-primary)]">
                {entry.teamName}
              </td>

              <td className="px-6 py-4 text-[var(--text-secondary)] font-normal">
                {entry.projectName}
              </td>

              <td className="px-6 py-4 text-right font-heading font-bold text-base text-[var(--primary-pink)]">
                {entry.totalScore} <span className="text-xs font-normal text-[var(--text-muted)]">pts</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
