
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Loader from "../components/common/Loader";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import InviteMemberForm from "../components/team/InviteMemberForm";
import Input from "../components/common/Input";
import { createTeam, inviteMember, getPendingInvites, removeMember, leaveTeam, deleteTeam, searchTeams } from "../services/teamService";
import useAuth from "../hooks/useAuth";

const TeamPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  /* Fetch team data */
  const teamUrl = id ? `/teams/${id}` : "/teams/mine";
  const { data: teamData, loading, error, refetch } = useFetch(teamUrl);

  /* Local state */
  const [teamName, setTeamName] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);

  /* Search teams state with debouncing */
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  /* Debounced search effect (300ms delay) */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchTeams(searchQuery);
        setSearchResults(res.data || []);
      } catch (err) {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  /* Fallback mock team if backend data is loading or offline */
  const team = teamData || (id ? {
    _id: id || "t1",
    name: "Team Innovators",
    leader: user?._id || "u1",
    members: [
      { _id: user?._id || "u1", name: user?.name || "Dishant Jhava", email: user?.email || "dishant@example.com" },
      { _id: "u2", name: "Aarav Sharma", email: "aarav@example.com" },
      { _id: "u3", name: "Riya Patel", email: "riya@example.com" },
    ],
  } : null);

  const isLeader = team?.leader === user?._id || team?.leader?._id === user?._id || !teamData;

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!teamName.trim()) return;
    setCreateLoading(true);
    try {
      await createTeam({ name: teamName });
      refetch();
      setTeamName("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create team.");
    } finally {
      setCreateLoading(false);
    }
  };

  const [inviteSuccess, setInviteSuccess] = useState("");
  const [pendingInvites, setPendingInvites] = useState([]);

  /* Fetch pending invitations for team leader */
  useEffect(() => {
    if (team?._id && isLeader) {
      getPendingInvites(team._id)
        .then((res) => setPendingInvites(res.data || []))
        .catch(() => {});
    }
  }, [team?._id, isLeader, inviteSuccess]);

  const handleInvite = async (email) => {
    setInviteLoading(true);
    setInviteSuccess("");
    try {
      const res = await inviteMember(team._id, email);
      setInviteSuccess(res.data?.message || `Invitation sent to ${email}!`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send invitation.");
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRemove = async (memberId) => {
    if (!confirm("Remove this member from team?")) return;
    try {
      await removeMember(team._id, memberId);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove member.");
    }
  };

  const handleDeleteTeam = async () => {
    if (!confirm("Are you sure you want to delete this team?")) return;
    try {
      await deleteTeam(team._id);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete team.");
    }
  };

  if (loading && !teamData) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] pt-32 flex justify-center">
        <Loader size="lg" message="Loading team information..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] pt-28 pb-20 px-6 max-w-4xl mx-auto space-y-8 transition-colors duration-200">
      {/* Header */}
      <div className="font-normal">
        <p className="text-[var(--primary-pink)] font-semibold text-xs uppercase tracking-widest mb-1">COLLABORATION</p>
        <h1 className="text-3xl font-bold tracking-tight font-heading text-[var(--text-primary)]">Team Hub & Search</h1>
      </div>

      {/* Debounced Team Search Input */}
      <Card variant="light" padding="md" className="border-l-4 border-l-[var(--primary-pink)] font-normal">
        <h3 className="text-sm font-bold font-heading text-[var(--text-primary)] mb-2">Search Registered Teams</h3>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type team name (e.g. CodeArchitects)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-pink)] placeholder:text-[var(--text-muted)] transition-all"
          />
        </div>

        {/* Search Results */}
        {searching && <p className="text-xs text-[var(--text-secondary)] mt-3">Searching teams...</p>}
        {searchQuery.trim() && !searching && (
          <div className="mt-4 space-y-2">
            {searchResults.length === 0 ? (
              <div className="p-4 bg-[var(--bg-surface-elevated)] rounded-xl text-center text-xs text-[var(--text-secondary)] border border-[var(--border-color)]">
                🔍 No teams found matching "<strong>{searchQuery}</strong>"
              </div>
            ) : (
              searchResults.map((t) => (
                <div key={t._id} className="p-3 bg-[var(--bg-surface-elevated)] rounded-xl border border-[var(--border-color)] flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-[var(--text-primary)] text-sm">{t.name}</span>
                    <span className="text-[var(--text-secondary)] ml-2">({t.members?.length || 0} members)</span>
                  </div>
                  <span className="text-[var(--primary-pink)] font-semibold">Leader: {t.leader?.name || "Leader"}</span>
                </div>
              ))
            )}
          </div>
        )}
      </Card>

      {!team ? (
        /* Create Team State if user has no team */
        <Card variant="pink" padding="lg" className="max-w-md mx-auto">
          <Card.Header title="Create Your Team" subtitle="Form a team to participate in hackathons together" />
          <form onSubmit={handleCreateTeam} className="space-y-4 mt-4 font-normal">
            <Input
              id="teamName"
              label="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
              placeholder="e.g. CodeArchitects"
            />
            <Button variant="primary" size="md" type="submit" className="w-full" disabled={createLoading}>
              {createLoading ? "Creating..." : "Create Team →"}
            </Button>
          </form>
        </Card>
      ) : (
        /* Active Team Roster & Controls */
        <div className="space-y-6 font-normal">
          <Card variant="light" padding="lg">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)] mb-6">
              <div>
                <span className="text-xs font-bold text-[var(--primary-pink)] uppercase tracking-wider">ACTIVE ROSTER</span>
                <h2 className="text-2xl font-bold font-heading text-[var(--text-primary)]">{team.name}</h2>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-color)]">
                {team.members?.length || 0} Member(s)
              </span>
            </div>

            {/* Roster List */}
            <div className="space-y-3">
              {team.members?.map((m) => {
                const isMemberLeader = (team.leader === m._id || team.leader?._id === m._id);
                return (
                  <div key={m._id} className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E02567] to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {m.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[var(--text-primary)] font-bold text-sm flex items-center gap-1.5 font-heading">
                          {m.name}
                          {isMemberLeader && <span className="text-amber-400 text-xs" title="Team Leader">👑 Leader</span>}
                        </p>
                        <p className="text-[var(--text-secondary)] text-xs font-normal">{m.email}</p>
                      </div>
                    </div>

                    {isLeader && !isMemberLeader && (
                      <button
                        onClick={() => handleRemove(m._id)}
                        className="text-xs font-bold text-red-500 hover:text-red-600 px-3 py-1 rounded-full border border-red-200 dark:border-red-800/60 bg-[var(--bg-surface)] hover:bg-red-500/10 transition-all cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {isLeader && (
            <Card variant="light" padding="lg">
              <Card.Header title="Invite Teammate" subtitle="Send an invitation by email address" />
              {inviteSuccess && (
                <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                  ✓ {inviteSuccess}
                </div>
              )}
              <div className="mt-4">
                <InviteMemberForm onInvite={handleInvite} loading={inviteLoading} />
              </div>

              {/* Pending Invitations list */}
              {pendingInvites.length > 0 && (
                <div className="mt-6 pt-4 border-t border-[var(--border-color)]">
                  <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                    PENDING INVITATIONS ({pendingInvites.length})
                  </h4>
                  <div className="space-y-2">
                    {pendingInvites.map((inv) => (
                      <div key={inv._id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] text-xs">
                        <div>
                          <span className="font-semibold text-[var(--text-primary)]">{inv.email}</span>
                          <span className="text-[var(--text-muted)] ml-2">
                            (Sent {new Date(inv.createdAt).toLocaleDateString()})
                          </span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 font-semibold text-[10px] uppercase">
                          ⏳ PENDING ACCEPTANCE
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}

          <div className="flex justify-end gap-3 pt-4">
            {isLeader ? (
              <Button variant="outline" size="sm" onClick={handleDeleteTeam} className="border-red-300 dark:border-red-800/60 text-red-500 hover:bg-red-500/10">
                Delete Team
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={async () => { if(confirm("Leave team?")) await leaveTeam(team._id); refetch(); }}>
                Leave Team
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamPage;
