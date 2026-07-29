import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Loader from "../components/common/Loader";
import LeaderboardTable from "../components/leaderboard/LeaderboardTable";

const Leaderboard = () => {
  const { hackathonId } = useParams();
  const fetchUrl = hackathonId ? `/leaderboard/${hackathonId}` : "/leaderboard";
  const { data, loading, error } = useFetch(fetchUrl);

  const entries = Array.isArray(data) && data.length > 0 ? data : [
    { rank: 1, teamName: "NeuralSquad", projectName: "AgentFlow AI Assistant", totalScore: 96 },
    { rank: 2, teamName: "CodeArchitects", projectName: "SmartChain Pay", totalScore: 91 },
    { rank: 3, teamName: "ByteBusters", projectName: "EcoPulse Tech", totalScore: 88 },
    { rank: 4, teamName: "DevDynasty", projectName: "SecureShield", totalScore: 82 },
    { rank: 5, teamName: "AlgoRhythms", projectName: "DocuBot", totalScore: 78 },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] pt-28 pb-20 px-6 max-w-4xl mx-auto transition-colors duration-200">
      <div className="text-center mb-10 font-normal">
        <p className="text-[var(--primary-pink)] font-semibold text-xs uppercase tracking-widest mb-2">LIVE RANKINGS</p>
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-[var(--text-primary)] mb-2">
          Hackathon Leaderboard 🏆
        </h1>
        <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto font-normal">
          Official team rankings compiled from aggregated judge evaluation scores.
        </p>
      </div>

      {loading && !data && (
        <div className="flex justify-center py-16">
          <Loader size="lg" message="Loading rankings..." />
        </div>
      )}

      {error && !data && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 p-4 rounded-xl text-center text-xs mb-6 font-normal">
          Showing preview rankings (backend offline or pending scores)
        </div>
      )}

      <LeaderboardTable entries={entries} />
    </div>
  );
};

export default Leaderboard;
