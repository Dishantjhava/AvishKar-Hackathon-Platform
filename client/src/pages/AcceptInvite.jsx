import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import useAuth from "../hooks/useAuth";
import { getInviteDetails, acceptTeamInvite } from "../services/teamService";

const AcceptInvite = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { isAuth, user } = useAuth();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getInviteDetails(token);
        setDetails(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Invalid or expired invitation link.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [token]);

  const handleAccept = async () => {
    setAccepting(true);
    setError("");
    try {
      const res = await acceptTeamInvite(token);
      setSuccess(res.data?.message || "Successfully joined the team!");
      setTimeout(() => {
        navigate("/team");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to accept invitation.");
    } finally {
      setAccepting(false);
    }
  };

  const redirectUrl = encodeURIComponent(`/invite/${token}`);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] pt-32 flex justify-center">
        <Loader size="lg" message="Loading team invitation..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] pt-28 pb-20 px-6 max-w-xl mx-auto flex items-center justify-center">
      <Card variant="light" padding="lg" className="w-full shadow-xl border border-[var(--border-color)] text-center">
        {error ? (
          <div className="py-6 space-y-4">
            <p className="text-4xl">⚠️</p>
            <h2 className="text-2xl font-bold font-heading text-[var(--text-primary)]">Invitation Error</h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-sm mx-auto">
              {error}
            </p>
            <div className="pt-4">
              <Link to="/hackathons">
                <Button variant="outline" size="md">
                  Browse Hackathons →
                </Button>
              </Link>
            </div>
          </div>
        ) : success ? (
          <div className="py-6 space-y-4">
            <p className="text-4xl">🎉</p>
            <h2 className="text-2xl font-bold font-heading text-[var(--text-primary)]">Welcome to the Team!</h2>
            <p className="text-sm text-[var(--text-secondary)]">{success}</p>
            <p className="text-xs text-[var(--text-muted)]">Redirecting to your team workspace...</p>
          </div>
        ) : (
          <div className="space-y-6 py-2">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[var(--pink-tint)] text-[var(--primary-pink)] border border-pink-200 dark:border-pink-900/30 uppercase tracking-wider mb-3">
                TEAM INVITATION
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--text-primary)]">
                Join <span className="text-[var(--primary-pink)]">{details?.teamName}</span>
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-2">
                <strong className="text-[var(--text-primary)]">{details?.inviterName}</strong> invited you to join their team for{" "}
                <strong className="text-[var(--text-primary)]">{details?.hackathonTitle}</strong>.
              </p>
            </div>

            <div className="bg-[var(--bg-surface-elevated)] p-4 rounded-xl border border-[var(--border-color)] text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Team Name:</span>
                <span className="font-semibold text-[var(--text-primary)]">{details?.teamName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Event:</span>
                <span className="font-semibold text-[var(--text-primary)]">{details?.hackathonTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Current Members:</span>
                <span className="font-semibold text-[var(--text-primary)]">{details?.memberCount} member(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Invited Email:</span>
                <span className="font-semibold text-[var(--primary-pink)]">{details?.invitedEmail}</span>
              </div>
            </div>

            {!isAuth ? (
              <div className="space-y-4 pt-2">
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs font-normal text-left leading-relaxed">
                  🔒 <strong>Authentication Required:</strong> Please log in or sign up with <strong>{details?.invitedEmail}</strong> to accept this team invitation.
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to={`/login?redirect=${redirectUrl}`} className="flex-1">
                    <Button variant="primary" size="md" className="w-full">
                      Log In to Accept →
                    </Button>
                  </Link>
                  <Link to={`/signup?redirect=${redirectUrl}`} className="flex-1">
                    <Button variant="outline" size="md" className="w-full">
                      Sign Up First
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                {user?.email?.toLowerCase() !== details?.invitedEmail?.toLowerCase() && (
                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-xs text-left leading-relaxed">
                    ⚠️ Note: You are logged in as <strong>{user?.email}</strong>, but this invite was sent to <strong>{details?.invitedEmail}</strong>.
                  </div>
                )}

                <Button
                  variant="primary"
                  size="md"
                  className="w-full py-3"
                  onClick={handleAccept}
                  disabled={accepting}
                >
                  {accepting ? "Joining Team..." : "Accept Invitation & Join Team →"}
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AcceptInvite;
