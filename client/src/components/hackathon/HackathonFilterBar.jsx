
const HackathonFilterBar = ({ filters, onChange }) => {
  const handleSearchChange = (e) => {
    onChange({ ...filters, search: e.target.value });
  };

  const handleModeChange = (e) => {
    onChange({ ...filters, mode: e.target.value });
  };

  const handleStatusChange = (e) => {
    onChange({ ...filters, status: e.target.value });
  };

  const handleThemeChange = (e) => {
    onChange({ ...filters, theme: e.target.value });
  };

  const themesList = [
    "AI / ML & Agents",
    "Web3 & Blockchain",
    "CleanTech & Sustainability",
    "Cybersecurity",
    "Open Innovation",
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px]">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">🔍</span>
        <input
          type="text"
          value={filters.search || ""}
          onChange={handleSearchChange}
          placeholder="Search hackathons by keyword..."
          className="w-full pl-9 pr-4 py-2.5 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-pink)] transition-all placeholder:text-[var(--text-muted)]"
        />
      </div>

      {/* Mode Filter */}
      <select
        value={filters.mode || ""}
        onChange={handleModeChange}
        className="px-4 py-2.5 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-semibold focus:outline-none focus:border-[var(--primary-pink)] cursor-pointer"
      >
        <option value="">All Modes</option>
        <option value="Online">Online</option>
        <option value="Offline">Offline</option>
        <option value="Hybrid">Hybrid</option>
      </select>

      {/* Status Filter */}
      <select
        value={filters.status || ""}
        onChange={handleStatusChange}
        className="px-4 py-2.5 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-semibold focus:outline-none focus:border-[var(--primary-pink)] cursor-pointer"
      >
        <option value="">All Statuses</option>
        <option value="open">Registration Open</option>
        <option value="closed">Registration Closed</option>
        <option value="upcoming">Upcoming</option>
        <option value="ongoing">Ongoing</option>
        <option value="completed">Completed</option>
      </select>

      {/* Theme Filter */}
      <select
        value={filters.theme || ""}
        onChange={handleThemeChange}
        className="px-4 py-2.5 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs font-semibold focus:outline-none focus:border-[var(--primary-pink)] cursor-pointer"
      >
        <option value="">All Themes</option>
        {themesList.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
    </div>
  );
};

export default HackathonFilterBar;
