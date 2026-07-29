import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SubmissionForm from "../components/submission/SubmissionForm";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { createSubmission } from "../services/submissionService";
import { getMyTeam } from "../services/teamService";
import { getMyRegistrations } from "../services/registrationService";

const SubmissionPage = () => {
  const { hackathonId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [team, setTeam] = useState(null);
  const [teamLoading, setTeamLoading] = useState(true);

  /* Fetch participant's current team on mount */
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await getMyTeam();
        setTeam(res.data || null);
      } catch {
        setTeam(null);
      } finally {
        setTeamLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError("");

    try {
      /* teamId is required by the backend */
      if (!team?._id) {
        setError("You must be part of a team before submitting. Please create or join a team first.");
        setLoading(false);
        return;
      }

      await createSubmission({
        ...formData,
        hackathonId,
        teamId: team._id,
      });

      setSuccess(true);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to submit project. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (teamLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] pt-32 flex justify-center">
        <Loader size="lg" message="Loading your team info..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] pt-28 pb-20 px-6 max-w-3xl mx-auto transition-colors duration-200">
      <div className="mb-8 font-normal">
        <p className="text-[var(--primary-pink)] font-semibold text-xs uppercase tracking-widest mb-1">
          PROJECT SUBMISSION
        </p>
        <h1 className="text-3xl font-bold tracking-tight font-heading text-[var(--text-primary)]">
          Submit Your Hackathon Project
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          Provide project details, code repository, live demo, and tech stack for judges to evaluate.
        </p>

        {/* Show current team being used */}
        {team && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
            👥 Submitting as team: <strong>{team.name}</strong>
          </div>
        )}

        {/* No team warning */}
        {!team && (
          <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400 text-sm">
            ⚠️ You are not in a team. Please{" "}
            <a href="/team" className="font-bold underline">create or join a team</a>{" "}
            before submitting a project.
          </div>
        )}
      </div>

      {success ? (
        <Card variant="pink" padding="lg" className="text-center py-12 border-pink-200 dark:border-pink-900/30">
          <p className="text-5xl mb-3">🎉</p>
          <h2 className="text-2xl font-bold font-heading text-[var(--text-primary)] mb-2">
            Project Submitted Successfully!
          </h2>
          <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto mb-6 font-normal">
            Your submission has been received and queued for judge evaluation. You can track its status from your dashboard.
          </p>
          <div className="flex justify-center gap-3 font-normal">
            <Button variant="primary" size="md" onClick={() => navigate("/dashboard/participant")}>
              Go to Dashboard →
            </Button>
            <Button variant="outline" size="md" onClick={() => setSuccess(false)}>
              Edit Submission
            </Button>
          </div>
        </Card>
      ) : (
        <Card variant="light" padding="lg" className="shadow-sm">
          {/* API error banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-sm font-semibold">
              ❌ {error}
            </div>
          )}
          <SubmissionForm onSubmit={handleSubmit} loading={loading} />
        </Card>
      )}
    </div>
  );
};

export default SubmissionPage;
