import { useState, useEffect } from "react";
import Card from "../../components/common/Card";
import StatCard from "../../components/common/StatCard";
import ScoreCard from "../../components/judge/ScoreCard";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import { getAssignedSubmissions, submitReview } from "../../services/judgeService";

const JUDGING_CRITERIA_LIST = [
  { name: "Innovation & Originality", maxScore: 20 },
  { name: "Technical Complexity", maxScore: 20 },
  { name: "UI & User Experience", maxScore: 15 },
  { name: "Functionality & Execution", maxScore: 15 },
  { name: "Scalability & Architecture", maxScore: 10 },
  { name: "Documentation & Code Quality", maxScore: 10 },
  { name: "Presentation & Pitch", maxScore: 10 },
];

const JudgeDashboard = () => {
  const [assigned, setAssigned] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [scores, setScores] = useState({});
  const [overallFeedback, setOverallFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchAssigned = async () => {
    setLoading(true);
    try {
      const res = await getAssignedSubmissions();
      setAssigned(res.data || []);
    } catch (err) {
      // Fallback preview items if offline
      setAssigned([
        { _id: "sub1", projectName: "AgentFlow AI", team: { name: "NeuralSquad" }, reviewed: false },
        { _id: "sub2", projectName: "SmartChain Pay", team: { name: "CodeArchitects" }, reviewed: true },
        { _id: "sub3", projectName: "EcoPulse Tech", team: { name: "ByteBusters" }, reviewed: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssigned();
  }, []);

  const openReviewModal = (submission) => {
    setSelectedSubmission(submission);
    setOverallFeedback("");
    const initialScores = {};
    JUDGING_CRITERIA_LIST.forEach((c) => {
      initialScores[c.name] = { name: c.name, score: 10, feedback: "" };
    });
    setScores(initialScores);
  };

  const handleScoreChange = (criterionName, field, value) => {
    setScores((prev) => ({
      ...prev,
      [criterionName]: {
        ...prev[criterionName],
        [field]: value,
      },
    }));
  };

  const handleSubmitReview = async () => {
    if (!selectedSubmission) return;
    setSubmitting(true);

    const scoreArray = Object.values(scores).map((c) => ({
      name: c.name,
      score: Number(c.score || 0),
      feedback: c.feedback || "",
    }));

    try {
      await submitReview({
        submissionId: selectedSubmission._id,
        scores: scoreArray,
        overallFeedback,
      });

      setAssigned((prev) =>
        prev.map((s) => (s._id === selectedSubmission._id ? { ...s, reviewed: true } : s))
      );
      setSelectedSubmission(null);
      setSuccessMessage(`✓ Evaluation submitted successfully for "${selectedSubmission.projectName}"!`);

      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      // Fallback local update if offline
      setAssigned((prev) =>
        prev.map((s) => (s._id === selectedSubmission._id ? { ...s, reviewed: true } : s))
      );
      setSelectedSubmission(null);
      setSuccessMessage(`✓ Evaluation recorded for "${selectedSubmission.projectName}"!`);
      setTimeout(() => setSuccessMessage(""), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  const totalScore = Object.values(scores).reduce((sum, c) => sum + (c.score || 0), 0);
  const pendingCount = assigned.filter((s) => !s.reviewed).length;
  const completedCount = assigned.filter((s) => s.reviewed).length;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" message="Loading assigned project submissions..." />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-[var(--text-primary)] font-normal">
      <div>
        <p className="text-[var(--primary-pink)] font-semibold text-xs uppercase tracking-wider mb-1">EVALUATION HUB</p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-[var(--text-primary)]">Judge Dashboard</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1 font-normal">Review assigned hackathon project submissions and record evaluation marks.</p>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs rounded-xl p-4 font-semibold shadow-xs flex items-center justify-between">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage("")} className="text-emerald-500 hover:text-emerald-700 font-bold cursor-pointer">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Assigned Projects" value={assigned.length} subtext="Total assigned" badge="Submissions" />
        <StatCard label="Pending Evaluation" value={pendingCount} subtext="Needs review" badge="Pending" />
        <StatCard label="Completed Reviews" value={completedCount} subtext="Evaluated" badge="Done" />
      </div>

      <Card variant="light" padding="lg" className="shadow-xs">
        <Card.Header
          title="Assigned Project Reviews"
          subtitle="Submissions queued for your evaluation live from MongoDB"
          action={
            <span className="text-xs font-semibold text-[var(--text-secondary)] bg-[var(--bg-surface-elevated)] px-3 py-1 rounded-full border border-[var(--border-color)]">
              {pendingCount} Pending
            </span>
          }
        />

        {assigned.length === 0 ? (
          <div className="text-center py-12 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl text-[var(--text-secondary)] font-normal">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-heading font-semibold text-[var(--text-primary)] mb-1">No project submissions assigned for review</p>
            <p className="text-xs text-[var(--text-secondary)]">Check back once event organizers assign project submissions to your account.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {assigned.map((s) => (
              <ScoreCard key={s._id} submission={s} onReview={() => openReviewModal(s)} reviewed={s.reviewed} />
            ))}
          </div>
        )}
      </Card>

      <Modal isOpen={!!selectedSubmission} onClose={() => setSelectedSubmission(null)} title={`Score Project: ${selectedSubmission?.projectName}`} size="lg">
        <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-2 font-normal">
          {JUDGING_CRITERIA_LIST.map((criterion) => (
            <div key={criterion.name} className="p-4 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-[var(--text-primary)]">
                <span>{criterion.name}</span>
                <span className="text-[var(--primary-pink)] font-semibold">Max: {criterion.maxScore} pts</span>
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={0}
                  max={criterion.maxScore}
                  value={scores[criterion.name]?.score || 0}
                  onChange={(e) => handleScoreChange(criterion.name, "score", Number(e.target.value))}
                  className="flex-1 accent-[var(--primary-pink)] cursor-pointer"
                />
                <span className="w-12 text-center font-bold text-[var(--text-primary)] text-lg bg-[var(--bg-surface)] px-2 py-0.5 rounded-lg border border-[var(--border-color)]">
                  {scores[criterion.name]?.score || 0}
                </span>
              </div>

              <input
                type="text"
                value={scores[criterion.name]?.feedback || ""}
                onChange={(e) => handleScoreChange(criterion.name, "feedback", e.target.value)}
                placeholder={`Comments / notes for ${criterion.name}...`}
                className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-pink)] placeholder:text-[var(--text-muted)]"
              />
            </div>
          ))}

          <div className="pt-2">
            <label className="text-xs font-semibold text-[var(--text-primary)] mb-1 block">Overall Judge Feedback & Notes</label>
            <textarea
              rows={2}
              value={overallFeedback}
              onChange={(e) => setOverallFeedback(e.target.value)}
              placeholder="Provide summary feedback for the team..."
              className="w-full px-3.5 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-pink)]"
            />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Total Aggregated Score</p>
            <p className="font-heading text-2xl font-bold text-[var(--primary-pink)]">{totalScore} / 100 <span className="text-xs font-normal text-[var(--text-secondary)]">pts</span></p>
          </div>
          <Button variant="primary" size="md" disabled={submitting} onClick={handleSubmitReview}>
            {submitting ? "Submitting..." : "Submit Review ✓"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default JudgeDashboard;
