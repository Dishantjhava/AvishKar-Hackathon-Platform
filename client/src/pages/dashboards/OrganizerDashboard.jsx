import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Card from "../../components/common/Card";
import StatCard from "../../components/common/StatCard";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import useAuth from "../../hooks/useAuth";
import { createHackathon, updateStatus, deleteHackathon } from "../../services/hackathonService";
import { searchSubmissions } from "../../services/submissionService";
import { getRegistrationsByHackathon, updateRegistrationStatus } from "../../services/registrationService";
import { validateDates } from "../../utils/validators";

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: hackathonsData, loading, refetch } = useFetch(`/hackathons?organizerId=${user?._id}`);

  // Create Hackathon Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    theme: "AI / ML & Agents",
    mode: "Online",
    prizePool: "₹1,00,000",
    maxTeamSize: 4,
    registrationDeadline: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [dateError, setDateError] = useState("");
  const [creating, setCreating] = useState(false);
  const [successBanner, setSuccessBanner] = useState("");

  // Search Submissions State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Manage Event Modal State
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [eventRegistrations, setEventRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchSubmissions(searchQuery);
        setSearchResults(res.data || []);
      } catch (err) {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const hackathons = hackathonsData || [
    { _id: "h1", title: "HackIndia 2026", theme: "AI / ML & Agents", mode: "Hybrid", status: "ongoing", registrationOpen: true, registrations: 42, submissions: 18 },
    { _id: "h2", title: "FinTech Battle", theme: "Web3 & Blockchain", mode: "Online", status: "upcoming", registrationOpen: true, registrations: 19, submissions: 0 },
    { _id: "h3", title: "GreenCode Summit", theme: "CleanTech", mode: "Offline", status: "completed", registrationOpen: false, registrations: 65, submissions: 48 },
  ];

  const handleDateChange = (field, value) => {
    const nextForm = { ...form, [field]: value };
    setForm(nextForm);
    if (nextForm.registrationDeadline && nextForm.startDate && nextForm.endDate) {
      setDateError(validateDates(nextForm.registrationDeadline, nextForm.startDate, nextForm.endDate));
    } else {
      setDateError("");
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Hackathon title is required.");
      return;
    }

    const dErr = validateDates(form.registrationDeadline, form.startDate, form.endDate);
    if (dErr) {
      setDateError(dErr);
      return;
    }

    setCreating(true);
    try {
      await createHackathon(form);
      const title = form.title;
      setIsModalOpen(false);
      setSuccessBanner(`✓ Hackathon "${title}" published successfully!`);
      refetch();

      setTimeout(() => setSuccessBanner(""), 5000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create hackathon.");
    } finally {
      setCreating(false);
    }
  };

  // Open Manage Event Modal & Fetch Live Registrations
  const handleManageEvent = async (hackathon) => {
    setSelectedHackathon(hackathon);
    setLoadingRegs(true);
    setEventRegistrations([]);

    try {
      const res = await getRegistrationsByHackathon(hackathon._id);
      setEventRegistrations(res.data || []);
    } catch (err) {
      // fallback sample registrations
      setEventRegistrations([
        { _id: "r1", participant: { name: "Dishant Jhava", email: "dishant@avishkar.dev" }, team: { name: "CodeArchitect" }, status: "approved" },
      ]);
    } finally {
      setLoadingRegs(false);
    }
  };

  // Toggle Status (ongoing/upcoming/completed)
  const handleStatusUpdate = async (newStatus) => {
    if (!selectedHackathon) return;
    setUpdatingStatus(true);
    try {
      await updateStatus(selectedHackathon._id, { status: newStatus });
      setSelectedHackathon((prev) => ({ ...prev, status: newStatus }));
      setSuccessBanner(`✓ Hackathon status updated to ${newStatus}.`);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Toggle Registration Open/Close
  const handleToggleRegistration = async () => {
    if (!selectedHackathon) return;
    setUpdatingStatus(true);
    const nextState = !selectedHackathon.registrationOpen;
    try {
      await updateStatus(selectedHackathon._id, { registrationOpen: nextState });
      setSelectedHackathon((prev) => ({ ...prev, registrationOpen: nextState }));
      setSuccessBanner(`✓ Registrations ${nextState ? "Opened" : "Closed"} successfully.`);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update registration status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Approve/Reject Participant Registration
  const handleRegistrationApproval = async (regId, newStatus) => {
    try {
      await updateRegistrationStatus(regId, { status: newStatus });
      setEventRegistrations((prev) =>
        prev.map((r) => (r._id === regId ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update registration status.");
    }
  };

  // Delete Hackathon
  const handleDelete = async (hackathonId, title) => {
    if (!confirm(`Are you sure you want to delete hackathon "${title}"?`)) return;
    try {
      await deleteHackathon(hackathonId);
      setSelectedHackathon(null);
      setSuccessBanner(`✓ Hackathon "${title}" deleted successfully.`);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete hackathon.");
    }
  };

  return (
    <div className="space-y-8 text-[var(--text-primary)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-normal">
        <div>
          <p className="text-[var(--primary-pink)] font-semibold text-xs uppercase tracking-wider mb-1">ORGANIZER HUB</p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-[var(--text-primary)]">Manage Your Hackathons</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Host events, approve team registrations, and deploy judging pipelines.</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)}>
          + Create Hackathon
        </Button>
      </div>

      {successBanner && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs rounded-xl p-4 font-semibold shadow-xs flex items-center justify-between">
          <span>{successBanner}</span>
          <button onClick={() => setSuccessBanner("")} className="text-emerald-500 hover:text-emerald-700 font-bold cursor-pointer">✕</button>
        </div>
      )}

      {/* Unified Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Hosted Events" value={hackathons.length} subtext="Total events" badge="Events" />
        <StatCard label="Registered Teams" value={hackathons.reduce((s, h) => s + (h.registrations || 0), 0)} subtext="Across all events" badge="Teams" />
        <StatCard label="Submissions" value={hackathons.reduce((s, h) => s + (h.submissions || 0), 0)} subtext="Projects submitted" badge="Projects" />
        <StatCard label="Live Hackathons" value={hackathons.filter((h) => h.status === "ongoing").length} subtext="Currently running" badge="Ongoing" />
      </div>

      {/* Search Submitted Projects Card */}
      <Card variant="light" padding="md" className="shadow-xs">
        <h3 className="font-heading text-sm font-semibold text-[var(--text-primary)] mb-1">Search Submitted Projects</h3>
        <p className="text-xs text-[var(--text-secondary)] font-normal mb-3">Search across all submitted projects by name or tech stack tags.</p>

        <div className="relative font-normal">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by project name or tech stack (e.g. React, Python, AI)..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--primary-pink)] transition-all placeholder:text-[var(--text-muted)]"
          />
        </div>

        {searching && <p className="text-xs text-[var(--text-secondary)] font-normal mt-3">Searching project submissions...</p>}
        {searchQuery.trim() && !searching && (
          <div className="mt-4 space-y-2 font-normal">
            {searchResults.length === 0 ? (
              <div className="p-4 bg-[var(--bg-surface-elevated)] rounded-xl text-center text-xs text-[var(--text-secondary)] border border-[var(--border-color)]">
                🔍 No project submissions found matching "<strong>{searchQuery}</strong>"
              </div>
            ) : (
              searchResults.map((sub) => (
                <div key={sub._id} className="p-3.5 bg-[var(--bg-surface-elevated)] rounded-xl border border-[var(--border-color)] flex justify-between items-center text-xs hover:bg-[var(--bg-surface)] transition-colors">
                  <div>
                    <span className="font-semibold text-[var(--text-primary)] text-sm block">{sub.projectName}</span>
                    <span className="text-[var(--text-secondary)] font-normal">Tech: {sub.techStack || "N/A"} · Team: {sub.team?.name || "Team"}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 capitalize">
                    {sub.status}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </Card>

      {/* My Hackathons List Card */}
      <Card variant="light" padding="lg" className="shadow-xs">
        <Card.Header
          title="My Hackathons"
          subtitle="Overview of hackathons hosted by your organization"
          action={
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
              + Host New Event
            </Button>
          }
        />

        {loading && !hackathonsData ? (
          <Loader size="sm" message="Loading hosted hackathons..." />
        ) : hackathons.length === 0 ? (
          <div className="text-center py-12 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl text-[var(--text-secondary)]">
            <p className="text-4xl mb-3">🚀</p>
            <p className="font-heading font-semibold text-[var(--text-primary)] mb-1">No hackathons hosted yet</p>
            <p className="text-xs text-[var(--text-secondary)] mb-4 font-normal">Click "+ Host New Event" above to launch your first hackathon!</p>
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
              + Host New Event
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-[var(--bg-surface-elevated)] border-b border-[var(--border-color)] text-[var(--text-muted)] text-[11px] uppercase tracking-wider font-semibold">
                  <th className="px-6 py-3.5">Event Title</th>
                  <th className="px-6 py-3.5">Theme & Mode</th>
                  <th className="px-6 py-3.5">Registrations</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] font-normal text-[var(--text-primary)]">
                {hackathons.map((h) => {
                  const statusStyles = {
                    published: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
                    draft: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
                    ongoing: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
                    upcoming: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60",
                    ended: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:slate-300 border-slate-200 dark:border-slate-700",
                    open: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
                  };
                  return (
                    <tr key={h._id} className="hover:bg-[var(--bg-surface-elevated)] transition-colors">
                      <td className="px-6 py-3.5 font-semibold text-[var(--text-primary)]">{h.title}</td>
                      <td className="px-6 py-3.5 text-xs text-[var(--text-secondary)] font-normal">
                        <span className="font-semibold text-[var(--primary-pink)] bg-[var(--pink-tint)] px-2 py-0.5 rounded-full mr-2">
                          {h.theme}
                        </span>
                        {h.mode}
                      </td>
                      <td className="px-6 py-3.5 text-xs text-[var(--text-secondary)] font-normal">
                        {h.registrations || 0} team(s)
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border capitalize ${statusStyles[h.status] || "bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)]"}`}>
                          {h.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <Button variant="outline" size="sm" onClick={() => handleManageEvent(h)}>
                          Manage Event →
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* MANAGE EVENT MODAL */}
      {selectedHackathon && (
        <Modal
          isOpen={!!selectedHackathon}
          onClose={() => setSelectedHackathon(null)}
          title={`Manage Event: ${selectedHackathon.title}`}
          size="lg"
        >
          <div className="space-y-6 text-sm font-normal">
            {/* Quick Status Controls */}
            <div className="p-4 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] space-y-3">
              <span className="text-xs font-bold text-[var(--primary-pink)] uppercase tracking-wider block">EVENT CONTROLS</span>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--text-secondary)]">Status:</span>
                  <select
                    value={selectedHackathon.status}
                    disabled={updatingStatus}
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] cursor-pointer"
                  >
                    <option value="ongoing">Ongoing (Live) 🟢</option>
                    <option value="upcoming">Upcoming 🟡</option>
                    <option value="completed">Completed 🏁</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={selectedHackathon.registrationOpen !== false ? "primary" : "outline"}
                    size="sm"
                    disabled={updatingStatus}
                    onClick={handleToggleRegistration}
                  >
                    {selectedHackathon.registrationOpen !== false ? "Close Registrations" : "Open Registrations"}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/hackathons/${selectedHackathon._id}`)}
                  >
                    View Page ↗
                  </Button>

                  <button
                    onClick={() => handleDelete(selectedHackathon._id, selectedHackathon.title)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 cursor-pointer"
                  >
                    Delete Event
                  </button>
                </div>
              </div>
            </div>

            {/* Enrolled Registrations & Approval Pipeline */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-[var(--text-primary)] text-sm">Enrolled Participants & Teams</h4>
                <span className="text-xs text-[var(--text-secondary)]">{eventRegistrations.length} Registration(s)</span>
              </div>

              {loadingRegs ? (
                <Loader size="sm" message="Fetching enrolled registrations..." />
              ) : eventRegistrations.length === 0 ? (
                <div className="p-6 bg-[var(--bg-surface-elevated)] rounded-2xl text-center text-xs text-[var(--text-secondary)] border border-[var(--border-color)]">
                  No registrations recorded for this event yet.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {eventRegistrations.map((r) => (
                    <div
                      key={r._id}
                      className="p-3 bg-[var(--bg-surface-elevated)] rounded-xl border border-[var(--border-color)] flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-[var(--text-primary)] text-sm">
                          {r.participant?.name || "Participant"}
                          {r.team?.name && (
                            <span className="text-xs text-[var(--primary-pink)] font-normal ml-2">
                              (Team: {r.team.name})
                            </span>
                          )}
                        </p>
                        <p className="text-[var(--text-secondary)] text-[11px]">{r.participant?.email || "Email"}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize border ${
                            r.status === "approved"
                              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200"
                              : r.status === "rejected"
                              ? "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200"
                              : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 border-amber-200"
                          }`}
                        >
                          {r.status}
                        </span>

                        <button
                          onClick={() => handleRegistrationApproval(r._id, "approved")}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 text-[11px] font-semibold cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRegistrationApproval(r._id, "rejected")}
                          className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 text-[11px] font-semibold cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Modal for Creating Hackathon */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Hackathon" size="md">
        <form onSubmit={handleCreateSubmit} className="space-y-4 font-normal">
          <Input id="title" label="Hackathon Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="e.g. AI Innovators 2026" />
          <Input id="theme" label="Theme" value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })} required placeholder="e.g. AI / ML, Web3, CleanTech" />
          <div className="grid grid-cols-2 gap-4">
            <Input id="prizePool" label="Prize Pool" value={form.prizePool} onChange={(e) => setForm({ ...form, prizePool: e.target.value })} required />
            <Input id="maxTeamSize" label="Max Team Size" type="number" value={form.maxTeamSize} onChange={(e) => setForm({ ...form, maxTeamSize: Number(e.target.value) })} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              id="registrationDeadline"
              label="Reg. Deadline"
              type="date"
              value={form.registrationDeadline}
              onChange={(e) => handleDateChange("registrationDeadline", e.target.value)}
              required
            />
            <Input
              id="startDate"
              label="Start Date"
              type="date"
              value={form.startDate}
              onChange={(e) => handleDateChange("startDate", e.target.value)}
              required
            />
            <Input
              id="endDate"
              label="End Date"
              type="date"
              value={form.endDate}
              onChange={(e) => handleDateChange("endDate", e.target.value)}
              required
            />
          </div>

          {dateError && (
            <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-xs rounded-xl p-3 font-normal">
              ⚠ {dateError}
            </div>
          )}

          <Input id="description" label="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required placeholder="Short summary of hackathon goals..." />

          <Button type="submit" variant="primary" size="md" className="w-full mt-2 cursor-pointer" disabled={creating || !!dateError}>
            {creating ? "Publishing..." : "Publish Hackathon →"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default OrganizerDashboard;
