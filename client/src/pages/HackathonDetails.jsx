import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";
import useAuth from "../hooks/useAuth";
import { ROLES } from "../utils/constants";
import { registerForHackathon, getMyRegistrations, cancelRegistration } from "../services/registrationService";
import { getMyTeam } from "../services/teamService";

/* ── helpers ─────────────────────────────── */
const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—";

const ModeIcon = ({ mode }) => {
  if (mode === "Online")  return <span>🌐</span>;
  if (mode === "Offline") return <span>📍</span>;
  return <span>🔀</span>;
};

const statusConfig = {
  ongoing:   { label: "ONGOING",  dot: "#22c55e", bg: "rgba(34,197,94,.12)",  color: "#22c55e"  },
  upcoming:  { label: "UPCOMING", dot: "#f59e0b", bg: "rgba(245,158,11,.12)", color: "#f59e0b"  },
  completed: { label: "ENDED",    dot: "#94a3b8", bg: "rgba(148,163,184,.12)",color: "#94a3b8"  },
  open:      { label: "OPEN",     dot: "#22c55e", bg: "rgba(34,197,94,.12)",  color: "#22c55e"  },
};

/* ── main ────────────────────────────────── */
const HackathonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuth, role } = useAuth();

  const { data: hackathonData, loading } = useFetch(`/hackathons/${id}`);

  const [registration, setRegistration] = useState(null);
  const [team, setTeam]                 = useState(null);
  const [registering, setRegistering]   = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (isAuth && role === ROLES.PARTICIPANT) {
      getMyRegistrations()
        .then((res) => {
          const list    = res.data || [];
          const matched = list.find((r) => r.hackathon?._id === id || r.hackathon === id);
          if (matched) setRegistration(matched);
        })
        .catch(() => {});

      getMyTeam()
        .then((res) => { if (res.data) setTeam(res.data); })
        .catch(() => {});
    }
  }, [isAuth, role, id]);

  const handleRegister = async () => {
    setRegistering(true);
    setStatusMessage("");
    try {
      const res = await registerForHackathon({ hackathonId: id, teamId: team?._id || null });
      setRegistration(res.data);
      setStatusMessage("Successfully registered!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to register.");
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!registration) return;
    if (!confirm("Cancel your registration?")) return;
    setRegistering(true);
    try {
      await cancelRegistration(registration._id);
      setRegistration(null);
      setStatusMessage("Registration cancelled.");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel.");
    } finally {
      setRegistering(false);
    }
  };

  const hackathon = hackathonData || {
    _id: id,
    title: "HackIndia 2026",
    theme: "AI / ML & Agents",
    mode: "Hybrid",
    venue: "IIIT Delhi, New Delhi",
    description: "A national-level hackathon focused on building AI-powered tools that solve real problems for Indian developers and small businesses.",
    rules: "1. All code must be written during the hackathon.\n2. Teams can consist of 1–4 members.\n3. Plagiarism results in disqualification.",
    prizePool: "₹5,00,000",
    maxTeamSize: 4,
    registrationDeadline: "2026-08-15",
    startDate: "2026-08-20",
    endDate: "2026-08-22",
    status: "ongoing",
    registeredCount: 42,
    judgingCriteria: [
      { name: "Innovation",           maxScore: 10 },
      { name: "Technical Complexity", maxScore: 10 },
      { name: "User Interface",       maxScore: 10 },
      { name: "Functionality",        maxScore: 10 },
      { name: "Scalability",          maxScore: 10 },
      { name: "Documentation",        maxScore: 10 },
      { name: "Presentation",         maxScore: 10 },
    ],
  };

  const sc         = statusConfig[hackathon.status?.toLowerCase()] || statusConfig.upcoming;
  const totalScore = hackathon.judgingCriteria?.reduce((s, c) => s + (c.maxScore || 0), 0) || 100;

  if (loading && !hackathonData) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-page)", paddingTop: "6rem" }}>
        <Loader size="lg" message="Loading hackathon details…" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] pt-24 pb-20 transition-colors duration-200">

      {/* ── Hero Banner ─── */}
      <div className="bg-[var(--pink-tint)] border-b border-[var(--border-color)] py-10 px-6 sm:px-12 mb-10 transition-colors duration-200">
        <div className="max-w-6xl mx-auto">

          {/* Back link */}
          <Link
            to="/hackathons"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--primary-pink)] mb-5 transition-colors"
          >
            ← Back to Hackathons
          </Link>

          {/* Badge row */}
          <div className="flex flex-wrap items-center gap-2 mb-4 font-normal">
            {/* Theme */}
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[var(--primary-pink)] text-white tracking-wide uppercase shadow-xs">
              {hackathon.theme}
            </span>

            {/* Mode */}
            <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-color)] flex items-center gap-1.5 shadow-2xs">
              <ModeIcon mode={hackathon.mode} /> {hackathon.mode}
            </span>

            {/* Status */}
            <span
              className="px-3.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 tracking-wide border"
              style={{ background: sc.bg, color: sc.color, borderColor: `${sc.color}40` }}
            >
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: sc.color }} />
              {sc.label}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-[var(--text-primary)] tracking-tight leading-tight mb-3">
            {hackathon.title}
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl mb-8 font-normal">
            {hackathon.description}
          </p>

          {/* Quick stat strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {[
              { icon: "🏆", label: "PRIZE POOL",    value: hackathon.prizePool },
              { icon: "📅", label: "EVENT DATES",   value: `${fmt(hackathon.startDate)} – ${fmt(hackathon.endDate)}` },
              { icon: "⏰", label: "REG. DEADLINE", value: fmt(hackathon.registrationDeadline) },
              { icon: "👥", label: "TEAM SIZE",     value: `Up to ${hackathon.maxTeamSize}` },
            ].map((s) => (
              <div key={s.label} className="flex items-start gap-2.5 p-3 rounded-2xl bg-[var(--bg-surface)]/60 border border-[var(--border-color)] backdrop-blur-xs">
                <span className="text-xl leading-none mt-0.5">{s.icon}</span>
                <div>
                  <div className="text-[10px] font-bold text-[var(--text-muted)] tracking-wider uppercase mb-0.5">{s.label}</div>
                  <div className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">{s.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body grid ───────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ── Left column (Span 2) ──────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Venue */}
            <Section icon="📍" title="Venue">
              <p className="text-sm font-bold text-[var(--text-primary)]">
                {hackathon.venue || "Online / Virtual"}
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1 font-normal">
                Mode: {hackathon.mode}
              </p>
            </Section>

            {/* Rules */}
            <Section icon="📋" title="Rules & Guidelines">
              {hackathon.rules ? (
                <ul className="space-y-2.5 font-normal">
                  {hackathon.rules.split("\n").filter(Boolean).map((rule, i) => (
                    <li key={i} className="flex gap-2.5 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      <span className="text-[var(--primary-pink)] font-bold flex-shrink-0 min-w-[20px]">{i + 1}.</span>
                      <span>{rule.replace(/^\d+\.\s*/, "")}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-normal">Standard hackathon honor code applies.</p>
              )}
            </Section>

            {/* Judging Criteria */}
            <Section icon="⚖️" title="Judging Criteria" subtitle="How your submission will be evaluated">
              <div className="space-y-3.5 mt-1 font-normal">
                {hackathon.judgingCriteria?.map((c) => {
                  const pct = Math.round((c.maxScore / totalScore) * 100);
                  return (
                    <div key={c.name}>
                      <div className="flex justify-between items-center mb-1.5 text-xs sm:text-sm">
                        <span className="font-semibold text-[var(--text-primary)]">{c.name}</span>
                        <span className="font-bold text-[var(--primary-pink)] bg-[var(--pink-tint)] px-2.5 py-0.5 rounded-full border border-pink-200 dark:border-pink-900/30 text-xs">
                          {c.maxScore} pts
                        </span>
                      </div>
                      <div className="h-1.5 bg-[var(--border-color)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[var(--primary-pink)] to-pink-400 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="flex justify-end pt-1">
                  <span className="text-xs text-[var(--text-muted)]">
                    Total: <strong className="text-[var(--text-primary)]">{totalScore} pts</strong>
                  </span>
                </div>
              </div>
            </Section>

            {/* Organizer */}
            {hackathon.organizer && (
              <Section icon="🧑‍💼" title="Organizer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary-pink)] to-pink-500 flex items-center justify-center text-white font-bold text-base shadow-xs flex-shrink-0">
                    {hackathon.organizer?.name?.[0] || "O"}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[var(--text-primary)] font-heading">{hackathon.organizer?.name}</div>
                    <div className="text-xs text-[var(--text-secondary)] font-normal">{hackathon.organizer?.email}</div>
                  </div>
                </div>
              </Section>
            )}
          </div>

          {/* ── Sidebar (Sticky) ───────────────────────────────── */}
          <div className="lg:col-span-1 sticky top-24">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-md transition-colors duration-200">
              {/* Pink top accent strip */}
              <div className="h-1 bg-gradient-to-r from-[var(--primary-pink)] via-pink-400 to-amber-400" />

              <div className="p-6">
                <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4">
                  EVENT OVERVIEW
                </h3>

                {/* Stats list */}
                <div className="divide-y divide-[var(--border-color)] font-normal">
                  {[
                    { label: "Prize Pool",          value: hackathon.prizePool },
                    { label: "Venue",               value: hackathon.venue || "Online" },
                    { label: "Max Team Size",       value: `${hackathon.maxTeamSize} members` },
                    { label: "Registered Teams",    value: `${hackathon.registeredCount || 0} teams`, pink: true },
                    { label: "Registration Closes", value: fmt(hackathon.registrationDeadline) },
                  ].map((item) => (
                    <div key={item.label} className="py-3 flex justify-between items-center text-xs sm:text-sm">
                      <span className="text-[var(--text-secondary)] font-medium">{item.label}</span>
                      <span className={`font-bold text-right max-w-[55%] ${item.pink ? "text-[var(--primary-pink)]" : "text-[var(--text-primary)]"}`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Status message */}
                {statusMessage && (
                  <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 text-xs font-semibold text-center">
                    ✓ {statusMessage}
                  </div>
                )}

                {/* CTA section */}
                <div className="mt-5 space-y-3 font-normal">
                  {isAuth ? (
                    role === ROLES.PARTICIPANT ? (
                      registration ? (
                        <>
                          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center">
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">✓ You're Registered</span>
                            {team && (
                              <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                                Team: <strong>{team.name}</strong>
                              </p>
                            )}
                          </div>
                          <PinkButton onClick={() => navigate(`/submit/${id}`)}>Submit Project →</PinkButton>
                          <button
                            onClick={handleCancelRegistration}
                            disabled={registering}
                            className="w-full text-center text-xs font-semibold text-red-500 hover:underline pt-1 cursor-pointer">
                            Cancel Registration
                          </button>
                        </>
                      ) : (
                        <>
                          {team ? (
                            <p className="text-xs text-[var(--text-secondary)] text-center">
                              Registering with team: <strong className="text-[var(--text-primary)]">{team.name}</strong>
                            </p>
                          ) : (
                            <p className="text-xs text-[var(--text-secondary)] text-center">
                              No team yet. Register solo or{" "}
                              <Link to="/team" className="text-[var(--primary-pink)] font-semibold underline">
                                create a team
                              </Link>
                            </p>
                          )}
                          <PinkButton onClick={handleRegister} disabled={registering}>
                            {registering ? "Registering…" : "Register Now →"}
                          </PinkButton>
                        </>
                      )
                    ) : (
                      <p className="text-xs text-[var(--text-secondary)] text-center italic">
                        Viewing as <strong>{role}</strong>
                      </p>
                    )
                  ) : (
                    <Link to="/login" className="block">
                      <PinkButton>Log in to Register →</PinkButton>
                    </Link>
                  )}

                  <Link to={`/leaderboard/${id}`} className="block text-center pt-1">
                    <span className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--primary-pink)] transition-colors cursor-pointer">
                      View Leaderboard 🏆
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Sub-components ─────────────────────── */
const Section = ({ icon, title, subtitle, children }) => (
  <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm transition-colors duration-200">
    <div className={`flex items-center gap-2.5 ${subtitle ? "mb-1" : "mb-4"}`}>
      <span className="text-lg">{icon}</span>
      <h2 className="text-base font-bold font-heading text-[var(--text-primary)] tracking-tight">
        {title}
      </h2>
    </div>
    {subtitle && (
      <p className="text-xs text-[var(--text-muted)] mb-4 ml-7 font-normal">{subtitle}</p>
    )}
    {children}
  </div>
);

const PinkButton = ({ children, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[var(--primary-pink)] to-pink-500 text-white font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer font-heading tracking-wide"
  >
    {children}
  </button>
);

export default HackathonDetails;
