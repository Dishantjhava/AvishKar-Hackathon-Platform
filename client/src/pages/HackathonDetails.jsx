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
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", paddingTop: "5.5rem", paddingBottom: "5rem", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Hero Banner — uses site's own color vars ─── */}
      <div style={{
        background: "var(--pink-tint)",
        borderBottom: "1px solid rgba(224,37,103,0.10)",
        padding: "3rem 2rem 2.5rem",
        marginBottom: "2.5rem",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

          {/* Back link */}
          <Link to="/hackathons" style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            color: "var(--text-muted)", fontSize: "13px", marginBottom: "1.5rem",
            textDecoration: "none", fontWeight: 500,
          }}>
            ← Back to Hackathons
          </Link>

          {/* Badge row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "1.1rem" }}>
            {/* Theme */}
            <span style={{
              padding: "4px 14px", borderRadius: "999px", fontSize: "11px",
              fontWeight: 700, background: "var(--primary-pink)", color: "#fff",
              letterSpacing: "0.05em", textTransform: "uppercase",
            }}>
              {hackathon.theme}
            </span>

            {/* Mode */}
            <span style={{
              padding: "4px 14px", borderRadius: "999px", fontSize: "11px",
              fontWeight: 600, background: "var(--bg-surface)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-color)",
              display: "flex", alignItems: "center", gap: "5px",
            }}>
              <ModeIcon mode={hackathon.mode} /> {hackathon.mode}
            </span>

            {/* Status */}
            <span style={{
              padding: "4px 14px", borderRadius: "999px", fontSize: "11px",
              fontWeight: 700, background: sc.bg, color: sc.color,
              border: `1px solid ${sc.color}40`,
              display: "flex", alignItems: "center", gap: "6px",
              letterSpacing: "0.05em",
            }}>
              <span style={{
                width: "7px", height: "7px", borderRadius: "50%",
                background: sc.color, display: "inline-block",
              }} />
              {sc.label}
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: "clamp(2rem, 5vw, 3.25rem)",
            fontWeight: 800,
            color: "var(--text-primary)",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: "0.9rem",
            fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
          }}>
            {hackathon.title}
          </h1>

          {/* Description */}
          <p style={{
            fontSize: "15px", color: "var(--text-secondary)",
            lineHeight: 1.75, maxWidth: "660px", marginBottom: "2rem",
          }}>
            {hackathon.description}
          </p>

          {/* Quick stat strip */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.75rem" }}>
            {[
              { icon: "🏆", label: "PRIZE POOL",    value: hackathon.prizePool },
              { icon: "📅", label: "EVENT DATES",   value: `${fmt(hackathon.startDate)} – ${fmt(hackathon.endDate)}` },
              { icon: "⏰", label: "REG. DEADLINE", value: fmt(hackathon.registrationDeadline) },
              { icon: "👥", label: "TEAM SIZE",     value: `Up to ${hackathon.maxTeamSize}` },
            ].map((s) => (
              <div key={s.label} style={{ display: "flex", alignItems: "flex-start", gap: "9px" }}>
                <span style={{ fontSize: "1.2rem", marginTop: "1px" }}>{s.icon}</span>
                <div>
                  <div style={{
                    fontSize: "10px", color: "var(--text-muted)",
                    fontWeight: 700, letterSpacing: "0.07em",
                    textTransform: "uppercase", marginBottom: "2px",
                  }}>{s.label}</div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body grid ───────────────────────────────── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div className="hd-grid">

          {/* ── Left column ──────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Venue */}
            <Section icon="📍" title="Venue">
              <p style={{ fontSize: "15px", color: "var(--text-primary)", fontWeight: 600, margin: 0 }}>
                {hackathon.venue || "Online / Virtual"}
              </p>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "4px 0 0" }}>
                Mode: {hackathon.mode}
              </p>
            </Section>

            {/* Rules */}
            <Section icon="📋" title="Rules & Guidelines">
              {hackathon.rules ? (
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {hackathon.rules.split("\n").filter(Boolean).map((rule, i) => (
                    <li key={i} style={{ display: "flex", gap: "10px", fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.65 }}>
                      <span style={{ color: "var(--primary-pink)", fontWeight: 700, flexShrink: 0, minWidth: "20px" }}>{i + 1}.</span>
                      <span>{rule.replace(/^\d+\.\s*/, "")}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>Standard hackathon honor code applies.</p>
              )}
            </Section>

            {/* Judging Criteria */}
            <Section icon="⚖️" title="Judging Criteria" subtitle="How your submission will be evaluated">
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "4px" }}>
                {hackathon.judgingCriteria?.map((c) => {
                  const pct = Math.round((c.maxScore / totalScore) * 100);
                  return (
                    <div key={c.name}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{c.name}</span>
                        <span style={{
                          fontSize: "12px", fontWeight: 700, color: "var(--primary-pink)",
                          background: "rgba(224,37,103,0.08)",
                          padding: "2px 10px", borderRadius: "999px",
                          border: "1px solid rgba(224,37,103,0.18)",
                        }}>
                          {c.maxScore} pts
                        </span>
                      </div>
                      <div style={{ height: "5px", background: "var(--border-color)", borderRadius: "999px", overflow: "hidden" }}>
                        <div style={{
                          width: `${pct}%`, height: "100%",
                          background: "linear-gradient(90deg, var(--primary-pink), #FF6B9D)",
                          borderRadius: "999px",
                        }} />
                      </div>
                    </div>
                  );
                })}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    Total: <strong style={{ color: "var(--text-primary)" }}>{totalScore} pts</strong>
                  </span>
                </div>
              </div>
            </Section>

            {/* Organizer */}
            {hackathon.organizer && (
              <Section icon="🧑‍💼" title="Organizer">
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--primary-pink), #FF6B9D)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: 700, fontSize: "16px", flexShrink: 0,
                  }}>
                    {hackathon.organizer?.name?.[0] || "O"}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>{hackathon.organizer?.name}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{hackathon.organizer?.email}</div>
                  </div>
                </div>
              </Section>
            )}
          </div>

          {/* ── Sidebar ───────────────────────────────── */}
          <div style={{ position: "sticky", top: "6.5rem", height: "fit-content" }}>
            <div style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}>
              {/* Pink top accent strip */}
              <div style={{ height: "4px", background: "linear-gradient(90deg, var(--primary-pink), #FF6B9D, #f59e0b)" }} />

              <div style={{ padding: "1.5rem" }}>
                <h3 style={{
                  fontSize: "11px", fontWeight: 700, color: "var(--text-muted)",
                  textTransform: "uppercase", letterSpacing: "0.09em",
                  margin: "0 0 1.25rem",
                }}>
                  Event Overview
                </h3>

                {/* Stats list */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {[
                    { label: "Prize Pool",          value: hackathon.prizePool },
                    { label: "Venue",               value: hackathon.venue || "Online" },
                    { label: "Max Team Size",       value: `${hackathon.maxTeamSize} members` },
                    { label: "Registered Teams",    value: `${hackathon.registeredCount || 0} teams`, pink: true },
                    { label: "Registration Closes", value: fmt(hackathon.registrationDeadline) },
                  ].map((item, i, arr) => (
                    <div key={item.label} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "11px 0",
                      borderBottom: i < arr.length - 1 ? "1px solid var(--border-color)" : "none",
                    }}>
                      <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>{item.label}</span>
                      <span style={{
                        fontSize: "13px", fontWeight: 700,
                        color: item.pink ? "var(--primary-pink)" : "var(--text-primary)",
                        textAlign: "right", maxWidth: "55%",
                      }}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Status message */}
                {statusMessage && (
                  <div style={{
                    marginTop: "1rem", padding: "10px 14px", borderRadius: "12px",
                    background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)",
                    color: "#22c55e", fontSize: "13px", fontWeight: 600, textAlign: "center",
                  }}>
                    ✓ {statusMessage}
                  </div>
                )}

                {/* CTA section */}
                <div style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {isAuth ? (
                    role === ROLES.PARTICIPANT ? (
                      registration ? (
                        <>
                          <div style={{
                            padding: "10px 14px", borderRadius: "12px",
                            background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)",
                            textAlign: "center",
                          }}>
                            <span style={{ fontSize: "13px", fontWeight: 700, color: "#22c55e" }}>✓ You're Registered</span>
                            {team && (
                              <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "4px 0 0" }}>
                                Team: <strong>{team.name}</strong>
                              </p>
                            )}
                          </div>
                          <PinkButton onClick={() => navigate(`/submit/${id}`)}>Submit Project →</PinkButton>
                          <button
                            onClick={handleCancelRegistration}
                            disabled={registering}
                            style={{
                              fontSize: "12px", fontWeight: 600, color: "#ef4444",
                              background: "none", border: "none", cursor: "pointer",
                              padding: "4px", textDecoration: "underline",
                            }}>
                            Cancel Registration
                          </button>
                        </>
                      ) : (
                        <>
                          {team ? (
                            <p style={{ fontSize: "12px", color: "var(--text-secondary)", textAlign: "center", margin: 0 }}>
                              Registering with team: <strong style={{ color: "var(--text-primary)" }}>{team.name}</strong>
                            </p>
                          ) : (
                            <p style={{ fontSize: "12px", color: "var(--text-secondary)", textAlign: "center", margin: 0 }}>
                              No team yet. Register solo or{" "}
                              <Link to="/team" style={{ color: "var(--primary-pink)", fontWeight: 700, textDecoration: "underline" }}>
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
                      <p style={{ fontSize: "12px", color: "var(--text-secondary)", textAlign: "center", fontStyle: "italic", margin: 0 }}>
                        Viewing as <strong>{role}</strong>
                      </p>
                    )
                  ) : (
                    <Link to="/login" style={{ textDecoration: "none" }}>
                      <PinkButton>Log in to Register →</PinkButton>
                    </Link>
                  )}

                  <Link to={`/leaderboard/${id}`} style={{ textDecoration: "none", textAlign: "center" }}>
                    <span style={{
                      fontSize: "12px", fontWeight: 600,
                      color: "var(--text-muted)",
                      transition: "color .2s",
                      cursor: "pointer",
                    }}
                      onMouseEnter={(e) => (e.target.style.color = "var(--primary-pink)")}
                      onMouseLeave={(e) => (e.target.style.color = "var(--text-muted)")}>
                      View Leaderboard 🏆
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive grid */}
      <style>{`
        .hd-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 330px;
          gap: 2rem;
          align-items: start;
        }
        @media (max-width: 860px) {
          .hd-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

/* ── Sub-components ─────────────────────── */
const Section = ({ icon, title, subtitle, children }) => (
  <div style={{
    background: "var(--bg-surface)",
    border: "1px solid var(--border-color)",
    borderRadius: "18px",
    padding: "1.5rem",
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: subtitle ? "3px" : "1rem" }}>
      <span style={{ fontSize: "1.1rem" }}>{icon}</span>
      <h2 style={{
        fontSize: "15px", fontWeight: 700, color: "var(--text-primary)",
        margin: 0, letterSpacing: "-0.01em",
        fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
      }}>
        {title}
      </h2>
    </div>
    {subtitle && (
      <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 1rem 1.75rem" }}>{subtitle}</p>
    )}
    {children}
  </div>
);

const PinkButton = ({ children, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      width: "100%", padding: "13px", borderRadius: "12px",
      background: "linear-gradient(135deg, var(--primary-pink), #FF6B9D)",
      color: "#fff", fontWeight: 700, fontSize: "14px",
      border: "none", cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.7 : 1,
      transition: "opacity .2s, transform .15s",
      letterSpacing: "0.01em",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}
    onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.transform = "translateY(-1px)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
  >
    {children}
  </button>
);

export default HackathonDetails;
