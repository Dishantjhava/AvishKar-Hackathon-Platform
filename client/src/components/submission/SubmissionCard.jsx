const SubmissionCard = ({ submission }) => {
  if (!submission) return null;

  return (
    <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-3 hover:scale-[1.01] hover:-translate-y-1 hover:border-[#E02567]/40 hover:shadow-xl hover:shadow-pink-500/5 transition-all duration-300 ease-out cursor-pointer group">
      <div className="flex items-center justify-between">
        <h4 className="font-heading font-semibold text-[var(--text-primary)] text-lg group-hover:text-[var(--primary-pink)] transition-colors">{submission.projectName}</h4>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--pink-tint)] text-[var(--primary-pink)] capitalize">
          {submission.status || "Submitted"}
        </span>
      </div>

      <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-normal">
        {submission.solution || submission.description}
      </p>

      {submission.techStack && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {submission.techStack.split(",").map((tech) => (
            <span key={tech} className="px-2.5 py-0.5 rounded-full text-xs bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-color)] font-normal">
              {tech.trim()}
            </span>
          ))}
        </div>
      )}

      <div className="pt-3 border-t border-[var(--border-color)] flex flex-wrap gap-4 text-xs font-semibold text-[var(--primary-pink)]">
        {submission.githubRepo && (
          <a href={submission.githubRepo} target="_blank" rel="noreferrer" className="hover:underline">
            GitHub Repo ↗
          </a>
        )}
        {submission.liveDemoUrl && (
          <a href={submission.liveDemoUrl} target="_blank" rel="noreferrer" className="hover:underline">
            Live Demo ↗
          </a>
        )}
      </div>
    </div>
  );
};

export default SubmissionCard;
