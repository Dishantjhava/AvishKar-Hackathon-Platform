import { useState, useEffect } from "react";
import Card from "../../components/common/Card";
import StatCard from "../../components/common/StatCard";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import useFetch from "../../hooks/useFetch";
import { updateUser, toggleBlockUser, deleteUser } from "../../services/userService";

const AdminDashboard = () => {
  const { data: statsData, loading: statsLoading } = useFetch("/users/stats");
  const { data: usersData, loading: usersLoading, refetch } = useFetch("/users");

  const [usersList, setUsersList] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    if (usersData && Array.isArray(usersData)) {
      setUsersList(usersData);
    }
  }, [usersData]);

  const showFeedback = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(""), 3500);
  };

  // Handle live role change via PUT /api/users/:id
  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      await updateUser(userId, { role: newRole });
      setUsersList((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      showFeedback(`User role updated to ${newRole} successfully.`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user role.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle block/unblock toggle via PATCH /api/users/:id/block
  const handleToggleBlock = async (userId, currentBlockedStatus) => {
    setUpdatingId(userId);
    const newStatus = !currentBlockedStatus;
    try {
      await toggleBlockUser(userId, newStatus);
      setUsersList((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isBlocked: newStatus } : u))
      );
      showFeedback(`User ${newStatus ? "blocked" : "unblocked"} successfully.`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle delete user via DELETE /api/users/:id
  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"?`)) return;
    setUpdatingId(userId);
    try {
      await deleteUser(userId);
      setUsersList((prev) => prev.filter((u) => u._id !== userId));
      showFeedback(`User ${userName} deleted successfully.`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user.");
    } finally {
      setUpdatingId(null);
    }
  };

  const stats = statsData || {
    totalUsers: 8,
    totalHackathons: 3,
    totalTeams: 2,
    totalSubmissions: 2,
  };

  if (statsLoading || usersLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" message="Loading administrator dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-[var(--text-primary)] font-normal">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[var(--primary-pink)] font-semibold text-xs uppercase tracking-wider mb-1">
            ADMINISTRATOR CONTROL
          </p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
            Platform Analytics & User Management
          </h1>
          <p className="text-[var(--text-secondary)] text-sm font-normal mt-1">
            Overview of system users, hackathon events, and role permissions.
          </p>
        </div>

        {actionMessage && (
          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold animate-in fade-in">
            ✓ {actionMessage}
          </div>
        )}
      </div>

      {/* Unified Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats.totalUsers} subtext="Registered accounts" badge="Users" />
        <StatCard label="Total Hackathons" value={stats.totalHackathons} subtext="Active & upcoming" badge="Events" />
        <StatCard label="Total Teams" value={stats.totalTeams} subtext="Formed teams" badge="Teams" />
        <StatCard label="Total Submissions" value={stats.totalSubmissions} subtext="Submitted projects" badge="Projects" />
      </div>

      {/* User Directory Table Card */}
      <Card variant="light" padding="lg" className="shadow-xs">
        <Card.Header
          title="User Directory & Role Controls"
          subtitle="Manage platform permissions, assign roles (PUT /api/users/:id), and moderate user access"
          action={
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[var(--text-secondary)] bg-[var(--bg-surface-elevated)] px-3 py-1 rounded-full border border-[var(--border-color)]">
                {usersList.length} User(s) Listed
              </span>
              <button
                onClick={() => refetch()}
                className="text-xs font-semibold text-[var(--primary-pink)] hover:underline cursor-pointer"
              >
                ↻ Refresh
              </button>
            </div>
          }
        />

        <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] font-normal mt-4">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-[var(--bg-surface-elevated)] border-b border-[var(--border-color)] text-[var(--text-muted)] text-[11px] uppercase tracking-wider font-semibold">
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5">Assigned Role (PUT API)</th>
                <th className="px-6 py-3.5">Account Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-primary)]">
              {usersList.map((u) => {
                const initials = u.name ? u.name.charAt(0).toUpperCase() : "U";
                const isUpdating = updatingId === u._id;

                return (
                  <tr key={u._id} className="hover:bg-[var(--bg-surface-elevated)] transition-colors">
                    {/* User Info */}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E02567] to-pink-500 flex items-center justify-center text-white font-semibold text-xs shadow-xs flex-shrink-0">
                          {initials}
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--text-primary)] text-sm">{u.name}</p>
                          <p className="text-[var(--text-secondary)] text-xs font-normal">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role Control Dropdown (Calls PUT /api/users/:id) */}
                    <td className="px-6 py-3.5">
                      <div className="relative inline-block">
                        <select
                          value={u.role}
                          disabled={isUpdating}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[var(--bg-surface-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-pink)] cursor-pointer transition-all"
                        >
                          <option value="participant">Participant 💻</option>
                          <option value="organizer">Organizer 🎯</option>
                          <option value="judge">Judge ⚖️</option>
                          <option value="admin">Admin 👑</option>
                        </select>
                      </div>
                    </td>

                    {/* Account Status Badge */}
                    <td className="px-6 py-3.5">
                      {u.isBlocked ? (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60">
                          Blocked
                        </span>
                      ) : (
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          Active
                        </span>
                      )}
                    </td>

                    {/* Action Buttons (Block & Delete) */}
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant={u.isBlocked ? "primary" : "outline"}
                          size="sm"
                          disabled={isUpdating}
                          onClick={() => handleToggleBlock(u._id, u.isBlocked)}
                        >
                          {u.isBlocked ? "Unblock" : "Block"}
                        </Button>

                        <button
                          disabled={isUpdating}
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer border border-transparent hover:border-red-500/20"
                          title="Delete User"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
