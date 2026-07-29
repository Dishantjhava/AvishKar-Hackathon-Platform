
const TeamCard = ({ team }) => {
  if (!team) return null;

  return (
    <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm hover:border-[var(--primary-pink)]/40 transition-all duration-300">
      {/* Team name */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E02567] to-pink-500 flex items-center justify-center text-white font-bold text-base shadow-xs">
          {team.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="text-[var(--text-primary)] font-bold font-heading">{team.name}</h3>
          <p className="text-[var(--text-secondary)] text-xs font-normal">{team.members?.length || 0} member(s)</p>
        </div>
      </div>

      {/* Members list */}
      <div className="flex flex-wrap gap-2 font-normal">
        {team.members?.map((member) => (
          <span
            key={member._id}
            className="flex items-center gap-1.5 text-xs bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-color)] px-2.5 py-1 rounded-full"
          >
            {member._id === team.leader && <span className="text-amber-400">👑</span>}
            {member.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TeamCard;
