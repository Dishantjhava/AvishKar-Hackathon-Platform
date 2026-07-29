
import { useState, useMemo } from "react";
import useFetch from "../hooks/useFetch";
import HackathonCard from "../components/hackathon/HackathonCard";
import HackathonFilterBar from "../components/hackathon/HackathonFilterBar";
import Loader from "../components/common/Loader";

const HackathonListing = () => {
  const [filters, setFilters] = useState({ search: "", mode: "", status: "", theme: "" });


  const queryParams = new URLSearchParams();
  if (filters.search) queryParams.append("search", filters.search);
  if (filters.mode)   queryParams.append("mode", filters.mode);
  if (filters.status) queryParams.append("status", filters.status);
  if (filters.theme)  queryParams.append("theme", filters.theme);

  const apiEndpoint = `/hackathons?${queryParams.toString()}`;
  const { data, loading, error } = useFetch(apiEndpoint);

  /* Client-side fallback dataset if backend data is offline */
  const filtered = useMemo(() => {
    const list = data || [
      {
        _id: "h1",
        title: "HackIndia 2026",
        theme: "AI / ML & Agents",
        mode: "Hybrid",
        prizePool: "₹5,00,000",
        registrationDeadline: "2026-08-15",
        maxTeamSize: 4,
        status: "open",
      },
      {
        _id: "h2",
        title: "FinTech Battle 2026",
        theme: "Web3 & Blockchain",
        mode: "Online",
        prizePool: "₹2,50,000",
        registrationDeadline: "2026-08-20",
        maxTeamSize: 3,
        status: "open",
      },
      {
        _id: "h3",
        title: "GreenCode Summit",
        theme: "CleanTech & Sustainability",
        mode: "Offline",
        prizePool: "₹1,50,000",
        registrationDeadline: "2026-09-01",
        maxTeamSize: 4,
        status: "upcoming",
      },
      {
        _id: "h4",
        title: "CyberShield Hack",
        theme: "Cybersecurity",
        mode: "Online",
        prizePool: "₹3,00,000",
        registrationDeadline: "2026-09-10",
        maxTeamSize: 4,
        status: "upcoming",
      },
    ];

    const now = new Date();

    return list.filter((h) => {
      const matchSearch = filters.search
        ? h.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          h.theme.toLowerCase().includes(filters.search.toLowerCase())
        : true;

      const matchMode = filters.mode
        ? h.mode.toLowerCase() === filters.mode.toLowerCase()
        : true;

      const regDate = new Date(h.registrationDeadline);
      let matchStatus = true;

      if (filters.status === "open") {
        matchStatus = h.status.toLowerCase() === "open" || regDate >= now;
      } else if (filters.status === "closed") {
        matchStatus = h.status.toLowerCase() === "closed" || regDate < now;
      } else if (filters.status) {
        matchStatus = h.status.toLowerCase() === filters.status.toLowerCase();
      }

      const matchTheme = filters.theme
        ? h.theme.toLowerCase().includes(filters.theme.toLowerCase())
        : true;

      return matchSearch && matchMode && matchStatus && matchTheme;
    });
  }, [data, filters]);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] pt-28 pb-20 px-6 md:px-12 max-w-7xl mx-auto transition-colors duration-200">

      {/* Page Header */}
      <div className="mb-10 text-center sm:text-left">
        <p className="text-[var(--primary-pink)] font-semibold text-xs uppercase tracking-widest mb-2">EXPLORE EVENTS</p>
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-[var(--text-primary)] mb-3">
          Discover Hackathons
        </h1>
        <p className="text-[var(--text-secondary)] text-sm max-w-2xl font-normal">
          Find your next challenge. Compete in college and industry hackathons, build innovative projects, and win prize pools.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[var(--bg-surface)] p-4 rounded-2xl border border-[var(--border-color)] shadow-sm mb-8">
        <HackathonFilterBar filters={filters} onChange={setFilters} />
      </div>

      {/* Loading state */}
      {loading && !data && (
        <div className="flex justify-center py-20">
          <Loader size="lg" message="Fetching hackathons..." />
        </div>
      )}

      {/* Error state */}
      {error && !data && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 p-4 rounded-2xl text-center text-xs my-6 font-normal">
          Backend server offline. Showing client fallback preview data.
        </div>
      )}

      {/* Results Count & Active Filter Tags */}
      <div className="mb-4 flex items-center justify-between text-xs text-[var(--text-secondary)] font-normal">
        <span>Showing <strong className="text-[var(--text-primary)] font-semibold">{filtered.length}</strong> hackathon(s)</span>
        {filters.search || filters.mode || filters.status || filters.theme ? (
          <button
            onClick={() => setFilters({ search: "", mode: "", status: "", theme: "" })}
            className="text-[var(--primary-pink)] font-semibold underline hover:opacity-80 cursor-pointer"
          >
            Reset all filters
          </button>
        ) : null}
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-12 text-center text-[var(--text-secondary)]">
          <p className="text-4xl mb-3">🔍</p>
          <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)] mb-1">No hackathons match your filter criteria</h3>
          <p className="text-xs mb-4 font-normal">Try clearing one of your filters or searching for a different keyword</p>
          <button
            onClick={() => setFilters({ search: "", mode: "", status: "", theme: "" })}
            className="text-xs font-semibold text-[var(--primary-pink)] underline hover:opacity-80 cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        /* Hackathon Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((h) => (
            <HackathonCard
              key={h._id || h.title}
              id={h._id}
              _id={h._id}
              title={h.title}
              theme={h.theme}
              mode={h.mode}
              prize={h.prizePool || h.prize}
              deadline={h.registrationDeadline ? new Date(h.registrationDeadline).toLocaleDateString() : h.deadline}
              teamSize={h.maxTeamSize || h.teamSize}
              status={h.status}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default HackathonListing;
