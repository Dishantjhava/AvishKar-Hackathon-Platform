import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import { updateProfile } from "../services/userService";

const Profile = () => {
  const { user, login, logout, token } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const res = await updateProfile(user._id, { name: name.trim() });
      const updatedUser = res.data?.user || { ...user, name: name.trim() };

      login(updatedUser, token);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] pt-28 pb-20 px-6 max-w-2xl mx-auto transition-colors duration-200">
      <div className="mb-8 font-normal">
        <p className="text-[var(--primary-pink)] font-semibold text-xs uppercase tracking-widest mb-1">
          ACCOUNT SETTINGS
        </p>
        <h1 className="text-3xl font-bold tracking-tight font-heading text-[var(--text-primary)]">
          User Profile
        </h1>
      </div>

      <Card variant="light" padding="lg" className="shadow-sm space-y-6">
        <div className="flex items-center gap-5 pb-6 border-b border-[var(--border-color)]">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E02567] to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-md flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-xl font-bold font-heading text-[var(--text-primary)]">{user?.name}</h2>
            <p className="text-[var(--text-secondary)] text-sm font-normal">{user?.email}</p>
            <span className="inline-block mt-2 text-xs font-semibold px-3 py-0.5 rounded-full bg-[var(--pink-tint)] text-[var(--primary-pink)] capitalize border border-pink-100 dark:border-pink-900/30">
              Role: {user?.role || "Participant"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Input
            id="name"
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            id="email"
            label="Email Address (Read-only)"
            value={user?.email || ""}
            disabled
            className="bg-[var(--bg-surface-elevated)] border-[var(--border-color)] text-[var(--text-secondary)] opacity-80"
          />

          {error && (
            <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-xs rounded-xl p-3 font-normal">
              ⚠ {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs rounded-xl p-3 font-normal">
              ✓ {success}
            </div>
          )}

          <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between font-normal">
            <Button variant="primary" size="md" disabled={loading} onClick={handleSave}>
              {loading ? "Saving..." : "Save Profile →"}
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={handleLogout}
              className="text-red-500 border-red-200 dark:border-red-800/60 hover:bg-red-500/10"
            >
              Sign Out of Account 🚪
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
