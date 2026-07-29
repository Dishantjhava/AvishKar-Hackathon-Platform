import Button from "../common/Button";

const ScoreCard = ({ submission, onReview, reviewed }) => {
  return (
    <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm flex flex-col justify-between hover:scale-[1.02] hover:-translate-y-1 hover:border-[#E02567]/40 hover:shadow-xl hover:shadow-pink-500/5 transition-all duration-300 ease-out cursor-pointer group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2 font-normal">
          <span className="font-heading font-semibold text-[var(--text-primary)] text-base group-hover:text-[var(--primary-pink)] transition-colors">{submission.projectName}</span>
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
              reviewed ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60" : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60"
            }`}
          >
            {reviewed ? "✓ Reviewed" : "● Pending"}
          </span>
        </div>
        <p className="text-xs text-[var(--text-secondary)] font-normal mb-3">
          Team: <strong className="text-[var(--text-primary)] font-semibold">{submission.team?.name || "N/A"}</strong>
        </p>
      </div>

      <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between font-normal">
        <a href={submission.githubRepo || "#"} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[var(--primary-pink)] hover:underline">
          View Code ↗
        </a>
        <Button variant={reviewed ? "outline" : "primary"} size="sm" onClick={() => onReview(submission)}>
          {reviewed ? "Edit Score" : "Score Project →"}
        </Button>
      </div>
    </div>
  );
};

export default ScoreCard;
