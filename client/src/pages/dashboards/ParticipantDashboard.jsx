import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/common/Card";
import StatCard from "../../components/common/StatCard";
import Button from "../../components/common/Button";
import Icon from "../../components/common/Icon";
import Loader from "../../components/common/Loader";
import SubmissionCard from "../../components/submission/SubmissionCard";
import useFetch from "../../hooks/useFetch";
import useAuth from "../../hooks/useAuth";

const ParticipantDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: registrationsData, loading: regLoading } = useFetch("/registrations/mine");
  const { data: teamData, loading: teamLoading } = useFetch("/teams/mine");
  const { data: submissionData, loading: subLoading } = useFetch("/submissions/mine");

  const registrations = Array.isArray(registrationsData) ? registrationsData : [];
  const team = teamData || null;
  const submissions = Array.isArray(submissionData) ? submissionData : (submissionData ? [submissionData] : []);
  const primarySubmission = submissions[0] || null;

  if (regLoading || teamLoading || subLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" message="Loading your workspace..." />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-[var(--text-primary)] font-normal">
      {/* Page Title Header */}
      <div>
        <p className="text-[var(--primary-pink)] font-semibold text-xs uppercase tracking-widest mb-1">
          MY WORKSPACE
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
          Participant Overview
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          Track registered events, collaborate with your team, and manage project submissions.
        </p>
      </div>

      {/* Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="REGISTERED EVENTS"
          value={registrations.length}
          subtext={registrations.length === 1 ? "1 Enrolled Hackathon" : `${registrations.length} Enrolled Hackathons`}
          badge={registrations.length > 0 ? "ACTIVE" : "EMPTY"}
        />
        <StatCard
          label="MY TEAM"
          value={team ? team.name : "No Team"}
          subtext={team ? `${team.members?.length || 1} Member(s)` : "Create or join team"}
          badge={team ? "FORMED" : "PENDING"}
        />
        <StatCard
          label="SUBMITTED PROJECTS"
          value={submissions.length > 0 ? `${submissions.length} Project(s)` : "0 Submitted"}
          subtext={primarySubmission ? `Latest: ${primarySubmission.projectName}` : "Pending submission"}
          badge={submissions.length > 0 ? (primarySubmission?.status?.toUpperCase() || "SUBMITTED") : "PENDING"}
        />
        <StatCard
          label="ACCOUNT ROLE"
          value={user?.role ? user.role.toUpperCase() : "PARTICIPANT"}
          subtext={user?.email || "Student Developer"}
          badge="VERIFIED"
        />
      </div>

      {/* Grid: Registered Events & Team Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registered Events Card */}
        <Card variant="light" padding="lg" className="shadow-sm">
          <Card.Header
            title="Registered Events"
            subtitle="Hackathons you have enrolled in live from MongoDB"
            action={
              <Link to="/hackathons">
                <Button variant="outline" size="sm">
                  Browse Events →
                </Button>
              </Link>
            }
          />

          {registrations.length === 0 ? (
            <div className="text-center py-8 bg-[var(--bg-surface-elevated)] rounded-2xl border border-[var(--border-color)] text-[var(--text-secondary)]">
              <p className="text-3xl mb-2">🎯</p>
              <p className="font-heading font-semibold text-[var(--text-primary)] text-sm mb-1">
                No event registrations yet
              </p>
              <p className="text-xs text-[var(--text-secondary)] mb-3">
                Browse available hackathons and register your team!
              </p>
              <Link to="/hackathons">
                <Button variant="primary" size="sm">
                  Browse Events →
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {registrations.map((reg) => {
                const hackathon = reg.hackathon || {};
                const title = hackathon.title || "Hackathon Event";
                const theme = hackathon.theme || "General";
                const mode = hackathon.mode || "Online";
                const status = reg.status || "approved";
                const dateStr = hackathon.startDate
                  ? new Date(hackathon.startDate).toLocaleDateString()
                  : "Upcoming";

                return (
                  <div
                    key={reg._id}
                    onClick={() => navigate(`/hackathons/${hackathon._id || hackathon}`)}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] shadow-2xs">
                        <Icon name="trophy" className="w-5 h-5 text-[var(--primary-pink)]" />
                      </div>
                      <div>
                        <p className="font-heading font-semibold text-[var(--text-primary)] text-sm">{title}</p>
                        <p className="text-xs text-[var(--text-secondary)] font-normal">
                          <span className="text-[var(--primary-pink)] font-semibold">{theme}</span> · {mode}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                        {status}
                      </span>
                      <p className="text-[11px] text-[var(--text-muted)] font-normal mt-1">{dateStr}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Team Roster Card */}
        <Card variant="light" padding="lg" className="shadow-sm">
          <Card.Header
            title="My Team Roster"
            subtitle="Active team members and leader"
            action={
              <Link to="/team">
                <Button variant="outline" size="sm">
                  Manage Team →
                </Button>
              </Link>
            }
          />

          {!team ? (
            <div className="text-center py-8 bg-[var(--bg-surface-elevated)] rounded-2xl border border-[var(--border-color)] text-[var(--text-secondary)]">
              <p className="text-3xl mb-2">👥</p>
              <p className="font-heading font-semibold text-[var(--text-primary)] text-sm mb-1">
                You are not in a team yet
              </p>
              <p className="text-xs text-[var(--text-secondary)] mb-3">
                Create a team to collaborate with peers or join an existing team!
              </p>
              <Link to="/team">
                <Button variant="primary" size="sm">
                  Create / Find Team →
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-[var(--bg-surface-elevated)] rounded-xl border border-[var(--border-color)] mb-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[var(--primary-pink)] uppercase tracking-wider">TEAM NAME</span>
                  <p className="font-heading font-bold text-[var(--text-primary)] text-base">{team.name}</p>
                </div>
                <span className="text-xs text-[var(--text-secondary)] px-2.5 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)]">
                  {team.members?.length || 1} Member(s)
                </span>
              </div>

              {team.members?.map((m) => {
                const memberId = m._id || m;
                const memberName = m.name || "Teammate";
                const memberEmail = m.email || "Member";
                const isLeader = team.leader === memberId || team.leader?._id === memberId;
                const initials = memberName.charAt(0).toUpperCase();

                return (
                  <div
                    key={memberId}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)]"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E02567] to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-2xs">
                        {initials}
                      </div>
                      <div>
                        <p className="font-heading font-semibold text-[var(--text-primary)] text-sm">{memberName}</p>
                        <p className="text-xs text-[var(--text-secondary)] font-normal">{memberEmail}</p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase ${
                        isLeader
                          ? "bg-[var(--pink-tint)] text-[var(--primary-pink)] border border-pink-100 dark:border-pink-900/30"
                          : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-color)]"
                      }`}
                    >
                      {isLeader ? "LEADER 👑" : "MEMBER"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Submission Status Section */}
      <Card variant="light" padding="lg" className="shadow-sm">
        <Card.Header
          title="Project Submissions"
          subtitle="All submitted projects for your registered hackathons and review status"
          action={
            registrations.length > 0 ? (
              <Link to={`/submit/${registrations[0].hackathon?._id || registrations[0].hackathon}`}>
                <Button variant="primary" size="sm">
                  + Submit Project
                </Button>
              </Link>
            ) : null
          }
        />

        {submissions.length === 0 ? (
          <div className="text-center py-8 bg-[var(--bg-surface-elevated)] rounded-2xl border border-[var(--border-color)] text-[var(--text-secondary)] font-normal">
            <p className="text-3xl mb-2">📁</p>
            <p className="font-heading font-semibold text-[var(--text-primary)] text-sm mb-1">
              No project submissions recorded
            </p>
            <p className="text-xs text-[var(--text-secondary)] mb-3">
              {registrations.length > 0
                ? "Submit your code repository link and live demo URL for your registered event!"
                : "Register for a hackathon first to unlock project submission!"}
            </p>
            {registrations.length > 0 && (
              <Link to={`/submit/${registrations[0].hackathon?._id || registrations[0].hackathon}`}>
                <Button variant="primary" size="sm">
                  + Create Submission
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {submissions.map((sub) => {
              const hackTitle = sub.hackathon?.title || "Hackathon Event";
              return (
                <div key={sub._id} className="relative">
                  <div className="mb-1 flex items-center justify-between text-xs px-1">
                    <span className="font-bold text-[var(--primary-pink)] uppercase tracking-wider text-[10px]">
                      EVENT: {hackTitle}
                    </span>
                    <Link
                      to={`/submit/${sub.hackathon?._id || sub.hackathon}`}
                      className="text-[11px] font-semibold text-[var(--text-secondary)] hover:text-[var(--primary-pink)] underline"
                    >
                      Edit
                    </Link>
                  </div>
                  <SubmissionCard submission={sub} />
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ParticipantDashboard;
